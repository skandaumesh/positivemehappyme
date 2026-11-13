import "server-only";
import { createClient, type User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { supabaseAdmin } from "./supabase-admin";

/**
 * Admin accounts live in Supabase Auth (auth.users, passwords hashed by Supabase).
 * Only users with app_metadata.role = "admin" may use /admin — app_metadata can
 * only be set with the secret key (see scripts/create-admin.mjs), so a public
 * sign-up can never become an admin.
 *
 * After a successful login we set our own signed, httpOnly cookie
 * ({ uid, exp } + HMAC). Every admin request re-checks the user in Supabase, so
 * deleting the user or removing the role revokes access immediately.
 */
const COOKIE = "pmhm_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type AdminUser = { id: string; email: string };

function hmacKey(): Buffer {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set.");
  return createHash("sha256").update(`pmhm-admin-session:${key}`).digest();
}

const sign = (payload: string) => createHmac("sha256", hmacKey()).update(payload).digest("base64url");

function encodeSession(uid: string, exp: number) {
  const payload = Buffer.from(JSON.stringify({ uid, exp })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decodeSession(token: string): { uid: string; exp: number } | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.uid !== "string" || typeof data.exp !== "number") return null;
    if (data.exp * 1000 < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

const isAdminUser = (user: User | null | undefined): user is User =>
  Boolean(user && user.app_metadata?.role === "admin" && user.email);

/** Verifies email + password against Supabase Auth and starts an admin session. */
export async function signInAdmin(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { ok: false, error: "Supabase is not configured on the server yet." };

  // Throwaway client: signing in switches its auth state to the user's session.
  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  let result;
  try {
    result = await client.auth.signInWithPassword({ email: email.trim(), password });
  } catch {
    return { ok: false, error: "Couldn’t reach the login service. Please check your connection and try again." };
  }
  const { data, error } = result;
  if (error || !isAdminUser(data.user)) {
    return { ok: false, error: "Email or password isn’t right. Please try again." };
  }
  await client.auth.signOut().catch(() => {}); // we keep our own cookie, not Supabase's tokens

  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  (await cookies()).set(COOKIE, encodeSession(data.user.id, exp), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return { ok: true };
}

/** The signed-in admin, or null. Re-checks the account in Supabase on every call. */
export async function getAdmin(): Promise<AdminUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  await connection(); // the expiry check reads the clock, so this must run per request
  let session;
  try {
    session = decodeSession(token);
  } catch {
    return null;
  }
  if (!session) return null;

  const { data, error } = await supabaseAdmin().auth.admin.getUserById(session.uid);
  if (error || !isAdminUser(data.user)) return null;
  return { id: data.user.id, email: data.user.email as string };
}

export async function isAdmin(): Promise<boolean> {
  return (await getAdmin()) !== null;
}

export async function endAdminSession() {
  (await cookies()).delete(COOKIE);
}
