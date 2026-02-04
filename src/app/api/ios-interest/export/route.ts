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
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const entries = await readEntries();
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
