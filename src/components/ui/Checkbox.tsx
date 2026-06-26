import type { InputHTMLAttributes, ReactNode } from 'react'
import { cx } from './cx'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> & {
  /** Label content rendered next to the box (supports inline links). */
  children: ReactNode
}

/**
 * Accessible checkbox with an inline label. Used for consent rows on the
 * sign-in form. (The `Switch` toggle is meant for settings, not form consent.)
 */
export function Checkbox({ className, children, id, ...rest }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-[1.5] text-text-2"
    >
      <input
        id={id}
        type="checkbox"
        className={cx(
          'mt-0.5 size-4 shrink-0 cursor-pointer accent-[var(--accent)]',
          className,
        )}
        {...rest}
      />
      <span>{children}</span>
    </label>
  )
}
