import { queryOptions } from '@tanstack/react-query'
import { getBrowserSupabase, isSupabaseConfigured } from '~/lib/supabase/browser'
import type {
  ClubDetail,
  ClubLinkedSpot,
  ClubListItem,
  ClubMember,
  ClubMemberStatus,
  ClubPrivacy,
  ClubRole,
} from './domain'

// ── Browse ───────────────────────────────────────────────────────────────────
// rpc_list_clubs returns accurate member/spot counts even for private clubs
// (SECURITY DEFINER) — a plain embedded count would be hidden by RLS.
type ClubListRpcRow = {
  id: string
  name: string
  category: string | null
  privacy: string | null
  cover_image_url: string | null
  member_count: number | null
  spot_count: number | null
  tags: string[] | null
}

export function mapClubListRow(row: ClubListRpcRow): ClubListItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category ?? '',
    privacy: (row.privacy as ClubPrivacy) ?? 'public',
    coverImageUrl: row.cover_image_url,
    memberCount: Number(row.member_count ?? 0),
    spotCount: Number(row.spot_count ?? 0),
    tags: row.tags ?? [],
  }
}

export function clubsListQueryOptions() {
  return queryOptions({
    queryKey: ['clubs', 'list'] as const,
    queryFn: async (): Promise<ClubListItem[]> => {
      if (!isSupabaseConfigured()) return []
      const { data, error } = await getBrowserSupabase().rpc('rpc_list_clubs')
      if (error) throw error
      return ((data ?? []) as unknown as ClubListRpcRow[]).map(mapClubListRow)
    },
  })
}

// ── Detail ───────────────────────────────────────────────────────────────────
type ClubDetailRpcRow = {
  id: string
  name: string
  description: string | null
  privacy: string | null
  category: string | null
  rules: string | null
  cover_image_url: string | null
  created_by: string
  member_count: number | null
  current_user_role: string | null
  current_user_status: string | null
  tags: string[] | null
  linked_locations: { id: string; name: string; address: string | null }[] | null
}

type LinkedLocationRow = {
  id: string
  name: string
  city: string | null
  location_images: { image_url: string; image_order: number }[]
}

type RosterRow = {
  role: string | null
  status: string | null
  joined_at: string | null
  user: { id: string; pseudo: string | null; name: string | null; profile_picture_url: string | null } | null
}

function thumbnailOf(images: { image_url: string; image_order: number }[]): string | null {
  if (!images || images.length === 0) return null
  return [...images].sort((a, b) => a.image_order - b.image_order)[0]?.image_url ?? null
}

function mapMember(row: RosterRow): ClubMember | null {
  if (!row.user) return null
  return {
    userId: row.user.id,
    name: row.user.pseudo ?? row.user.name ?? 'Member',
    avatarUrl: row.user.profile_picture_url,
    role: (row.role as ClubRole) ?? 'member',
    joinedAt: row.joined_at ?? '',
  }
}

export function clubDetailQueryOptions(clubId: string) {
  return queryOptions({
    queryKey: ['clubs', 'detail', clubId] as const,
    queryFn: async (): Promise<ClubDetail | null> => {
      if (!isSupabaseConfigured()) return null
      const sb = getBrowserSupabase()

      const { data, error } = await sb.rpc('rpc_get_club_with_details', { p_club_id: clubId })
      if (error) throw error
      const row = (data as unknown as ClubDetailRpcRow[] | null)?.[0]
      if (!row) return null

      const linked = row.linked_locations ?? []
      const linkedIds = linked.map((l) => l.id)

      const [locsRes, rosterRes] = await Promise.all([
        linkedIds.length > 0
          ? sb
              .from('locations')
              .select('id,name,city,location_images(image_url,image_order)')
              .in('id', linkedIds)
          : Promise.resolve({ data: [], error: null }),
        sb
          .from('club_members')
          .select(
            'role,status,joined_at,user:users!club_members_user_id_fkey(id,pseudo,name,profile_picture_url)',
          )
          .eq('club_id', clubId)
          .eq('status', 'approved')
          .order('joined_at', { ascending: true }),
      ])
      if (locsRes.error) throw locsRes.error
      if (rosterRes.error) throw rosterRes.error

      const locById = new Map(
        ((locsRes.data ?? []) as unknown as LinkedLocationRow[]).map((l) => [l.id, l]),
      )
      const linkedSpots: ClubLinkedSpot[] = linked.map((l) => {
        const loc = locById.get(l.id)
        return {
          id: l.id,
          name: loc?.name ?? l.name,
          city: loc?.city ?? '',
          thumbnailUrl: loc ? thumbnailOf(loc.location_images) : null,
        }
      })

      const members = ((rosterRes.data ?? []) as unknown as RosterRow[])
        .map(mapMember)
        .filter((m): m is ClubMember => m !== null)

      return {
        id: row.id,
        name: row.name,
        category: row.category ?? '',
        privacy: (row.privacy as ClubPrivacy) ?? 'public',
        description: row.description,
        rules: row.rules,
        coverImageUrl: row.cover_image_url,
        createdBy: row.created_by,
        memberCount: Number(row.member_count ?? 0),
        tags: row.tags ?? [],
        linkedSpots,
        members,
        viewerRole: (row.current_user_role as ClubRole | null) ?? null,
        viewerStatus: (row.current_user_status as ClubMemberStatus | null) ?? null,
      }
    },
  })
}
