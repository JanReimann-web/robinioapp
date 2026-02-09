import { NextResponse } from "next/server";
import { applyRateLimit, isAuthorized } from "@/lib/adminSecurity";
import { getWaitlistFirestore } from "@/lib/waitlistFirestore";

type InterestEntry = {
  email: string;
  createdAt: string;
};

export const runtime = "nodejs";

const ADMIN_RATE = { windowMs: 5 * 60 * 1000, max: 20 };

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

const escapeCsv = (value: string) => {
  if (value.includes(",") || value.includes("\"") || value.includes("\n")) {
    return `"${value.replace(/"/g, "\"\"")}"`;
  }
  return value;
};

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
  const header = "email,createdAt";
  const rows = entries.map(
    (entry) => `${escapeCsv(entry.email)},${escapeCsv(entry.createdAt)}`
  );
  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"ios-interest.csv\"",
      "Cache-Control": "no-store",
    },
  });
}
