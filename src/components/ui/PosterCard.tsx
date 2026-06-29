import type { ReactNode } from 'react'
import { coverGradient } from '~/lib/visuals'
import { cx } from './cx'
import { ImageWithShimmer } from './ImageWithShimmer'

export type PosterVariant = 'feed' | 'rail' | 'spot'

const VARIANT_ASPECT: Record<PosterVariant, string> = {
  rail: 'w-[248px] shrink-0 aspect-[3/4.2]',
  feed: 'aspect-[16/12] max-md:aspect-[4/4.4]',
  spot: 'aspect-[21/9] max-md:aspect-[4/4.6]',
}

// Bottom-weighted scrim so overlaid white text stays legible over any poster.
const SCRIM =
  'bg-[linear-gradient(176deg,rgba(8,3,12,0.05)_0%,rgba(8,3,12,0)_30%,rgba(8,3,12,0.35)_64%,rgba(8,3,12,0.86)_100%)]'

type PosterCardProps = {
  /** Seed for the deterministic gradient fallback (usually the entity id). */
  seedId: string
  imageUrl?: string | null
  variant?: PosterVariant
  /** Dims the card (e.g. cancelled events); restores opacity on hover. */
  dimmed?: boolean
  onClick?: () => void
  /** Rendered in the top overlay row (badges, date stub). */
  top?: ReactNode
  /** Rendered in the bottom "meat" block (tags, title, meta, social). */
  children?: ReactNode
  className?: string
}

/**
 * Shared poster shell for Event and Club cards: a full-bleed image (or gradient
 * fallback) under a scrim, with overlaid white content. Click/keyboard
 * accessible when `onClick` is provided.
 */
export function PosterCard({
  seedId,
  imageUrl,
  variant = 'feed',
  dimmed = false,
  onClick,
  top,
  children,
  className,
}: PosterCardProps) {
  const interactive = Boolean(onClick)
  return (
    <div
      className={cx(
        'group relative isolate overflow-hidden rounded-[22px] bg-surface shadow-[var(--shadow-md)]',
        // Tailwind v4 maps -translate-y-* to the CSS `translate` property (not
        // `transform`), so `translate` must be in the transition list or the lift
        // jumps with no animation.
        'transition-[translate,box-shadow,opacity] duration-200 ease-[cubic-bezier(.32,.72,0,1)]',
        interactive && 'cursor-pointer hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]',
        dimmed && 'opacity-60 hover:opacity-100',
        VARIANT_ASPECT[variant],
        className,
      )}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick?.()
              }
            }
          : undefined
      }
    >
      {imageUrl ? (
        <div className="absolute inset-0 z-0">
          <ImageWithShimmer src={imageUrl} alt="" className="h-full w-full" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0" style={{ backgroundImage: coverGradient(seedId) }} />
      )}
      <div className={cx('pointer-events-none absolute inset-0 z-[1]', SCRIM)} />
      <div className="relative z-[2] flex h-full flex-col p-3.5 text-white">
        {top != null && <div className="flex items-start justify-between gap-2">{top}</div>}
        <div className="mt-auto flex flex-col gap-2.5">{children}</div>
      </div>
    </div>
  )
}
