import type { CSSProperties } from 'react'
import { cdnImageUrl } from '~/lib/cdn/images'
import { coverGradient, initials } from '~/lib/visuals'
import { cx } from './cx'

type AvatarProps = {
  name: string
  avatarUrl?: string | null
  /** Pixel diameter. */
  size?: number
  /** Optional background override (CSS value); defaults to a deterministic gradient. */
  bg?: string
  className?: string
  /** Extra inline styles merged after the computed size/background (e.g. stack overlap). */
  style?: CSSProperties
}

/**
 * Circular avatar: shows the image when present, otherwise the person's
 * initials over a deterministic gradient derived from their name.
 */
export function Avatar({ name, avatarUrl, size = 32, bg, className, style }: AvatarProps) {
  return (
    <div
      className={cx(
        'grid shrink-0 place-items-center overflow-hidden rounded-full font-semibold text-white',
        className,
      )}
      style={{
        width: size,
        height: size,
        background: bg ?? coverGradient(name),
        fontSize: Math.round(size * 0.4),
        ...style,
      }}
      title={name}
    >
      {avatarUrl ? (
        <img src={cdnImageUrl(avatarUrl)} alt="" className="size-full object-cover" />
      ) : (
        initials(name)
      )}
    </div>
  )
}
