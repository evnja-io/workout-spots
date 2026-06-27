import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { getBrowserSupabase } from '~/lib/supabase/browser'
import { useSession } from '~/features/auth/session'
import { useAuthGate } from '~/features/auth/useAuthGate'
import { trackEvent } from '~/features/analytics/gtag'
import type { ClubDetail, ClubPrivacy } from './domain'
import type { CreateClubParsed } from './schema'
import { uploadClubCover } from './photos'

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

/**
 * Create a club via rpc_create_club (atomic: club + owner membership + tags +
 * linked spots), then upload the cover and patch it in. Navigates to the new club.
 */
export function useCreateClub() {
  const { userId } = useSession()
  const gate = useAuthGate()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ values, cover }: { values: CreateClubParsed; cover: File | null }) => {
      if (!userId) throw new Error('Not authenticated')
      const sb = getBrowserSupabase()
      const { data, error } = await sb.rpc('rpc_create_club', {
        p_name: values.name,
        p_description: values.description,
        p_category: values.category,
        p_privacy: values.privacy,
        p_rules: values.rules || undefined,
        p_linked_spot_ids: values.linkedSpotIds,
        p_tags: values.tags,
      })
      if (error) throw error
      const clubId = data
      if (cover) {
        const url = await uploadClubCover(clubId, cover)
        const { error: updErr } = await sb.rpc('rpc_update_club', {
          p_club_id: clubId,
          p_cover_image_url: url,
        })
        if (updErr) throw updErr
      }
      return clubId
    },
    onSuccess: (clubId) => {
      trackEvent('club_created', { club_id: clubId })
      void queryClient.invalidateQueries({ queryKey: listKey })
      void navigate({ to: '/clubs/$clubId', params: { clubId } })
    },
  })

  return {
    create: (values: CreateClubParsed, cover: File | null) =>
      gate(() => mutation.mutate({ values, cover })),
    pending: mutation.isPending,
  }
}
