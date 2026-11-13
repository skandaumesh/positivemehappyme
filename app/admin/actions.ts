"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { endAdminSession, isAdmin, signInAdmin } from "@/lib/admin-auth";
import { clientIp, isLimited, recordHit } from "@/lib/rate-limit";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/validation";

export type LoginState = { error: string; email: string };

const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MS = 15 * 60_000;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").slice(0, 200);
  const password = String(formData.get("password") ?? "").slice(0, 200);
  if (!email || !password) return { error: "Please enter your email and password.", email };

  const key = `login-fail:${clientIp(await headers())}`;
  if (isLimited(key, MAX_FAILED_LOGINS, LOCKOUT_MS)) {
    return { error: "Too many wrong attempts. Please wait 15 minutes and try again.", email };
  }

  const result = await signInAdmin(email, password);
  if (!result.ok) {
    recordHit(key);
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return { error: result.error, email };
  }
  redirect("/admin");
}

export async function logout() {
  await endAdminSession();
  redirect("/admin");
}

export async function setOrderStatus(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;
  if (!/^[0-9a-f-]{36}$/i.test(id) || !ORDER_STATUSES.includes(status)) {
    throw new Error("Invalid request");
  }

  const { error } = await supabaseAdmin().from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

/** Hides an order from the admin and exports. The row stays in the database. */
export async function deleteOrder(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error("Invalid request");

  const { error } = await supabaseAdmin()
    .from("orders")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
