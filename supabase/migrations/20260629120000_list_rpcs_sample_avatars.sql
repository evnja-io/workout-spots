-- Add a small sample of member/attendee avatars to the two browse-list RPCs so
-- the redesigned poster cards can render "social stacks" (overlapping avatars +
-- count) directly from the list query — the detail RPCs already expose full
-- rosters, but the list endpoints previously returned counts only.
--
-- Adding an OUT column changes each function's return type, which `create or
-- replace` cannot do, so we drop + recreate. Both stay SECURITY DEFINER: they
-- already bypass RLS to compute accurate counts, and only a display name +
-- avatar URL are added (public.users is already anon-readable — no new exposure).

-- ── Clubs ────────────────────────────────────────────────────────────────────
drop function if exists public.rpc_list_clubs();
create or replace function public.rpc_list_clubs()
returns table (
  id uuid,
  name character varying,
  category character varying,
  privacy character varying,
  cover_image_url text,
  created_at timestamp with time zone,
  member_count bigint,
  spot_count bigint,
  tags text[],
  sample_avatars jsonb
)
language sql
security definer
set search_path = public
as $$
  select
    c.id,
    c.name,
    c.category,
    c.privacy,
    c.cover_image_url,
    c.created_at,
    coalesce(mc.n, 0) as member_count,
    coalesce(sc.n, 0) as spot_count,
    coalesce(tg.tags, array[]::text[]) as tags,
    coalesce(sa.avatars, '[]'::jsonb) as sample_avatars
  from public.clubs c
  left join (
    select club_id, count(*) as n
    from public.club_members
    where status = 'approved'
    group by club_id
  ) mc on mc.club_id = c.id
  left join (
    select club_id, count(*) as n
    from public.club_spots
    group by club_id
  ) sc on sc.club_id = c.id
  left join (
    select club_id, array_agg(tag::text order by tag) as tags
    from public.club_tags
    group by club_id
  ) tg on tg.club_id = c.id
  left join lateral (
    select jsonb_agg(s.obj order by s.rank, s.joined_at) as avatars
    from (
      select
        jsonb_build_object(
          'id', u.id,
          'name', coalesce(u.name, u.pseudo),
          'avatar_url', u.profile_picture_url
        ) as obj,
        case cm.role when 'owner' then 0 when 'moderator' then 1 else 2 end as rank,
        cm.joined_at as joined_at
      from public.club_members cm
      join public.users u on u.id = cm.user_id
      where cm.club_id = c.id and cm.status = 'approved'
      order by rank, cm.joined_at
      limit 5
    ) s
  ) sa on true
  order by c.created_at desc;
$$;

alter function public.rpc_list_clubs() owner to postgres;
grant execute on function public.rpc_list_clubs() to anon, authenticated, service_role;

-- ── Events ───────────────────────────────────────────────────────────────────
drop function if exists public.rpc_list_events();
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
  tags jsonb,
  sample_avatars jsonb
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
    coalesce(tg.tags, '[]'::jsonb) as tags,
    coalesce(sa.avatars, '[]'::jsonb) as sample_avatars
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
  left join lateral (
    select jsonb_agg(s.obj order by s.created_at) as avatars
    from (
      select
        jsonb_build_object(
          'id', u.id,
          'name', coalesce(u.name, u.pseudo),
          'avatar_url', u.profile_picture_url
        ) as obj,
        ep.created_at as created_at
      from public.event_participants ep
      join public.users u on u.id = ep.user_id
      where ep.event_id = e.id
        and ep.participation_type = 'participating'
        and ep.status = 'approved'
      order by ep.created_at
      limit 5
    ) s
  ) sa on true
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
