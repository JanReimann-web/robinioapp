import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type InterestEntry = {
  email: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "ios-interest.json");

export const runtime = "nodejs";

const getAdminCode = (request: Request) => {
  const url = new URL(request.url);
  return (
    request.headers.get("x-admin-code") ||
    url.searchParams.get("code") ||
    ""
  );
};

const isAuthorized = (request: Request) => {
  const adminCode = process.env.ADMIN_ACCESS_CODE;
  if (!adminCode) {
    return false;
  }
  return getAdminCode(request) === adminCode;
};

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
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
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
    },
  });
}
