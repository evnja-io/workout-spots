import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getBrowserSupabase } from '~/lib/supabase/browser'
import { trackEvent } from '~/features/analytics/gtag'
import type { ParticipationStatus } from './domain'

const detailKey = (eventId: string) => ['events', 'detail', eventId] as const
const participantsKey = (eventId: string) => ['events', 'participants', eventId] as const
const listKey = ['events', 'list'] as const

/** Organizer sets a participant's status (approve / reject / waitlist). */
export function useSetParticipantStatus(eventId: string) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async ({
      participantId,
      status,
    }: {
      participantId: string
      status: ParticipationStatus
    }) => {
      const { error } = await getBrowserSupabase()
        .from('event_participants')
        .update({ status })
        .eq('id', participantId)
      if (error) throw error
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: participantsKey(eventId) })
      void queryClient.invalidateQueries({ queryKey: detailKey(eventId) })
    },
  })
  return {
    approve: (participantId: string) => mutation.mutate({ participantId, status: 'approved' }),
    reject: (participantId: string) => mutation.mutate({ participantId, status: 'rejected' }),
    waitlist: (participantId: string) => mutation.mutate({ participantId, status: 'waitlisted' }),
    pending: mutation.isPending,
  }
}

/** Cancel an event (status='cancelled' + reason). */
export function useCancelEvent(eventId: string) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (reason: string) => {
      const { error } = await getBrowserSupabase()
        .from('events')
        .update({ status: 'cancelled', cancellation_reason: reason || null })
        .eq('id', eventId)
      if (error) throw error
    },
    onSuccess: () => trackEvent('event_cancelled', { event_id: eventId }),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: detailKey(eventId) })
      void queryClient.invalidateQueries({ queryKey: listKey })
    },
  })
  return { cancelEvent: (reason: string) => mutation.mutate(reason), pending: mutation.isPending }
}
