"use client";

import Link from "next/link";
import { BagIcon } from "@/components/art/Icons";
import { cartCount, cartTotal, useCart } from "@/lib/cart";
import { formatINR } from "@/lib/site";

/** Floating "View cart" bar shown on the home page once something is in the cart. */
export function CartBar() {
  const c = useCart();
  const count = cartCount(c);
  if (count === 0) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <Link
        href="/cart"
        className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-full bg-teal-deep py-2.5 pr-2.5 pl-5 text-ivory shadow-[0_18px_40px_-12px_rgba(11,64,64,0.7)] ring-1 ring-gold/30 transition-transform hover:-translate-y-0.5"
      >
        <BagIcon className="h-5 w-5 shrink-0 text-gold-light" />
        <span className="min-w-0 flex-1 truncate text-sm">
          <strong className="font-semibold">
            {count} item{count > 1 ? "s" : ""}
          </strong>{" "}
          · {formatINR(cartTotal(c))} · Free delivery
        </span>
        <span className="rounded-full bg-gold-light px-4 py-2 text-sm font-semibold text-maroon-deep">View cart →</span>
      </Link>
    </div>
  );
}
