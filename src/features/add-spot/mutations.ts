import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { getBrowserSupabase } from '~/lib/supabase/browser'
import { useSession } from '~/features/auth/session'
import { useAuthGate } from '~/features/auth/useAuthGate'
import type { AddSpotParsed } from './schema'

// TODO(db-access): RLS policies must be in place so users can only insert locations
// where created_by = auth.uid(). The created_by field is set server-side by Supabase
// via RLS or set explicitly here to userId for now.

export function useCreateSpot() {
  const { userId } = useSession()
  const gate = useAuthGate()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (values: AddSpotParsed) => {
      if (!userId) throw new Error('Not authenticated')

      const supabase = getBrowserSupabase()

      // 1. Insert the location
      const { data, error } = await supabase
        .from('locations')
        .insert({
          name: values.name,
          description: values.description,
          latitude: values.position.lat,
          longitude: values.position.lng,
          address: values.address,
          city: values.city,
          region: values.region,
          country: values.country,
          is_open_24h: values.isOpen24h,
          created_by: userId,
        })
        .select('id')
        .single()

      if (error) throw error
      const newId = data.id

      // 2. Insert discipline join rows
      if (values.disciplines.length > 0) {
        const { error: discErr } = await supabase.from('location_disciplines').insert(
          values.disciplines.map((discipline_id) => ({
            location_id: newId,
            discipline_id,
          })),
        )
        if (discErr) throw discErr
      }

      // 3. Insert equipment join rows
      if (values.equipment.length > 0) {
        const { error: eqErr } = await supabase.from('location_equipments').insert(
          values.equipment.map((equipment_id) => ({
            location_id: newId,
            equipment_id,
          })),
        )
        if (eqErr) throw eqErr
      }

      return newId
    },
    onSuccess: (newId: string) => {
      void queryClient.invalidateQueries({ queryKey: ['spots'] })
      void navigate({ to: '/spots/$spotId', params: { spotId: newId } })
    },
  })

  return {
    create: (values: AddSpotParsed) => gate(() => mutation.mutate(values)),
    pending: mutation.isPending,
  }
}
