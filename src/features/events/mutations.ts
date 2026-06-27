import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getBrowserSupabase } from '~/lib/supabase/browser'
import { useSession } from '~/features/auth/session'
import { useAuthGate } from '~/features/auth/useAuthGate'
import { trackEvent } from '~/features/analytics/gtag'
import type { EventDetail, ParticipationStatus } from './domain'

const detailKey = (eventId: string) => ['events', 'detail', eventId] as const
const listKey = ['events', 'list'] as const

// The Phase-0 trigger sets status server-side on INSERT only, so we delete any
// existing row before inserting — this makes switching interested→participating
// re-run the capacity/approval logic instead of keeping a stale 'approved'.
async function replaceParticipation(
  eventId: string,
  userId: string,
  participationType: 'interested' | 'participating',
) {
  const sb = getBrowserSupabase()
  await sb.from('event_participants').delete().eq('event_id', eventId).eq('user_id', userId)
  const { error } = await sb
    .from('event_participants')
    .insert({ event_id: eventId, user_id: userId, participation_type: participationType })
  if (error) throw error
}

/** Optimistic status mirroring the Phase-0 trigger for a 'participating' insert. */
function predictedStatus(event: EventDetail): ParticipationStatus {
  if (event.requiresApproval) return 'pending'
  if (event.maxParticipants != null && event.goingCount >= event.maxParticipants)
    return 'waitlisted'
  return 'approved'
}

/** Participate / request to join / join waitlist (server decides the final status). */
export function useRsvp(eventId: string) {
  const { userId } = useSession()
  const gate = useAuthGate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Not authenticated')
      await replaceParticipation(eventId, userId, 'participating')
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: detailKey(eventId) })
      const snapshot = queryClient.getQueryData<EventDetail | null>(detailKey(eventId))
      queryClient.setQueryData<EventDetail | null>(detailKey(eventId), (prev) => {
        if (!prev) return prev
        const status = predictedStatus(prev)
        const wasGoing = prev.viewerType === 'participating' && prev.viewerStatus === 'approved'
        const goingDelta = status === 'approved' && !wasGoing ? 1 : 0
        return {
          ...prev,
          viewerType: 'participating',
          viewerStatus: status,
          goingCount: prev.goingCount + goingDelta,
        }
      })
      return { snapshot }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot !== undefined) queryClient.setQueryData(detailKey(eventId), ctx.snapshot)
    },
    onSuccess: () => trackEvent('event_rsvp', { event_id: eventId }),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: detailKey(eventId) })
      void queryClient.invalidateQueries({ queryKey: listKey })
    },
  })

  return { rsvp: () => gate(() => mutation.mutate()), pending: mutation.isPending }
}

/** Mark interested (does not consume capacity). */
export function useSetInterest(eventId: string) {
  const { userId } = useSession()
  const gate = useAuthGate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Not authenticated')
      await replaceParticipation(eventId, userId, 'interested')
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: detailKey(eventId) })
      const snapshot = queryClient.getQueryData<EventDetail | null>(detailKey(eventId))
      queryClient.setQueryData<EventDetail | null>(detailKey(eventId), (prev) => {
        if (!prev) return prev
        const wasGoing = prev.viewerType === 'participating' && prev.viewerStatus === 'approved'
        return {
          ...prev,
          viewerType: 'interested',
          viewerStatus: 'approved',
          goingCount: wasGoing ? Math.max(0, prev.goingCount - 1) : prev.goingCount,
        }
      })
      return { snapshot }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot !== undefined) queryClient.setQueryData(detailKey(eventId), ctx.snapshot)
    },
    onSettled: () => void queryClient.invalidateQueries({ queryKey: detailKey(eventId) }),
  })

  return { setInterest: () => gate(() => mutation.mutate()), pending: mutation.isPending }
}

/** Cancel / withdraw participation entirely. */
export function useCancelRsvp(eventId: string) {
  const { userId } = useSession()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Not authenticated')
      const { error } = await getBrowserSupabase()
        .from('event_participants')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId)
      if (error) throw error
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: detailKey(eventId) })
      const snapshot = queryClient.getQueryData<EventDetail | null>(detailKey(eventId))
      queryClient.setQueryData<EventDetail | null>(detailKey(eventId), (prev) => {
        if (!prev) return prev
        const wasGoing = prev.viewerType === 'participating' && prev.viewerStatus === 'approved'
        return {
          ...prev,
          viewerType: null,
          viewerStatus: null,
          goingCount: wasGoing ? Math.max(0, prev.goingCount - 1) : prev.goingCount,
        }
      })
      return { snapshot }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot !== undefined) queryClient.setQueryData(detailKey(eventId), ctx.snapshot)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: detailKey(eventId) })
      void queryClient.invalidateQueries({ queryKey: listKey })
    },
  })

  return { cancel: () => mutation.mutate(), pending: mutation.isPending }
}
