import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getBrowserSupabase } from '~/lib/supabase/browser'
import { useSession } from '~/features/auth/session'
import { useAuthGate } from '~/features/auth/useAuthGate'
import { trackEvent } from '~/features/analytics/gtag'
import type { ClubDetail, ClubPrivacy } from './domain'

const detailKey = (clubId: string) => ['clubs', 'detail', clubId] as const
const listKey = ['clubs', 'list'] as const

/**
 * Join (public → approved) or request to join (private → pending) a club.
 * rpc_request_club_membership auto-approves public clubs server-side; the
 * optimistic update mirrors that and onSettled reconciles with the truth.
 */
export function useJoinClub(clubId: string, privacy: ClubPrivacy) {
  const { userId } = useSession()
  const gate = useAuthGate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Not authenticated')
      const { error } = await getBrowserSupabase().rpc('rpc_request_club_membership', {
        p_club_id: clubId,
      })
      if (error) throw error
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: detailKey(clubId) })
      const snapshot = queryClient.getQueryData<ClubDetail | null>(detailKey(clubId))
      queryClient.setQueryData<ClubDetail | null>(detailKey(clubId), (prev) =>
        prev
          ? {
              ...prev,
              viewerRole: 'member',
              viewerStatus: privacy === 'public' ? 'approved' : 'pending',
              memberCount: privacy === 'public' ? prev.memberCount + 1 : prev.memberCount,
            }
          : prev,
      )
      return { snapshot }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot !== undefined) queryClient.setQueryData(detailKey(clubId), ctx.snapshot)
    },
    onSuccess: () => trackEvent('club_join', { club_id: clubId, privacy }),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: detailKey(clubId) })
      void queryClient.invalidateQueries({ queryKey: listKey })
    },
  })

  return { join: () => gate(() => mutation.mutate()), pending: mutation.isPending }
}

/** Leave a club or cancel a pending request (rpc_leave_club). */
export function useLeaveClub(clubId: string) {
  const { userId } = useSession()
  const gate = useAuthGate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Not authenticated')
      const { error } = await getBrowserSupabase().rpc('rpc_leave_club', { p_club_id: clubId })
      if (error) throw error
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: detailKey(clubId) })
      const snapshot = queryClient.getQueryData<ClubDetail | null>(detailKey(clubId))
      queryClient.setQueryData<ClubDetail | null>(detailKey(clubId), (prev) => {
        if (!prev) return prev
        const wasApproved = prev.viewerStatus === 'approved'
        return {
          ...prev,
          viewerRole: null,
          viewerStatus: null,
          memberCount: wasApproved ? Math.max(0, prev.memberCount - 1) : prev.memberCount,
        }
      })
      return { snapshot }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot !== undefined) queryClient.setQueryData(detailKey(clubId), ctx.snapshot)
    },
    onSuccess: () => trackEvent('club_leave', { club_id: clubId }),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: detailKey(clubId) })
      void queryClient.invalidateQueries({ queryKey: listKey })
    },
  })

  return { leave: () => gate(() => mutation.mutate()), pending: mutation.isPending }
}
