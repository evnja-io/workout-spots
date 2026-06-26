import { useEffect, useRef, useState } from 'react'

/** True when the user has asked for reduced motion (client only). */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Reveal-on-scroll: adds `.in` to every `.reveal` inside `root` as it enters the
 * viewport. Mirrors the design's script, including the failsafes so content is
 * NEVER stuck hidden if IntersectionObserver doesn't run. Under reduced-motion
 * the CSS never hides `.reveal`, so this is purely additive.
 */
export function useReveal(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current
    if (!el) return
    const reveals = Array.from(el.querySelectorAll<HTMLElement>('.reveal'))
    if (reveals.length === 0) return
    const showAll = () => reveals.forEach((r) => r.classList.add('in'))

    if (!('IntersectionObserver' in window)) {
      showAll()
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    // Reveal anything already in view immediately, observe the rest.
    reveals.forEach((r) => {
      const rect = r.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) r.classList.add('in')
      else io.observe(r)
    })

    // Hard fallback: if IO never fires, show everything shortly after.
    const t = window.setTimeout(showAll, 1500)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [root])
}

/** Toggles `.scrolled` on the header once the page is scrolled a little. */
export function useScrolled(threshold = 12): boolean {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

/**
 * Scroll-spy: returns the id of the section currently in view, for `aria-current`
 * highlighting in the nav (NN/g: visibility of system status / where am I).
 */
export function useScrollSpy(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null)
    if (sections.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5] },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [ids])
  return active
}

/**
 * Count-up: animates a number from 0 to `value` the first time it scrolls into
 * view. SSR-safe — the initial state is the final value, so there's no hydration
 * mismatch; the animation only overrides it on the client. Skipped under
 * reduced-motion.
 */
export function useCountUp(value: number, durationMs = 1400) {
  const ref = useRef<HTMLElement | null>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !('IntersectionObserver' in window)) {
      setDisplay(value)
      return
    }
    let raf = 0
    let start = 0
    const animate = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / durationMs, 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(eased * value))
      if (p < 1) raf = requestAnimationFrame(animate)
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setDisplay(0)
          raf = requestAnimationFrame(animate)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, durationMs])

  return { ref, display }
}

/** Smooth-scroll to an in-page anchor, honoring reduced-motion, and move focus
 * to the target for keyboard users (accessibility). */
export function scrollToAnchor(hash: string) {
  const id = hash.replace(/^#/, '')
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  })
  // Make the section programmatically focusable so focus follows the scroll.
  el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}
