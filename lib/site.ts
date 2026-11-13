/**
 * Everything brand-related that the client may want to tweak lives here.
 * Contact details and UPI come from environment variables (see .env.example)
 * so they can be changed on the host without touching code.
 */

export const MAX_QTY_PER_EDITION = 20;

export type EditionKey = "kids" | "adults";
export const EDITION_KEYS: EditionKey[] = ["kids", "adults"];

/**
 * Price per kit in ₹, delivery included. The server recalculates totals from this too.
 * Change here to update prices everywhere (cards, cart, UPI QR, server totals).
 */
export const PRICES: Record<EditionKey, number> = { kids: 399, adults: 399 };

export const priceTotal = (qty: Record<EditionKey, number>) =>
  EDITION_KEYS.reduce((sum, k) => sum + qty[k] * PRICES[k], 0);

/** "₹399 per kit" when both editions cost the same, otherwise "From ₹…". */
export function priceLabel() {
  const prices = EDITION_KEYS.map((k) => PRICES[k]);
  const min = Math.min(...prices);
  return min === Math.max(...prices) ? `${formatINR(min)} per kit` : `From ${formatINR(min)}`;
}

export const EDITIONS: Record<
  EditionKey,
  {
    title: string;
    fullName: string;
    tagline: string;
    description: string;
    includes: string[];
    kitShort: string;
  }
> = {
  kids: {
    title: "Kids Edition",
    fullName: "My Daily Dose of Affirmation – Kids",
    tagline: "For little dreamers",
    description:
      "A fun and creative way to introduce children to positive thinking, self-belief and affirmations.",
    includes: [
      "Kids affirmation colouring book",
      "Sketch pen set",
      "Handy take-along bag",
    ],
    kitShort: "Book + sketch pens + bag",
  },
  adults: {
    title: "Adults Edition",
    fullName: "My Daily Dose of Affirmation – Adults",
    tagline: "For mindful grown-ups",
    description:
      "A mindful little escape from everyday routines, helping you relax, reconnect with yourself and consciously practise positive affirmations.",
    includes: [
      "Adult affirmation colouring book",
      "Colouring pencil set",
      "Handy take-along bag",
    ],
    kitShort: "Book + colouring pencils + bag",
  },
};

export const site = {
  name: "Positive Me Happy Me",
  /**
   * The one address Google should index (canonical links, sitemap, structured data,
   * share images). Server-side only. On Vercel this follows the production domain
   * automatically: positivemehappyme.vercel.app until the custom domain is added,
   * then positivemehappyme.com (redeploy after adding it). NEXT_PUBLIC_SITE_URL overrides.
   */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://positivemehappyme.com")
  ).replace(/\/$/, ""),
  author: "Neha Lal",
  instagram: "positivemehappyme",
  /** Digits only, with country code, e.g. 919876543210 */
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, ""),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "nehalal18@gmail.com",
  /** Neha's Paytm UPI (decoded from her QR). Env vars can override it. */
  upiId: (process.env.NEXT_PUBLIC_UPI_ID || "8147215288@pthdfc").trim(),
  upiName: process.env.NEXT_PUBLIC_UPI_NAME || "NEHA N LAL",
  /** Her original Paytm QR — shown as a backup if an app rejects the amount-filled QR. */
  upiQrImage: "/images/upi-qr.png",
  /**
   * When real photos arrive, drop them into /public/images and set the paths
   * here (e.g. "/images/hero.jpg"). Empty = the illustrated placeholder is used.
   */
  images: {
    /** Book cover shown in the hero (800×1600). */
    hero: "/images/hero.jpeg",
    /** Painted folk mandala (transparent PNG) for the hero corners. */
    mandala: "/images/mandala.png",
    /** Transparent cut-out of the drawstring pouch — used for any edition without its own photo. */
    pouch: "/images/pouch.png",
    logo: "/images/logo.jpeg",
    book: "",
    kids: "/images/kids-book.jpeg",
    adults: "/images/adults-book.jpeg",
  },
};

export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;
export const orderCode = (n: number) => `PMHM-${String(n).padStart(4, "0")}`;

export function upiPayLink(amount: number) {
  if (!site.upiId || amount <= 0) return "";
  return (
    `upi://pay?pa=${site.upiId}` +
    `&pn=${encodeURIComponent(site.upiName)}` +
    `&am=${amount.toFixed(2)}&cu=INR` +
    `&tn=${encodeURIComponent("Daily Dose of Affirmation")}`
  );
}
