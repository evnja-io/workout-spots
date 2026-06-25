-- ============================================================================
-- Workout Spots — Discover: write-path prerequisites
-- ============================================================================
-- Run this in the Supabase SQL editor (it executes as the `postgres` owner,
-- which is required for the auth.users trigger and storage changes). The app's
-- anon key cannot run DDL.
--
-- This migration is IDEMPOTENT and safe to re-run. It does NOT enable RLS or
-- add/alter any SELECT policies, so it cannot break the already-working public
-- reads. It only adds: unique constraints, the public.users mirror trigger,
-- the user-rating aggregation trigger, additive write policies, and the
-- spot-images storage bucket + its policies.
--
-- Background: the app sets `created_by` / `user_id` from the session
-- (auth.uid()), which equals public.users.id after the mirror trigger below.
-- `location_images.uploaded_by` references auth.users(id) directly.
-- `locations.average_rating` / `rating_count` are USER-derived (from
-- location_ratings); `external_average_rating` / `external_rating_count` are the
-- scraped base and are left untouched.
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- 1. Unique constraints (so per-user upserts/inserts don't duplicate)
--    De-duplicate any existing rows FIRST (keep one per pair), then add the
--    constraint only if it isn't already present.
-- ----------------------------------------------------------------------------

-- location_ratings: one rating per (location_id, user_id)
delete from public.location_ratings a
using public.location_ratings b
where a.location_id = b.location_id
  and a.user_id   = b.user_id
  and a.ctid < b.ctid;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'location_ratings_location_user_unique'
  ) then
    alter table public.location_ratings
      add constraint location_ratings_location_user_unique unique (location_id, user_id);
  end if;
end $$;

-- location_likes: one like per (location_id, user_id)
delete from public.location_likes a
using public.location_likes b
where a.location_id = b.location_id
  and a.user_id   = b.user_id
  and a.ctid < b.ctid;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'location_likes_location_user_unique'
  ) then
    alter table public.location_likes
      add constraint location_likes_location_user_unique unique (location_id, user_id);
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- 2. public.users mirror trigger
--    Copies new auth.users rows into public.users (id + email) so the FKs on
--    location_likes / location_comments / location_ratings / locations resolve.
--    Backfills existing auth users.
-- ----------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- public.users.email is NOT NULL; skip auth users without an email
  -- (e.g. phone/anonymous sign-ins) so signup is never blocked.
  if new.email is not null then
    insert into public.users (id, email)
    values (new.id, new.email)
    on conflict (id) do nothing;
  end if;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill anyone who signed up before the trigger existed.
insert into public.users (id, email)
select u.id, u.email
from auth.users u
where u.email is not null
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- 3. User-rating aggregation trigger
--    Keeps locations.average_rating / rating_count in sync with the user-
--    submitted location_ratings rows (NULL average when there are none).
-- ----------------------------------------------------------------------------

create or replace function public.refresh_location_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  loc uuid := coalesce(new.location_id, old.location_id);
begin
  update public.locations l
  set rating_count   = sub.cnt,
      average_rating = sub.avg
  from (
    select count(*)::int as cnt,
           avg(rating)::numeric as avg
    from public.location_ratings
    where location_id = loc
  ) sub
  where l.id = loc;
  return null;
end $$;

drop trigger if exists trg_refresh_location_rating on public.location_ratings;
create trigger trg_refresh_location_rating
  after insert or update or delete on public.location_ratings
  for each row execute function public.refresh_location_rating();

-- ----------------------------------------------------------------------------
-- 4. Additive WRITE RLS policies (INSERT / UPDATE / DELETE), scoped to
--    auth.uid(). These do NOT enable RLS and do NOT touch SELECT, so existing
--    public reads are unaffected. If RLS is OFF on a table the policy is inert;
--    if RLS is ON, these are what let authenticated users contribute.
--    Each is dropped-if-exists first so the script is re-runnable.
-- ----------------------------------------------------------------------------

-- locations (created_by = auth.uid())
drop policy if exists "locations insert own"  on public.locations;
create policy "locations insert own" on public.locations
  for insert to authenticated with check (created_by = auth.uid());
drop policy if exists "locations update own"  on public.locations;
create policy "locations update own" on public.locations
  for update to authenticated using (created_by = auth.uid()) with check (created_by = auth.uid());

-- location_likes (user_id = auth.uid())
drop policy if exists "location_likes insert own" on public.location_likes;
create policy "location_likes insert own" on public.location_likes
  for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "location_likes delete own" on public.location_likes;
create policy "location_likes delete own" on public.location_likes
  for delete to authenticated using (user_id = auth.uid());

-- location_comments (user_id = auth.uid())
drop policy if exists "location_comments insert own" on public.location_comments;
create policy "location_comments insert own" on public.location_comments
  for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "location_comments update own" on public.location_comments;
create policy "location_comments update own" on public.location_comments
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "location_comments delete own" on public.location_comments;
create policy "location_comments delete own" on public.location_comments
  for delete to authenticated using (user_id = auth.uid());

-- location_ratings (user_id = auth.uid())
drop policy if exists "location_ratings insert own" on public.location_ratings;
create policy "location_ratings insert own" on public.location_ratings
  for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "location_ratings update own" on public.location_ratings;
create policy "location_ratings update own" on public.location_ratings
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "location_ratings delete own" on public.location_ratings;
create policy "location_ratings delete own" on public.location_ratings
  for delete to authenticated using (user_id = auth.uid());

-- location_equipments (added_by = auth.uid())
drop policy if exists "location_equipments insert own" on public.location_equipments;
create policy "location_equipments insert own" on public.location_equipments
  for insert to authenticated with check (added_by = auth.uid());

-- location_disciplines (added_by = auth.uid())
drop policy if exists "location_disciplines insert own" on public.location_disciplines;
create policy "location_disciplines insert own" on public.location_disciplines
  for insert to authenticated with check (added_by = auth.uid());

-- location_images (uploaded_by = auth.uid())
drop policy if exists "location_images insert own" on public.location_images;
create policy "location_images insert own" on public.location_images
  for insert to authenticated with check (uploaded_by = auth.uid());

-- ----------------------------------------------------------------------------
-- 5. Storage: the spot-images bucket + its policies
--    storage.objects has RLS enabled by default, so both a public SELECT and an
--    authenticated INSERT policy are required for the bucket.
-- ----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('location-images', 'location-images', true)
on conflict (id) do nothing;

drop policy if exists "location-images public read" on storage.objects;
create policy "location-images public read" on storage.objects
  for select using (bucket_id = 'location-images');

drop policy if exists "location-images authenticated upload" on storage.objects;
create policy "location-images authenticated upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'location-images');

drop policy if exists "location-images owner update" on storage.objects;
create policy "location-images owner update" on storage.objects
  for update to authenticated using (bucket_id = 'location-images' and owner = auth.uid());

drop policy if exists "location-images owner delete" on storage.objects;
create policy "location-images owner delete" on storage.objects
  for delete to authenticated using (bucket_id = 'location-images' and owner = auth.uid());

commit;

-- ============================================================================
-- Post-run sanity checks (optional — run these SELECTs to confirm):
--   select conname from pg_constraint
--     where conname in ('location_ratings_location_user_unique',
--                       'location_likes_location_user_unique');
--   select tgname from pg_trigger
--     where tgname in ('on_auth_user_created','trg_refresh_location_rating');
--   select id, public from storage.buckets where id = 'location-images';
-- ============================================================================
