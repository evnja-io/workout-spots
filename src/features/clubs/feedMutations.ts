import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getBrowserSupabase } from '~/lib/supabase/browser'
import { useSession } from '~/features/auth/session'
import { useAuthGate } from '~/features/auth/useAuthGate'
import { trackEvent } from '~/features/analytics/gtag'
import type { CreateMedia } from '~/features/feed/types'
import type { ClubPost } from './domain'
import { uploadPostImage } from './photos'

// All feed cache variants for a club, regardless of viewer (userId is in the key).
const feedFilter = (clubId: string) => ({ queryKey: ['clubs', 'feed', clubId] as const })

function patchPosts(
  queryClient: ReturnType<typeof useQueryClient>,
  clubId: string,
  updater: (posts: ClubPost[]) => ClubPost[],
) {
  queryClient.setQueriesData<ClubPost[]>(feedFilter(clubId), (prev) =>
    prev ? updater(prev) : prev,
  )
}

/** Like / unlike a post (optimistic). */
export function useToggleLike(clubId: string) {
  const { userId } = useSession()
  const gate = useAuthGate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ postId, liked }: { postId: string; liked: boolean }) => {
      if (!userId) throw new Error('Not authenticated')
      const sb = getBrowserSupabase()
      if (liked) {
        const { error } = await sb
          .from('club_post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId)
        if (error) throw error
      } else {
        const { error } = await sb
          .from('club_post_likes')
          .insert({ post_id: postId, user_id: userId })
        if (error) throw error
      }
    },
    onMutate: async ({ postId, liked }) => {
      await queryClient.cancelQueries(feedFilter(clubId))
      patchPosts(queryClient, clubId, (posts) =>
        posts.map((p) =>
          p.id === postId
            ? { ...p, viewerLiked: !liked, likeCount: p.likeCount + (liked ? -1 : 1) }
            : p,
        ),
      )
    },
    onError: () => void queryClient.invalidateQueries(feedFilter(clubId)),
    onSettled: () => void queryClient.invalidateQueries(feedFilter(clubId)),
  })

  return {
    toggle: (postId: string, liked: boolean) => gate(() => mutation.mutate({ postId, liked })),
  }
}

/** Create a club post (content + at most one media block: image | video | poll). */
export function useCreatePost(clubId: string) {
  const { userId } = useSession()
  const gate = useAuthGate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ content, media }: { content: string; media: CreateMedia }) => {
      if (!userId) throw new Error('Not authenticated')
      const sb = getBrowserSupabase()
      const { data, error } = await sb
        .from('club_posts')
        .insert({
          club_id: clubId,
          author_id: userId,
          content: content || null,
          media_type: media?.kind ?? null,
          video_url: media?.kind === 'video' ? media.url : null,
          poll_closes_at: media?.kind === 'poll' ? media.closesAt : null,
        })
        .select('id')
        .single()
      if (error) throw error
      if (media?.kind === 'image') {
        const url = await uploadPostImage(clubId, data.id, media.file)
        const { error: updErr } = await sb
          .from('club_posts')
          .update({ image_url: url })
          .eq('id', data.id)
        if (updErr) throw updErr
      } else if (media?.kind === 'poll') {
        const { error: optErr } = await sb.from('club_poll_options').insert(
          media.options.map((label, i) => ({ post_id: data.id, label, position: i })),
        )
        if (optErr) throw optErr
      }
    },
    onSuccess: () => trackEvent('club_post_created', { club_id: clubId }),
    onSettled: () => void queryClient.invalidateQueries(feedFilter(clubId)),
  })

  return {
    submit: (content: string, media: CreateMedia) =>
      gate(() => mutation.mutate({ content, media })),
    pending: mutation.isPending,
  }
}

/** Cast a single poll vote (optimistic; the DB unique constraint blocks duplicates). */
export function useVotePoll(clubId: string) {
  const { userId } = useSession()
  const gate = useAuthGate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ postId, optionId }: { postId: string; optionId: string }) => {
      if (!userId) throw new Error('Not authenticated')
      const { error } = await getBrowserSupabase()
        .from('club_poll_votes')
        .insert({ post_id: postId, option_id: optionId, user_id: userId })
      if (error) throw error
    },
    onMutate: async ({ postId, optionId }) => {
      await queryClient.cancelQueries(feedFilter(clubId))
      patchPosts(queryClient, clubId, (posts) =>
        posts.map((p) =>
          p.id === postId && p.poll && p.poll.viewerVotedOptionId == null
            ? {
                ...p,
                poll: {
                  ...p.poll,
                  totalVotes: p.poll.totalVotes + 1,
                  viewerVotedOptionId: optionId,
                  options: p.poll.options.map((o) =>
                    o.id === optionId ? { ...o, voteCount: o.voteCount + 1 } : o,
                  ),
                },
              }
            : p,
        ),
      )
    },
    onError: () => void queryClient.invalidateQueries(feedFilter(clubId)),
    onSettled: () => void queryClient.invalidateQueries(feedFilter(clubId)),
  })

  return {
    vote: (postId: string, optionId: string) =>
      gate(() => mutation.mutate({ postId, optionId })),
  }
}

/** Delete a post (optimistic removal). */
export function useDeletePost(clubId: string) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await getBrowserSupabase().from('club_posts').delete().eq('id', postId)
      if (error) throw error
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries(feedFilter(clubId))
      patchPosts(queryClient, clubId, (posts) => posts.filter((p) => p.id !== postId))
    },
    onError: () => void queryClient.invalidateQueries(feedFilter(clubId)),
    onSettled: () => void queryClient.invalidateQueries(feedFilter(clubId)),
  })
  return { remove: (postId: string) => mutation.mutate(postId) }
}

/** Add a comment to a post. */
export function useAddComment(clubId: string) {
  const { userId } = useSession()
  const gate = useAuthGate()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      if (!userId) throw new Error('Not authenticated')
      const { error } = await getBrowserSupabase()
        .from('club_post_comments')
        .insert({ post_id: postId, author_id: userId, content })
      if (error) throw error
    },
    onSettled: () => void queryClient.invalidateQueries(feedFilter(clubId)),
  })
  return {
    submit: (postId: string, content: string) => gate(() => mutation.mutate({ postId, content })),
  }
}

/** Delete a comment (optimistic removal). */
export function useDeleteComment(clubId: string) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async ({ commentId }: { postId: string; commentId: string }) => {
      const { error } = await getBrowserSupabase()
        .from('club_post_comments')
        .delete()
        .eq('id', commentId)
      if (error) throw error
    },
    onMutate: async ({ postId, commentId }) => {
      await queryClient.cancelQueries(feedFilter(clubId))
      patchPosts(queryClient, clubId, (posts) =>
        posts.map((p) =>
          p.id === postId ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) } : p,
        ),
      )
    },
    onError: () => void queryClient.invalidateQueries(feedFilter(clubId)),
    onSettled: () => void queryClient.invalidateQueries(feedFilter(clubId)),
  })
  return { remove: (postId: string, commentId: string) => mutation.mutate({ postId, commentId }) }
}
