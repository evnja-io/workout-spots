import type { ReactNode } from 'react'
import { cx } from './cx'

type RatingBadgeProps = {
  children: ReactNode
  className?: string
}

/**
 * Inline rating badge (ported from `.rating-badge`): bold value preceded by an
 * amber star/stars. The caller supplies the icon + value as children.
 */
export function RatingBadge({ children, className }: RatingBadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-[3px] text-[12px] font-semibold text-text [&_svg]:text-[#f59e0b]',
        className,
      )}
    >
      {children}
    </span>
  )
}
