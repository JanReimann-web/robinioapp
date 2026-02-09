import { timingSafeEqual } from "crypto";
import { rateLimit, type RateLimitResult } from "./rateLimit";

const ADMIN_HEADER = "x-admin-code";

export const getClientIp = (request: Request) => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
};

const safeEqual = (left: string, right: string) => {
  if (!left || left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(Buffer.from(left), Buffer.from(right));
};

export const getAdminCode = (request: Request) =>
  request.headers.get(ADMIN_HEADER) ?? "";

export const isAuthorized = (request: Request) => {
  const adminCode = process.env.ADMIN_ACCESS_CODE ?? "";
  if (!adminCode) {
    console.error("[admin] ADMIN_ACCESS_CODE is not set in the runtime environment.");
    return false;
  }
  const provided = getAdminCode(request);
  const ok = safeEqual(provided, adminCode);
  if (!ok && provided) {
    console.warn("[admin] Invalid admin code provided.");
  }
  return ok;
};

export const applyRateLimit = (
  request: Request,
  scope: string,
  config: { windowMs: number; max: number }
): RateLimitResult => {
  const ip = getClientIp(request);
  return rateLimit(`${scope}:${ip}`, config);
};
