-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- Project: tkjyejioryexljcdqrmo (Jimmy-Jam)

create table if not exists public.assistance_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  assistance_type text[] not null,
  description text,
  status text not null default 'new' -- new | reviewing | approved | denied
);

alter table public.assistance_applications enable row level security;

-- Anyone (including anonymous site visitors) can submit an application.
create policy "Anyone can submit an application"
  on public.assistance_applications
  for insert
  to anon
  with check (true);

-- No one can read, update, or delete using the anon key.
-- Staff review happens in the Supabase Table Editor (or a future authenticated admin view).


-- ============================================================
-- VENUE PINS (GPS navigation feature)
-- ============================================================
-- Public visitors can see pins (parking, restrooms, event tables, etc.) and
-- navigate to them. Only a logged-in admin can create/edit/delete pins.
--
-- IMPORTANT: after running this, create at least one admin login:
-- Supabase Dashboard > Authentication > Users > Add User (email + password).
-- That person then signs in on the app's Admin page to manage pins.
-- The anon (public) key can NEVER write to this table, regardless of what
-- the app's UI shows, so a real login is required, not just a PIN screen.

create table if not exists public.venue_pins (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  category text not null, -- parking | restroom | table | vendor | attraction | other
  lat double precision not null,
  lng double precision not null
);

alter table public.venue_pins enable row level security;

create policy "Anyone can view pins"
  on public.venue_pins
  for select
  to anon, authenticated
  using (true);

create policy "Logged-in admins can manage pins"
  on public.venue_pins
  for all
  to authenticated
  using (true)
  with check (true);

-- Seed pins, approximated from the venue's aerial site map (parking lots,
-- chili team row, vendors, kid zone, etc.) — adjust exact placement from the
-- Admin page once you can verify them on the ground with a phone GPS.
insert into public.venue_pins (name, category, lat, lng) values
  ('VIP Parking', 'parking', 29.772000, -81.454200),
  ('Team Parking', 'parking', 29.771300, -81.452600),
  ('Judges Parking', 'parking', 29.771500, -81.453400),
  ('Handicap Parking', 'parking', 29.771100, -81.452500),
  ('Vendor / Volunteer & Band Parking', 'parking', 29.770600, -81.454400),
  ('Food Trucks', 'vendor', 29.770900, -81.452900),
  ('Chili Teams', 'table', 29.770400, -81.452800),
  ('BBQ Turn-In / Judges Tent', 'table', 29.771000, -81.453000),
  ('Vendors', 'vendor', 29.770500, -81.454100),
  ('Kid Zone', 'attraction', 29.770200, -81.454000),
  ('BMX Show', 'attraction', 29.769900, -81.454100),
  ('K9 Show', 'attraction', 29.769900, -81.453700),
  ('Car Show', 'attraction', 29.769800, -81.452900),
  ('Side by Sides', 'attraction', 29.769600, -81.452800)
on conflict do nothing;
