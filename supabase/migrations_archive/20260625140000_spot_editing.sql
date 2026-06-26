-- ============================================================================
-- Workout Spots — wiki-style spot editing
-- ============================================================================
-- Run in the Supabase SQL editor (or via the Management API). Idempotent and
-- transactional. Builds on 20260625120000_discover_write_prerequisites.sql.
--
-- DECISION (intentional): any authenticated user may edit any spot — update its
-- basics, and add/remove its equipment, disciplines and photos. Most spots are
-- scraped (created_by = NULL) and ownerless, so owner-only editing would lock
-- almost everything. Vandalism risk is accepted for v1; moderation/edit-history
-- is a future concern. This widens the prior owner-scoped UPDATE policy and adds
-- DELETE policies. Public reads and the INSERT policies are unchanged.
-- ============================================================================

begin;

-- 1. locations UPDATE: any authenticated user (was created_by-scoped).
drop policy if exists "locations update own" on public.locations;
drop policy if exists "locations update authed" on public.locations;
create policy "locations update authed" on public.locations
  for update to authenticated using (true) with check (true);

-- 2. DELETE policies (any authenticated) so contributors can remove tags/photos,
--    including those on scraped spots (added_by / uploaded_by = NULL).
drop policy if exists "location_disciplines delete authed" on public.location_disciplines;
create policy "location_disciplines delete authed" on public.location_disciplines
  for delete to authenticated using (true);

drop policy if exists "location_equipments delete authed" on public.location_equipments;
create policy "location_equipments delete authed" on public.location_equipments
  for delete to authenticated using (true);

drop policy if exists "location_images delete authed" on public.location_images;
create policy "location_images delete authed" on public.location_images
  for delete to authenticated using (true);

-- 3. Storage: allow any authenticated user to delete objects in the bucket
--    (scraped images have owner = NULL, so the prior owner-scoped delete can't
--    remove them). Replaces "location-images owner delete".
drop policy if exists "location-images owner delete" on storage.objects;
drop policy if exists "location-images authed delete" on storage.objects;
create policy "location-images authed delete" on storage.objects
  for delete to authenticated using (bucket_id = 'location-images');

commit;

-- Post-run check (optional):
--   select policyname, cmd from pg_policies
--   where tablename in ('locations','location_disciplines','location_equipments','location_images')
--   and cmd in ('UPDATE','DELETE') order by tablename, cmd;
