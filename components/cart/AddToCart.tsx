"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BagIcon, CheckIcon } from "@/components/art/Icons";
import { cart, useCart } from "@/lib/cart";
import { MAX_QTY_PER_EDITION, type EditionKey } from "@/lib/site";

/** "Add to cart" for an edition card, with a short confirmation and a link to the cart. */
export function AddToCart({ edition }: { edition: EditionKey }) {
  const inCart = useCart()[edition];
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function add() {
    cart.add(edition);
    setJustAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={add}
        disabled={inCart >= MAX_QTY_PER_EDITION}
        className={`btn ${justAdded ? "bg-teal text-ivory" : "btn-primary"}`}
      >
        {justAdded ? (
          <>
            <CheckIcon className="h-5 w-5" /> Added
          </>
        ) : (
          <>
            <BagIcon className="h-5 w-5" /> Add to cart
          </>
        )}
      </button>
      <p aria-live="polite" className="min-h-5 text-sm text-ink-soft">
        {inCart > 0 ? (
          <>
            {inCart} in cart ·{" "}
            <Link href="/cart" className="font-semibold text-teal hover:underline">
              View cart →
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}
