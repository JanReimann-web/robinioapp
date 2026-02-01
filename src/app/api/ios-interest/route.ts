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

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const entries = await readEntries();
  return NextResponse.json({ ok: true, entries });
}

export async function POST(request: Request) {
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

    return NextResponse.json({ ok: true, duplicate: exists });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
