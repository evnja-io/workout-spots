-- ============================================================================
-- Workout Spots — signup consent (terms acceptance + marketing opt-ins)
-- ============================================================================
-- Run this in the Supabase SQL editor (executes as the `postgres` owner; the
-- app's anon key cannot run DDL).
--
-- The sign-in modal collects three consents at signup:
--   1. Terms of Service (CGU) — required; we store WHICH version was accepted
--      and WHEN, so a future terms update can re-prompt only stale acceptors.
--   2. Product update emails — optional opt-in.
--   3. Partner offers — optional opt-in.
--
-- Because sign-in is passwordless (magic-link OTP), no public.users row exists
-- when the form is submitted — it is created by handle_new_user() only after
-- the link is clicked. So the consents ride along as auth user-metadata
-- (signInWithOtp options.data) and this trigger writes them into the columns
-- below at user-creation time. The existing "users update own" policy already
-- lets a signed-in user change the marketing opt-ins from /profile.
--
-- IDEMPOTENT and safe to re-run.
-- ============================================================================

begin;

-- 1. Consent columns on public.users -----------------------------------------
alter table public.users
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists terms_version text,
  add column if not exists marketing_email_opt_in boolean not null default false,
  add column if not exists marketing_email_opt_in_at timestamptz,
  add column if not exists partner_offers_opt_in boolean not null default false,
  add column if not exists partner_offers_opt_in_at timestamptz,
  -- Unguessable per-user token embedded in the unsubscribe link of marketing
  -- emails. Backfilled with a distinct uuid per existing row by the default.
  add column if not exists unsubscribe_token uuid not null default gen_random_uuid();

create unique index if not exists users_unsubscribe_token_key
  on public.users (unsubscribe_token);

-- 2. Extend the mirror trigger to record consent from auth metadata ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  marketing boolean := coalesce((meta->>'marketing_email_opt_in')::boolean, false);
  partners boolean := coalesce((meta->>'partner_offers_opt_in')::boolean, false);
begin
  -- public.users.email is NOT NULL; skip auth users without an email
  -- (e.g. phone/anonymous sign-ins) so signup is never blocked.
  if new.email is not null then
    insert into public.users (
      id, email,
      terms_accepted_at, terms_version,
      marketing_email_opt_in, marketing_email_opt_in_at,
      partner_offers_opt_in, partner_offers_opt_in_at
    )
    values (
      new.id, new.email,
      case when meta ? 'terms_version' then now() else null end,
      meta->>'terms_version',
      marketing, case when marketing then now() else null end,
      partners, case when partners then now() else null end
    )
    on conflict (id) do nothing;
  end if;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Tokenized unsubscribe (no login) ----------------------------------------
--    Called with the anon key from the /unsubscribe page using the token from a
--    marketing email's unsubscribe link. SECURITY DEFINER so it can update the
--    matching row regardless of RLS, but it only ever flips the caller's
--    marketing flags OFF for the row owning the token — no escalation path.
--    p_type: 'marketing_email' | 'partner_offers' | anything else => both.
create or replace function public.unsubscribe_marketing(p_token uuid, p_type text default 'all')
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  affected integer := 0;
begin
  if p_type = 'marketing_email' then
    update public.users
      set marketing_email_opt_in = false, marketing_email_opt_in_at = now()
      where unsubscribe_token = p_token;
  elsif p_type = 'partner_offers' then
    update public.users
      set partner_offers_opt_in = false, partner_offers_opt_in_at = now()
      where unsubscribe_token = p_token;
  else
    update public.users
      set marketing_email_opt_in = false, marketing_email_opt_in_at = now(),
          partner_offers_opt_in = false, partner_offers_opt_in_at = now()
      where unsubscribe_token = p_token;
  end if;
  get diagnostics affected = row_count;
  return affected > 0;
end $$;

revoke all on function public.unsubscribe_marketing(uuid, text) from public;
grant execute on function public.unsubscribe_marketing(uuid, text) to anon, authenticated;

commit;

-- Post-run sanity check (optional):
--   select column_name from information_schema.columns
--   where table_schema = 'public' and table_name = 'users'
--     and (column_name like '%opt_in%' or column_name like 'terms_%'
--          or column_name = 'unsubscribe_token');
--   select public.unsubscribe_marketing('00000000-0000-0000-0000-000000000000', 'all');  -- expect: f
