import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
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
  const minPct = Math.min(100, Math.round((minParticipants / maxParticipants) * 100))
  const full = isFull({ goingCount, maxParticipants })
  const left = spotsLeft({ goingCount, maxParticipants }) ?? 0
  const minMet = goingCount >= minParticipants

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2.5 text-[13px]">
        <span className="text-[15px] font-extrabold tracking-[-0.01em] text-text">
          {goingCount} <span className="font-semibold text-text-3">/ {maxParticipants}</span>
        </span>
        <span className="text-[12px] font-semibold text-text-3">
          {full ? t('events.full') : t('events.spotsLeft', { count: left })}
        </span>
      </div>
      <div className="relative h-[9px] overflow-hidden rounded-full bg-surface-2">
        <div
          className={cx(
            'absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-[cubic-bezier(.32,.72,0,1)]',
            full ? 'bg-[linear-gradient(100deg,#D97706,#FBBF24)]' : 'bg-hot',
          )}
          style={{ width: `${pct}%` }}
        />
        {minParticipants > 0 && (
          <div
            className="absolute -inset-y-[3px] w-0.5 rounded bg-border-strong"
            style={{ left: `${minPct}%` }}
            title={t('events.minNeeded', { count: Math.max(0, minParticipants - goingCount) })}
          />
        )}
      </div>
      {minParticipants > 1 && (
        <div className="flex items-center justify-between text-[12px] font-semibold text-text-3">
          {minMet ? (
            <span className="inline-flex items-center gap-1 text-emerald-600">
              <Icon name="check" size={12} />
              {t('events.minReached')}
            </span>
          ) : (
            <span className="text-amber-600">
              {t('events.minNeeded', { count: minParticipants - goingCount })}
            </span>
          )}
          <span>{t('events.minLabel', { count: minParticipants })}</span>
        </div>
      )}
    </div>
  )
}
