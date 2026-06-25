import { useTranslation } from 'react-i18next'
import { Stars } from '~/components/ui/Stars'
import type { SpotComment } from '~/features/spots/domain'

function formatCommentDate(value: string, locale: string): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}

export function ReviewList({ comments }: { comments: SpotComment[] }) {
  const { t, i18n } = useTranslation()

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
              {c.date && <span> · {formatCommentDate(c.date, i18n.language)}</span>}
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
