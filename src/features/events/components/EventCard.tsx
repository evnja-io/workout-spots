import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { ImageWithShimmer } from '~/components/ui/ImageWithShimmer'
import { cx } from '~/components/ui/cx'
import type { EventListItem } from '../domain'
import { dayParts, formatEventDate, formatEventTimeRange, isFull } from '../eventState'
import { coverGradient } from './visuals'
import { EvTags, PriceBadge, StatusBadge } from './badges'

export function EventCard({
  event,
  onOpen,
}: {
  event: EventListItem
  onOpen: (id: string) => void
}) {
  const { t } = useTranslation()
  const { day, month } = dayParts(event.startsAt, event.timezone)
  const full = isFull(event)

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen(event.id)
    }
  }

  return (
    <div
      className={cx(
        'group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-surface transition-[border-color,box-shadow] duration-150 hover:border-accent-soft hover:shadow-[var(--shadow-md)]',
        event.status === 'cancelled' && 'opacity-70',
      )}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(event.id)}
      onKeyDown={handleKeyDown}
    >
      <div
        className="relative h-36 w-full text-white"
        style={event.featuredImageUrl ? undefined : { backgroundImage: coverGradient(event.id) }}
      >
        {event.featuredImageUrl && (
          <div className="absolute inset-0">
            <ImageWithShimmer src={event.featuredImageUrl} alt="" className="h-full w-full" />
          </div>
        )}
        <div className="absolute inset-x-2 top-2 flex items-center justify-between gap-1">
          <StatusBadge status={event.status} onCover />
          <PriceBadge
            isFree={event.isFree}
            amount={event.priceAmount}
            currency={event.priceCurrency}
            onCover
          />
        </div>
        <div className="absolute bottom-2 left-2 grid h-12 w-11 place-items-center rounded-lg bg-black/45 backdrop-blur-sm">
          <span className="text-[10px] font-semibold uppercase leading-none opacity-90">
            {month}
          </span>
          <span className="text-[18px] font-bold leading-none">{day}</span>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-1 text-[15px] font-semibold tracking-[-0.005em] text-text">
          {event.title}
        </h3>
        <div className="flex items-center gap-1.5 text-[12.5px] text-text-3">
          <Icon name="clock" size={13} />
          <span className="truncate">
            {formatEventDate(event.startsAt, event.timezone)} ·{' '}
            {formatEventTimeRange(event.startsAt, event.endsAt, event.timezone)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[12.5px] text-text-3">
          <Icon name="mappin" size={13} />
          <span className="truncate">{event.primaryLocationName ?? t('events.locationTba')}</span>
        </div>
        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            <EvTags tags={event.tags} max={3} />
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-1 text-[12px] text-text-3">
          <span className="inline-flex items-center gap-1">
            <Icon name="users" size={14} />
            <strong className="text-text">{event.goingCount}</strong>
            {event.maxParticipants != null && <> / {event.maxParticipants}</>} {t('events.going')}
          </span>
          {full && event.status === 'upcoming' && (
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-600">
              {t('events.waitlist')}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function EventCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <div className="h-36 w-full animate-pulse bg-surface-2" />
      <div className="flex flex-col gap-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-surface-2" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-surface-2" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-surface-2" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-surface-2" />
      </div>
    </div>
  )
}
