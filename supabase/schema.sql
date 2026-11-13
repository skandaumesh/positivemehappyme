-- Positive Me Happy Me — run this once in Supabase → SQL Editor → New query → Run.
-- Creates the orders table and the private bucket for payment screenshots.
-- Nothing here is publicly readable: the website server talks to Supabase with
-- the secret key. Admin logins are Supabase Auth users with app_metadata.role =
-- 'admin' (create them with scripts/create-admin.mjs).

create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_no        bigint generated always as identity unique,
  created_at      timestamptz not null default now(),
  name            text not null check (char_length(name) between 2 and 100),
  email           text not null check (char_length(email) <= 200),
  phone           text not null check (phone ~ '^[6-9][0-9]{9}$'),
  map_link        text not null check (char_length(map_link) <= 1000),
  address         text check (char_length(address) <= 500),
  kids_qty        int  not null default 0 check (kids_qty between 0 and 20),
  adults_qty      int  not null default 0 check (adults_qty between 0 and 20),
  total           int  not null check (total > 0),
  screenshot_path text not null,
  status          text not null default 'pending'
                  check (status in ('pending', 'verified', 'shipped', 'rejected')),
  constraint orders_at_least_one_book check (kids_qty + adults_qty > 0)
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- "Delete" in the admin only sets this; orders are never removed from the database.
alter table public.orders add column if not exists deleted_at timestamptz;

-- Lock the table down: RLS on with no policies = no access for anon/authenticated.
alter table public.orders enable row level security;
revoke all on public.orders from anon, authenticated;

-- Private bucket for screenshots (5 MB max, images only).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-screenshots',
  'payment-screenshots',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do nothing;
