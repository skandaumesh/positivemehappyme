# Positive Me Happy Me — launch site

Brand site with a cart for **My Daily Dose of Affirmation**. Customers add Kids/Adults kits to
the cart (saved in the browser), then on `/cart` review items, enter name, email, phone and
Google Maps link, pay by UPI QR, upload the payment screenshot and submit. Orders land in a
login-protected admin page at `/admin`.

| Page | What |
| --- | --- |
| `/` | Home: brand story, editions with **Add to cart**, how-to-order |
| `/cart` | Cart + checkout: items, details, UPI QR, screenshot upload |
| `/admin` | Orders dashboard (Supabase Auth login) |

**Stack:** Next.js 16 (App Router) · Tailwind CSS 4 · Supabase (Postgres + Storage) · Vercel

## Go live in ~15 minutes

### 1. Supabase (database + screenshot storage)
1. Create a project at [supabase.com](https://supabase.com) — pick the **Mumbai (ap-south-1)** region.
2. **SQL Editor → New query**, paste [`supabase/schema.sql`](supabase/schema.sql), **Run**.
3. **Project Settings → API keys**: copy the **Project URL** and the **secret / service_role** key.

### 2. Environment variables
Copy `.env.example` to `.env.local` and fill in:

| Key | What |
| --- | --- |
| `SUPABASE_URL` | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key (server only) |
| `NEXT_PUBLIC_UPI_ID` | Optional — defaults to `8147215288@pthdfc` (set in `lib/site.ts`) |
| `NEXT_PUBLIC_UPI_NAME` | Optional — defaults to `NEHA N LAL` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional, digits with country code (`919876543210`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional — defaults to `nehalal18@gmail.com` |

### 3. Admin login (stored in Supabase Auth)
Admin accounts are Supabase Auth users marked `role: admin`. Create one — or run it again
with a new password to change it:
```bash
node --env-file=.env.local scripts/create-admin.mjs you@example.com 'a-strong-password'
```
Accounts are listed under **Supabase → Authentication → Users**. Deleting a user there removes
their access immediately. Recommended: **Authentication → Sign In / Providers → turn off
"Allow new users to sign up"** (public sign-ups can't become admins anyway, but keep it tidy).

### 4. Run locally
```bash
npm install
npm run dev     # http://localhost:3000  ·  admin: http://localhost:3000/admin
```

### 5. Deploy to Vercel
Push to GitHub → **vercel.com → Add New Project** → import the repo → add the same
environment variables → **Deploy**. Add the custom domain under **Settings → Domains**.

> `NEXT_PUBLIC_*` values are baked in at build time — redeploy after changing them.

## Before launch — test checklist
- [ ] Pay **₹1** from GPay, PhonePe and Paytm using the site's QR. It's a personal UPI ID, so some apps
      may reject a pre-filled amount; the original Paytm QR (`public/images/upi-qr.png`) is offered as a
      fallback under "Payment app showing an error?".
- [ ] Place a full test order on a phone → it appears in `/admin` with the screenshot.
- [ ] Mark it Verified → Shipped; try **Send confirmation** on WhatsApp; try **Export CSV**.

## Swapping in real photos
Put images in `public/images/` and set the paths in [`lib/site.ts`](lib/site.ts) → `site.images`
(`hero`, `book`, `kids`, `adults`). Empty paths show the illustrated placeholders.
Prices, edition copy and contact details also live in `lib/site.ts`.

## How it's secured
- The `orders` table and `payment-screenshots` bucket have **no public access** (RLS on, no policies).
- Only the Next.js server talks to Supabase, using the secret key.
- `/admin` logins are checked against Supabase Auth (passwords hashed by Supabase); only users with
  `app_metadata.role = "admin"` get in. The session is a signed httpOnly cookie (7 days), and every
  admin request re-checks the account, so removing a user revokes access at once.
- Orders are validated again on the server; totals are calculated server-side.
- Screenshots are compressed in the browser (~200 KB) and limited to images under 4 MB.
