import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import type { RsvpView } from '../eventState'

const primaryBtn =
  'inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-hot px-4 py-3 text-[14px] font-bold text-white shadow-[0_6px_20px_-6px_rgba(244,55,79,0.6)] transition-[filter,transform] hover:brightness-105 active:translate-y-px disabled:opacity-50'
const subtleBtn =
  'inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2 text-[13px] font-semibold text-text transition-colors hover:bg-surface-2 disabled:opacity-50'

// Status pill: an icon tile + a two-line label.
const statusBox = 'flex items-center gap-2.5 rounded-[15px] px-3.5 py-3 text-[14px] font-bold'
const iconTile = 'grid size-[34px] shrink-0 place-items-center rounded-[11px]'

export function RSVPControl({
  view,
  interested,
  pending,
  onPrimary,
  onCancel,
  onInterest,
}: {
  view: RsvpView
  interested: boolean
  pending: boolean
  onPrimary: () => void
  onCancel: () => void
  onInterest: () => void
}) {
  const { t } = useTranslation()

  if (view === 'closed') {
    return (
      <div className="inline-flex w-full items-center justify-center gap-1.5 text-[13px] font-semibold text-text-3">
        <Icon name="lock" size={14} />
        {t('events.registrationClosed')}
      </div>
    )
  }

  if (view === 'going') {
    return (
      <div className="flex flex-col gap-2.5">
        <div className={cx(statusBox, 'bg-hot-soft text-accent')}>
          <span className={cx(iconTile, 'bg-hot text-white')}>
            <Icon name="check" size={17} />
          </span>
          <span className="flex flex-col leading-tight">
            {t('events.youreGoing')}
            <span className="text-[12px] font-medium text-text-3">{t('events.seeYouThere')}</span>
          </span>
        </div>
        <button type="button" className={subtleBtn} disabled={pending} onClick={onCancel}>
          <Icon name="close" size={14} />
          {t('events.cancelRsvp')}
        </button>
      </div>
    )
  }

  if (view === 'pending') {
    return (
      <div className="flex flex-col gap-2.5">
        <div className={cx(statusBox, 'bg-amber-500/15 text-amber-600')}>
          <span className={cx(iconTile, 'bg-amber-500 text-white')}>
            <Icon name="clock" size={17} />
          </span>
          <span className="flex flex-col leading-tight">
            {t('events.awaitingApproval')}
            <span className="text-[12px] font-medium text-text-3">
              {t('events.awaitingApprovalSub')}
            </span>
          </span>
        </div>
        <button type="button" className={subtleBtn} disabled={pending} onClick={onCancel}>
          {t('events.withdrawRequest')}
        </button>
      </div>
    )
  }

  if (view === 'on-waitlist') {
    return (
      <div className="flex flex-col gap-2.5">
        <div className={cx(statusBox, 'bg-indigo-500/15 text-indigo-500')}>
          <span className={cx(iconTile, 'bg-indigo-500 text-white')}>
            <Icon name="users" size={17} />
          </span>
          <span className="flex flex-col leading-tight">
            {t('events.onWaitlist')}
            <span className="text-[12px] font-medium text-text-3">{t('events.onWaitlistSub')}</span>
          </span>
        </div>
        <button type="button" className={subtleBtn} disabled={pending} onClick={onCancel}>
          {t('events.leaveWaitlist')}
        </button>
      </div>
    )
  }

  // Join-type actions (participate / request / waitlist)
  const primaryLabel =
    view === 'request'
      ? t('events.requestToJoin')
      : view === 'waitlist'
        ? t('events.joinWaitlist')
        : t('events.participate')

  return (
    <div className="flex flex-col gap-2.5">
      {view === 'waitlist' && (
        <div className="inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold text-text-3">
          <Icon name="info" size={13} />
          {t('events.eventFull')}
        </div>
      )}
      <button type="button" className={primaryBtn} disabled={pending} onClick={onPrimary}>
        <Icon
          name={view === 'request' ? 'userPlus' : view === 'waitlist' ? 'clock' : 'check'}
          size={15}
        />
        {primaryLabel}
      </button>
      <button
        type="button"
        className={cx(subtleBtn, interested && 'border-accent bg-accent-soft text-accent')}
        disabled={pending}
        onClick={onInterest}
      >
        <Icon name="heart" size={15} fill={interested ? 'currentColor' : 'none'} />
        {interested ? t('events.interested') : t('events.imInterested')}
      </button>
    </div>
  )
}
