import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { getBrowserSupabase } from '~/lib/supabase/browser'
import { useSession } from '~/features/auth/session'
import { useAuthGate } from '~/features/auth/useAuthGate'
import type { AddSpotParsed } from './schema'
import { uploadSpotImages, deleteSpotImages } from './photos'
import { diffIds } from './diff'

// TODO(db-access): RLS policies must be in place so users can only insert locations
// where created_by = auth.uid(). The created_by field is set server-side by Supabase
// via RLS or set explicitly here to userId for now.

export function useCreateSpot() {
  const { userId } = useSession()
  const gate = useAuthGate()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ values, files }: { values: AddSpotParsed; files: File[] }) => {
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
            added_by: userId,
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
            added_by: userId,
          })),
        )
        if (eqErr) throw eqErr
      }

      // 4. Upload photos
      if (files.length > 0) {
        await uploadSpotImages(newId, files, userId)
      }

      return newId
    },
    onSuccess: (newId: string) => {
      void queryClient.invalidateQueries({ queryKey: ['spots'] })
      void navigate({ to: '/spots/$spotId', params: { spotId: newId } })
    },
  })

  return {
    create: (values: AddSpotParsed, files: File[]) =>
      gate(() => mutation.mutate({ values, files })),
    pending: mutation.isPending,
  }
}

export type UpdateArgs = {
  values: AddSpotParsed
  currentDisciplineIds: string[]
  currentEquipmentIds: string[]
  newFiles: File[]
  removedImages: { id: string; path?: string }[]
  maxExistingOrder: number
}

export function useUpdateSpot(spotId: string, onSuccess?: () => void) {
  const { userId } = useSession()
  const gate = useAuthGate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (args: UpdateArgs) => {
      if (!userId) throw new Error('Not authenticated')
      const { values, currentDisciplineIds, currentEquipmentIds, newFiles, removedImages, maxExistingOrder } = args
      const supabase = getBrowserSupabase()

      // 1. Update the location
      const { error: updateError } = await supabase
        .from('locations')
        .update({
          name: values.name,
          description: values.description,
          is_open_24h: values.isOpen24h,
        })
        .eq('id', spotId)
      if (updateError) throw updateError

      // 2. Disciplines diff
      const discDiff = diffIds(currentDisciplineIds, values.disciplines)
      if (discDiff.toAdd.length > 0) {
        const { error } = await supabase.from('location_disciplines').insert(
          discDiff.toAdd.map((discipline_id) => ({
            location_id: spotId,
            discipline_id,
            added_by: userId,
          })),
        )
        if (error) throw error
      }
      if (discDiff.toRemove.length > 0) {
        const { error } = await supabase
          .from('location_disciplines')
          .delete()
          .eq('location_id', spotId)
          .in('discipline_id', discDiff.toRemove)
        if (error) throw error
      }

      // 3. Equipment diff
      const eqDiff = diffIds(currentEquipmentIds, values.equipment)
      if (eqDiff.toAdd.length > 0) {
        const { error } = await supabase.from('location_equipments').insert(
          eqDiff.toAdd.map((equipment_id) => ({
            location_id: spotId,
            equipment_id,
            added_by: userId,
          })),
        )
        if (error) throw error
      }
      if (eqDiff.toRemove.length > 0) {
        const { error } = await supabase
          .from('location_equipments')
          .delete()
          .eq('location_id', spotId)
          .in('equipment_id', eqDiff.toRemove)
        if (error) throw error
      }

      // 4. Photos
      if (newFiles.length > 0) {
        await uploadSpotImages(spotId, newFiles, userId, maxExistingOrder + 1)
      }
      if (removedImages.length > 0) {
        await deleteSpotImages(removedImages)
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['spot', spotId] })
      void queryClient.invalidateQueries({ queryKey: ['spots'] })
      onSuccess?.()
    },
  })

  return {
    save: (args: UpdateArgs) => gate(() => mutation.mutate(args)),
    pending: mutation.isPending,
  }
}
