import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import type { RsvpView } from '../eventState'

const primaryBtn =
  'inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-[13.5px] font-medium text-white transition-colors hover:bg-accent-2 disabled:opacity-50'
const subtleBtn =
  'inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2 text-[13px] font-medium text-text transition-colors hover:bg-surface-2 disabled:opacity-50'

const statusBox = 'flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium'

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
      <div className={cx(statusBox, 'bg-surface-2 text-text-3')}>
        <Icon name="clock" size={16} />
        {t('events.registrationClosed')}
      </div>
    )
  }

  if (view === 'going') {
    return (
      <div className="flex flex-col gap-2">
        <div className={cx(statusBox, 'bg-accent-soft text-accent')}>
          <Icon name="star" size={16} />
          <span className="flex flex-col">
            {t('events.youreGoing')}
            <span className="text-[12px] font-normal opacity-80">{t('events.seeYouThere')}</span>
          </span>
        </div>
        <button type="button" className={subtleBtn} disabled={pending} onClick={onCancel}>
          {t('events.cancelRsvp')}
        </button>
      </div>
    )
  }

  if (view === 'pending') {
    return (
      <div className="flex flex-col gap-2">
        <div className={cx(statusBox, 'bg-surface-2 text-text-2')}>
          <Icon name="clock" size={16} />
          {t('events.awaitingApproval')}
        </div>
        <button type="button" className={subtleBtn} disabled={pending} onClick={onCancel}>
          {t('events.withdrawRequest')}
        </button>
      </div>
    )
  }

  if (view === 'on-waitlist') {
    return (
      <div className="flex flex-col gap-2">
        <div className={cx(statusBox, 'bg-amber-500/15 text-amber-600')}>
          <Icon name="users" size={16} />
          {t('events.onWaitlist')}
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
    <div className="flex flex-col gap-2">
      {view === 'waitlist' && (
        <div className="flex items-center gap-1.5 text-[12px] text-text-3">
          <Icon name="clock" size={13} />
          {t('events.eventFull')}
        </div>
      )}
      <button type="button" className={primaryBtn} disabled={pending} onClick={onPrimary}>
        {primaryLabel}
      </button>
      <button
        type="button"
        className={cx(subtleBtn, interested && 'border-accent text-accent')}
        disabled={pending}
        onClick={onInterest}
      >
        <Icon name="heart" size={15} fill={interested ? 'currentColor' : 'none'} />
        {interested ? t('events.interested') : t('events.imInterested')}
      </button>
    </div>
  )
}
