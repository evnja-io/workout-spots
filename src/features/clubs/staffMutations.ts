import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getBrowserSupabase } from '~/lib/supabase/browser'
import { trackEvent } from '~/features/analytics/gtag'
import type { ClubRole } from './domain'
import type { CreateClubParsed } from './schema'
import { uploadClubCover } from './photos'

const detailKey = (clubId: string) => ['clubs', 'detail', clubId] as const
const pendingKey = (clubId: string) => ['clubs', 'pending', clubId] as const
const listKey = ['clubs', 'list'] as const

function useStaffAction<TArgs>(
  fn: (args: TArgs) => Promise<void>,
  keys: readonly (readonly unknown[])[],
) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: fn,
    onSettled: () => {
      for (const key of keys) void queryClient.invalidateQueries({ queryKey: key })
    },
  })
  return mutation
}

/** Approve a pending membership request (rpc_approve_member). */
export function useApproveMember(clubId: string) {
  const m = useStaffAction<string>(
    async (membershipId) => {
      const { error } = await getBrowserSupabase().rpc('rpc_approve_member', {
        p_membership_id: membershipId,
      })
      if (error) throw error
    },
    [pendingKey(clubId), detailKey(clubId), listKey],
  )
  return { approve: (membershipId: string) => m.mutate(membershipId), pending: m.isPending }
}

/** Reject a pending membership request (rpc_reject_member). */
export function useRejectMember(clubId: string) {
  const m = useStaffAction<string>(
    async (membershipId) => {
      const { error } = await getBrowserSupabase().rpc('rpc_reject_member', {
        p_membership_id: membershipId,
      })
      if (error) throw error
    },
    [pendingKey(clubId)],
  )
  return { reject: (membershipId: string) => m.mutate(membershipId), pending: m.isPending }
}

/** Remove an approved member (rpc_kick_member). */
export function useKickMember(clubId: string) {
  const m = useStaffAction<string>(
    async (memberUserId) => {
      const { error } = await getBrowserSupabase().rpc('rpc_kick_member', {
        p_club_id: clubId,
        p_member_user_id: memberUserId,
      })
      if (error) throw error
    },
    [detailKey(clubId), listKey],
  )
  return { kick: (memberUserId: string) => m.mutate(memberUserId), pending: m.isPending }
}

/** Promote/demote a member between moderator and member (rpc_change_member_role). */
export function useChangeMemberRole(clubId: string) {
  const m = useStaffAction<{ memberUserId: string; role: ClubRole }>(
    async ({ memberUserId, role }) => {
      const { error } = await getBrowserSupabase().rpc('rpc_change_member_role', {
        p_club_id: clubId,
        p_member_user_id: memberUserId,
        p_new_role: role,
      })
      if (error) throw error
    },
    [detailKey(clubId)],
  )
  return {
    changeRole: (memberUserId: string, role: ClubRole) => m.mutate({ memberUserId, role }),
    pending: m.isPending,
  }
}

/** Transfer ownership to another member (rpc_transfer_ownership). */
export function useTransferOwnership(clubId: string) {
  const m = useStaffAction<string>(
    async (newOwnerUserId) => {
      const { error } = await getBrowserSupabase().rpc('rpc_transfer_ownership', {
        p_club_id: clubId,
        p_new_owner_user_id: newOwnerUserId,
      })
      if (error) throw error
    },
    [detailKey(clubId)],
  )
  return { transfer: (newOwnerUserId: string) => m.mutate(newOwnerUserId), pending: m.isPending }
}

/** Edit club details (rpc_update_club) + optional new cover. */
export function useUpdateClub(clubId: string) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async ({ values, cover }: { values: CreateClubParsed; cover: File | null }) => {
      const sb = getBrowserSupabase()
      const coverUrl = cover ? await uploadClubCover(clubId, cover) : undefined
      const { error } = await sb.rpc('rpc_update_club', {
        p_club_id: clubId,
        p_name: values.name,
        p_description: values.description,
        p_category: values.category,
        p_privacy: values.privacy,
        p_rules: values.rules || undefined,
        p_linked_spot_ids: values.linkedSpotIds,
        p_tags: values.tags,
        ...(coverUrl ? { p_cover_image_url: coverUrl } : {}),
      })
      if (error) throw error
    },
    onSuccess: () => trackEvent('club_updated', { club_id: clubId }),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: detailKey(clubId) })
      void queryClient.invalidateQueries({ queryKey: listKey })
    },
  })
  return {
    update: (values: CreateClubParsed, cover: File | null) => mutation.mutate({ values, cover }),
    pending: mutation.isPending,
  }
}
