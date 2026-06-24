import type { ReactNode } from 'react'
import { cx } from './cx'

type ChipProps = {
  active?: boolean
  onClick?: () => void
  children: ReactNode
}

export function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      className={cx('chip', active && 'active')}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
