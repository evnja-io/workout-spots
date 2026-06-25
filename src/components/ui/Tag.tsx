import type { ReactNode } from 'react'
import { cx } from './cx'

type TagProps = {
  /** Accent (violet) styling instead of the neutral grey. */
  accent?: boolean
  children: ReactNode
}

/** Small pill used in lists (ported from `.tag`). */
export function Tag({ accent, children }: TagProps) {
  return (
    <span
      className={cx(
        'rounded-full px-[7px] py-0.5 text-[10.5px] font-medium',
        accent ? 'bg-accent-soft text-accent' : 'bg-surface-2 text-text-2',
      )}
    >
      {children}
    </span>
  )
}

/** Larger chip used in the detail tag grid (ported from `.tag-chip`). */
export function TagChip({ accent, children }: TagProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-[8px] px-2.5 py-[5px] text-[12px] font-medium',
        accent ? 'bg-accent-soft text-accent' : 'bg-surface-2 text-text-2',
      )}
    >
      {children}
    </span>
  )
}
