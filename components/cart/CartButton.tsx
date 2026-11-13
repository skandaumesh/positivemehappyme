"use client";

import Link from "next/link";
import { BagIcon } from "@/components/art/Icons";
import { cartCount, useCart } from "@/lib/cart";

/** Header cart icon with item-count badge. */
export function CartButton() {
  const count = cartCount(useCart());
  return (
    <Link
      href="/cart"
      aria-label={count ? `Cart, ${count} item${count > 1 ? "s" : ""}` : "Cart, empty"}
      className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-champagne bg-white/80 text-teal transition-colors hover:border-maroon/40 hover:text-maroon"
    >
      <BagIcon className="h-[22px] w-[22px]" />
      {count > 0 ? (
        <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-maroon px-1 text-[0.7rem] leading-none font-bold text-ivory ring-2 ring-ivory">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
