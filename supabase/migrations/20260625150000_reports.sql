-- ============================================================================
-- Workout Spots — Reports: spot/comment reporting
-- ============================================================================
-- Run this in the Supabase SQL editor (the app's anon key cannot run DDL).
--
-- Creates public.reports, where a signed-in user can report a spot or a comment
-- with an optional reason. RLS is enabled; only an INSERT policy scoped to
-- auth.uid() is added (mirroring "location_comments insert own"). No SELECT
-- policy is added on purpose — reports are not publicly readable.
-- ============================================================================

begin;

create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('spot', 'comment')),
  target_id   uuid not null,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason      text,
  created_at  timestamptz not null default now()
);

alter table public.reports enable row level security;

-- A signed-in user may only file reports as themselves.
drop policy if exists "reports insert own" on public.reports;
create policy "reports insert own" on public.reports
  for insert to authenticated with check (reporter_id = auth.uid());

commit;
