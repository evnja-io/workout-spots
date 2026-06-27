import { useTranslation } from 'react-i18next'
import { cx } from '~/components/ui/cx'
import type { EventStatus, EventTag } from '../domain'

const pill = 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium'

const STATUS_STYLE: Record<EventStatus, string> = {
  draft: 'bg-surface-2 text-text-3',
  upcoming: 'bg-accent-soft text-accent',
  ongoing: 'bg-emerald-500/15 text-emerald-500',
  completed: 'bg-surface-2 text-text-3',
  cancelled: 'bg-red-500/15 text-red-500',
}

export function StatusBadge({
  status,
  onCover = false,
}: {
  status: EventStatus
  onCover?: boolean
}) {
  const { t } = useTranslation()
  return (
    <span
      className={cx(
        pill,
        onCover ? 'bg-black/40 text-white backdrop-blur-sm' : STATUS_STYLE[status],
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
  return (
    <span
      className={cx(
        pill,
        onCover ? 'bg-black/40 text-white backdrop-blur-sm' : 'bg-surface-2 text-text-2',
      )}
    >
      {isFree ? t('events.free') : `${sym}${amount ?? 0}`}
    </span>
  )
}

export function EvTag({ tag }: { tag: EventTag }) {
  const { i18n } = useTranslation()
  const label = i18n.language === 'fr' && tag.nameFr ? tag.nameFr : tag.name
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{
        backgroundColor: `color-mix(in srgb, ${tag.color} 16%, transparent)`,
        color: tag.color,
      }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
      {label}
    </span>
  )
}

export function EvTags({ tags, max }: { tags: EventTag[]; max?: number }) {
  const shown = max ? tags.slice(0, max) : tags
  return (
    <>
      {shown.map((t) => (
        <EvTag key={t.id} tag={t} />
      ))}
    </>
  )
}
