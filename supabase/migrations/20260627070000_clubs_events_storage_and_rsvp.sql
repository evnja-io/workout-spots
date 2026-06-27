-- Clubs & Events frontend prerequisites.
--
-- The clubs/events tables, RLS and the clubs rpc_* API already ship in the
-- baseline. Two things are missing before the frontend can be built:
--
--   1. Storage buckets for club covers, post images and event images. The
--      public-only baseline dump excludes storage.*, and the helper functions
--      get_club_image_url() / get_post_image_url() already expect the bucket ids
--      'club-images' and 'post-images'. We add those plus 'event-images', mirroring
--      the location-images bucket policies from 20250722120001_local_infra.sql.
--
--   2. Server-side RSVP status. The event_participants INSERT policy only checks
--      user_id + event visibility — it does NOT constrain `status`, so a client
--      could self-insert status='approved' to bypass approval/capacity and gain
--      posting rights. A BEFORE INSERT trigger sets the status authoritatively.
--
-- Idempotent and safe to re-run.

begin;

-- ============================================================================
-- 1. Storage buckets (mirror the location-images policy block)
-- ============================================================================

-- club-images: club cover images (objects under club-images/<club_id>/…)
-- post-images:  club & event post images (under post-images/<club_id|event_id>/…)
-- event-images: event featured images + galleries (under event-images/<event_id>/…)
insert into storage.buckets (id, name, public)
values
  ('club-images', 'club-images', true),
  ('post-images', 'post-images', true),
  ('event-images', 'event-images', true)
on conflict (id) do nothing;

do $$
declare
  b text;
begin
  foreach b in array array['club-images', 'post-images', 'event-images']
  loop
    execute format('drop policy if exists %I on storage.objects', b || ' public read');
    execute format(
      'create policy %I on storage.objects for select using (bucket_id = %L)',
      b || ' public read', b);

    execute format('drop policy if exists %I on storage.objects', b || ' authenticated upload');
    execute format(
      'create policy %I on storage.objects for insert to authenticated with check (bucket_id = %L)',
      b || ' authenticated upload', b);

    execute format('drop policy if exists %I on storage.objects', b || ' owner update');
    execute format(
      'create policy %I on storage.objects for update to authenticated using (bucket_id = %L and owner = auth.uid())',
      b || ' owner update', b);

    execute format('drop policy if exists %I on storage.objects', b || ' owner delete');
    execute format(
      'create policy %I on storage.objects for delete to authenticated using (bucket_id = %L and owner = auth.uid())',
      b || ' owner delete', b);
  end loop;
end;
$$;

-- ============================================================================
-- 2. Authoritative RSVP status on insert
-- ============================================================================
-- Forces event_participants.status regardless of any client-supplied value:
--   * participation_type = 'interested'  -> 'approved' (does not consume capacity)
--   * event requires approval            -> 'pending'
--   * event is full (going >= max)       -> 'waitlisted'
--   * otherwise                          -> 'approved'
-- Organizer approve/reject/waitlist happen via UPDATE under the existing creator
-- policy and are unaffected. Waitlist auto-promotion on cancellation is deferred.
create or replace function public.set_event_participant_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_requires_approval boolean;
  v_max int;
  v_going int;
begin
  if new.participation_type = 'interested' then
    new.status := 'approved';
    return new;
  end if;

  select requires_approval, max_participants
    into v_requires_approval, v_max
    from public.events
   where id = new.event_id;

  if coalesce(v_requires_approval, false) then
    new.status := 'pending';
    return new;
  end if;

  if v_max is not null then
    select count(*)
      into v_going
      from public.event_participants
     where event_id = new.event_id
       and participation_type = 'participating'
       and status = 'approved';
    if v_going >= v_max then
      new.status := 'waitlisted';
      return new;
    end if;
  end if;

  new.status := 'approved';
  return new;
end;
$$;

alter function public.set_event_participant_status() owner to postgres;

drop trigger if exists set_event_participant_status_trigger on public.event_participants;
create trigger set_event_participant_status_trigger
  before insert on public.event_participants
  for each row execute function public.set_event_participant_status();

commit;
