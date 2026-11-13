"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BagIcon } from "@/components/art/Icons";
import { cartCount, cartTotal, useCart } from "@/lib/cart";
import { formatINR } from "@/lib/site";

/**
 * Floating "View cart" bar on the home page once something is in the cart.
 * Hidden while the hero (#top) is on screen so it never covers the main buttons;
 * the header cart icon already shows the count there.
 */
export function CartBar() {
  const c = useCart();
  const count = cartCount(c);
  const [heroInView, setHeroInView] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("top"); // CartBar is only used on the home page
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setHeroInView(entry.intersectionRatio > 0.15), {
      threshold: [0, 0.15, 0.5],
    });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  if (count === 0) return null;
  const hidden = heroInView;

  return (
    <div
      aria-hidden={hidden}
      className={`pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 transition-all duration-300 md:justify-end md:px-6 ${
        hidden ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <Link
        href="/cart"
        tabIndex={hidden ? -1 : 0}
        className={`flex w-full max-w-md items-center gap-3 rounded-full bg-teal-deep py-2.5 pr-2.5 pl-5 text-ivory shadow-[0_18px_40px_-12px_rgba(11,64,64,0.7)] ring-1 ring-gold/30 transition-transform hover:-translate-y-0.5 md:max-w-sm ${
          hidden ? "" : "pointer-events-auto"
        }`}
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
