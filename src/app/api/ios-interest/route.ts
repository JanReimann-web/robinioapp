import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { applyRateLimit, isAuthorized } from "@/lib/adminSecurity";

type InterestEntry = {
  email: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "ios-interest.json");

export const runtime = "nodejs";

const readEntries = async (): Promise<InterestEntry[]> => {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    return JSON.parse(raw) as InterestEntry[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
};

const writeEntries = async (entries: InterestEntry[]) => {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(entries, null, 2), "utf8");
};

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
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const entries = await readEntries();
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
  try {
    const body = (await request.json()) as { email?: string };
    const email = (body.email ?? "").trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, message: "Invalid email" },
        { status: 400 }
      );
    }

    const entries = await readEntries();
    const exists = entries.some((entry) => entry.email === email);

    if (!exists) {
      entries.push({ email, createdAt: new Date().toISOString() });
      await writeEntries(entries);
    }

    return NextResponse.json(
      { ok: true, duplicate: exists },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
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

    const entries = await readEntries();
    const nextEntries = entries.filter((entry) => entry.email !== email);
    await writeEntries(nextEntries);

    return NextResponse.json(
      { ok: true, removed: entries.length - nextEntries.length },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
