import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  TextareaHTMLAttributes,
  HTMLAttributes,
} from 'react'
import { cx } from './cx'

const control =
  'w-full rounded-[10px] border bg-surface px-3 py-2.5 text-[14px] transition-[border-color,box-shadow] duration-150 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-softer)]'

type WithError = { error?: boolean }

export function FieldLabel({ className, ...rest }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cx('mb-1.5 block text-[12px] font-semibold text-text-2', className)} {...rest} />
  )
}

export function FieldHint({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx('mt-1 text-[12px] text-text-3', className)} {...rest} />
}

export function Input({
  className,
  error,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & WithError) {
  return (
    <input
      className={cx(control, error ? 'border-[#dc2626]' : 'border-border-strong', className)}
      {...rest}
    />
  )
}

export function Textarea({
  className,
  error,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & WithError) {
  return (
    <textarea
      className={cx(
        control,
        'min-h-[90px] resize-y',
        error ? 'border-[#dc2626]' : 'border-border-strong',
        className,
      )}
      {...rest}
    />
  )
}
