import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { OrderStatus } from "./validation";

export const SCREENSHOT_BUCKET = "payment-screenshots";

export type Order = {
  id: string;
  order_no: number;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  map_link: string;
  address: string | null;
  kids_qty: number;
  adults_qty: number;
  total: number;
  screenshot_path: string;
  status: OrderStatus;
  /** Set when an admin deletes the order — the row is kept, just hidden. */
  deleted_at?: string | null;
};

let client: SupabaseClient | null = null;

/**
 * Server-only client using the secret (service role) key. The orders table and
 * screenshot bucket have no public access at all — everything goes through here.
 */
export function supabaseAdmin(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
