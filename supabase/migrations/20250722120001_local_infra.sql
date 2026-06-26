-- ============================================================================
-- Local infrastructure: objects the `public`-only baseline dump excludes.
-- ============================================================================
-- The baseline (20250722120000_remote_baseline.sql) is a `public`-schema dump,
-- so it omits anything living in the `auth` / `storage` schemas. The local
-- Supabase stack provisions those schemas itself, but the project-specific
-- wiring below must be replayed so a fresh `supabase db reset` reproduces
-- production behavior:
--   1. the auth.users -> public.users mirror trigger (the handle_new_user
--      FUNCTION is already in the baseline; only the trigger on auth.users is
--      missing because auth.* is excluded);
--   2. the `location-images` and `avatars` storage buckets;
--   3. their storage.objects RLS policies.
--
-- Extracted verbatim from the archived hand-written migrations
-- (supabase/migrations_archive/20260625120000_* and 20260625150000_avatars_bucket).
-- Idempotent and safe to re-run.
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- 1. public.users mirror trigger on auth.users
--    (public.handle_new_user() ships in the baseline dump.)
-- ----------------------------------------------------------------------------
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 2. Storage: location-images bucket + policies
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

-- ----------------------------------------------------------------------------
-- 3. Storage: avatars bucket + per-user-folder policies
--    Objects live under avatars/{auth.uid()}/…
-- ----------------------------------------------------------------------------
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
