import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getBrowserSupabase } from '~/lib/supabase/browser'
import { useSession } from '~/features/auth/session'
import { useAuthGate } from '~/features/auth/useAuthGate'
import { trackEvent } from '~/features/analytics/gtag'
import type { CreateMedia } from '~/features/feed/types'
import type { EventPost } from './domain'
import { uploadEventPostImage } from './photos'

const feedFilter = (eventId: string) => ({ queryKey: ['events', 'feed', eventId] as const })

function patchPosts(
  queryClient: ReturnType<typeof useQueryClient>,
  eventId: string,
  updater: (posts: EventPost[]) => EventPost[],
) {
  queryClient.setQueriesData<EventPost[]>(feedFilter(eventId), (prev) =>
    prev ? updater(prev) : prev,
  )
}

/** Like / unlike an event post (optimistic). */
export function useToggleLike(eventId: string) {
  const { userId } = useSession()
  const gate = useAuthGate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ postId, liked }: { postId: string; liked: boolean }) => {
      if (!userId) throw new Error('Not authenticated')
      const sb = getBrowserSupabase()
      if (liked) {
        const { error } = await sb
          .from('event_post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId)
        if (error) throw error
      } else {
        const { error } = await sb
          .from('event_post_likes')
          .insert({ post_id: postId, user_id: userId })
        if (error) throw error
      }
    },
    onMutate: async ({ postId, liked }) => {
      await queryClient.cancelQueries(feedFilter(eventId))
      patchPosts(queryClient, eventId, (posts) =>
        posts.map((p) =>
          p.id === postId
            ? { ...p, viewerLiked: !liked, likeCount: p.likeCount + (liked ? -1 : 1) }
            : p,
        ),
      )
    },
    onError: () => void queryClient.invalidateQueries(feedFilter(eventId)),
    onSettled: () => void queryClient.invalidateQueries(feedFilter(eventId)),
  })

  return {
    toggle: (postId: string, liked: boolean) => gate(() => mutation.mutate({ postId, liked })),
  }
}

/** Create an event post (content + at most one media block: image | video | poll). */
export function useCreatePost(eventId: string) {
  const { userId } = useSession()
  const gate = useAuthGate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ content, media }: { content: string; media: CreateMedia }) => {
      if (!userId) throw new Error('Not authenticated')
      const sb = getBrowserSupabase()
      const { data, error } = await sb
        .from('event_posts')
        .insert({
          event_id: eventId,
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
        const url = await uploadEventPostImage(eventId, data.id, media.file)
        const { error: updErr } = await sb
          .from('event_posts')
          .update({ image_url: url })
          .eq('id', data.id)
        if (updErr) throw updErr
      } else if (media?.kind === 'poll') {
        const { error: optErr } = await sb.from('event_poll_options').insert(
          media.options.map((label, i) => ({ post_id: data.id, label, position: i })),
        )
        if (optErr) throw optErr
      }
    },
    onSuccess: () => trackEvent('event_post_created', { event_id: eventId }),
    onSettled: () => void queryClient.invalidateQueries(feedFilter(eventId)),
  })

  return {
    submit: (content: string, media: CreateMedia) =>
      gate(() => mutation.mutate({ content, media })),
    pending: mutation.isPending,
  }
}

/** Cast a single poll vote (optimistic; the DB unique constraint blocks duplicates). */
export function useVotePoll(eventId: string) {
  const { userId } = useSession()
  const gate = useAuthGate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ postId, optionId }: { postId: string; optionId: string }) => {
      if (!userId) throw new Error('Not authenticated')
      const { error } = await getBrowserSupabase()
        .from('event_poll_votes')
        .insert({ post_id: postId, option_id: optionId, user_id: userId })
      if (error) throw error
    },
    onMutate: async ({ postId, optionId }) => {
      await queryClient.cancelQueries(feedFilter(eventId))
      patchPosts(queryClient, eventId, (posts) =>
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
    onError: () => void queryClient.invalidateQueries(feedFilter(eventId)),
    onSettled: () => void queryClient.invalidateQueries(feedFilter(eventId)),
  })

  return {
    vote: (postId: string, optionId: string) =>
      gate(() => mutation.mutate({ postId, optionId })),
  }
}

/** Delete a post (optimistic removal). */
export function useDeletePost(eventId: string) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await getBrowserSupabase().from('event_posts').delete().eq('id', postId)
      if (error) throw error
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries(feedFilter(eventId))
      patchPosts(queryClient, eventId, (posts) => posts.filter((p) => p.id !== postId))
    },
    onError: () => void queryClient.invalidateQueries(feedFilter(eventId)),
    onSettled: () => void queryClient.invalidateQueries(feedFilter(eventId)),
  })
  return { remove: (postId: string) => mutation.mutate(postId) }
}

/** Add a comment to a post. */
export function useAddComment(eventId: string) {
  const { userId } = useSession()
  const gate = useAuthGate()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      if (!userId) throw new Error('Not authenticated')
      const { error } = await getBrowserSupabase()
        .from('event_post_comments')
        .insert({ post_id: postId, author_id: userId, content })
      if (error) throw error
    },
    onSettled: () => void queryClient.invalidateQueries(feedFilter(eventId)),
  })
  return {
    submit: (postId: string, content: string) => gate(() => mutation.mutate({ postId, content })),
  }
}

/** Delete a comment (optimistic removal). */
export function useDeleteComment(eventId: string) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async ({ commentId }: { postId: string; commentId: string }) => {
      const { error } = await getBrowserSupabase()
        .from('event_post_comments')
        .delete()
        .eq('id', commentId)
      if (error) throw error
    },
    onMutate: async ({ postId, commentId }) => {
      await queryClient.cancelQueries(feedFilter(eventId))
      patchPosts(queryClient, eventId, (posts) =>
        posts.map((p) =>
          p.id === postId ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) } : p,
        ),
      )
    },
    onError: () => void queryClient.invalidateQueries(feedFilter(eventId)),
    onSettled: () => void queryClient.invalidateQueries(feedFilter(eventId)),
  })
  return { remove: (postId: string, commentId: string) => mutation.mutate({ postId, commentId }) }
}
