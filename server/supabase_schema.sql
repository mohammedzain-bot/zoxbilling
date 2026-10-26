-- =========================================================================
-- ZOX STORE MANAGEMENT — SUPABASE DATABASE SETUP
-- =========================================================================
-- Instructions:
-- 1. Open your Supabase Project dashboard (https://supabase.com/dashboard)
-- 2. Click on "SQL Editor" on the left menu.
-- 3. Click "New query", paste the script below, and click "Run".
-- =========================================================================

-- 1. Create the primary store persistence table
create table if not exists zox_store (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS)
alter table zox_store enable row level security;

-- 3. Create access policy allowing full CRUD via API key
drop policy if exists "Allow full access to zox_store" on zox_store;
create policy "Allow full access to zox_store" on zox_store
  for all
  using (true)
  with check (true);

-- 4. Initial check
select * from zox_store;
