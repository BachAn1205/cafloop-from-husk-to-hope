-- QR / web visit tracking (each visit to cafloop.com = 1 lượt)
create table if not exists public.qr_visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  path text not null default '/',
  referrer text
);

create index if not exists qr_visits_created_at_idx on public.qr_visits (created_at desc);

alter table public.qr_visits enable row level security;

-- Public site can record visits
drop policy if exists "anon_insert_qr_visits" on public.qr_visits;
create policy "anon_insert_qr_visits"
  on public.qr_visits
  for insert
  to anon, authenticated
  with check (true);

-- Public + admin can read count (no sensitive PII stored)
drop policy if exists "anon_select_qr_visits" on public.qr_visits;
create policy "anon_select_qr_visits"
  on public.qr_visits
  for select
  to anon, authenticated
  using (true);

grant select, insert on table public.qr_visits to anon, authenticated;
grant all on table public.qr_visits to service_role;
