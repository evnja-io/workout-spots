import type { ReactNode } from 'react'
import { Avatar } from './Avatar'
import { cx } from './cx'

export type StackPerson = { id: string; name: string; avatarUrl?: string | null }

type AvatarStackProps = {
  people: StackPerson[]
  /** Total count the stack represents (for the "+N" overflow); defaults to people.length. */
  total?: number
  /** Max avatars to render before collapsing into "+N". */
  max?: number
  size?: number
  /** White ring for placement over a poster/scrim; otherwise a surface-colored ring. */
  onPoster?: boolean
  /** Optional trailing label (e.g. "12 going"). */
  label?: ReactNode
  className?: string
}

/**
 * Overlapping row of avatars with an optional "+N" overflow bubble and trailing
 * label. Powers the event "friend stacks" and club "member stacks".
 */
export function AvatarStack({
  people,
  total,
  max = 3,
  size = 26,
  onPoster = false,
  label,
  className,
}: AvatarStackProps) {
  const shown = people.slice(0, max)
  const count = total ?? people.length
  const extra = Math.max(0, count - shown.length)
  const ring = onPoster ? 'ring-white/90' : 'ring-surface'
  const overlap = -Math.round(size * 0.32)

  return (
    <div className={cx('flex items-center gap-2', className)}>
      {shown.length > 0 && (
        <div className="flex items-center">
          {shown.map((p, i) => (
            <Avatar
              key={p.id}
              name={p.name}
              avatarUrl={p.avatarUrl}
              size={size}
              className={cx('ring-2', ring)}
              style={i === 0 ? undefined : { marginLeft: overlap }}
            />
          ))}
          {extra > 0 && (
            <div
              className={cx(
                'grid shrink-0 place-items-center rounded-full font-bold ring-2',
                ring,
                onPoster ? 'bg-black/70 text-white backdrop-blur-sm' : 'bg-surface-2 text-text-2',
              )}
              style={{
                width: size,
                height: size,
                fontSize: Math.round(size * 0.4),
                marginLeft: overlap,
              }}
            >
              +{extra}
            </div>
          )}
        </div>
      )}
      {label != null && (
        <span className="min-w-0 truncate text-[12.5px] font-semibold">{label}</span>
      )}
    </div>
  )
}
