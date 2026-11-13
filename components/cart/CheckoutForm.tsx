"use client";

import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { BagIcon, CheckIcon, PinIcon, TrashIcon, UploadIcon, WhatsAppIcon } from "@/components/art/Icons";
import { cart, cartCount, useCart, type Cart } from "@/lib/cart";
import { compressImage } from "@/lib/compress-image";
import {
  EDITIONS,
  EDITION_KEYS,
  MAX_QTY_PER_EDITION,
  PRICES,
  priceLabel,
  priceTotal,
  formatINR,
  orderCode,
  site,
  upiPayLink,
  type EditionKey,
} from "@/lib/site";
import { extractMapLink, isEmail, normalizePhone } from "@/lib/validation";

type Qty = Cart;
type FieldKey = "name" | "email" | "phone" | "mapLink" | "address";
type ErrorKey = "qty" | "name" | "email" | "phone" | "mapLink" | "screenshot" | "form";
type Errors = Partial<Record<ErrorKey, string>>;
type Placed = { orderNo: number; name: string; qty: Qty; total: number };

const EMPTY_FIELDS: Record<FieldKey, string> = { name: "", email: "", phone: "", mapLink: "", address: "" };
const MAX_UPLOAD = 4 * 1024 * 1024;
const ERROR_ORDER: ErrorKey[] = ["qty", "name", "phone", "email", "mapLink", "screenshot", "form"];

const EDITION_IMAGE: Record<EditionKey, string> = {
  kids: site.images.kids || site.images.pouch,
  adults: site.images.adults || site.images.pouch,
};

/** true only after hydration, so the saved cart (localStorage) never flashes as "empty" */
const useHydrated = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

export function CheckoutForm() {
  const qty = useCart();
  const hydrated = useHydrated();
  const [fields, setFields] = useState(EMPTY_FIELDS);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [placed, setPlaced] = useState<Placed | null>(null);
  const previewRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const total = priceTotal(qty);
  const payLink = upiPayLink(total);

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    [],
  );

  function clearError(key: ErrorKey) {
    setErrors((er) => (er[key] || er.form ? { ...er, [key]: undefined, form: undefined } : er));
  }

  function setField(key: FieldKey, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    if (key !== "address") clearError(key);
  }

  function changeQty(edition: EditionKey, delta: number) {
    cart.set(edition, qty[edition] + delta);
    clearError("qty");
  }

  function setScreenshot(next: File | null) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = next ? URL.createObjectURL(next) : null;
    setFile(next);
    setPreview(previewRef.current);
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setScreenshot(null);
      setErrors((er) => ({ ...er, screenshot: "Please choose an image — a screenshot or photo of your payment." }));
      return;
    }
    setScreenshot(f);
    clearError("screenshot");
  }

  function fillCurrentLocation() {
    if (!("geolocation" in navigator)) {
      setErrors((er) => ({ ...er, mapLink: "Location isn’t available here — please paste your Google Maps link." }));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setField("mapLink", `https://www.google.com/maps?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setErrors((er) => ({
          ...er,
          mapLink: "We couldn’t get your location. Please paste your Google Maps link instead.",
        }));
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }

  async function copyUpiId() {
    try {
      await navigator.clipboard.writeText(site.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the ID is visible to copy by hand */
    }
  }

  function validate(): Errors {
    const e: Errors = {};
    if (qty.kids + qty.adults < 1) e.qty = "Please choose at least one book.";
    if (fields.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!normalizePhone(fields.phone)) e.phone = "Please enter a valid 10-digit mobile number.";
    if (!isEmail(fields.email.trim())) e.email = "Please enter a valid email address.";
    if (!extractMapLink(fields.mapLink))
      e.mapLink = "Please paste a Google Maps link (it starts with https://maps.app.goo.gl/…).";
    if (!file) e.screenshot = "Please upload the screenshot of your UPI payment.";
    return e;
  }

  function scrollToFirstError(errs: Errors) {
    const first = ERROR_ORDER.find((k) => errs[k]);
    if (first) document.querySelector(`[data-field="${first}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const honeypot = (e.currentTarget.elements.namedItem("company") as HTMLInputElement | null)?.value ?? "";
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      scrollToFirstError(errs);
      return;
    }

    setSubmitting(true);
    try {
      const shot = await compressImage(file as File);
      if (shot.size > MAX_UPLOAD) {
        const tooBig = { screenshot: "This image is too large. Please upload a smaller screenshot (under 4 MB)." };
        setErrors(tooBig);
        scrollToFirstError(tooBig);
        return;
      }
      const body = new FormData();
      body.set("name", fields.name.trim());
      body.set("email", fields.email.trim());
      body.set("phone", fields.phone);
      body.set("mapLink", extractMapLink(fields.mapLink) ?? "");
      body.set("address", fields.address.trim());
      body.set("kidsQty", String(qty.kids));
      body.set("adultsQty", String(qty.adults));
      body.set("company", honeypot);
      body.set("screenshot", shot, shot.name);

      const res = await fetch("/api/orders", { method: "POST", body });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; orderNo: number }
        | { ok: false; error?: string; fieldErrors?: Errors }
        | null;

      if (!res.ok || !data || !data.ok) {
        const serverErrs: Errors = {
          ...(data && !data.ok ? data.fieldErrors : {}),
          form: (data && !data.ok && data.error) || "Something went wrong. Please try again.",
        };
        setErrors(serverErrs);
        scrollToFirstError(serverErrs);
        return;
      }

      setPlaced({ orderNo: data.orderNo, name: fields.name.trim(), qty, total });
      cart.clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrors({ form: "We couldn’t reach our server. Please check your internet connection and try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (placed) return <ThankYou placed={placed} />;
  if (!hydrated) return <CartSkeleton />;
  if (cartCount(qty) === 0) return <EmptyCart />;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8"
    >
      {/* Honeypot for bots — hidden from people and screen readers */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Company <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="space-y-6">
        <Step n={1} title="Your cart">
          <div className="space-y-3" data-field="qty">
            {EDITION_KEYS.filter((key) => qty[key] > 0).map((key) => (
              <div
                key={key}
                className="flex flex-col gap-3 rounded-2xl border border-champagne bg-ivory p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <Image
                    src={EDITION_IMAGE[key]}
                    alt=""
                    width={144}
                    height={144}
                    className={`h-[72px] w-[72px] shrink-0 rounded-xl bg-blush ring-1 ring-champagne ${
                      EDITION_IMAGE[key] === site.images.pouch ? "object-contain p-1.5" : "object-cover"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-lg leading-tight text-teal">{EDITIONS[key].title}</p>
                    <p className="mt-0.5 text-sm text-ink-soft">{EDITIONS[key].kitShort}</p>
                    <p className="mt-1 font-semibold text-maroon tabular-nums">
                      {formatINR(PRICES[key])}
                      {qty[key] > 1 ? (
                        <span className="ml-1.5 font-normal text-ink-soft">
                          × {qty[key]} = <span className="font-semibold text-ink">{formatINR(PRICES[key] * qty[key])}</span>
                        </span>
                      ) : null}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-1 border-t border-dashed border-champagne pt-3 sm:justify-end sm:border-0 sm:pt-0">
                <div className="flex shrink-0 items-center rounded-full border border-champagne bg-white">
                  <button
                    type="button"
                    onClick={() => changeQty(key, -1)}
                    disabled={qty[key] <= 1}
                    aria-label={`Remove one ${EDITIONS[key].title}`}
                    className="grid h-10 w-10 place-items-center rounded-full text-xl text-maroon transition-colors hover:bg-blush disabled:text-ink-soft/40 disabled:hover:bg-transparent"
                  >
                    −
                  </button>
                  <output aria-live="polite" className="w-7 text-center font-semibold tabular-nums">
                    {qty[key]}
                  </output>
                  <button
                    type="button"
                    onClick={() => changeQty(key, 1)}
                    disabled={qty[key] >= MAX_QTY_PER_EDITION}
                    aria-label={`Add one ${EDITIONS[key].title}`}
                    className="grid h-10 w-10 place-items-center rounded-full text-xl text-maroon transition-colors hover:bg-blush disabled:text-ink-soft/40"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => cart.remove(key)}
                  aria-label={`Remove ${EDITIONS[key].title} from cart`}
                  className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-blush hover:text-maroon"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                </div>
              </div>
            ))}

            {EDITION_KEYS.filter((key) => qty[key] === 0).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => changeQty(key, 1)}
                className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-gold/60 px-4 py-3 text-left transition-colors hover:border-maroon/50 hover:bg-blush/30"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blush text-lg text-maroon">+</span>
                <span className="min-w-0 flex-1 text-sm text-ink-soft">
                  Add the <strong className="font-semibold text-teal">{EDITIONS[key].title}</strong> too
                </span>
                <span className="text-sm font-semibold text-maroon">{formatINR(PRICES[key])}</span>
              </button>
            ))}
            <FieldError id="qty" message={errors.qty} />
          </div>
        </Step>

        <Step n={2} title="Your details">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="name" label="Full name" error={errors.name} className="sm:col-span-2">
              <input
                id="name"
                className="input"
                autoComplete="name"
                value={fields.name}
                onChange={(e) => setField("name", e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                maxLength={100}
              />
            </Field>

            <Field id="phone" label="Mobile number" error={errors.phone}>
              <div className="flex">
                <span className="grid place-items-center rounded-l-[0.875rem] border-[1.5px] border-r-0 border-champagne bg-cream px-3 text-ink-soft">
                  +91
                </span>
                <input
                  id="phone"
                  className="input rounded-l-none"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="98765 43210"
                  value={fields.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  maxLength={16}
                />
              </div>
            </Field>

            <Field id="email" label="Email" error={errors.email}>
              <input
                id="email"
                className="input"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={fields.email}
                onChange={(e) => setField("email", e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                maxLength={200}
              />
            </Field>

            <Field id="mapLink" label="Google Maps link to your address" error={errors.mapLink} className="sm:col-span-2">
              <input
                id="mapLink"
                className="input"
                type="url"
                inputMode="url"
                placeholder="https://maps.app.goo.gl/…"
                value={fields.mapLink}
                onChange={(e) => setField("mapLink", e.target.value)}
                aria-invalid={Boolean(errors.mapLink)}
                aria-describedby={errors.mapLink ? "mapLink-error" : "mapLink-help"}
              />
              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                <button
                  type="button"
                  onClick={fillCurrentLocation}
                  disabled={locating}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal underline-offset-4 hover:underline disabled:opacity-60"
                >
                  <PinIcon className="h-4 w-4" />
                  {locating ? "Finding you…" : "I’m at home — use my current location"}
                </button>
              </div>
              <details id="mapLink-help" className="mt-2 text-sm text-ink-soft">
                <summary className="cursor-pointer font-medium text-ink-soft hover:text-maroon">
                  How do I copy my Google Maps link?
                </summary>
                <ol className="mt-2 list-decimal space-y-1 pl-5">
                  <li>Open Google Maps and find your home (or tap the blue dot).</li>
                  <li>Tap the place, then tap <strong>Share</strong>.</li>
                  <li>
                    Tap <strong>Copy link</strong> and paste it here.
                  </li>
                </ol>
              </details>
            </Field>

            <Field
              id="address"
              label="House / flat no., landmark & PIN code"
              hint="Optional, but it helps our courier find you."
              className="sm:col-span-2"
            >
              <textarea
                id="address"
                className="input min-h-[88px] resize-y"
                autoComplete="street-address"
                value={fields.address}
                onChange={(e) => setField("address", e.target.value)}
                maxLength={500}
                rows={3}
              />
            </Field>
          </div>
        </Step>
      </div>

      <div className="space-y-6">
        <Step n={3} title="Pay via UPI">
          <dl className="space-y-2 text-[0.95rem]">
            {EDITION_KEYS.filter((k) => qty[k] > 0).map((k) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-ink-soft">
                  {EDITIONS[k].title} × {qty[k]}
                </dt>
                <dd className="font-medium tabular-nums">{formatINR(qty[k] * PRICES[k])}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Delivery</dt>
              <dd className="font-semibold text-teal">FREE</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-dashed border-champagne pt-3">
              <dt className="font-serif text-lg">Total</dt>
              <dd className="font-serif text-3xl font-bold text-maroon tabular-nums">{formatINR(total)}</dd>
            </div>
          </dl>

          <div className="mt-6 rounded-2xl border border-champagne bg-ivory p-5 text-center">
            {total === 0 ? (
              <p className="py-8 text-ink-soft">Choose an edition above to see your payment QR code.</p>
            ) : !site.upiId ? (
              <p className="py-8 text-maroon">UPI details will appear here shortly.</p>
            ) : (
              <>
                <div className="mx-auto w-fit rounded-2xl bg-white p-3 shadow-sm ring-1 ring-champagne">
                  <QRCodeSVG value={payLink} size={196} marginSize={1} fgColor="#3a2924" level="M" title={`UPI QR code for ${formatINR(total)}`} />
                </div>
                <p className="mt-3 text-sm text-ink-soft">
                  Scan with GPay, PhonePe, Paytm or any UPI app to pay{" "}
                  <strong className="text-ink">{formatINR(total)}</strong>
                </p>
                <a href={payLink} className="btn btn-primary mt-4 w-full md:hidden">
                  Pay {formatINR(total)} with a UPI app
                </a>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                  <span className="text-ink-soft">UPI ID:</span>
                  <code className="rounded-md bg-white px-2 py-1 font-mono text-ink ring-1 ring-champagne">{site.upiId}</code>
                  <button type="button" onClick={copyUpiId} className="font-semibold text-teal hover:underline">
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="mt-2 text-xs text-ink-soft">
                  Payee name: <span className="font-semibold text-ink">{site.upiName}</span>
                </p>
                {site.upiQrImage ? (
                  <details className="mt-4 border-t border-dashed border-champagne pt-3 text-sm">
                    <summary className="cursor-pointer font-medium text-ink-soft hover:text-maroon">
                      Payment app showing an error? Use our Paytm QR
                    </summary>
                    {/* eslint-disable-next-line @next/next/no-img-element -- static QR, must stay pixel-exact */}
                    <img
                      src={site.upiQrImage}
                      alt={`Paytm UPI QR code for ${site.upiId}`}
                      width={934}
                      height={1600}
                      loading="lazy"
                      className="mx-auto mt-3 w-full max-w-[220px] rounded-xl ring-1 ring-champagne"
                    />
                    <p className="mt-2 text-ink-soft">
                      Scan it and enter <strong className="text-ink">{formatINR(total)}</strong> as the amount.
                    </p>
                  </details>
                ) : null}
              </>
            )}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-soft">
            UPI payments only. No cash on delivery or card payments.
          </p>
        </Step>

        <Step n={4} title="Upload your payment screenshot">
          <div data-field="screenshot">
            <input
              ref={fileInputRef}
              id="screenshot"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onFileChange}
              aria-describedby={errors.screenshot ? "screenshot-error" : undefined}
            />
            {preview ? (
              <div className="flex items-center gap-4 rounded-2xl border border-teal/30 bg-ivory p-3">
                {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                <img src={preview} alt="Your payment screenshot" className="h-28 w-20 shrink-0 rounded-lg object-cover ring-1 ring-champagne" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 font-semibold text-teal">
                    <CheckIcon className="h-4 w-4" /> Screenshot added
                  </p>
                  <p className="mt-0.5 truncate text-sm text-ink-soft">{file?.name}</p>
                  <label htmlFor="screenshot" className="mt-2 inline-block cursor-pointer text-sm font-semibold text-maroon hover:underline">
                    Change image
                  </label>
                </div>
              </div>
            ) : (
              <label
                htmlFor="screenshot"
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-9 text-center transition-colors hover:border-maroon/50 hover:bg-blush/30 ${
                  errors.screenshot ? "border-maroon/60 bg-[#fff8f7]" : "border-gold/50 bg-ivory"
                }`}
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-blush text-maroon">
                  <UploadIcon className="h-6 w-6" />
                </span>
                <span className="font-semibold text-ink">Tap to upload screenshot</span>
                <span className="text-sm text-ink-soft">Make sure the amount and UPI reference number are visible</span>
              </label>
            )}
            <FieldError id="screenshot" message={errors.screenshot} />
          </div>
        </Step>

        <div data-field="form" className="space-y-3">
          {errors.form ? (
            <p role="alert" className="rounded-2xl border border-maroon/30 bg-[#fff1ef] px-4 py-3 text-sm text-maroon">
              {errors.form}
            </p>
          ) : null}
          <button type="submit" disabled={submitting} className="btn btn-primary w-full py-4 text-base">
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/40 border-t-ivory" aria-hidden="true" />
                Sending your order…
              </>
            ) : (
              <>Submit Order{total > 0 ? ` · ${formatINR(total)}` : ""}</>
            )}
          </button>
          <p className="text-center text-xs leading-relaxed text-ink-soft">
            Orders are confirmed after we verify your payment. We’ll reach you on WhatsApp or email.
          </p>
        </div>
      </div>
    </form>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.75rem] border border-champagne bg-white/80 p-5 shadow-[0_24px_48px_-36px_rgba(86,13,34,0.3)] sm:p-7">
      <h3 className="mb-5 flex items-center gap-3 font-serif text-xl text-teal sm:text-2xl">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-maroon font-sans text-sm font-bold text-ivory">
          {n}
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  className = "",
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div data-field={id} className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="mt-1.5 text-xs text-ink-soft">{hint}</p> : null}
      <FieldError id={id} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-medium text-maroon">
      {message}
    </p>
  );
}

function CartSkeleton() {
  return (
    <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]" aria-busy="true" aria-label="Loading your cart">
      {[0, 1].map((i) => (
        <div key={i} className="h-72 animate-pulse rounded-[1.75rem] border border-champagne bg-white/60" />
      ))}
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-[2rem] border border-champagne bg-white/80 px-6 py-12 text-center sm:px-12">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blush text-maroon">
        <BagIcon className="h-8 w-8" />
      </span>
      <p className="mt-6 font-script text-4xl text-maroon">Your cart is empty</p>
      <p className="mt-2 text-ink-soft">Choose your Daily Dose to get started — {priceLabel()} with free delivery.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {EDITION_KEYS.map((key) => (
          <button key={key} type="button" onClick={() => cart.add(key)} className="btn btn-outline">
            Add {EDITIONS[key].title}
          </button>
        ))}
      </div>
      <Link href="/#editions" className="mt-6 inline-block text-sm font-semibold text-teal hover:underline">
        See what’s inside each edition →
      </Link>
    </div>
  );
}

function ThankYou({ placed }: { placed: Placed }) {
  const code = orderCode(placed.orderNo);
  const firstName = placed.name.split(/\s+/)[0];
  const items = EDITION_KEYS.filter((k) => placed.qty[k] > 0)
    .map((k) => `${EDITIONS[k].title} × ${placed.qty[k]}`)
    .join(", ");
  const waText = `Hi! I just placed order ${code} on the Positive Me Happy Me website.\nName: ${placed.name}\nOrder: ${items}\nTotal paid: ${formatINR(placed.total)}`;

  return (
    <div className="mx-auto mt-12 max-w-2xl rounded-[2rem] border border-gold/40 bg-white/85 px-6 py-12 text-center shadow-[0_30px_60px_-40px_rgba(86,13,34,0.45)] sm:px-12">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal text-ivory">
        <CheckIcon className="h-8 w-8" />
      </span>
      <p className="mt-6 font-script text-5xl text-maroon">Thank you, {firstName}!</p>
      <h3 className="mt-3 font-serif text-2xl text-teal">
        Your order <span className="whitespace-nowrap">{code}</span> has been received.
      </h3>
      <p className="mt-2 text-ink-soft">
        {items} · <strong className="text-ink">{formatINR(placed.total)}</strong>
      </p>
      <p className="mx-auto mt-5 max-w-md leading-relaxed text-ink-soft">
        We’ll verify your payment and confirm your order on WhatsApp or email. Your daily dose of
        positivity is almost on its way.
      </p>
      {site.email ? (
        <p className="mt-3 text-sm text-ink-soft">
          Questions? Write to{" "}
          <a href={`mailto:${site.email}`} className="font-semibold text-teal hover:underline">
            {site.email}
          </a>
        </p>
      ) : null}
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        {site.whatsapp ? (
          <a
            href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(waText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <WhatsAppIcon className="h-5 w-5" /> Send order on WhatsApp
          </a>
        ) : null}
        <Link href="/" className="btn btn-outline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
