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
  name text not null unique,
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

-- Seed pins, repositioned to match the relative layout shown on the venue's
-- aerial site map (VIP Parking at the north end, the Chili Teams grid in the
-- center, Vendors/Kid Zone/Car Show along the west and south edges, etc).
-- Absolute GPS is still approximate — these are correct RELATIVE TO EACH
-- OTHER based on the site map, but should be fine-tuned from the Admin page
-- once someone can walk the grounds with a phone GPS. Safe to re-run: this
-- upserts by name instead of creating duplicates.
insert into public.venue_pins (name, category, lat, lng) values
  ('VIP Parking', 'parking', 29.7715310, -81.4534230),
  ('Judges Parking', 'parking', 29.7711460, -81.4533910),
  ('Team Parking', 'parking', 29.7711190, -81.4531070),
  ('Handicap Parking', 'parking', 29.7709270, -81.4530430),
  ('Vendor / Volunteer & Band Parking', 'parking', 29.7707620, -81.4538030),
  ('Food Trucks', 'vendor', 29.7708990, -81.4532960),
  ('BBQ Turn-In / Judges Tent', 'table', 29.7708720, -81.4533600),
  ('Chili Teams', 'table', 29.7706520, -81.4533600),
  ('Vendors', 'vendor', 29.7706790, -81.4536760),
  ('Kid Zone', 'attraction', 29.7705420, -81.4535490),
  ('BMX Show', 'attraction', 29.7704050, -81.4535490),
  ('K9 Show', 'attraction', 29.7704050, -81.4534230),
  ('Car Show', 'attraction', 29.7703500, -81.4532960),
  ('Side by Sides', 'attraction', 29.7702670, -81.4533600)
on conflict (name) do update set
  category = excluded.category,
  lat = excluded.lat,
  lng = excluded.lng;
