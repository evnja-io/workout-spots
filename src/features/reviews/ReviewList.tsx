import { useTranslation } from 'react-i18next'
import { Stars } from '~/components/ui/Stars'
import type { SpotComment } from '~/features/spots/domain'

export function ReviewList({ comments }: { comments: SpotComment[] }) {
  const { t } = useTranslation()

  if (comments.length === 0) {
    return (
      <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 8 }}>
        {t('review.noReviews')}
      </p>
    )
  }

  return (
    <div className="comments">
      {comments.map((c) => (
        <div key={c.id} className="comment">
          <div className="comment-head">
            <div className="comment-avatar">{c.user.charAt(0).toUpperCase()}</div>
            <div className="comment-meta">
              <strong>{c.user}</strong>
              {c.date && <span> · {c.date}</span>}
            </div>
          </div>
          {c.rating != null && (
            <div style={{ marginBottom: 4 }}>
              <Stars value={c.rating} size={12} />
            </div>
          )}
          {c.text && <p className="comment-body">{c.text}</p>}
        </div>
      ))}
    </div>
  )
}
