import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBrowserSupabase, isSupabaseConfigured } from '~/lib/supabase/browser'
import { useSession } from './session'

export type UserProfile = { id: string; pseudo: string | null; name: string | null }

/**
 * Current user's public.users profile (pseudo/name). Returns null when Supabase
 * isn't configured or there's no signed-in user. Pass `enabled` at the call site
 * to avoid firing while the session is still resolving.
 */
export function currentUserProfileQueryOptions(userId: string | null) {
  return queryOptions({
    queryKey: ['profile', userId] as const,
    queryFn: async (): Promise<UserProfile | null> => {
      if (!isSupabaseConfigured() || !userId) return null
      const { data, error } = await getBrowserSupabase()
        .from('users')
        .select('id,pseudo,name')
        .eq('id', userId)
        .maybeSingle()
      if (error) throw error
      return data ?? null
    },
  })
}

/** Update the signed-in user's nickname (public.users.pseudo). */
export function useUpdatePseudo() {
  const { userId } = useSession()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (pseudo: string) => {
      if (!userId) throw new Error('Not authenticated')
      const { error } = await getBrowserSupabase()
        .from('users')
        .update({ pseudo })
        .eq('id', userId)
      if (error) throw error
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile', userId] })
    },
  })

  return {
    updatePseudo: (pseudo: string) => mutation.mutateAsync(pseudo),
    pending: mutation.isPending,
    error: mutation.error,
  }
}
