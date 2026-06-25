import { useEffect, useState } from 'react'

/**
 * SSR-safe media-query hook. Returns `false` on the server and on the first
 * client render (so SSR/CSR markup match and hydration never mismatches), then
 * corrects to the real value in an effect after mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** Mobile breakpoint: matches Tailwind's `md` boundary (< 768px). */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)')
}
