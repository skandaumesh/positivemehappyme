import { randomUUID } from "node:crypto";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { MAX_QTY_PER_EDITION, priceTotal } from "@/lib/site";
import { SCREENSHOT_BUCKET, supabaseAdmin } from "@/lib/supabase-admin";
import { extractMapLink, isEmail, normalizePhone } from "@/lib/validation";

const MAX_BYTES = 4 * 1024 * 1024; // stays under Vercel's 4.5 MB request limit
const MAX_ORDERS_PER_PHONE_PER_HOUR = 5;
const MAX_REQUESTS_PER_IP = 20; // per 10 minutes, per server instance

type FieldErrors = Partial<
  Record<"qty" | "name" | "email" | "phone" | "mapLink" | "screenshot", string>
>;

function fail(status: number, error: string, fieldErrors?: FieldErrors) {
  return Response.json({ ok: false, error, fieldErrors }, { status });
}

/** Trims, caps length and replaces control characters (newlines kept for the address). */
const text = (v: FormDataEntryValue | null, max: number, multiline = false) =>
  typeof v === "string"
    ? v
        .replace(multiline ? /[\u0000-\u0009\u000b-\u001f\u007f]/g : /[\u0000-\u001f\u007f]/g, " ")
        .trim()
        .slice(0, max)
    : "";

function qty(v: FormDataEntryValue | null) {
  const n = Number(typeof v === "string" ? v : NaN);
  return Number.isInteger(n) && n >= 0 && n <= MAX_QTY_PER_EDITION ? n : -1;
}

/**
 * Detects the real image type from the file's first bytes. The browser-supplied
 * MIME type is ignored, so a renamed HTML/script file can't be stored as an "image".
 */
async function sniffImage(file: File): Promise<{ mime: string; ext: string } | null> {
  const b = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const ascii = (from: number, to: number) => String.fromCharCode(...b.slice(from, to));
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  if (b[0] === 0x89 && ascii(1, 4) === "PNG") return { mime: "image/png", ext: "png" };
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return { mime: "image/webp", ext: "webp" };
  if (ascii(4, 8) === "ftyp" && ["heic", "heix", "hevc", "heim", "heis", "mif1", "msf1"].includes(ascii(8, 12)))
    return { mime: "image/heic", ext: "heic" };
  return null;
}

export async function POST(request: Request) {
  try {
    return await handleOrder(request);
  } catch (e) {
    console.error("Order API crashed", e);
    return fail(500, "Something went wrong on our side. Please try again in a minute.");
  }
}

async function handleOrder(request: Request) {
  const ipCheck = rateLimit(`order:${clientIp(request.headers)}`, MAX_REQUESTS_PER_IP, 10 * 60_000);
  if (!ipCheck.ok) {
    return fail(429, "Too many attempts from your connection. Please wait a few minutes and try again.");
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BYTES + 256 * 1024) {
    return fail(413, "That image is too large. Please upload one under 4 MB.", {
      screenshot: "That image is too large. Please upload one under 4 MB.",
    });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(400, "We couldn't read your order. Please try again.");
  }

  // Honeypot: real people never see or fill this field.
  if (text(form.get("company"), 100)) return Response.json({ ok: true, orderNo: 0 });

  const name = text(form.get("name"), 100);
  const email = text(form.get("email"), 200).toLowerCase();
  const phone = normalizePhone(text(form.get("phone"), 30));
  const mapLink = extractMapLink(text(form.get("mapLink"), 1500));
  const address = text(form.get("address"), 500, true);
  const kids = qty(form.get("kidsQty"));
  const adults = qty(form.get("adultsQty"));
  const file = form.get("screenshot");

  const errors: FieldErrors = {};
  if (kids < 0 || adults < 0 || kids + adults < 1) errors.qty = "Please choose at least one book.";
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!isEmail(email)) errors.email = "Please enter a valid email address.";
  if (!phone) errors.phone = "Please enter a valid 10-digit mobile number.";
  if (!mapLink) errors.mapLink = "Please paste a Google Maps link to your address.";

  let image: { mime: string; ext: string } | null = null;
  if (!(file instanceof File) || file.size === 0) {
    errors.screenshot = "Please upload your payment screenshot.";
  } else if (file.size > MAX_BYTES) {
    errors.screenshot = "That image is too large. Please upload one under 4 MB.";
  } else if (!(image = await sniffImage(file))) {
    errors.screenshot = "The screenshot must be an image (JPG, PNG, WEBP or HEIC).";
  }
  if (Object.keys(errors).length > 0) {
    return fail(422, "Please check the highlighted fields.", errors);
  }

  let supabase;
  try {
    supabase = supabaseAdmin();
  } catch (e) {
    console.error(e);
    return fail(503, "Ordering is temporarily unavailable. Please try again shortly.");
  }

  // Database-backed limit: works across all server instances.
  const since = new Date(Date.now() - 60 * 60_000).toISOString();
  const recent = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("phone", phone as string)
    .gte("created_at", since);
  if (!recent.error && (recent.count ?? 0) >= MAX_ORDERS_PER_PHONE_PER_HOUR) {
    return fail(429, "We’ve already received several orders from this number in the last hour. Please message us on WhatsApp or try again later.");
  }

  const { mime, ext } = image as { mime: string; ext: string };
  const path = `${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${ext}`;
  const upload = await supabase.storage
    .from(SCREENSHOT_BUCKET)
    .upload(path, file as File, { contentType: mime, upsert: false });
  if (upload.error) {
    console.error("Screenshot upload failed", upload.error);
    return fail(500, "We couldn't upload your screenshot. Please try again.");
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      name,
      email,
      phone,
      map_link: mapLink,
      address: address || null,
      kids_qty: kids,
      adults_qty: adults,
      total: priceTotal({ kids, adults }),
      screenshot_path: path,
    })
    .select("order_no")
    .single();

  if (error || !data) {
    console.error("Order insert failed", error);
    await supabase.storage.from(SCREENSHOT_BUCKET).remove([path]);
    return fail(500, "We couldn't save your order. Please try again.");
  }

  return Response.json({ ok: true, orderNo: data.order_no });
}
