import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import type { Poll } from './types'

/**
 * Renders a poll. Before voting (and while open) the options are clickable
 * buttons; after voting or once closed it shows result bars with percentages,
 * highlighting the viewer's choice.
 */
export function PollBlock({
  poll,
  disabled,
  onVote,
}: {
  poll: Poll
  disabled: boolean
  onVote: (optionId: string) => void
}) {
  const { t } = useTranslation()
  const closed = poll.closesAt != null && new Date(poll.closesAt).getTime() <= Date.now()
  const showResults = poll.viewerVotedOptionId != null || closed

  return (
    <div className="mt-2.5 flex flex-col gap-2">
      {poll.options.map((opt) => {
        const pct = poll.totalVotes > 0 ? Math.round((opt.voteCount / poll.totalVotes) * 100) : 0
        const isChoice = poll.viewerVotedOptionId === opt.id

        if (!showResults) {
          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => onVote(opt.id)}
              className="rounded-[10px] border border-border px-3 py-2 text-left text-[13.5px] font-medium text-text transition-colors hover:border-accent hover:bg-accent-soft disabled:opacity-50"
            >
              {opt.label}
            </button>
          )
        }

        return (
          <div
            key={opt.id}
            className={cx(
              'relative overflow-hidden rounded-[10px] border px-3 py-2',
              isChoice ? 'border-accent' : 'border-border',
            )}
          >
            <div
              className={cx(
                'absolute inset-y-0 left-0 transition-[width]',
                isChoice ? 'bg-accent-soft' : 'bg-surface-2',
              )}
              style={{ width: `${pct}%` }}
            />
            <div className="relative flex items-center justify-between gap-2 text-[13.5px]">
              <span className="inline-flex min-w-0 items-center gap-1.5 truncate text-text">
                {isChoice && <Icon name="check" size={14} color="var(--accent)" />}
                <span className="truncate">{opt.label}</span>
              </span>
              <span className="shrink-0 font-semibold text-text-3">{pct}%</span>
            </div>
          </div>
        )
      })}

      <div className="flex items-center gap-2 text-[12px] text-text-4">
        <span>{t('feed.votes', { count: poll.totalVotes })}</span>
        {closed ? (
          <span>· {t('feed.pollClosed')}</span>
        ) : poll.closesAt != null ? (
          <span>· {t('feed.pollClosesAt', { date: new Date(poll.closesAt).toLocaleString() })}</span>
        ) : null}
      </div>
    </div>
  )
}
