-- Browse RPC for the Clubs section.
--
-- The clubs discovery list shows every club (clubs_select_all_for_discovery is
-- USING true), but member/spot counts live in club_members / club_spots, whose
-- RLS hides the rows of PRIVATE clubs from non-members. A plain embedded
-- `club_members(count)` therefore returns 0 for private clubs to outsiders, which
-- makes discovery cards look empty. This SECURITY DEFINER function returns the
-- accurate counts + tags for the browse grid, mirroring rpc_get_club_with_details.
--
-- Search / category / tag filtering is applied client-side over this list.

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
  tags text[]
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
    coalesce(tg.tags, array[]::text[]) as tags
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
  order by c.created_at desc;
$$;

alter function public.rpc_list_clubs() owner to postgres;

grant execute on function public.rpc_list_clubs() to anon, authenticated, service_role;
