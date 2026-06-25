import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Stars } from '~/components/ui/Stars'
import { Icon } from '~/components/ui/Icon'
import { useSession } from '~/features/auth/session'
import { ReportDialog } from '~/features/reports/ReportDialog'
import { useDeleteComment } from './mutations'
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

export function ReviewList({ spotId, comments }: { spotId: string; comments: SpotComment[] }) {
  const { t, i18n } = useTranslation()
  const { userId } = useSession()
  const { remove, pending } = useDeleteComment(spotId)
  const [reportingId, setReportingId] = useState<string | null>(null)

  if (comments.length === 0) {
    return (
      <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 8 }}>
        {t('review.noReviews')}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {comments.map((c) => {
        const isOwn = userId != null && c.userId === userId
        return (
          <div
            key={c.id}
            className="rounded-[10px] border border-border bg-surface p-3"
          >
            <div className="mb-1.5 flex items-center gap-2">
              <div className="grid h-[26px] w-[26px] place-items-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent">
                {c.user.charAt(0).toUpperCase()}
              </div>
              <div className="text-[12px] text-text-3">
                <strong className="font-semibold text-text">{c.user}</strong>
                {c.date && <span> · {formatCommentDate(c.date, i18n.language)}</span>}
              </div>
              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  className="grid size-[24px] place-items-center rounded-[6px] text-text-3 transition-colors duration-150 hover:bg-surface-2 hover:text-text"
                  aria-label={t('report.button')}
                  title={t('report.button')}
                  data-testid="comment-report-button"
                  onClick={() => setReportingId(c.id)}
                >
                  <Icon name="flag" size={13} />
                </button>
                {isOwn && (
                  <button
                    type="button"
                    className="grid h-6 w-6 place-items-center rounded-md text-text-3 transition-colors hover:bg-accent-soft hover:text-accent disabled:opacity-50"
                    aria-label={t('review.delete')}
                    title={t('review.delete')}
                    disabled={pending}
                    onClick={() => {
                      if (window.confirm(t('review.deleteConfirm'))) remove(c.id)
                    }}
                  >
                    <Icon name="trash" size={14} />
                  </button>
                )}
              </div>
            </div>
            {c.rating != null && (
              <div style={{ marginBottom: 4 }}>
                <Stars value={c.rating} size={12} />
              </div>
            )}
            {c.text && (
              <p className="text-[13px] leading-normal text-text-2">{c.text}</p>
            )}
          </div>
        )
      })}

      <ReportDialog
        open={reportingId != null}
        onClose={() => setReportingId(null)}
        targetType="comment"
        targetId={reportingId ?? ''}
      />
    </div>
  )
}
