-- Read RPCs for the Events section.
--
-- event_participants RLS only lets a viewer see their OWN row (plus the event
-- creator seeing all), so a plain embedded `event_participants(count)` returns
-- 0/1 for everyone else — the discovery cards and capacity meter need the real
-- going/waitlist/pending counts. These SECURITY DEFINER functions expose those
-- counts while re-implementing the events visibility rule (public to all,
-- private to the creator, club_only to the creator + approved club members).

-- ── Browse list ──────────────────────────────────────────────────────────────
create or replace function public.rpc_list_events()
returns table (
  id uuid,
  title text,
  starts_at timestamptz,
  ends_at timestamptz,
  timezone text,
  is_free boolean,
  price_amount numeric,
  price_currency text,
  visibility text,
  status text,
  max_participants int,
  club_id uuid,
  featured_image_url text,
  going_count bigint,
  primary_location_name text,
  primary_location_city text,
  tags jsonb
)
language sql
security definer
set search_path = public
as $$
  select
    e.id, e.title, e.starts_at, e.ends_at, e.timezone,
    e.is_free, e.price_amount, e.price_currency,
    e.visibility, e.status, e.max_participants, e.club_id,
    e.featured_image_url,
    coalesce(gc.n, 0) as going_count,
    pl.name as primary_location_name,
    pl.city as primary_location_city,
    coalesce(tg.tags, '[]'::jsonb) as tags
  from public.events e
  left join lateral (
    select count(*) as n
    from public.event_participants ep
    where ep.event_id = e.id
      and ep.participation_type = 'participating'
      and ep.status = 'approved'
  ) gc on true
  left join lateral (
    select l.name, l.city
    from public.event_locations el
    join public.locations l on l.id = el.location_id
    where el.event_id = e.id
    order by el.is_primary desc, el.location_order asc
    limit 1
  ) pl on true
  left join lateral (
    select jsonb_agg(
      jsonb_build_object('id', t.id, 'name', t.name, 'name_fr', t.name_fr, 'color', t.color, 'icon', t.icon)
      order by t.name
    ) as tags
    from public.event_tag_assignments eta
    join public.event_tags t on t.id = eta.tag_id
    where eta.event_id = e.id
  ) tg on true
  where e.status <> 'draft'
    and (
      e.visibility = 'public'
      or (e.visibility = 'private' and e.created_by = auth.uid())
      or (e.visibility = 'club_only' and (
        e.created_by = auth.uid()
        or exists (
          select 1 from public.club_members cm
          where cm.club_id = e.club_id and cm.user_id = auth.uid() and cm.status = 'approved'
        )
      ))
    )
  order by e.starts_at asc;
$$;

alter function public.rpc_list_events() owner to postgres;
grant execute on function public.rpc_list_events() to anon, authenticated, service_role;

-- ── Detail ───────────────────────────────────────────────────────────────────
create or replace function public.rpc_get_event_with_details(p_event_id uuid)
returns table (
  id uuid,
  title text,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  timezone text,
  min_participants int,
  max_participants int,
  registration_deadline timestamptz,
  is_free boolean,
  price_amount numeric,
  price_currency text,
  visibility text,
  requires_approval boolean,
  club_id uuid,
  club_name text,
  created_by uuid,
  organizer_name text,
  organizer_contact text,
  status text,
  cancellation_reason text,
  featured_image_url text,
  going_count bigint,
  waitlist_count bigint,
  pending_count bigint,
  current_user_type text,
  current_user_status text,
  locations jsonb,
  images jsonb,
  tags jsonb
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select
    e.id, e.title, e.description, e.starts_at, e.ends_at, e.timezone,
    e.min_participants, e.max_participants, e.registration_deadline,
    e.is_free, e.price_amount, e.price_currency,
    e.visibility, e.requires_approval, e.club_id, c.name::text,
    e.created_by, e.organizer_name, e.organizer_contact,
    e.status, e.cancellation_reason, e.featured_image_url,
    (select count(*) from public.event_participants ep
      where ep.event_id = e.id and ep.participation_type = 'participating' and ep.status = 'approved'),
    (select count(*) from public.event_participants ep
      where ep.event_id = e.id and ep.status = 'waitlisted'),
    (select count(*) from public.event_participants ep
      where ep.event_id = e.id and ep.status = 'pending'),
    me.participation_type,
    me.status,
    coalesce((
      select jsonb_agg(
        jsonb_build_object('id', l.id, 'name', l.name, 'city', l.city, 'address', l.address,
          'is_primary', el.is_primary, 'order', el.location_order, 'notes', el.notes)
        order by el.is_primary desc, el.location_order asc
      )
      from public.event_locations el join public.locations l on l.id = el.location_id
      where el.event_id = e.id
    ), '[]'::jsonb),
    coalesce((
      select jsonb_agg(
        jsonb_build_object('image_url', ei.image_url, 'order', ei.image_order, 'caption', ei.caption)
        order by ei.image_order
      )
      from public.event_images ei where ei.event_id = e.id
    ), '[]'::jsonb),
    coalesce((
      select jsonb_agg(
        jsonb_build_object('id', t.id, 'name', t.name, 'name_fr', t.name_fr, 'color', t.color, 'icon', t.icon)
        order by t.name
      )
      from public.event_tag_assignments eta join public.event_tags t on t.id = eta.tag_id
      where eta.event_id = e.id
    ), '[]'::jsonb)
  from public.events e
  left join public.clubs c on c.id = e.club_id
  left join public.event_participants me on me.event_id = e.id and me.user_id = auth.uid()
  where e.id = p_event_id
    and (
      e.visibility = 'public'
      or (e.visibility = 'private' and e.created_by = auth.uid())
      or (e.visibility = 'club_only' and (
        e.created_by = auth.uid()
        or exists (
          select 1 from public.club_members cm
          where cm.club_id = e.club_id and cm.user_id = auth.uid() and cm.status = 'approved'
        )
      ))
    );
end;
$$;

alter function public.rpc_get_event_with_details(uuid) owner to postgres;
grant execute on function public.rpc_get_event_with_details(uuid) to anon, authenticated, service_role;
