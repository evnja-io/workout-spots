import type { ReactNode } from 'react'
import { cx } from './cx'

type ChipProps = {
  active?: boolean
  onClick?: () => void
  children: ReactNode
}

const base =
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-[5px] text-[12px] font-normal transition-all duration-150'

export function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      data-active={active || undefined}
      className={cx(
        base,
        active
          ? 'border-accent bg-accent text-white hover:border-accent-2 hover:bg-accent-2'
          : 'border-border-strong bg-surface text-text-2 hover:border-accent hover:text-accent',
      )}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
