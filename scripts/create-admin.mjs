// Creates (or updates) an admin login in Supabase Auth.
//
//   node --env-file=.env.local scripts/create-admin.mjs <email> <password>
//
// Run it again with a new password to change it. The account is marked
// app_metadata.role = "admin", which only the secret key can set.
import { createClient } from "@supabase/supabase-js";

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("Usage: node --env-file=.env.local scripts/create-admin.mjs <email> <password>");
  process.exit(1);
}
if (password.length < 8) {
  console.error("Use a password of at least 8 characters.");
  process.exit(1);
}

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (see .env.example).");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const target = email.trim().toLowerCase();

let existing = null;
for (let page = 1; !existing; page++) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
  if (error) throw error;
  existing = data.users.find((u) => u.email?.toLowerCase() === target) ?? null;
  if (data.users.length < 200) break;
}

const attrs = { password, email_confirm: true, app_metadata: { role: "admin" } };
const { data, error } = existing
  ? await supabase.auth.admin.updateUserById(existing.id, attrs)
  : await supabase.auth.admin.createUser({ email: target, ...attrs });

if (error) {
  console.error("Failed:", error.message);
  process.exit(1);
}
console.log(`${existing ? "Updated" : "Created"} admin ${data.user.email} (${data.user.id})`);
