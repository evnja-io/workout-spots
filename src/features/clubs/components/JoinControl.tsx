import { Icon, type IconName } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import type { ClubViewerState } from '../membership'

const base =
  'inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-colors disabled:opacity-60'
const variants = {
  primary: 'bg-accent text-white hover:bg-accent-2',
  outline: 'border border-border text-text hover:bg-surface-2',
  ghost: 'text-text-3 hover:text-text',
} as const

function Btn({
  variant,
  icon,
  label,
  pending,
  onClick,
}: {
  variant: keyof typeof variants
  icon?: IconName
  label: string
  pending?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      className={cx(base, variants[variant])}
      disabled={pending}
      onClick={onClick}
    >
      {icon && <Icon name={icon} size={15} />}
      {label}
    </button>
  )
}

type JoinControlProps = {
  state: ClubViewerState
  joinPending: boolean
  leavePending: boolean
  onJoin: () => void
  onLeave: () => void
  /** Omitted until the management surface exists; the Manage button is hidden when absent. */
  onManage?: () => void
}

export function JoinControl({
  state,
  joinPending,
  leavePending,
  onJoin,
  onLeave,
  onManage,
}: JoinControlProps) {
  const { primaryAction, canManage } = state
  return (
    <div className="flex flex-col gap-2">
      {canManage && onManage && (
        <Btn variant="primary" icon="settings" label="Manage club" onClick={onManage} />
      )}

      {primaryAction === 'join' && (
        <Btn
          variant="primary"
          icon="plus"
          label="Join club"
          pending={joinPending}
          onClick={onJoin}
        />
      )}
      {primaryAction === 'request' && (
        <Btn
          variant="primary"
          icon="plus"
          label="Request to join"
          pending={joinPending}
          onClick={onJoin}
        />
      )}
      {primaryAction === 'cancel' && (
        <>
          <div className="flex items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2 text-[13px] font-medium text-text-3">
            <Icon name="clock" size={15} />
            Request pending
          </div>
          <Btn variant="ghost" label="Cancel request" pending={leavePending} onClick={onLeave} />
        </>
      )}
      {primaryAction === 'leave' && (
        <Btn variant="outline" label="Leave club" pending={leavePending} onClick={onLeave} />
      )}
      {primaryAction === 'owned' && (
        <div className="flex items-center justify-center gap-1.5 rounded-full bg-accent-soft px-4 py-2 text-[13px] font-medium text-accent">
          <Icon name="star" size={15} />
          You own this club
        </div>
      )}
    </div>
  )
}
