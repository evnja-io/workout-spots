import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { getBrowserSupabase } from '~/lib/supabase/browser'
import { useSession } from '~/features/auth/session'
import { useAuthGate } from '~/features/auth/useAuthGate'
import { trackEvent } from '~/features/analytics/gtag'
import type { EventDetail, ParticipationStatus } from './domain'
import type { CreateEventParsed } from './schema'
import { uploadEventFeatured } from './photos'
import { nextGalleryOrder, uploadAndInsertGallery } from './gallery'

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

/**
 * Create an event: insert the row, upload the featured image, then insert the
 * event_locations and tag assignments (all under the creator RLS policies).
 */
export function useCreateEvent() {
  const { userId } = useSession()
  const gate = useAuthGate()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({
      values,
      featured,
      gallery,
    }: {
      values: CreateEventParsed
      featured: File | null
      gallery: File[]
    }) => {
      if (!userId) throw new Error('Not authenticated')
      const sb = getBrowserSupabase()

      const { data, error } = await sb
        .from('events')
        .insert({
          title: values.title,
          description: values.description || null,
          starts_at: values.startsAt,
          ends_at: values.endsAt,
          timezone: values.timezone,
          min_participants: values.minParticipants,
          max_participants: values.maxParticipants,
          registration_deadline: values.registrationDeadline,
          is_free: values.isFree,
          price_amount: values.isFree ? null : values.priceAmount,
          price_currency: values.priceCurrency,
          visibility: values.visibility,
          club_id: values.visibility === 'club_only' ? values.clubId : null,
          requires_approval: values.requiresApproval,
          organizer_name: values.organizerName || null,
          organizer_contact: values.organizerContact || null,
          created_by: userId,
        })
        .select('id')
        .single()
      if (error) throw error
      const eventId = data.id

      if (featured) {
        const { url, path } = await uploadEventFeatured(eventId, featured)
        const { error: updErr } = await sb
          .from('events')
          .update({ featured_image_url: url, featured_image_path: path })
          .eq('id', eventId)
        if (updErr) throw updErr
      }

      const locRows = values.locations.map((l, i) => ({
        event_id: eventId,
        location_id: l.locationId,
        is_primary: l.isPrimary,
        location_order: i + 1,
        notes: l.note || null,
      }))
      const { error: locErr } = await sb.from('event_locations').insert(locRows)
      if (locErr) throw locErr

      if (values.tagIds.length > 0) {
        const { error: tagErr } = await sb
          .from('event_tag_assignments')
          .insert(values.tagIds.map((tag_id) => ({ event_id: eventId, tag_id })))
        if (tagErr) throw tagErr
      }

      if (gallery.length > 0) await uploadAndInsertGallery(eventId, gallery, 1)

      return eventId
    },
    onSuccess: (eventId) => {
      trackEvent('event_created', { event_id: eventId })
      void queryClient.invalidateQueries({ queryKey: listKey })
      void navigate({ to: '/events/$eventId', params: { eventId } })
    },
  })

  return {
    create: (values: CreateEventParsed, featured: File | null, gallery: File[]) =>
      gate(() => mutation.mutate({ values, featured, gallery })),
    pending: mutation.isPending,
  }
}

/**
 * Full edit of an event the viewer owns: update scalar fields, replace the
 * event_locations and tag assignments, optionally replace the featured image,
 * and append any new gallery images.
 */
export function useEditEvent(eventId: string) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({
      values,
      featured,
      gallery,
    }: {
      values: CreateEventParsed
      featured: File | null
      gallery: File[]
    }) => {
      const sb = getBrowserSupabase()

      const featuredFields = featured
        ? await uploadEventFeatured(eventId, featured).then((r) => ({
            featured_image_url: r.url,
            featured_image_path: r.path,
          }))
        : {}
      const { error } = await sb
        .from('events')
        .update({
          title: values.title,
          description: values.description || null,
          starts_at: values.startsAt,
          ends_at: values.endsAt,
          timezone: values.timezone,
          min_participants: values.minParticipants,
          max_participants: values.maxParticipants,
          registration_deadline: values.registrationDeadline,
          is_free: values.isFree,
          price_amount: values.isFree ? null : values.priceAmount,
          price_currency: values.priceCurrency,
          visibility: values.visibility,
          club_id: values.visibility === 'club_only' ? values.clubId : null,
          requires_approval: values.requiresApproval,
          organizer_name: values.organizerName || null,
          ...featuredFields,
        })
        .eq('id', eventId)
      if (error) throw error

      // Replace locations
      await sb.from('event_locations').delete().eq('event_id', eventId)
      const locRows = values.locations.map((l, i) => ({
        event_id: eventId,
        location_id: l.locationId,
        is_primary: l.isPrimary,
        location_order: i + 1,
        notes: l.note || null,
      }))
      const { error: locErr } = await sb.from('event_locations').insert(locRows)
      if (locErr) throw locErr

      // Replace tag assignments
      await sb.from('event_tag_assignments').delete().eq('event_id', eventId)
      if (values.tagIds.length > 0) {
        const { error: tagErr } = await sb
          .from('event_tag_assignments')
          .insert(values.tagIds.map((tag_id) => ({ event_id: eventId, tag_id })))
        if (tagErr) throw tagErr
      }

      // Append new gallery images
      if (gallery.length > 0) {
        const start = await nextGalleryOrder(eventId)
        await uploadAndInsertGallery(eventId, gallery, start)
      }
    },
    onSuccess: () => trackEvent('event_updated', { event_id: eventId }),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: detailKey(eventId) })
      void queryClient.invalidateQueries({ queryKey: listKey })
    },
  })

  return {
    edit: (values: CreateEventParsed, featured: File | null, gallery: File[]) =>
      mutation.mutate({ values, featured, gallery }),
    pending: mutation.isPending,
  }
}
