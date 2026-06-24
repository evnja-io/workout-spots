import { queryOptions } from '@tanstack/react-query'
import { getBrowserSupabase, isSupabaseConfigured } from '~/lib/supabase/browser'
import { mapSpotRow } from '~/features/spots/queries'
import type { SpotListItem } from '~/features/spots/domain'

export function spotLikeQueryOptions(spotId: string, userId: string | null) {
  return queryOptions({
    queryKey: ['like', spotId, userId] as const,
    queryFn: async (): Promise<boolean> => {
      if (!isSupabaseConfigured() || !userId) return false
      const { data } = await getBrowserSupabase()
        .from('location_likes')
        .select('id')
        .eq('location_id', spotId)
        .eq('user_id', userId)
        .maybeSingle()
      return data !== null
    },
  })
}

export function savedSpotsQueryOptions(userId: string | null) {
  return queryOptions({
    queryKey: ['saved', userId] as const,
    queryFn: async (): Promise<SpotListItem[]> => {
      if (!isSupabaseConfigured() || !userId) return []
      const { data, error } = await getBrowserSupabase()
        .from('location_likes')
        .select(
          'locations(id,name,city,address,latitude,longitude,is_open_24h,average_rating,rating_count,location_disciplines(discipline_id),location_equipments(equipment_id),location_images(id,image_url,image_order))'
        )
        .eq('user_id', userId)
      if (error) throw error
      type LikeRow = { locations: Parameters<typeof mapSpotRow>[0] | null }
      return (data as unknown as LikeRow[])
        .map((r) => r.locations)
        .filter((loc): loc is Parameters<typeof mapSpotRow>[0] => loc !== null)
        .map(mapSpotRow)
    },
  })
}
