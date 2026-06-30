import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActionMenu, type ActionItem } from '~/components/ui/ActionMenu'
import { Icon, type IconName } from '~/components/ui/Icon'
import { ImageWithShimmer } from '~/components/ui/ImageWithShimmer'
import { Lightbox } from '~/components/ui/Lightbox'
import { cx } from '~/components/ui/cx'
import { cdnImageUrl } from '~/lib/cdn/images'
import type {
  EventDetail as EventDetailType,
  EventImage,
  EventLocation,
  EventVisibility,
} from '../domain'
import {
  dayParts,
  formatEventDate,
  formatEventTimeRange,
  formatTime,
  resolveRsvpView,
} from '../eventState'
import { useCancelRsvp, useRsvp, useSetInterest } from '../mutations'
import { coverGradient } from './visuals'
import { EvTags, StatusBadge } from './badges'
import { CapacityMeter } from './CapacityMeter'
import { RSVPControl } from './RSVPControl'
import { EventFeed } from './EventFeed'

const VIS_ICON: Record<EventVisibility, 'globe' | 'lock' | 'users'> = {
  public: 'globe',
  private: 'lock',
  club_only: 'users',
}

export function EventDetail({
  event,
  onBack,
  onOpenSpot,
  onManage,
}: {
  event: EventDetailType
  onBack: () => void
  onOpenSpot: (spotId: string) => void
  /** Provided only to the organiser; renders the Manage entry. */
  onManage?: () => void
}) {
  const { t } = useTranslation()
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [tab, setTab] = useState<'overview' | 'feed'>('overview')
  const canCompose = event.viewerType === 'participating' && event.viewerStatus === 'approved'

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
    <div className="flex flex-col gap-4 rounded-[22px] border border-border bg-surface p-5 shadow-[var(--shadow-md)]">
      <PriceBlock isFree={event.isFree} amount={event.priceAmount} currency={event.priceCurrency} />
      <CapacityMeter
        goingCount={event.goingCount}
        maxParticipants={event.maxParticipants}
        minParticipants={event.minParticipants}
      />
      {event.registrationDeadline && view !== 'closed' && (
        <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-text-3">
          <Icon name="clock" size={13} />
          {t('events.deadline', {
            date: formatEventDate(event.registrationDeadline, event.timezone),
            time: formatTime(event.registrationDeadline, event.timezone),
          })}
        </div>
      )}
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

  const { day, month } = dayParts(event.startsAt, event.timezone)

  // Mobile: secondary actions (manage / cancel / interest) live in the hero "⋮"
  // sheet; the primary RSVP action is a prominent hero button. Mirrors RSVPControl.
  const joinable = view === 'participate' || view === 'request' || view === 'waitlist'
  const menuItems: ActionItem[] = []
  if (onManage) menuItems.push({ icon: 'settings', label: t('events.manage'), onClick: onManage })
  if (view === 'going')
    menuItems.push({ icon: 'close', label: t('events.cancelRsvp'), danger: true, onClick: cancel.cancel })
  if (view === 'pending')
    menuItems.push({
      icon: 'close',
      label: t('events.withdrawRequest'),
      danger: true,
      onClick: cancel.cancel,
    })
  if (view === 'on-waitlist')
    menuItems.push({
      icon: 'close',
      label: t('events.leaveWaitlist'),
      danger: true,
      onClick: cancel.cancel,
    })
  if (joinable)
    menuItems.push({
      icon: 'heart',
      label: interested ? t('events.interested') : t('events.imInterested'),
      onClick: setInterest.setInterest,
    })

  const heroCta = joinable
    ? {
        label:
          view === 'request'
            ? t('events.requestToJoin')
            : view === 'waitlist'
              ? t('events.joinWaitlist')
              : t('events.participate'),
        icon: (view === 'request' ? 'userPlus' : view === 'waitlist' ? 'clock' : 'check') as IconName,
      }
    : null

  return (
    <div className="md:pb-8">
      {/* Immersive hero */}
      <div className="relative flex min-h-[380px] flex-col md:min-h-[460px]">
        {event.featuredImageUrl ? (
          <div className="absolute inset-0 z-0">
            <ImageWithShimmer src={event.featuredImageUrl} alt="" className="h-full w-full" />
          </div>
        ) : (
          <div
            className="absolute inset-0 z-0"
            style={{ backgroundImage: coverGradient(event.id) }}
          />
        )}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(178deg,rgba(8,3,12,0.45)_0%,rgba(8,3,12,0.05)_26%,rgba(8,3,12,0.55)_70%,rgba(8,3,12,0.92)_100%)]" />

        <div className="relative z-[2] flex items-start justify-between gap-2.5 p-4 md:px-7 md:py-[18px]">
          <button
            type="button"
            onClick={onBack}
            aria-label={t('events.backToEvents')}
            className="grid size-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <Icon name="chevronL" size={18} />
          </button>
          <div className="flex items-center gap-2">
            <StatusBadge status={event.status} onCover />
            {onManage && (
              <button
                type="button"
                onClick={onManage}
                className="hidden items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3.5 py-2 text-[13px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/25 md:inline-flex"
              >
                <Icon name="settings" size={15} />
                {t('events.manage')}
              </button>
            )}
            <ActionMenu
              className="md:hidden"
              triggerLabel="Event options"
              title={event.title}
              items={menuItems}
            />
          </div>
        </div>

        <div className="relative z-[2] mx-auto mt-auto w-full max-w-6xl px-4 pb-[22px] pt-6 text-white md:px-7 md:pb-7">
          {event.tags.length > 0 && (
            <div className="mb-3.5 flex flex-wrap gap-1.5">
              <EvTags tags={event.tags} max={4} />
            </div>
          )}
          <h1 className="max-w-[16ch] font-display text-[clamp(40px,6.4vw,86px)] leading-[0.9] tracking-[0.008em] [text-shadow:0_3px_26px_rgba(0,0,0,0.5)]">
            {event.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 text-[15px] font-bold [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] max-md:text-[13px]">
              <span className="grid size-9 place-items-center rounded-[12px] bg-hot text-white">
                <span className="flex flex-col items-center leading-none">
                  <span className="text-[8px] font-extrabold uppercase">{month}</span>
                  <span className="font-display text-[15px]">{day}</span>
                </span>
              </span>
              {formatEventDate(event.startsAt, event.timezone)} ·{' '}
              {formatEventTimeRange(event.startsAt, event.endsAt, event.timezone)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-white/85">
              <Icon name={VIS_ICON[event.visibility]} size={14} />
              {t(`events.visibility_${event.visibility}`)}
            </span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/40 px-4 py-2.5 backdrop-blur-sm">
              <Icon name="users" size={16} />
              <span className="text-[13.5px] font-semibold">
                <b className="font-extrabold">{event.goingCount}</b> {t('events.going')}
              </span>
            </div>
            {/* Mobile primary CTA — desktop uses the aside RSVP card. */}
            {heroCta && (
              <button
                type="button"
                onClick={rsvp.rsvp}
                disabled={pending}
                className="inline-flex items-center gap-1.5 rounded-full bg-hot px-5 py-3 text-[14px] font-bold text-white shadow-[0_6px_20px_-6px_rgba(244,55,79,0.6)] transition-[filter,transform] hover:brightness-105 active:translate-y-px disabled:opacity-50 md:hidden"
              >
                <Icon name={heroCta.icon} size={16} />
                {heroCta.label}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto grid max-w-6xl gap-7 px-5 py-6 md:grid-cols-[minmax(0,1fr)_320px] md:px-7">
        <div className="flex min-w-0 flex-col gap-6">
          {event.status === 'cancelled' && event.cancellationReason && (
            <div className="flex items-start gap-3 rounded-[18px] border border-red-500/30 bg-red-500/10 px-4 py-3.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-red-600 text-white">
                <Icon name="info" size={18} />
              </span>
              <div>
                <h4 className="text-[15px] font-extrabold text-red-600">{t('events.cancelled')}</h4>
                <p className="mt-1 text-[13.5px] leading-snug text-text-2">
                  {event.cancellationReason}
                </p>
              </div>
            </div>
          )}

          <WhenBlock startsAt={event.startsAt} endsAt={event.endsAt} timezone={event.timezone} />

          <div className="flex gap-1 border-b border-border">
            <TabButton
              active={tab === 'overview'}
              label={t('events.tabOverview')}
              onClick={() => setTab('overview')}
            />
            <TabButton
              active={tab === 'feed'}
              label={t('events.tabFeed')}
              onClick={() => setTab('feed')}
            />
          </div>

          {tab === 'feed' ? (
            <EventFeed eventId={event.id} canCompose={canCompose} />
          ) : (
            <div className="flex flex-col gap-6">
              {event.description && (
                <p className="whitespace-pre-line text-[15.5px] leading-relaxed text-text-2">
                  {event.description}
                </p>
              )}

              <Section title={t('events.locations')}>
                <div className="flex flex-col gap-3">
                  {event.locations.map((loc, i) => (
                    <LocationRow
                      key={loc.id}
                      location={loc}
                      index={i + 1}
                      onOpen={() => onOpenSpot(loc.id)}
                    />
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
                    <EvTags tags={event.tags} surface />
                  </div>
                </Section>
              )}
            </div>
          )}
        </div>

        <aside className="hidden md:block">
          <div className="sticky top-4">{rsvpCard}</div>
        </aside>
      </div>

      {lightbox != null && (
        <Lightbox
          images={event.images.map((img) => ({ url: img.imageUrl, caption: img.caption }))}
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

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        '-mb-px border-b-2 px-3 py-2.5 text-[14px] font-bold transition-colors',
        active ? 'border-accent text-accent' : 'border-transparent text-text-3 hover:text-text',
      )}
    >
      {label}
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3.5 font-display text-[16px] uppercase tracking-[0.03em] text-text">
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
  const { day, month } = dayParts(startsAt, timezone)
  return (
    <div className="flex items-center gap-4 rounded-[18px] border border-border bg-surface p-4">
      <div className="w-[60px] shrink-0 overflow-hidden rounded-[14px] bg-hot py-2 text-center text-white shadow-[0_8px_20px_-8px_rgba(244,55,79,0.7)]">
        <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] opacity-90">
          {month}
        </div>
        <div className="font-display text-[28px] leading-none">{day}</div>
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="text-[16px] font-extrabold tracking-[-0.01em] text-text">
          {formatEventDate(startsAt, timezone)}
        </div>
        <div className="text-[14px] font-semibold text-text-2">
          {formatEventTimeRange(startsAt, endsAt, timezone)}
        </div>
        <div className="inline-flex items-center gap-1.5 text-[12.5px] text-text-3">
          <Icon name="globe" size={12} />
          {timezone}
        </div>
      </div>
    </div>
  )
}

function LocationRow({
  location,
  index,
  onOpen,
}: {
  location: EventLocation
  index: number
  onOpen: () => void
}) {
  const { t } = useTranslation()
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cx(
        'group/loc flex items-center gap-3.5 rounded-[16px] border p-3.5 text-left transition-[border-color,transform] hover:translate-x-0.5 hover:border-accent',
        location.isPrimary ? 'border-accent-soft' : 'border-border',
      )}
    >
      <span
        className={cx(
          'grid size-7 shrink-0 place-items-center rounded-[9px] text-[13px] font-extrabold',
          location.isPrimary ? 'bg-hot text-white' : 'bg-surface-2 text-text-3',
        )}
      >
        {location.isPrimary ? <Icon name="mappin" size={15} /> : index}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[15px] font-extrabold tracking-[-0.01em] text-text">
            {location.name}
          </span>
          {location.isPrimary && (
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-accent">
              {t('events.primary')}
            </span>
          )}
        </div>
        {location.address && (
          <div className="mt-0.5 inline-flex items-center gap-1.5 text-[12.5px] text-text-3">
            <Icon name="mappin" size={12} />
            {location.address}
          </div>
        )}
        {location.notes && (
          <div className="mt-2 border-l-2 border-accent pl-3 text-[13px] leading-snug text-text-2">
            {location.notes}
          </div>
        )}
      </div>
      <Icon name="chevronR" size={18} />
    </button>
  )
}

function OrganizerRow({ name, detail }: { name: string; detail: string | null }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-3.5 rounded-[18px] border border-border bg-surface p-4">
      <div className="grid size-10 place-items-center rounded-full bg-hot text-white">
        <Icon name="user" size={18} />
      </div>
      <div className="min-w-0">
        <div className="text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-text-4">
          {t('events.hostedBy')}
        </div>
        <div className="text-[16px] font-extrabold text-text">{name}</div>
        {detail && <div className="text-[13px] text-text-3">{detail}</div>}
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
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2">
        <span
          className={cx(
            'font-display text-[40px] leading-[0.85]',
            isFree ? 'text-hot' : 'text-text',
          )}
        >
          {isFree ? t('events.free') : `${sym}${amount ?? 0}`}
        </span>
        {!isFree && (
          <span className="text-[13px] font-semibold text-text-3">{t('events.perPerson')}</span>
        )}
      </div>
      {!isFree && (
        <div className="flex items-start gap-2 rounded-[12px] bg-surface-2 px-3 py-2.5 text-[12px] leading-snug text-text-3">
          <Icon name="info" size={14} />
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
          className="aspect-square overflow-hidden rounded-[14px] bg-surface-2 transition-transform hover:scale-[1.03]"
        >
          <img
            src={cdnImageUrl(img.imageUrl)}
            alt={img.caption ?? ''}
            className="h-full w-full object-cover"
          />
        </button>
      ))}
    </div>
  )
}
