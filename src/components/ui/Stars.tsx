import { useState } from 'react'
import { cx } from './cx'

type StarsProps = {
  value: number
  size?: number
  interactive?: boolean
  onChange?: (v: number) => void
}

function StarSvg({ on, size }: { on: boolean; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={on ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
      className={on ? 'on' : undefined}
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

const baseStars = 'inline-flex gap-0.5 [&_svg]:size-3.5'

export function Stars({ value, size = 12, interactive = false, onChange }: StarsProps) {
  const [hover, setHover] = useState(0)

  if (!interactive) {
    return (
      <span className={cx(baseStars, 'text-[#f59e0b]')}>
        {Array.from({ length: 5 }, (_, idx) => {
          const i = idx + 1
          const on = i <= Math.round(value)
          return <StarSvg key={i} on={on} size={size} />
        })}
      </span>
    )
  }

  return (
    <span
      className={cx(
        baseStars,
        '[&_svg]:cursor-pointer [&_svg]:text-border-strong [&_svg]:transition-colors [&_svg]:duration-100 [&_.on]:text-[#f59e0b]',
      )}
    >
      {Array.from({ length: 5 }, (_, idx) => {
        const i = idx + 1
        const on = i <= (hover || value)
        return (
          <button
            key={i}
            type="button"
            aria-label={`Rate ${i}`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange?.(i)}
          >
            <StarSvg on={on} size={size} />
          </button>
        )
      })}
    </span>
  )
}
