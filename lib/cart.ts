"use client";

import { useSyncExternalStore } from "react";
import { EDITION_KEYS, MAX_QTY_PER_EDITION, priceTotal, type EditionKey } from "./site";

/**
 * Tiny cart store kept in localStorage so it survives page changes and reloads,
 * and stays in sync across tabs. Read it with `useCart()`, change it with `cart.*`.
 */
export type Cart = Record<EditionKey, number>;

const STORAGE_KEY = "pmhm-cart-v1";
const EMPTY: Cart = Object.freeze({ kids: 0, adults: 0 }) as Cart;

let cache: Cart | null = null;
const listeners = new Set<() => void>();

const clampQty = (n: unknown) =>
  Number.isInteger(n) ? Math.min(MAX_QTY_PER_EDITION, Math.max(0, n as number)) : 0;

function readStorage(): Cart {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!parsed || typeof parsed !== "object") return EMPTY;
    return { kids: clampQty(parsed.kids), adults: clampQty(parsed.adults) };
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): Cart {
  if (cache === null) cache = readStorage();
  return cache;
}

const getServerSnapshot = () => EMPTY;

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    cache = readStorage();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function write(next: Cart) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* private mode / storage full — cart still works for this page view */
  }
  listeners.forEach((l) => l());
}

export const cart = {
  add(edition: EditionKey, n = 1) {
    const c = getSnapshot();
    write({ ...c, [edition]: clampQty(c[edition] + n) });
  },
  set(edition: EditionKey, qty: number) {
    write({ ...getSnapshot(), [edition]: clampQty(qty) });
  },
  remove(edition: EditionKey) {
    write({ ...getSnapshot(), [edition]: 0 });
  },
  clear() {
    write({ kids: 0, adults: 0 });
  },
};

export function useCart(): Cart {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const cartCount = (c: Cart) => EDITION_KEYS.reduce((n, k) => n + c[k], 0);
export const cartTotal = (c: Cart) => priceTotal(c);
