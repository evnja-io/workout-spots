import { useTranslation } from 'react-i18next'
import { cx } from '~/components/ui/cx'
import { isFull, spotsLeft } from '../eventState'

export function CapacityMeter({
  goingCount,
  maxParticipants,
  minParticipants,
}: {
  goingCount: number
  maxParticipants: number | null
  minParticipants: number
}) {
  const { t } = useTranslation()

  if (maxParticipants == null) {
    return (
      <div className="text-[13px] text-text-3">{t('events.goingCount', { count: goingCount })}</div>
    )
  }

  const pct = Math.min(100, Math.round((goingCount / maxParticipants) * 100))
  const full = isFull({ goingCount, maxParticipants })
  const left = spotsLeft({ goingCount, maxParticipants }) ?? 0
  const minMet = goingCount >= minParticipants

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between text-[13px]">
        <span className="font-semibold text-text">
          {goingCount} <span className="font-normal text-text-4">/ {maxParticipants}</span>
        </span>
        <span className="text-text-3">
          {full ? t('events.full') : t('events.spotsLeft', { count: left })}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div
          className={cx('h-full rounded-full', full ? 'bg-amber-500' : 'bg-accent')}
          style={{ width: `${pct}%` }}
        />
      </div>
      {minParticipants > 1 && (
        <div className="text-[11.5px] text-text-4">
          {minMet
            ? t('events.minReached')
            : t('events.minNeeded', { count: minParticipants - goingCount })}
        </div>
      )}
    </div>
  )
}
