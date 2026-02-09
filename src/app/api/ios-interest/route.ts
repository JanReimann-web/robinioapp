import { NextResponse } from "next/server";
import { applyRateLimit, isAuthorized } from "@/lib/adminSecurity";
import { getWaitlistFirestore } from "@/lib/waitlistFirestore";

type InterestEntry = {
  email: string;
  createdAt: string;
};

export const runtime = "nodejs";

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const ADMIN_RATE = { windowMs: 5 * 60 * 1000, max: 20 };
const PUBLIC_RATE = { windowMs: 60 * 1000, max: 8 };

const rateLimitResponse = (retryAfter: number) =>
  NextResponse.json(
    { ok: false, message: "Too many requests" },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "Cache-Control": "no-store",
      },
    }
  );

export async function GET(request: Request) {
  const limit = applyRateLimit(request, "admin", ADMIN_RATE);
  if (!limit.allowed) {
    return rateLimitResponse(limit.retryAfter);
  }

  const db = getWaitlistFirestore();
  if (!db) {
    return NextResponse.json(
      { ok: false, message: "Server misconfigured" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const snapshot = await db
    .collection("ios_interest")
    .orderBy("createdAt", "desc")
    .limit(5000)
    .get();
  const entries = snapshot.docs
    .map((doc) => doc.data() as InterestEntry)
    .filter((entry) => typeof entry?.email === "string");
  return NextResponse.json(
    { ok: true, entries },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request: Request) {
  const limit = applyRateLimit(request, "public", PUBLIC_RATE);
  if (!limit.allowed) {
    return rateLimitResponse(limit.retryAfter);
  }

  const db = getWaitlistFirestore();
  if (!db) {
    console.error("[ios-interest] Firestore is not configured (missing env vars).");
    return NextResponse.json(
      { ok: false, message: "Server misconfigured" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
  try {
    const body = (await request.json()) as { email?: string };
    const email = (body.email ?? "").trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, message: "Invalid email" },
        { status: 400 }
      );
    }

    const ref = db.collection("ios_interest").doc(email);
    const entry: InterestEntry = { email, createdAt: new Date().toISOString() };
    let exists = false;

    try {
      await ref.create(entry);
    } catch (error) {
      const code = (error as { code?: unknown }).code;
      // Firestore returns gRPC status codes (ALREADY_EXISTS = 6)
      if (code === 6 || code === "6" || code === "already-exists") {
        exists = true;
      } else {
        throw error;
      }
    }

    return NextResponse.json(
      { ok: true, duplicate: exists },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    const err = error as { name?: unknown; message?: unknown; code?: unknown };
    console.error("[ios-interest] POST failed", {
      name: typeof err?.name === "string" ? err.name : "unknown",
      code: err?.code,
      message: typeof err?.message === "string" ? err.message : String(error),
    });
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function DELETE(request: Request) {
  const limit = applyRateLimit(request, "admin", ADMIN_RATE);
  if (!limit.allowed) {
    return rateLimitResponse(limit.retryAfter);
  }

  const db = getWaitlistFirestore();
  if (!db) {
    return NextResponse.json(
      { ok: false, message: "Server misconfigured" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const body = (await request.json()) as { email?: string };
    const email = (body.email ?? "").trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, message: "Invalid email" },
        { status: 400 }
      );
    }

    const ref = db.collection("ios_interest").doc(email);
    const snapshot = await ref.get();
    const existed = snapshot.exists;
    if (existed) {
      await ref.delete();
    }

    return NextResponse.json(
      { ok: true, removed: existed ? 1 : 0 },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
