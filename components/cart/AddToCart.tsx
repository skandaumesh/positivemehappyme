"use client";

import Link from "next/link";
import { BagIcon, CheckIcon } from "@/components/art/Icons";
import { cart, useCart } from "@/lib/cart";
import { EDITIONS, MAX_QTY_PER_EDITION, PRICES, formatINR, type EditionKey } from "@/lib/site";

/**
 * "Add to cart" on an edition card. Once added, it turns into a green
 * quantity control (− ✓ 2 added +) so the customer can adjust before going to the cart.
 * Going below 1 removes the book and brings the Add button back.
 */
export function AddToCart({ edition }: { edition: EditionKey }) {
  const qty = useCart()[edition];
  const title = EDITIONS[edition].title;

  return (
    <div className="flex flex-col items-end gap-2">
      {qty === 0 ? (
        <button type="button" onClick={() => cart.add(edition)} className="btn btn-primary">
          <BagIcon className="h-5 w-5" /> Add to cart
        </button>
      ) : (
        <div
          role="group"
          aria-label={`${title} quantity`}
          className="flex items-center rounded-full bg-teal p-1 text-ivory shadow-[0_12px_24px_-12px_rgba(15,92,90,0.7)]"
        >
          <button
            type="button"
            onClick={() => cart.set(edition, qty - 1)}
            aria-label={qty === 1 ? `Remove ${title} from cart` : `Remove one ${title}`}
            className="grid h-10 w-10 place-items-center rounded-full text-2xl leading-none transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-gold-light"
          >
            −
          </button>
          <span aria-live="polite" className="flex min-w-[6.5rem] items-center justify-center gap-1.5 px-1 font-semibold tabular-nums">
            <CheckIcon className="h-4 w-4 text-gold-light" />
            {qty} added
          </span>
          <button
            type="button"
            onClick={() => cart.add(edition)}
            disabled={qty >= MAX_QTY_PER_EDITION}
            aria-label={`Add one more ${title}`}
            className="grid h-10 w-10 place-items-center rounded-full text-2xl leading-none transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-gold-light disabled:opacity-40"
          >
            +
          </button>
        </div>
      )}
      <p className="min-h-5 text-sm text-ink-soft">
        {qty > 0 ? (
          <>
            {formatINR(PRICES[edition] * qty)} ·{" "}
            <Link href="/cart" className="font-semibold text-teal hover:underline">
              View cart →
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}
