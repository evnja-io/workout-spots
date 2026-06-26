-- ============================================================================
-- Workout Spots — hide unsubscribe_token (and consent flags) from the API
-- ============================================================================
-- Run this in the Supabase SQL editor (executes as the `postgres` owner).
--
-- The previous migration added public.users.unsubscribe_token, but public.users
-- is exposed to the `anon` role at the table level — so the token (which gates
-- the unsubscribe_marketing RPC) was readable by anyone holding the anon key
-- (it ships in the client bundle). That would let anyone read every user's token
-- and unsubscribe them at will. A column-level REVOKE is a no-op while a
-- table-level SELECT grant exists, so we switch `users` to column-level SELECT
-- for the API roles and simply omit `unsubscribe_token`.
--
-- The RPC is SECURITY DEFINER (it reads the token internally) and the future
-- email sender uses the service_role key (bypasses these grants), so no API
-- client ever needs SELECT on the token.
--
-- While here, the marketing consent flags are restricted to `authenticated`
-- (only the signed-in user reads them, on /profile) — they are not public data.
--
-- NOTE: this intentionally PRESERVES the table's pre-existing public exposure of
-- the other columns (including `email`, which was already anon-readable before
-- this feature). Tightening that is a separate decision, out of scope here.
--
-- IDEMPOTENT and safe to re-run.
-- ============================================================================

begin;

-- Replace the table-wide SELECT with explicit per-column grants.
revoke select on public.users from anon, authenticated;

-- Columns that were already publicly readable — preserve current behavior,
-- minus the new sensitive ones. (`id` is needed for embed joins, e.g.
-- location_comments → users(pseudo,name).)
grant select (
  id, email, pseudo, birth_year, created_at, updated_at, bio, city, state,
  name, profile_picture_url, fitness_level, unread_notifications_count,
  last_notification_read_at
) on public.users to anon, authenticated;

-- Consent flags: read only by the signed-in user on /profile; not public.
grant select (
  terms_accepted_at, terms_version,
  marketing_email_opt_in, marketing_email_opt_in_at,
  partner_offers_opt_in, partner_offers_opt_in_at
) on public.users to authenticated;

-- unsubscribe_token is granted to no API role: only the SECURITY DEFINER RPC
-- and the service_role key may read it.

commit;

-- Post-run sanity checks (optional):
--   As anon, selecting the token must now fail with 42501 (permission denied):
--     curl "$URL/rest/v1/users?select=unsubscribe_token&limit=1" -H "apikey: $ANON"
--   Public reads must still work:
--     curl "$URL/rest/v1/users?select=pseudo,name&limit=1" -H "apikey: $ANON"  -- 200
