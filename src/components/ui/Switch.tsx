import { cx } from './cx'

type SwitchProps = {
  on: boolean
  onChange: (v: boolean) => void
  label?: string
}

export function Switch({ on, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={cx('switch', on && 'on')}
      onClick={() => onChange(!on)}
    />
  )
}
