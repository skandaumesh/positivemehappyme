import "server-only";
import { supabaseAdmin, type Order } from "./supabase-admin";

/**
 * Orders that haven't been deleted. "Delete" in the admin only sets `deleted_at`,
 * so rows are never removed from the database.
 *
 * `softDelete` is false until the `deleted_at` column exists (see supabase/schema.sql);
 * in that case all orders are returned and the Delete button is hidden.
 */
export async function listActiveOrders({
  ascending = false,
  limit = 1000,
}: { ascending?: boolean; limit?: number } = {}): Promise<{ orders: Order[]; softDelete: boolean }> {
  const query = () =>
    supabaseAdmin().from("orders").select("*").order("created_at", { ascending }).limit(limit);

  const active = await query().is("deleted_at", null);
  if (!active.error) return { orders: active.data as Order[], softDelete: true };

  if (/deleted_at/.test(active.error.message)) {
    const all = await query();
    if (all.error) throw new Error(all.error.message);
    return { orders: all.data as Order[], softDelete: false };
  }
  throw new Error(active.error.message);
}
