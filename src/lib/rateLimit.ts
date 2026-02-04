type RateLimitConfig = {
  windowMs: number;
  max: number;
};

type RateState = {
  count: number;
  resetAt: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter: number;
};

const store = new Map<string, RateState>();

export const rateLimit = (
  key: string,
  config: RateLimitConfig
): RateLimitResult => {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || now > existing.resetAt) {
    const resetAt = now + config.windowMs;
    const count = 1;
    store.set(key, { count, resetAt });
    return {
      allowed: true,
      remaining: Math.max(0, config.max - count),
      resetAt,
      retryAfter: 0,
    };
  }

  existing.count += 1;
  store.set(key, existing);
  const allowed = existing.count <= config.max;
  return {
    allowed,
    remaining: Math.max(0, config.max - existing.count),
    resetAt: existing.resetAt,
    retryAfter: allowed ? 0 : Math.ceil((existing.resetAt - now) / 1000),
  };
};
