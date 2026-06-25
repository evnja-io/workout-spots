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
      className={cx(
        'relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-150',
        on ? 'bg-accent' : 'bg-border-strong',
      )}
      onClick={() => onChange(!on)}
    >
      <span
        className={cx(
          'absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-200',
          on && 'translate-x-4',
        )}
      />
    </button>
  )
}
