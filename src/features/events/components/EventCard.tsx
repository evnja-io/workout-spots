import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { AvatarStack } from '~/components/ui/AvatarStack'
import { PosterCard, type PosterVariant } from '~/components/ui/PosterCard'
import { Skeleton } from '~/components/ui/Skeleton'
import { cx } from '~/components/ui/cx'
import type { EventListItem } from '../domain'
import { dayParts, formatTime, isFull } from '../eventState'
import { EvTags, PriceBadge, StatusBadge } from './badges'

const TITLE_SIZE: Record<PosterVariant, string> = {
  rail: 'text-[24px]',
  feed: 'text-[34px]',
  spot: 'text-[clamp(30px,4vw,52px)]',
}

/** Decorative CTA hint shown on the card (the whole card opens the detail). */
function cardCta(event: EventListItem): { key: string; cls: string } | null {
  if (event.status === 'cancelled') return null
  if (event.status === 'completed') return { key: 'events.cta_recap', cls: 'ghost' }
  if (event.status === 'ongoing') return { key: 'events.cta_joinNow', cls: 'hot' }
  if (isFull(event)) return { key: 'events.cta_waitlist', cls: 'ghost' }
  return { key: 'events.cta_rsvp', cls: 'solid' }
}

const CTA_CLS: Record<string, string> = {
  solid: 'bg-white text-[#11070f]',
  hot: 'bg-hot text-white',
  ghost: 'border border-white/25 bg-white/15 text-white backdrop-blur-sm',
}

export function EventCard({
  event,
  onOpen,
  variant = 'feed',
}: {
  event: EventListItem
  onOpen: (id: string) => void
  variant?: PosterVariant
}) {
  const { t } = useTranslation()
  const { day, month } = dayParts(event.startsAt, event.timezone)
  const cta = cardCta(event)
  const tagMax = variant === 'spot' ? 4 : 2
  const goingLabel =
    event.goingCount === 0
      ? t('events.beFirst')
      : t('events.goingCount', { count: event.goingCount })

  const top = (
    <>
      <div className="flex min-w-[50px] flex-col items-center rounded-[13px] border border-white/15 bg-black/40 px-2.5 py-1.5 backdrop-blur-sm">
        <span className="text-[10.5px] font-extrabold uppercase tracking-[0.1em] opacity-90">
          {month}
        </span>
        <span className="font-display text-[25px] leading-none">{day}</span>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <PriceBadge
          isFree={event.isFree}
          amount={event.priceAmount}
          currency={event.priceCurrency}
          onCover
        />
        <StatusBadge status={event.status} onCover />
      </div>
    </>
  )

  return (
    <PosterCard
      seedId={event.id}
      imageUrl={event.featuredImageUrl}
      variant={variant}
      dimmed={event.status === 'cancelled'}
      onClick={() => onOpen(event.id)}
      top={top}
    >
      {event.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <EvTags tags={event.tags} max={tagMax} />
        </div>
      )}
      <h3
        className={cx(
          'font-display leading-[0.96] [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]',
          'line-clamp-2',
          TITLE_SIZE[variant],
        )}
      >
        {event.title}
      </h3>
      <div className="flex flex-wrap items-center gap-1.5 text-[13px] font-semibold text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]">
        <Icon name="clock" size={13} />
        {formatTime(event.startsAt, event.timezone)}
        <span className="opacity-50">·</span>
        <Icon name="mappin" size={13} />
        <span className="truncate">{event.primaryLocationName ?? t('events.locationTba')}</span>
      </div>
      <div
        className={cx(
          'flex items-center justify-between gap-2.5 border-t border-white/15 pt-2.5',
          variant === 'spot' && 'flex-wrap',
        )}
      >
        <AvatarStack
          people={event.sampleAttendees}
          total={event.goingCount}
          max={variant === 'spot' ? 5 : 3}
          size={variant === 'spot' ? 32 : 26}
          onPoster
          label={<span className="text-white/90">{goingLabel}</span>}
        />
        {cta && (
          <span
            className={cx(
              'inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-extrabold',
              CTA_CLS[cta.cls],
            )}
          >
            {t(cta.key)}
            {variant === 'spot' && <Icon name="chevronR" size={15} />}
          </span>
        )}
      </div>
    </PosterCard>
  )
}

export function EventCardSkeleton({ variant = 'feed' }: { variant?: PosterVariant }) {
  const aspect =
    variant === 'rail'
      ? 'w-[248px] shrink-0 aspect-[3/4.2]'
      : variant === 'spot'
        ? 'aspect-[21/9] max-md:aspect-[4/4.6]'
        : 'aspect-[16/12] max-md:aspect-[4/4.4]'
  return <Skeleton className={cx('rounded-[22px]', aspect)} />
}
