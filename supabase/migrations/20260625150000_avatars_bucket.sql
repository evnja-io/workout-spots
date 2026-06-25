-- ============================================================================
-- Workout Spots — profile avatars storage bucket
-- ============================================================================
-- Run this in the Supabase SQL editor (it executes as the `postgres` owner,
-- which is required for storage changes). The app's anon key cannot run DDL.
--
-- Creates a PUBLIC `avatars` bucket for user profile pictures. Modeled on the
-- `location-images` bucket block in 20260625120000_discover_write_prerequisites.sql,
-- but writes are restricted to each user's OWN folder: objects are stored under
-- `avatars/{auth.uid()}/…`, and the insert/update/delete policies require the
-- first path segment to equal the caller's auth.uid(). Public read is open so the
-- profile_picture_url (a public URL) renders for everyone.
--
-- storage.objects has RLS enabled by default, so a public SELECT plus
-- per-user INSERT/UPDATE/DELETE policies are all required.
--
-- IDEMPOTENT and safe to re-run.
-- ============================================================================

begin;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars public read" on storage.objects;
create policy "avatars public read" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatars insert own" on storage.objects;
create policy "avatars insert own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars update own" on storage.objects;
create policy "avatars update own" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars delete own" on storage.objects;
create policy "avatars delete own" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

commit;

-- Post-run sanity checks (optional):
--   select id, public from storage.buckets where id = 'avatars';
--   select policyname, cmd from pg_policies
--     where tablename = 'objects' and policyname like 'avatars%'
--     order by cmd;
-- ============================================================================
