import type { ButtonHTMLAttributes } from 'react'
import { cx } from './cx'

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost'
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ variant = 'primary', className, children, ...rest }: ButtonProps) {
  return (
    <button className={cx('btn', `btn-${variant}`, className)} {...rest}>
      {children}
    </button>
  )
}
