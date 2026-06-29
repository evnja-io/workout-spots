import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import type { EventStatus, EventTag } from '../domain'

// Poster-safe pill: dark glass over imagery, uppercase + bold like the design.
const coverPill =
  'inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.04em] text-white backdrop-blur-sm'

const surfaceStatus: Record<EventStatus, string> = {
  draft: 'bg-surface-2 text-text-3',
  upcoming: 'bg-accent-soft text-accent',
  ongoing: 'bg-emerald-500/15 text-emerald-500',
  completed: 'bg-surface-2 text-text-3',
  cancelled: 'bg-red-500/15 text-red-500',
}

/**
 * Status badge. `upcoming` renders nothing on a cover (the date stub carries
 * it), matching the design — only live/wrapped/cancelled show a pill.
 */
export function StatusBadge({
  status,
  onCover = false,
}: {
  status: EventStatus
  onCover?: boolean
}) {
  const { t } = useTranslation()

  if (onCover) {
    if (status === 'ongoing') {
      return (
        <span
          className={cx(
            coverPill,
            'border-transparent bg-[#FF3B6B] shadow-[0_4px_16px_-4px_#FF3B6B]',
          )}
        >
          <span className="size-1.5 rounded-full bg-white [animation:livePulse_1.3s_ease-in-out_infinite]" />
          {t('events.status_ongoing')}
        </span>
      )
    }
    if (status === 'completed') {
      return <span className={cx(coverPill, 'text-white/80')}>{t('events.status_completed')}</span>
    }
    if (status === 'cancelled') {
      return <span className={cx(coverPill, 'text-[#FCA5A5]')}>{t('events.status_cancelled')}</span>
    }
    return null
  }

  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
        surfaceStatus[status],
      )}
    >
      {status === 'ongoing' && <span className="size-1.5 animate-pulse rounded-full bg-current" />}
      {t(`events.status_${status}`)}
    </span>
  )
}

export function PriceBadge({
  isFree,
  amount,
  currency,
  onCover = false,
}: {
  isFree: boolean
  amount: number | null
  currency: string
  onCover?: boolean
}) {
  const { t } = useTranslation()
  const sym = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : `${currency} `

  if (onCover) {
    return isFree ? (
      <span className={cx(coverPill, 'border-transparent bg-white text-[#11070f]')}>
        {t('events.free')}
      </span>
    ) : (
      <span className={coverPill}>
        <Icon name="ticket" size={12} />
        {sym}
        {amount ?? 0}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-text-2">
      {isFree ? t('events.free') : `${sym}${amount ?? 0}`}
    </span>
  )
}

/**
 * Colored tag chip. Poster-safe by default (dark glass + colored dot); pass
 * `surface` for placement on a light surface (color-mixed tint).
 */
export function EvTag({ tag, surface = false }: { tag: EventTag; surface?: boolean }) {
  const { i18n } = useTranslation()
  const label = i18n.language === 'fr' && tag.nameFr ? tag.nameFr : tag.name

  if (surface) {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
        style={{
          backgroundColor: `color-mix(in srgb, ${tag.color} 16%, transparent)`,
          color: tag.color,
        }}
      >
        {tag.icon ? <Icon name="dumbbell" size={11} /> : null}
        {label}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
      <span className="size-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
      {label}
    </span>
  )
}

export function EvTags({
  tags,
  max,
  surface = false,
}: {
  tags: EventTag[]
  max?: number
  surface?: boolean
}) {
  const shown = max ? tags.slice(0, max) : tags
  return (
    <>
      {shown.map((tag) => (
        <EvTag key={tag.id} tag={tag} surface={surface} />
      ))}
    </>
  )
}
