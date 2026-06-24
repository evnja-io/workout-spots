import { queryOptions } from '@tanstack/react-query'
import { getBrowserSupabase, isSupabaseConfigured } from '~/lib/supabase/browser'
import type { SpotListItem, SpotDetail, SpotImage, Equipment, Discipline, SpotComment } from './domain'

// ─── Input row types (embedded-join select shapes) ───────────────────────────

type SpotListRow = {
  id: string
  name: string
  city: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  is_open_24h: boolean | null
  average_rating: number | null
  rating_count: number | null
  location_disciplines: { discipline_id: string }[]
  location_equipments: { equipment_id: string }[]
  location_images: { id?: string; image_url: string; image_order: number }[]
}

type SpotDetailEquipmentRow = {
  equipment_id: string
  equipments: { id: string; name: string; equipment_locale_key: string; category: string }
}

type SpotDetailDisciplineRow = {
  discipline_id: string
  disciplines: { id: string; name: string; discipline_locale_key: string; category: string }
}

type SpotDetailCommentRow = {
  id: string
  content: string
  created_at: string | null
  rating?: number | null
  users: { pseudo: string | null; name: string | null } | null
}

type SpotDetailRow = {
  id: string
  name: string
  city: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  is_open_24h: boolean | null
  average_rating: number | null
  rating_count: number | null
  description: string | null
  region: string | null
  country: string | null
  contributor: string | null
  opening_hours: Record<string, string> | null
  location_images: { id?: string; image_url: string; image_order: number }[]
  location_equipments: SpotDetailEquipmentRow[]
  location_disciplines: SpotDetailDisciplineRow[]
  location_comments: SpotDetailCommentRow[]
}

// ─── Pure mappers ─────────────────────────────────────────────────────────────

export function mapSpotRow(row: SpotListRow): SpotListItem {
  const sortedImages = [...row.location_images].sort((a, b) => a.image_order - b.image_order)
  const thumbnailUrl = sortedImages[0]?.image_url ?? null

  return {
    id: row.id,
    name: row.name,
    city: row.city ?? '',
    address: row.address ?? '',
    latitude: row.latitude ?? 0,
    longitude: row.longitude ?? 0,
    isOpen24h: row.is_open_24h ?? false,
    averageRating: row.average_rating ?? 0,
    ratingCount: row.rating_count ?? 0,
    disciplineIds: row.location_disciplines.map((d) => d.discipline_id),
    equipmentIds: row.location_equipments.map((e) => e.equipment_id),
    thumbnailUrl,
  }
}

export function mapSpotDetailRow(row: SpotDetailRow): SpotDetail {
  const sortedImages = [...row.location_images].sort((a, b) => a.image_order - b.image_order)
  const thumbnailUrl = sortedImages[0]?.image_url ?? null

  const images: SpotImage[] = sortedImages.map((img, i) => ({
    id: img.id ?? `img-${i}`,
    url: img.image_url,
    order: img.image_order,
  }))

  const equipment: Equipment[] = row.location_equipments.map((le) => ({
    id: le.equipments.id,
    name: le.equipments.name,
    localeKey: le.equipments.equipment_locale_key,
    category: le.equipments.category,
  }))

  const disciplines: Discipline[] = row.location_disciplines.map((ld) => ({
    id: ld.disciplines.id,
    name: ld.disciplines.name,
    localeKey: ld.disciplines.discipline_locale_key,
    category: ld.disciplines.category,
  }))

  const comments: SpotComment[] = row.location_comments.map((c) => ({
    id: c.id,
    user: c.users?.pseudo ?? c.users?.name ?? 'Anonymous',
    rating: c.rating ?? null,
    date: c.created_at ?? '',
    text: c.content,
  }))

  return {
    id: row.id,
    name: row.name,
    city: row.city ?? '',
    address: row.address ?? '',
    latitude: row.latitude ?? 0,
    longitude: row.longitude ?? 0,
    isOpen24h: row.is_open_24h ?? false,
    averageRating: row.average_rating ?? 0,
    ratingCount: row.rating_count ?? 0,
    disciplineIds: row.location_disciplines.map((d) => d.discipline_id),
    equipmentIds: row.location_equipments.map((e) => e.equipment_id),
    thumbnailUrl,
    description: row.description,
    region: row.region ?? '',
    country: row.country ?? '',
    contributor: row.contributor ?? '',
    openingHours: row.opening_hours ?? null,
    images,
    equipment,
    disciplines,
    comments,
    viewerLiked: false,
    viewerRating: null,
  }
}

// ─── Query options ────────────────────────────────────────────────────────────

export function spotsQueryOptions() {
  return queryOptions({
    queryKey: ['spots'] as const,
    queryFn: async (): Promise<SpotListItem[]> => {
      if (!isSupabaseConfigured()) return []
      const { data, error } = await getBrowserSupabase()
        .from('locations')
        .select(
          'id,name,city,address,latitude,longitude,is_open_24h,average_rating,rating_count,location_disciplines(discipline_id),location_equipments(equipment_id),location_images(id,image_url,image_order)',
        )
      if (error) throw error
      return (data as unknown as SpotListRow[]).map(mapSpotRow)
    },
  })
}

export function spotDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: ['spot', id] as const,
    queryFn: async (): Promise<SpotDetail | null> => {
      if (!isSupabaseConfigured()) return null
      const { data, error } = await getBrowserSupabase()
        .from('locations')
        .select(
          `id,name,city,address,latitude,longitude,is_open_24h,average_rating,rating_count,
          description,region,country,contributor,opening_hours,
          location_disciplines(discipline_id,disciplines(id,name,discipline_locale_key,category)),
          location_equipments(equipment_id,equipments(id,name,equipment_locale_key,category)),
          location_images(id,image_url,image_order),
          location_comments(id,content,created_at,rating,users(pseudo,name))`,
        )
        .eq('id', id)
        .maybeSingle()
      if (error) throw error
      if (!data) return null
      return mapSpotDetailRow(data)
    },
  })
}
