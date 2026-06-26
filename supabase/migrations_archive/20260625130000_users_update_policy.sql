-- ============================================================================
-- Workout Spots — allow users to update their own profile (nickname/pseudo)
-- ============================================================================
-- Run this in the Supabase SQL editor (executes as the `postgres` owner; the
-- app's anon key cannot run DDL).
--
-- The one-time nickname onboarding writes `public.users.pseudo` for the signed-in
-- user. If RLS is ON for public.users, an UPDATE policy is required; this adds an
-- additive policy scoped to the caller's own row (id = auth.uid()). It does NOT
-- enable RLS and does NOT touch SELECT, so existing public reads of users
-- (pseudo/name, used for comment authors + spot contributors) are unaffected.
--
-- IDEMPOTENT and safe to re-run.
-- ============================================================================

begin;

drop policy if exists "users update own" on public.users;
create policy "users update own" on public.users
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

commit;

-- Post-run sanity check (optional):
--   select polname from pg_policy where polname = 'users update own';
