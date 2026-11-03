-- People's Choice voting. Run once in the Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- Project: tkjyejioryexljcdqrmo (Jimmy-Jam)
-- Closing time must match VOTING_CLOSES_AT in src/FestivalPeoplesChoice.jsx.

create table if not exists public.people_choice_votes (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  device_id text not null,
  category text not null,
  team_name text not null,
  -- One vote per device per category, enforced by the database.
  unique (device_id, category)
);

alter table public.people_choice_votes enable row level security;

-- Anonymous devices can vote, but only before voting closes.
create policy "Devices can vote before voting closes"
  on public.people_choice_votes
  for insert
  to anon
  with check (now() < timestamptz '2027-01-09 17:00:00-05');

-- No select policy: raw votes (with device IDs) cannot be read with the anon key.

-- Public tally. Returns nothing until voting closes.
create or replace function public.people_choice_results()
returns table (category text, team_name text, votes bigint)
language sql
security definer
set search_path = public
as $$
  select v.category, v.team_name, count(*)::bigint
  from public.people_choice_votes v
  where now() >= timestamptz '2027-01-09 17:00:00-05'
  group by v.category, v.team_name
$$;

grant execute on function public.people_choice_results() to anon;
