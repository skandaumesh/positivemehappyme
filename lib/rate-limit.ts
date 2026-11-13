import "server-only";

/**
 * Small in-memory sliding-window limiter. Per server instance, so it's a speed
 * bump against bursts/bots rather than a hard global limit (the order API also
 * has a per-phone limit backed by the database).
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false, retryAfterSec: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    // keep memory bounded
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return { ok: true, retryAfterSec: 0 };
}

/** Records a hit without checking (e.g. count only failed logins). */
export function recordHit(key: string) {
  const hits = buckets.get(key) ?? [];
  hits.push(Date.now());
  buckets.set(key, hits);
}

export function isLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  buckets.set(key, hits);
  return hits.length >= limit;
}

/** Client IP as seen by the host (Vercel sets x-forwarded-for / x-real-ip). */
export function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}
