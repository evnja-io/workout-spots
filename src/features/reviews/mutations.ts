import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from '~/features/auth/session'
import { useAuthGate } from '~/features/auth/useAuthGate'
import { getBrowserSupabase } from '~/lib/supabase/browser'
import { reviewSchema } from './schema'
import type { ReviewInput, ReviewParsed } from './schema'
import type { SpotDetail } from '~/features/spots/domain'

// crypto.randomUUID() is called only inside onMutate (event-handler path), not in
// render or queryFn — safe per project determinism rule (no Date.now()/Math.random()).

export function useSubmitReview(spotId: string): {
  submit: (values: ReviewInput) => void
  pending: boolean
} {
  const { userId } = useSession()
  const gate = useAuthGate()
  const queryClient = useQueryClient()

  // mutationFn receives the fully-parsed (non-optional text) type
  const mutation = useMutation({
    mutationFn: async (values: ReviewParsed) => {
      if (!userId) throw new Error('Not authenticated')
      const supabase = getBrowserSupabase()

      // TODO(db-access): upsert assumes columns {location_id, user_id, rating} —
      // confirm exact schema + onConflict constraint name once DB access lands.
      const { error: ratingError } = await supabase
        .from('location_ratings')
        .upsert(
          { location_id: spotId, user_id: userId, rating: values.rating },
          { onConflict: 'location_id,user_id' },
        )
      if (ratingError) throw ratingError

      if (values.text.trim()) {
        const { error: commentError } = await supabase
          .from('location_comments')
          .insert({ location_id: spotId, user_id: userId, content: values.text.trim() })
        if (commentError) throw commentError
      }
    },

    onMutate: async (values: ReviewParsed) => {
      const key = ['spot', spotId] as const
      await queryClient.cancelQueries({ queryKey: key })
      const snapshot = queryClient.getQueryData<SpotDetail>(key)

      // Generate optimistic ID inside the handler — allowed per project rules.
      const optimisticId = crypto.randomUUID()

      queryClient.setQueryData<SpotDetail>(key, (prev) => {
        if (!prev) return prev
        return {
          ...prev,
          comments: [
            {
              id: optimisticId,
              user: 'You',
              rating: values.rating,
              date: '',
              text: values.text,
            },
            ...prev.comments,
          ],
        }
      })

      return { snapshot }
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot !== undefined) {
        queryClient.setQueryData(['spot', spotId], ctx.snapshot)
      }
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['spot', spotId] })
    },
  })

  const submit = (values: ReviewInput) => {
    // Parse input so defaults are applied (text defaults to '') before mutating
    const parsed = reviewSchema.parse(values)
    gate(() => mutation.mutate(parsed))
  }

  return { submit, pending: mutation.isPending }
}
