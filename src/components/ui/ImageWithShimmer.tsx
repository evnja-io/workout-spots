import { useEffect, useRef, useState } from 'react'
import { cdnImageUrl } from '~/lib/cdn/images'
import { cx } from './cx'
import { Skeleton } from './Skeleton'

/**
 * Image that shows a shimmer placeholder until its bytes finish loading, then
 * fades in. Avoids the progressive top-to-bottom paint of a CSS
 * `background-image` by keeping the `<img>` hidden until the `load` event.
 *
 * `className` sizes the (relative, clipped) wrapper; the image fills it with
 * `object-cover`.
 */
export function ImageWithShimmer({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const [loaded, setLoaded] = useState(false)
  const ref = useRef<HTMLImageElement>(null)

  // Cached images can already be complete before onLoad attaches — reconcile.
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true)
  }, [src])

  return (
    <div className={cx('relative overflow-hidden', className)}>
      {!loaded && <Skeleton className="absolute inset-0" />}
      <img
        ref={ref}
        src={cdnImageUrl(src)}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={cx(
          'h-full w-full object-cover',
          loaded ? 'opacity-100 transition-opacity duration-300' : 'opacity-0',
        )}
      />
    </div>
  )
}
