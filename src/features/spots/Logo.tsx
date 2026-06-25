export interface LogoProps {
  size?: number
  className?: string
  title?: string
}

/**
 * The "spots" brand mark: a rising line (the climb / reps / progress) that
 * resolves into a dropped map pin — a chart and a marker in one gesture.
 * Self-colored with a rose→orange gradient, so it does not inherit `--accent`.
 */
export function Logo({ size = 36, className, title = 'Workout Spots' }: LogoProps) {
  // Unique-enough gradient id so multiple instances don't collide.
  const gradId = `spots-mark-${size}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="-2 2 132 112"
      className={className}
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#E11D48" />
          <stop offset="0.5" stopColor="#F4374F" />
          <stop offset="1" stopColor="#FB7A1E" />
        </linearGradient>
      </defs>
      <path
        d="M 8.71 100.24 L 24.95 63.15 L 55.05 31.85 L 72.14 49.96 L 103.05 19.05 L 112.95 28.95 L 71.86 70.04 L 54.95 52.15 L 35.05 72.85 Z"
        fill={`url(#${gradId})`}
        stroke={`url(#${gradId})`}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="108" cy="24" r="13.5" fill={`url(#${gradId})`} />
    </svg>
  )
}
