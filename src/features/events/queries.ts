import { queryOptions } from '@tanstack/react-query'
import { getBrowserSupabase, isSupabaseConfigured } from '~/lib/supabase/browser'
import type {
  EventDetail,
  EventImage,
  EventListItem,
  EventLocation,
  EventParticipant,
  EventStatus,
  EventTag,
  EventVisibility,
  ParticipationStatus,
  ParticipationType,
} from './domain'

type TagJson = { id: string; name: string; name_fr: string; color: string; icon: string | null }
type LocationJson = {
  id: string
  name: string
  city: string | null
  address: string | null
  is_primary: boolean
  order: number
  notes: string | null
}
type ImageJson = { image_url: string; order: number; caption: string | null }

function mapTag(t: TagJson): EventTag {
  return { id: t.id, name: t.name, nameFr: t.name_fr, color: t.color, icon: t.icon ?? null }
}
function num(v: number | string | null): number | null {
  return v == null ? null : Number(v)
}

// ── Browse list ──────────────────────────────────────────────────────────────
type EventListRpcRow = {
  id: string
  title: string
  starts_at: string
  ends_at: string
  timezone: string | null
  is_free: boolean
  price_amount: number | string | null
  price_currency: string | null
  visibility: string
  status: string
  max_participants: number | null
  club_id: string | null
  featured_image_url: string | null
  going_count: number | string | null
  primary_location_name: string | null
  primary_location_city: string | null
  tags: TagJson[] | null
}

export function mapEventListRow(row: EventListRpcRow): EventListItem {
  return {
    id: row.id,
    title: row.title,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    timezone: row.timezone ?? 'UTC',
    isFree: row.is_free,
    priceAmount: num(row.price_amount),
    priceCurrency: row.price_currency ?? 'EUR',
    status: row.status as EventStatus,
    maxParticipants: row.max_participants,
    goingCount: Number(row.going_count ?? 0),
    primaryLocationName: row.primary_location_name,
    clubId: row.club_id,
    featuredImageUrl: row.featured_image_url,
    tags: (row.tags ?? []).map(mapTag),
  }
}

export function eventsListQueryOptions() {
  return queryOptions({
    queryKey: ['events', 'list'] as const,
    queryFn: async (): Promise<EventListItem[]> => {
      if (!isSupabaseConfigured()) return []
      const { data, error } = await getBrowserSupabase().rpc('rpc_list_events')
      if (error) throw error
      return ((data ?? []) as unknown as EventListRpcRow[]).map(mapEventListRow)
    },
  })
}

// ── Participants (organizer) ─────────────────────────────────────────────────
type ParticipantRow = {
  id: string
  participation_type: string
  status: string
  notes: string | null
  created_at: string
  user: {
    id: string
    pseudo: string | null
    name: string | null
    profile_picture_url: string | null
  } | null
}

export function eventParticipantsQueryOptions(eventId: string) {
  return queryOptions({
    queryKey: ['events', 'participants', eventId] as const,
    queryFn: async (): Promise<EventParticipant[]> => {
      if (!isSupabaseConfigured()) return []
      const { data, error } = await getBrowserSupabase()
        .from('event_participants')
        .select(
          'id,participation_type,status,notes,created_at,user:users!event_participants_user_id_fkey(id,pseudo,name,profile_picture_url)',
        )
        .eq('event_id', eventId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return ((data ?? []) as unknown as ParticipantRow[]).map((r) => ({
        id: r.id,
        user: {
          id: r.user?.id ?? '',
          name: r.user?.pseudo ?? r.user?.name ?? 'Member',
          avatarUrl: r.user?.profile_picture_url ?? null,
        },
        type: r.participation_type as ParticipationType,
        status: r.status as ParticipationStatus,
        note: r.notes,
        createdAt: r.created_at,
      }))
    },
  })
}

// ── Lookups for the create/edit form ─────────────────────────────────────────
export function eventTagsQueryOptions() {
  return queryOptions({
    queryKey: ['events', 'tags'] as const,
    queryFn: async (): Promise<EventTag[]> => {
      if (!isSupabaseConfigured()) return []
      const { data, error } = await getBrowserSupabase()
        .from('event_tags')
        .select('id,name,name_fr,color,icon')
        .order('name')
      if (error) throw error
      return ((data ?? []) as TagJson[]).map(mapTag)
    },
  })
}

export type LinkableClub = { id: string; name: string }

/** Clubs the viewer is an approved member of — for the club_only event picker. */
export function userClubsQueryOptions(userId: string | null) {
  return queryOptions({
    queryKey: ['events', 'user-clubs', userId ?? 'anon'] as const,
    queryFn: async (): Promise<LinkableClub[]> => {
      if (!isSupabaseConfigured() || !userId) return []
      const { data, error } = await getBrowserSupabase()
        .from('club_members')
        .select('club:clubs!club_members_club_id_fkey(id,name)')
        .eq('user_id', userId)
        .eq('status', 'approved')
      if (error) throw error
      return ((data ?? []) as unknown as { club: { id: string; name: string } | null }[])
        .map((r) => r.club)
        .filter((c): c is { id: string; name: string } => c !== null)
    },
  })
}

// ── Detail ───────────────────────────────────────────────────────────────────
type EventDetailRpcRow = {
  id: string
  title: string
  description: string | null
  starts_at: string
  ends_at: string
  timezone: string | null
  min_participants: number | null
  max_participants: number | null
  registration_deadline: string | null
  is_free: boolean
  price_amount: number | string | null
  price_currency: string | null
  visibility: string
  requires_approval: boolean
  club_id: string | null
  club_name: string | null
  created_by: string
  organizer_name: string | null
  organizer_contact: string | null
  status: string
  cancellation_reason: string | null
  featured_image_url: string | null
  going_count: number | string | null
  waitlist_count: number | string | null
  pending_count: number | string | null
  current_user_type: string | null
  current_user_status: string | null
  locations: LocationJson[] | null
  images: ImageJson[] | null
  tags: TagJson[] | null
}

export function eventDetailQueryOptions(eventId: string) {
  return queryOptions({
    queryKey: ['events', 'detail', eventId] as const,
    queryFn: async (): Promise<EventDetail | null> => {
      if (!isSupabaseConfigured()) return null
      const { data, error } = await getBrowserSupabase().rpc('rpc_get_event_with_details', {
        p_event_id: eventId,
      })
      if (error) throw error
      const row = (data as unknown as EventDetailRpcRow[] | null)?.[0]
      if (!row) return null

      const locations: EventLocation[] = (row.locations ?? []).map((l) => ({
        id: l.id,
        name: l.name,
        city: l.city ?? '',
        address: l.address ?? '',
        isPrimary: l.is_primary,
        order: l.order,
        notes: l.notes,
      }))
      const images: EventImage[] = (row.images ?? []).map((i) => ({
        imageUrl: i.image_url,
        order: i.order,
        caption: i.caption,
      }))

      return {
        id: row.id,
        title: row.title,
        description: row.description,
        startsAt: row.starts_at,
        endsAt: row.ends_at,
        timezone: row.timezone ?? 'UTC',
        minParticipants: row.min_participants ?? 1,
        maxParticipants: row.max_participants,
        registrationDeadline: row.registration_deadline,
        isFree: row.is_free,
        priceAmount: num(row.price_amount),
        priceCurrency: row.price_currency ?? 'EUR',
        visibility: row.visibility as EventVisibility,
        requiresApproval: row.requires_approval,
        clubId: row.club_id,
        clubName: row.club_name,
        createdBy: row.created_by,
        organizerName: row.organizer_name,
        organizerContact: row.organizer_contact,
        status: row.status as EventStatus,
        cancellationReason: row.cancellation_reason,
        featuredImageUrl: row.featured_image_url,
        goingCount: Number(row.going_count ?? 0),
        waitlistCount: Number(row.waitlist_count ?? 0),
        pendingCount: Number(row.pending_count ?? 0),
        viewerType: (row.current_user_type as ParticipationType | null) ?? null,
        viewerStatus: (row.current_user_status as ParticipationStatus | null) ?? null,
        locations,
        images,
        tags: (row.tags ?? []).map(mapTag),
      }
    },
  })
}
