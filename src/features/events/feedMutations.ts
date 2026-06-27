import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getBrowserSupabase } from '~/lib/supabase/browser'
import { useSession } from '~/features/auth/session'
import { useAuthGate } from '~/features/auth/useAuthGate'
import { trackEvent } from '~/features/analytics/gtag'
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

/** Create an event post (content + optional image). */
export function useCreatePost(eventId: string) {
  const { userId } = useSession()
  const gate = useAuthGate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ content, file }: { content: string; file: File | null }) => {
      if (!userId) throw new Error('Not authenticated')
      const sb = getBrowserSupabase()
      const { data, error } = await sb
        .from('event_posts')
        .insert({ event_id: eventId, author_id: userId, content })
        .select('id')
        .single()
      if (error) throw error
      if (file) {
        const url = await uploadEventPostImage(eventId, data.id, file)
        const { error: updErr } = await sb
          .from('event_posts')
          .update({ image_url: url })
          .eq('id', data.id)
        if (updErr) throw updErr
      }
    },
    onSuccess: () => trackEvent('event_post_created', { event_id: eventId }),
    onSettled: () => void queryClient.invalidateQueries(feedFilter(eventId)),
  })

  return {
    submit: (content: string, file: File | null) => gate(() => mutation.mutate({ content, file })),
    pending: mutation.isPending,
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
