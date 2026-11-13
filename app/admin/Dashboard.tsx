import Link from "next/link";
import type { ReactNode } from "react";
import { MailIcon, PinIcon, TrashIcon, WhatsAppIcon } from "@/components/art/Icons";
import { Logo } from "@/components/art/Logo";
import { listActiveOrders } from "@/lib/orders";
import { formatINR, orderCode } from "@/lib/site";
import type { Order } from "@/lib/supabase-admin";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/validation";
import { deleteOrder, logout, setOrderStatus } from "./actions";
import { ConfirmAction } from "./ConfirmAction";
import { ScreenshotViewer } from "./ScreenshotViewer";

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "bg-[#fdf1d8] text-[#8a5a00] ring-[#efd59a]",
  verified: "bg-[#e3f1ef] text-teal ring-[#b5d8d3]",
  shipped: "bg-[#e8eefc] text-[#23439a] ring-[#c3d1f3]",
  rejected: "bg-[#fbe6e4] text-maroon ring-[#efc0bb]",
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  verified: "Verified",
  shipped: "Shipped",
  rejected: "Rejected",
};

/** Buttons offered for each status. Every one asks for confirmation first. */
const NEXT_ACTIONS: Record<OrderStatus, { to: OrderStatus; label: string; primary?: boolean }[]> = {
  pending: [
    { to: "verified", label: "Payment verified", primary: true },
    { to: "rejected", label: "Reject" },
  ],
  verified: [
    { to: "shipped", label: "Mark shipped", primary: true },
    { to: "pending", label: "Back to pending" },
  ],
  shipped: [{ to: "verified", label: "Undo shipped" }],
  rejected: [{ to: "pending", label: "Back to pending" }],
};

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

export async function Dashboard({ filter, adminEmail }: { filter: OrderStatus | "all"; adminEmail: string }) {
  let orders: Order[] = [];
  let softDelete = true;
  let loadError = "";
  try {
    ({ orders, softDelete } = await listActiveOrders());
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Could not load orders.";
  }

  const counts = Object.fromEntries(
    ORDER_STATUSES.map((s) => [s, orders.filter((o) => o.status === s).length]),
  ) as Record<OrderStatus, number>;
  const confirmedRevenue = orders
    .filter((o) => o.status === "verified" || o.status === "shipped")
    .reduce((sum, o) => sum + o.total, 0);
  const booksToShip = orders
    .filter((o) => o.status === "verified")
    .reduce((sum, o) => sum + o.kids_qty + o.adults_qty, 0);
  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <header className="sticky top-0 z-40 border-b border-gold/25 bg-ivory/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" aria-label="View website">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <a href="/admin/export" className="btn btn-outline px-4 py-2 text-sm">
              Export CSV
            </a>
            <form action={logout}>
              <button type="submit" className="btn px-4 py-2 text-sm text-ink-soft hover:text-maroon">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h1 className="font-serif text-3xl text-teal">Orders</h1>
          <p className="text-sm text-ink-soft">
            Signed in as <span className="font-semibold text-ink">{adminEmail}</span>
          </p>
        </div>

        {loadError ? (
          <div role="alert" className="mt-6 rounded-2xl border border-maroon/30 bg-[#fff1ef] p-5 text-maroon">
            <p className="font-semibold">Couldn’t load orders.</p>
            <p className="mt-1 text-sm">{loadError}</p>
            <p className="mt-2 text-sm text-ink-soft">
              Check SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY and that supabase/schema.sql has been run.
            </p>
          </div>
        ) : null}

        {!softDelete && !loadError ? (
          <div className="mt-6 rounded-2xl border border-gold/40 bg-[#fdf6e6] p-4 text-sm text-ink">
            <p className="font-semibold">One-time setup needed to enable “Delete”</p>
            <p className="mt-1 text-ink-soft">
              In Supabase → SQL Editor, run:{" "}
              <code className="rounded bg-white px-1.5 py-0.5 text-ink ring-1 ring-champagne">
                alter table public.orders add column if not exists deleted_at timestamptz;
              </code>
            </p>
          </div>
        ) : null}

        <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Awaiting verification" value={String(counts.pending)} accent="text-[#8a5a00]" />
          <Stat label="Verified, to ship" value={String(counts.verified)} sub={`${booksToShip} kits`} accent="text-teal" />
          <Stat label="Shipped" value={String(counts.shipped)} accent="text-[#23439a]" />
          <Stat label="Confirmed revenue" value={formatINR(confirmedRevenue)} accent="text-maroon" />
        </dl>

        <nav aria-label="Filter orders" className="mt-8 -mx-4 overflow-x-auto px-4">
          <ul className="flex w-max gap-2">
            {(["all", ...ORDER_STATUSES] as const).map((s) => {
              const active = s === filter;
              const n = s === "all" ? orders.length : counts[s];
              return (
                <li key={s}>
                  <Link
                    href={s === "all" ? "/admin" : `/admin?status=${s}`}
                    prefetch={false}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      active ? "bg-teal text-ivory" : "bg-white text-ink-soft ring-1 ring-champagne hover:text-teal"
                    }`}
                  >
                    {s === "all" ? "All" : STATUS_LABEL[s]}
                    <span className={`rounded-full px-2 py-0.5 text-xs ${active ? "bg-ivory/20" : "bg-cream"}`}>{n}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {visible.length === 0 && !loadError ? (
          <div className="mt-8 rounded-[1.75rem] border border-dashed border-champagne bg-white/60 px-6 py-16 text-center">
            <p className="font-script text-4xl text-maroon">No orders here yet</p>
            <p className="mt-2 text-ink-soft">New orders appear here as soon as customers submit them.</p>
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 lg:grid-cols-2">
            {visible.map((o) => (
              <OrderCard key={o.id} order={o} canDelete={softDelete} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-champagne bg-white p-4 sm:p-5">
      <dt className="text-xs font-semibold tracking-wide text-ink-soft uppercase">{label}</dt>
      <dd className={`mt-1 font-serif text-2xl font-bold sm:text-3xl ${accent}`}>
        {value}
        {sub ? <span className="ml-2 font-sans text-sm font-medium text-ink-soft">{sub}</span> : null}
      </dd>
    </div>
  );
}

/** Wording for the "are you sure?" dialog of each status change. */
function confirmCopy(
  o: Order,
  code: string,
  to: OrderStatus,
): { title: string; message: ReactNode; confirmLabel: string; tone: "primary" | "danger" } {
  if (to === "verified" && o.status === "pending") {
    return {
      title: `Confirm payment for ${code}?`,
      message: (
        <>
          Only confirm once <strong className="text-ink">{formatINR(o.total)}</strong> from{" "}
          <strong className="text-ink">{o.name}</strong> has reached your UPI account. Match the amount and
          UPI reference in the screenshot with your bank/UPI app.
        </>
      ),
      confirmLabel: "Yes, payment received",
      tone: "primary",
    };
  }
  if (to === "verified") {
    return {
      title: `Undo “shipped” for ${code}?`,
      message: "The order goes back to Verified (paid, not yet shipped).",
      confirmLabel: "Yes, undo shipped",
      tone: "primary",
    };
  }
  if (to === "rejected") {
    return {
      title: `Reject order ${code}?`,
      message: "Use this when the payment wasn’t received or the screenshot doesn’t match. You can move it back to pending later.",
      confirmLabel: "Yes, reject",
      tone: "danger",
    };
  }
  if (to === "shipped") {
    return {
      title: `Mark ${code} as shipped?`,
      message: "Confirm the parcel has been handed to the courier. You can then send the customer a “shipped” message on WhatsApp.",
      confirmLabel: "Yes, it’s shipped",
      tone: "primary",
    };
  }
  return {
    title: `Move ${code} back to pending?`,
    message: "The order will need its payment verified again.",
    confirmLabel: "Yes, move to pending",
    tone: "primary",
  };
}

function OrderCard({ order: o, canDelete }: { order: Order; canDelete: boolean }) {
  const code = orderCode(o.order_no);
  const firstName = o.name.split(/\s+/)[0];
  const items = [
    o.kids_qty > 0 ? `Kids × ${o.kids_qty}` : "",
    o.adults_qty > 0 ? `Adults × ${o.adults_qty}` : "",
  ].filter(Boolean);
  const confirmText =
    o.status === "shipped"
      ? `Hi ${firstName}, your Positive Me Happy Me order ${code} has been shipped! 🎁 Your Daily Dose of Affirmation is on its way. Thank you!`
      : `Hi ${firstName}, thank you for ordering My Daily Dose of Affirmation! 🌸 Your payment of ${formatINR(o.total)} for order ${code} is verified and your order is confirmed. We'll let you know once it ships. — Positive Me Happy Me`;

  return (
    <li className="flex flex-col rounded-[1.5rem] border border-champagne bg-white p-5 shadow-[0_20px_40px_-34px_rgba(86,13,34,0.4)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-lg font-bold text-teal">{code}</p>
          <p className="text-xs text-ink-soft">{dateFmt.format(new Date(o.created_at))}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${STATUS_STYLE[o.status]}`}>
          {STATUS_LABEL[o.status]}
        </span>
      </div>

      <div className="mt-4 flex gap-4">
        <div className="min-w-0 flex-1 space-y-1.5 text-sm">
          <p className="text-base font-semibold text-ink">{o.name}</p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <a href={`tel:+91${o.phone}`} className="font-medium text-ink hover:text-maroon">
              +91 {o.phone.slice(0, 5)} {o.phone.slice(5)}
            </a>
            <a
              href={`https://wa.me/91${o.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-teal hover:underline"
            >
              <WhatsAppIcon className="h-4 w-4" /> Chat
            </a>
          </p>
          <p className="truncate">
            <a href={`mailto:${o.email}`} className="inline-flex items-center gap-1 text-ink-soft hover:text-maroon">
              <MailIcon className="h-4 w-4 shrink-0" /> {o.email}
            </a>
          </p>
          <p>
            <a
              href={o.map_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-teal hover:underline"
            >
              <PinIcon className="h-4 w-4" /> Open location in Maps
            </a>
          </p>
          {o.address ? <p className="text-ink-soft">{o.address}</p> : null}
          <p className="pt-1">
            <span className="text-ink">{items.join(" · ")}</span>
            <span className="ml-2 font-serif text-lg font-bold text-maroon">{formatINR(o.total)}</span>
          </p>
        </div>

        <ScreenshotViewer orderId={o.id} code={code} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-dashed border-champagne pt-4">
        {NEXT_ACTIONS[o.status].map((a) => {
          const c = confirmCopy(o, code, a.to);
          return (
            <ConfirmAction
              key={a.to}
              action={setOrderStatus}
              fields={{ id: o.id, status: a.to }}
              trigger={a.label}
              triggerClassName={`btn px-4 py-2 text-sm ${a.primary ? "btn-primary" : "text-ink-soft ring-1 ring-champagne hover:text-maroon"}`}
              title={c.title}
              message={c.message}
              confirmLabel={c.confirmLabel}
              tone={c.tone}
            />
          );
        })}
        {o.status === "verified" || o.status === "shipped" ? (
          <a
            href={`https://wa.me/91${o.phone}?text=${encodeURIComponent(confirmText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn ml-auto px-4 py-2 text-sm text-teal ring-1 ring-teal/40 hover:bg-teal hover:text-ivory"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {o.status === "shipped" ? "Send shipped message" : "Send confirmation"}
          </a>
        ) : null}
        {canDelete ? (
          <ConfirmAction
            action={deleteOrder}
            fields={{ id: o.id }}
            trigger={
              <>
                <TrashIcon className="h-4 w-4" /> Delete
              </>
            }
            triggerClassName={`btn px-3 py-2 text-sm text-ink-soft hover:bg-blush hover:text-maroon ${
              o.status === "verified" || o.status === "shipped" ? "" : "ml-auto"
            }`}
            title={`Delete order ${code}?`}
            message="It will be removed from this dashboard and from CSV exports. The order is still kept safely in the database."
            confirmLabel="Delete"
            tone="danger"
          />
        ) : null}
      </div>
    </li>
  );
}
