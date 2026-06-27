import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { ImageWithShimmer } from '~/components/ui/ImageWithShimmer'
import { cx } from '~/components/ui/cx'
import type { EventDetail as EventDetailType, EventImage, EventLocation } from '../domain'
import { formatEventDate, formatEventTimeRange, formatTime, resolveRsvpView } from '../eventState'
import { useCancelRsvp, useRsvp, useSetInterest } from '../mutations'
import { coverGradient } from './visuals'
import { EvTags, PriceBadge, StatusBadge } from './badges'
import { CapacityMeter } from './CapacityMeter'
import { RSVPControl } from './RSVPControl'

export function EventDetail({
  event,
  onBack,
  onOpenSpot,
}: {
  event: EventDetailType
  onBack: () => void
  onOpenSpot: (spotId: string) => void
}) {
  const { t } = useTranslation()
  const [lightbox, setLightbox] = useState<number | null>(null)

  const view = resolveRsvpView(
    {
      status: event.status,
      registrationDeadline: event.registrationDeadline,
      requiresApproval: event.requiresApproval,
      maxParticipants: event.maxParticipants,
      goingCount: event.goingCount,
    },
    { type: event.viewerType, status: event.viewerStatus },
  )
  const interested = event.viewerType === 'interested'

  const rsvp = useRsvp(event.id)
  const setInterest = useSetInterest(event.id)
  const cancel = useCancelRsvp(event.id)
  const pending = rsvp.pending || setInterest.pending || cancel.pending

  const rsvpCard = (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
      <PriceBlock isFree={event.isFree} amount={event.priceAmount} currency={event.priceCurrency} />
      <CapacityMeter
        goingCount={event.goingCount}
        maxParticipants={event.maxParticipants}
        minParticipants={event.minParticipants}
      />
      {event.registrationDeadline && view !== 'closed' && (
        <div className="flex items-center gap-1.5 text-[12px] text-text-4">
          <Icon name="clock" size={13} />
          {t('events.deadline', {
            date: formatEventDate(event.registrationDeadline, event.timezone),
            time: formatTime(event.registrationDeadline, event.timezone),
          })}
        </div>
      )}
      <div className="h-px bg-border" />
      <RSVPControl
        view={view}
        interested={interested}
        pending={pending}
        onPrimary={rsvp.rsvp}
        onCancel={cancel.cancel}
        onInterest={setInterest.setInterest}
      />
    </div>
  )

  return (
    <div className="pb-24 md:pb-8">
      {/* Cover */}
      <div
        className="relative h-52 text-white md:h-64"
        style={event.featuredImageUrl ? undefined : { backgroundImage: coverGradient(event.id) }}
      >
        {event.featuredImageUrl && (
          <>
            <div className="absolute inset-0">
              <ImageWithShimmer src={event.featuredImageUrl} alt="" className="h-full w-full" />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25),rgba(0,0,0,0.6))]" />
          </>
        )}
        <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col justify-between p-4 md:p-6">
          <div>
            <button
              type="button"
              onClick={onBack}
              aria-label={t('events.backToEvents')}
              className="grid size-9 place-items-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
            >
              <Icon name="chevronL" size={18} />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <StatusBadge status={event.status} onCover />
              <PriceBadge
                isFree={event.isFree}
                amount={event.priceAmount}
                currency={event.priceCurrency}
                onCover
              />
            </div>
            <h1 className="mt-2 text-[26px] font-semibold leading-tight md:text-[30px]">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 md:grid-cols-[1fr_320px]">
        <div className="flex min-w-0 flex-col gap-6">
          {event.status === 'cancelled' && event.cancellationReason && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-[13px] text-red-500">
              <strong>{t('events.cancelled')}</strong> — {event.cancellationReason}
            </div>
          )}

          <WhenBlock startsAt={event.startsAt} endsAt={event.endsAt} timezone={event.timezone} />

          {event.description && (
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-text-2">
              {event.description}
            </p>
          )}

          <Section title={t('events.locations')}>
            <div className="flex flex-col gap-2">
              {event.locations.map((loc) => (
                <LocationRow key={loc.id} location={loc} onOpen={() => onOpenSpot(loc.id)} />
              ))}
            </div>
          </Section>

          <Section title={t('events.organizer')}>
            <OrganizerRow
              name={event.organizerName || event.clubName || t('events.organizerUnknown')}
              detail={event.clubName || event.organizerContact}
            />
          </Section>

          {event.images.length > 0 && (
            <Section title={t('events.gallery')}>
              <Gallery images={event.images} onOpen={setLightbox} />
            </Section>
          )}

          {event.tags.length > 0 && (
            <Section title={t('events.tags')}>
              <div className="flex flex-wrap gap-1.5">
                <EvTags tags={event.tags} />
              </div>
            </Section>
          )}
        </div>

        <aside className="hidden md:block">
          <div className="sticky top-4">{rsvpCard}</div>
        </aside>
      </div>

      {/* Mobile sticky RSVP bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface p-3 pb-[calc(12px+env(safe-area-inset-bottom))] md:hidden">
        <RSVPControl
          view={view}
          interested={interested}
          pending={pending}
          onPrimary={rsvp.rsvp}
          onCancel={cancel.cancel}
          onInterest={setInterest.setInterest}
        />
      </div>

      {lightbox != null && (
        <Lightbox
          images={event.images}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNav={(d) =>
            setLightbox((i) =>
              i == null ? i : (i + d + event.images.length) % event.images.length,
            )
          }
        />
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2.5 text-[13px] font-semibold uppercase tracking-[0.04em] text-text-4">
        {title}
      </h2>
      {children}
    </section>
  )
}

function WhenBlock({
  startsAt,
  endsAt,
  timezone,
}: {
  startsAt: string
  endsAt: string
  timezone: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3.5">
      <div className="grid size-12 place-items-center rounded-lg bg-accent-soft text-accent">
        <Icon name="clock" size={22} />
      </div>
      <div>
        <div className="text-[15px] font-semibold text-text">
          {formatEventDate(startsAt, timezone)}
        </div>
        <div className="text-[13px] text-text-3">
          {formatEventTimeRange(startsAt, endsAt, timezone)} · {timezone}
        </div>
      </div>
    </div>
  )
}

function LocationRow({ location, onOpen }: { location: EventLocation; onOpen: () => void }) {
  const { t } = useTranslation()
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cx(
        'flex items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-surface-2',
        location.isPrimary ? 'border-accent-soft' : 'border-border',
      )}
    >
      <Icon name="mappin" size={16} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-medium text-text">{location.name}</span>
          {location.isPrimary && (
            <span className="rounded-full bg-accent-soft px-1.5 py-0.5 text-[10px] font-medium text-accent">
              {t('events.primary')}
            </span>
          )}
        </div>
        {location.address && <div className="text-[12.5px] text-text-3">{location.address}</div>}
        {location.notes && <div className="mt-1 text-[12.5px] text-text-2">{location.notes}</div>}
      </div>
      <Icon name="chevronR" size={18} />
    </button>
  )
}

function OrganizerRow({ name, detail }: { name: string; detail: string | null }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <div className="grid size-10 place-items-center rounded-full bg-accent-soft text-accent">
        <Icon name="user" size={18} />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wide text-text-4">
          {t('events.hostedBy')}
        </div>
        <div className="text-[14px] font-medium text-text">{name}</div>
        {detail && <div className="text-[12.5px] text-text-3">{detail}</div>}
      </div>
    </div>
  )
}

function PriceBlock({
  isFree,
  amount,
  currency,
}: {
  isFree: boolean
  amount: number | null
  currency: string
}) {
  const { t } = useTranslation()
  const sym = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : `${currency} `
  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-[20px] font-bold text-text">
        {isFree ? t('events.free') : `${sym}${amount ?? 0}`}
        {!isFree && (
          <span className="ml-1 text-[12px] font-normal text-text-3">{t('events.perPerson')}</span>
        )}
      </div>
      {!isFree && (
        <div className="flex items-start gap-1.5 rounded-lg bg-surface-2 px-2.5 py-2 text-[12px] text-text-3">
          <Icon name="flag" size={13} />
          <span>{t('events.payNote')}</span>
        </div>
      )}
    </div>
  )
}

function Gallery({ images, onOpen }: { images: EventImage[]; onOpen: (i: number) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {images.map((img, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onOpen(i)}
          className="aspect-square overflow-hidden rounded-lg bg-surface-2"
        >
          <img src={img.imageUrl} alt={img.caption ?? ''} className="h-full w-full object-cover" />
        </button>
      ))}
    </div>
  )
}

function Lightbox({
  images,
  index,
  onClose,
  onNav,
}: {
  images: EventImage[]
  index: number
  onClose: () => void
  onNav: (d: number) => void
}) {
  const img = images[index]
  if (!img) return null
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button className="absolute right-4 top-4 text-white" onClick={onClose} aria-label="Close">
        <Icon name="close" size={22} />
      </button>
      {images.length > 1 && (
        <button
          className="absolute left-4 text-white"
          onClick={(e) => {
            e.stopPropagation()
            onNav(-1)
          }}
          aria-label="Previous"
        >
          <Icon name="chevronL" size={26} />
        </button>
      )}
      <img
        src={img.imageUrl}
        alt={img.caption ?? ''}
        className="max-h-[80vh] max-w-full rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      {images.length > 1 && (
        <button
          className="absolute right-4 text-white"
          onClick={(e) => {
            e.stopPropagation()
            onNav(1)
          }}
          aria-label="Next"
        >
          <Icon name="chevronR" size={26} />
        </button>
      )}
    </div>
  )
}
