import { useState } from 'react'
import { Icon, type IconName } from './Icon'
import { cx } from './cx'
import { Sheet } from './Sheet'

export type ActionItem = {
  icon?: IconName
  label: string
  onClick: () => void
  /** Renders the row in red for destructive/leave actions. */
  danger?: boolean
}

const trigger =
  'grid size-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60'
const row =
  'flex w-full items-center gap-3 rounded-[10px] px-3 py-3 text-left text-[14.5px] font-semibold text-text transition-colors duration-150 hover:bg-surface-2'

/**
 * Kebab ("⋮") button that opens an animated bottom action sheet (reuses `Sheet`,
 * so it gets spring open + swipe-to-dismiss for free). Renders nothing when there
 * are no items — callers can pass a state-dependent list without guarding.
 */
export function ActionMenu({
  items,
  triggerLabel,
  title,
  className,
}: {
  items: ActionItem[]
  triggerLabel: string
  title?: string
  /** Extra classes on the trigger button (e.g. `md:hidden`). */
  className?: string
}) {
  const [open, setOpen] = useState(false)
  if (items.length === 0) return null

  return (
    <>
      <button
        type="button"
        aria-label={triggerLabel}
        onClick={() => setOpen(true)}
        className={cx(trigger, className)}
      >
        <Icon name="moreVertical" size={20} fill="currentColor" />
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title={title}>
        <div className="flex flex-col px-3 pb-4">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className={cx(row, item.danger && 'text-red-500 hover:bg-red-500/10')}
              onClick={() => {
                setOpen(false)
                item.onClick()
              }}
            >
              {item.icon && <Icon name={item.icon} size={18} />}
              {item.label}
            </button>
          ))}
        </div>
      </Sheet>
    </>
  )
}
