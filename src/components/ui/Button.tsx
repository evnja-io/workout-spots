import type { ButtonHTMLAttributes } from 'react'
import { cx } from './cx'

type Variant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = {
  variant?: Variant
} & ButtonHTMLAttributes<HTMLButtonElement>

const base =
  'inline-flex items-center justify-center gap-1.5 rounded-[10px] px-3.5 py-2.5 text-[13px] font-medium transition-[background-color,border-color,color,opacity] duration-150'

const variants: Record<Variant, string> = {
  primary:
    'flex-1 bg-accent text-accent-fg hover:bg-accent-2 disabled:opacity-[0.45] disabled:cursor-not-allowed',
  secondary:
    'border border-border-strong bg-surface-2 text-text hover:bg-surface hover:border-accent hover:text-accent',
  ghost: 'text-text-2 hover:bg-surface-2',
}

export function Button({ variant = 'primary', className, children, ...rest }: ButtonProps) {
  return (
    <button data-variant={variant} className={cx(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  )
}
