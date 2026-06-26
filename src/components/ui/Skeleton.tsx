import { cx } from './cx'

/**
 * Shimmer placeholder block. Composes into card/detail skeletons and sits
 * behind images until their bytes load. Size, radius, and aspect come from
 * `className`; the solid `bg-surface-2` base doubles as the static placeholder
 * when `prefers-reduced-motion` neutralizes the sweep (see global.css).
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cx('relative overflow-hidden bg-surface-2', className)} aria-hidden="true">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_ease-in-out_infinite] bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.06),transparent)] [[data-theme=dark]_&]:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)]" />
    </div>
  )
}
