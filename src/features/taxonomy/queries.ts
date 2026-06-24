import { queryOptions } from '@tanstack/react-query'
import type { TFunction } from 'i18next'
import { getBrowserSupabase, isSupabaseConfigured } from '~/lib/supabase/browser'
import type { Equipment, Discipline } from '~/features/spots/domain'
import type { Database } from '~/lib/supabase/types'

type EquipmentRow = Database['public']['Tables']['equipments']['Row']
type DisciplineRow = Database['public']['Tables']['disciplines']['Row']

export function equipmentsQueryOptions() {
  return queryOptions<Equipment[]>({
    queryKey: ['equipments'],
    queryFn: async () => {
      if (!isSupabaseConfigured()) return []
      const { data, error } = await getBrowserSupabase()
        .from('equipments')
        .select('id,name,equipment_locale_key,category')
      if (error) throw error
      return (data ?? []).map((row: Pick<EquipmentRow, 'id' | 'name' | 'equipment_locale_key' | 'category'>) => ({
        id: row.id,
        name: row.name,
        localeKey: row.equipment_locale_key,
        category: row.category,
      }))
    },
  })
}

export function disciplinesQueryOptions() {
  return queryOptions<Discipline[]>({
    queryKey: ['disciplines'],
    queryFn: async () => {
      if (!isSupabaseConfigured()) return []
      const { data, error } = await getBrowserSupabase()
        .from('disciplines')
        .select('id,name,discipline_locale_key,category')
      if (error) throw error
      return (data ?? []).map((row: Pick<DisciplineRow, 'id' | 'name' | 'discipline_locale_key' | 'category'>) => ({
        id: row.id,
        name: row.name,
        localeKey: row.discipline_locale_key,
        category: row.category,
      }))
    },
  })
}

export function resolveLabel(localeKey: string, fallback: string, t: TFunction): string {
  return t(localeKey, { defaultValue: fallback })
}
