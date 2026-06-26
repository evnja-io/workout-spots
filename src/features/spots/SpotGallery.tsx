import { useCallback, useEffect, useRef, useState } from 'react'
import type { SpotImage } from './domain'
import { ImageWithShimmer } from '~/components/ui/ImageWithShimmer'

/** Top/bottom darkening so the close button and progress bars stay legible. */
function Scrim() {
  return (
    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15)_0%,transparent_40%,transparent_70%,rgba(0,0,0,0.35))]" />
  )
}

/**
 * Spot photo viewer. With one photo it's a static image; with several it's a
 * native horizontal scroll-snap track (touch swipe + momentum for free) whose
 * progress bars sync to the scroll position. Renders absolutely-positioned
 * children, so it must live inside a `relative` framed container (see Detail).
 */
export function SpotGallery({ images, alt }: { images: SpotImage[]; alt: string }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const [active, setActive] = useState(0)

  const onScroll = useCallback(() => {
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      const el = trackRef.current
      if (!el || el.clientWidth === 0) return
      setActive(Math.round(el.scrollLeft / el.clientWidth))
    })
  }, [])

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const goTo = useCallback(
    (i: number) => {
      const el = trackRef.current
      if (!el) return
      const clamped = Math.max(0, Math.min(i, images.length - 1))
      el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' })
    },
    [images.length],
  )

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      goTo(active + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goTo(active - 1)
    }
  }

  if (images.length === 0) {
    return (
      <>
        <div
          className="h-full w-full bg-[repeating-linear-gradient(135deg,var(--c1)_0_10px,var(--c2)_10px_20px)]"
          style={{ '--c1': '#6366f1', '--c2': '#8b5cf6' } as React.CSSProperties}
        />
        <Scrim />
      </>
    )
  }

  if (images.length === 1) {
    return (
      <>
        <ImageWithShimmer src={images[0]!.url} alt={alt} className="h-full w-full" />
        <Scrim />
      </>
    )
  }

  return (
    <>
      <div
        ref={trackRef}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={alt}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((img, i) => (
          <ImageWithShimmer
            key={img.id}
            src={img.url}
            alt={`${alt} (${i + 1}/${images.length})`}
            className="h-full w-full shrink-0 snap-center"
          />
        ))}
      </div>
      <Scrim />
      <div className="absolute right-3 bottom-2.5 left-3 flex gap-1.5">
        {images.map((img, i) => (
          <button
            key={img.id}
            className={
              'h-1 flex-1 rounded-[2px] ' +
              (i === active ? 'bg-white' : 'bg-[rgba(255,255,255,0.4)]')
            }
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Image ${i + 1}`}
            aria-current={i === active || undefined}
          />
        ))}
      </div>
    </>
  )
}
