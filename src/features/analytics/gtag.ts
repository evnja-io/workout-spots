// Google Analytics 4 (gtag.js) integration.
//
// GA is loaded lazily and ONLY after the user grants cookie consent (see
// consent.ts) AND a measurement ID is configured. Until then nothing is added
// to the DOM and every tracking call is a no-op. All functions are guarded on
// `window` so they are safe to import in SSR'd modules.

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined

let loaded = false

function isEnabled(): boolean {
  return typeof window !== 'undefined' && !!GA_ID
}

/**
 * Inject the gtag.js script and initialise GA. Idempotent and safe to call
 * multiple times. No-ops when there is no measurement ID or no `window`.
 * Automatic page_view sending is disabled — we emit page_view manually on each
 * SPA navigation (see Analytics.tsx) for accurate route tracking.
 */
export function loadGtag(): void {
  if (loaded || !isEnabled()) return
  loaded = true

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // gtag relies on `arguments`, so this cannot be an arrow function.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)
}

/** Send a manual page_view event for the given path. No-ops if GA isn't loaded. */
export function trackPageview(path: string): void {
  if (!loaded || !isEnabled()) return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}

/** Send a custom event. No-ops if GA isn't loaded. */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (!loaded || !isEnabled()) return
  window.gtag('event', name, params ?? {})
}
