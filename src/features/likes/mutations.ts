import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getBrowserSupabase } from '~/lib/supabase/browser'
import { trackEvent } from '~/features/analytics/gtag'

export function useSaveSpotMutation(spotId: string, userId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (currentlyLiked: boolean) => {
      if (!userId) throw new Error('Not authenticated')
      const supabase = getBrowserSupabase()
      if (currentlyLiked) {
        const { error } = await supabase
          .from('location_likes')
          .delete()
          .eq('location_id', spotId)
          .eq('user_id', userId)
        if (error) throw error
        trackEvent('spot_unsaved', { spot_id: spotId })
      } else {
        const { error } = await supabase
          .from('location_likes')
          .insert({ location_id: spotId, user_id: userId })
        if (error) throw error
        trackEvent('spot_saved', { spot_id: spotId })
      }
    },
    onMutate: async (currentlyLiked: boolean) => {
      const key = ['like', spotId, userId] as const
      await queryClient.cancelQueries({ queryKey: key })
      const snapshot = queryClient.getQueryData<boolean>(key)
      queryClient.setQueryData<boolean>(key, !currentlyLiked)
      return { snapshot }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot !== undefined) {
        queryClient.setQueryData(['like', spotId, userId], ctx.snapshot)
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['like', spotId, userId] })
      void queryClient.invalidateQueries({ queryKey: ['saved', userId] })
    },
  })
}
