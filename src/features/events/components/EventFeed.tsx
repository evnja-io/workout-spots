import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Avatar } from '~/components/ui/Avatar'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import { Lightbox } from '~/components/ui/Lightbox'
import { Composer } from '~/features/feed/Composer'
import { PostImage } from '~/features/feed/PostImage'
import { VideoBlock } from '~/features/feed/VideoBlock'
import { PollBlock } from '~/features/feed/PollBlock'
import { useSession } from '~/features/auth/session'
import type { EventPost } from '../domain'
import { eventFeedQueryOptions } from '../queries'
import {
  useAddComment,
  useCreatePost,
  useDeleteComment,
  useDeletePost,
  useToggleLike,
  useVotePoll,
} from '../feedMutations'
import { timeAgo } from './visuals'

export function EventFeed({ eventId, canCompose }: { eventId: string; canCompose: boolean }) {
  const { t } = useTranslation()
  const { userId } = useSession()
  const { data: posts = [], isPending } = useQuery(eventFeedQueryOptions(eventId, userId))

  const createPost = useCreatePost(eventId)
  const toggleLike = useToggleLike(eventId)
  const deletePost = useDeletePost(eventId)
  const addComment = useAddComment(eventId)
  const deleteComment = useDeleteComment(eventId)
  const votePoll = useVotePoll(eventId)

  return (
    <div className="flex flex-col gap-4">
      {canCompose ? (
        <Composer
          pending={createPost.pending}
          placeholder={t('events.composePlaceholder')}
          onSubmit={createPost.submit}
        />
      ) : (
        <p className="rounded-lg border border-dashed border-border px-3.5 py-2.5 text-[13px] text-text-3">
          {t('events.feedJoinToPost')}
        </p>
      )}

      {isPending ? (
        <p className="py-6 text-center text-[13px] text-text-3">{t('common.retry')}</p>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-[13px] text-text-3">
          {t('events.feedEmpty')}
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            viewerUserId={userId}
            canComment={canCompose}
            onToggleLike={() => toggleLike.toggle(post.id, post.viewerLiked)}
            onDeletePost={() => deletePost.remove(post.id)}
            onAddComment={(content) => addComment.submit(post.id, content)}
            onDeleteComment={(commentId) => deleteComment.remove(post.id, commentId)}
            onVote={(optionId) => votePoll.vote(post.id, optionId)}
          />
        ))
      )}
    </div>
  )
}

function PostCard({
  post,
  viewerUserId,
  canComment,
  onToggleLike,
  onDeletePost,
  onAddComment,
  onDeleteComment,
  onVote,
}: {
  post: EventPost
  viewerUserId: string | null
  canComment: boolean
  onToggleLike: () => void
  onDeletePost: () => void
  onAddComment: (content: string) => void
  onDeleteComment: (commentId: string) => void
  onVote: (optionId: string) => void
}) {
  const { t } = useTranslation()
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const isAuthor = viewerUserId != null && post.author.id === viewerUserId

  const submitComment = () => {
    const text = comment.trim()
    if (!text) return
    onAddComment(text)
    setComment('')
    setShowComments(true)
  }

  return (
    <article className="rounded-[18px] border border-border bg-surface p-4">
      <header className="flex items-center gap-2.5">
        <Avatar name={post.author.name} avatarUrl={post.author.avatarUrl} size={36} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-semibold text-text">{post.author.name}</div>
          <div className="text-[12px] text-text-4">{timeAgo(post.createdAt)}</div>
        </div>
        {isAuthor && (
          <button
            type="button"
            aria-label={t('events.deletePost')}
            onClick={onDeletePost}
            className="text-text-4 hover:text-text"
          >
            <Icon name="trash" size={15} />
          </button>
        )}
      </header>

      {post.content && (
        <p className="mt-2.5 whitespace-pre-line text-[14px] leading-relaxed text-text-2">
          {post.content}
        </p>
      )}
      {post.imageUrl && <PostImage url={post.imageUrl} onOpen={() => setLightboxOpen(true)} />}
      {post.videoUrl && <VideoBlock url={post.videoUrl} />}
      {post.poll && (
        <PollBlock
          poll={post.poll}
          disabled={post.poll.viewerVotedOptionId != null}
          onVote={onVote}
        />
      )}
      {lightboxOpen && post.imageUrl && (
        <Lightbox
          images={[{ url: post.imageUrl }]}
          index={0}
          onClose={() => setLightboxOpen(false)}
          onNav={() => {}}
        />
      )}

      <div className="mt-3 flex items-center gap-4 text-[13px] text-text-3">
        <button
          type="button"
          onClick={onToggleLike}
          className={cx('inline-flex items-center gap-1.5', post.viewerLiked && 'text-accent')}
        >
          <Icon name="heart" size={16} fill={post.viewerLiked ? 'currentColor' : 'none'} />
          {post.likeCount}
        </button>
        <button
          type="button"
          onClick={() => setShowComments((v) => !v)}
          className="inline-flex items-center gap-1.5"
        >
          <Icon name="list" size={16} />
          {post.comments.length}
        </button>
      </div>

      {showComments && (
        <div className="mt-3 flex flex-col gap-2.5 border-t border-border pt-3">
          {post.comments.map((c) => {
            const own = viewerUserId != null && c.author.id === viewerUserId
            return (
              <div key={c.id} className="flex items-start gap-2">
                <Avatar name={c.author.name} avatarUrl={c.author.avatarUrl} size={26} />
                <div className="min-w-0 flex-1 rounded-lg bg-surface-2 px-2.5 py-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12.5px] font-semibold text-text">{c.author.name}</span>
                    <span className="text-[11px] text-text-4">{timeAgo(c.createdAt)}</span>
                  </div>
                  <p className="whitespace-pre-line text-[13px] text-text-2">{c.content}</p>
                </div>
                {own && (
                  <button
                    type="button"
                    aria-label={t('events.deleteComment')}
                    onClick={() => onDeleteComment(c.id)}
                    className="mt-1 text-text-4 hover:text-text"
                  >
                    <Icon name="trash" size={13} />
                  </button>
                )}
              </div>
            )
          })}

          {canComment && (
            <div className="flex items-center gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                placeholder={t('events.commentPlaceholder')}
                maxLength={1000}
                className="min-w-0 flex-1 rounded-full border border-border bg-surface px-3 py-1.5 text-[13px] text-text outline-none placeholder:text-text-4"
              />
              <button
                type="button"
                onClick={submitComment}
                disabled={comment.trim() === ''}
                className="shrink-0 rounded-full bg-accent px-3 py-1.5 text-[12.5px] font-medium text-white disabled:opacity-50"
              >
                {t('events.send')}
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  )
}
