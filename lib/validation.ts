/** Shared by the order form (browser) and the order API (server). */

/** Returns a 10-digit Indian mobile number, or null if it isn't one. */
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export function isEmail(input: string): boolean {
  return input.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}

/**
 * People often paste "Check out this place: https://maps.app.goo.gl/…".
 * Pull the first URL out and accept it only if it points at Google Maps.
 */
export function extractMapLink(input: string): string | null {
  const match = input.match(/https?:\/\/[^\s<>"']+/i);
  if (!match) return null;
  let url: URL;
  try {
    url = new URL(match[0]);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const ok =
    host === "maps.app.goo.gl" ||
    host === "goo.gl" ||
    host === "g.co" ||
    host.startsWith("maps.google.") ||
    (/^google\.[a-z.]+$/.test(host) && url.pathname.startsWith("/maps"));
  return ok && match[0].length <= 1000 ? match[0] : null;
}

export const ORDER_STATUSES = ["pending", "verified", "shipped", "rejected"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
