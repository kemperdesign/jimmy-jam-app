-- Admin page: staff accounts, editable festival content, and photo storage.
-- Run once in the Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- Project: tkjyejioryexljcdqrmo (Jimmy-Jam)
-- Before running: create the admin login in Dashboard > Authentication > Users > Add user
-- (email kemperdesignservices@gmail.com, choose a strong password). The last statement
-- below then grants it admin access.

-- ============================================================
-- 1. Admins: who may change content. Nobody can read this table with the anon key.
-- ============================================================
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text
);

alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid())
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ============================================================
-- 2. Content items: artists, schedule events, and teams, stored as one JSON record each.
--    The app reads active rows ordered by sort_order and falls back to its built-in list.
-- ============================================================
create table if not exists public.content_items (
  kind text not null,                      -- artists | schedule | teams | sponsors | faq | winners | volunteer
  id text not null,                        -- matches data.id
  sort_order integer not null default 0,
  active boolean not null default true,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (kind, id)
);

alter table public.content_items enable row level security;

create policy "Anyone can read content items"
  on public.content_items
  for select
  to anon, authenticated
  using (true);

create policy "Admins manage content items"
  on public.content_items
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 3. Tighten existing map tables so only admins can write (they were open to any login).
-- ============================================================
drop policy if exists "Logged-in admins can manage pins" on public.venue_pins;
create policy "Admins manage pins"
  on public.venue_pins
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Logged-in admins can update site map calibration" on public.site_map_calibration;
create policy "Admins manage site map calibration"
  on public.site_map_calibration
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 4. Photo storage: public read, admin-only upload, replace, and delete.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('content-photos', 'content-photos', true)
on conflict (id) do nothing;

create policy "Anyone can view content photos"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'content-photos');

create policy "Admins upload content photos"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'content-photos' and public.is_admin());

create policy "Admins update content photos"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'content-photos' and public.is_admin())
  with check (bucket_id = 'content-photos' and public.is_admin());

create policy "Admins delete content photos"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'content-photos' and public.is_admin());

-- ============================================================
-- 5. Grant admin access to the owner account. Re-running is safe.
-- ============================================================
insert into public.admins (user_id, email)
select id, email from auth.users where email = 'kemperdesignservices@gmail.com'
on conflict (user_id) do nothing;
