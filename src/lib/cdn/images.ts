/**
 * Rewrites image URLs to the Cloudflare image CDN (img.evnja.gg) so responses
 * are served from the edge cache. Applied at render time — stored URLs keep
 * their original origin, so this is fully reversible by unsetting the env var.
 *
 * Gated by `VITE_IMAGE_CDN_URL`. When it is unset (local dev, tests), every URL
 * is returned unchanged, so local Supabase (127.0.0.1) and mocks are untouched.
 *
 * The route prefixes and the host allowlist mirror the Worker in
 * `workers/img-cdn/index.js` — keep them in sync.
 */

// Hosts the /ext proxy may fetch. Mirrors EXT_ALLOWLIST in the Worker.
const EXT_ALLOWLIST = new Set([
  'calisthenics-parks.com',
  'www.lvbarstarzz.com',
  'www.calisthenicsnederland.nl',
])

const SB_PUBLIC_MARKER = '/storage/v1/object/public/'

function cdnBase(): string {
  const raw = import.meta.env.VITE_IMAGE_CDN_URL as string | undefined
  if (!raw) return ''
  return raw.replace(/\/+$/, '')
}

export function cdnImageUrl(url: string): string
export function cdnImageUrl(url: string | null | undefined): string | undefined
export function cdnImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return url ?? undefined

  const base = cdnBase()
  if (!base) return url

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return url // relative path, data:, blob:, etc. — leave as-is
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return url

  // Supabase public storage object → /sb/<bucket>/<path>
  if (parsed.hostname.endsWith('.supabase.co') && parsed.pathname.startsWith(SB_PUBLIC_MARKER)) {
    const rest = parsed.pathname.slice(SB_PUBLIC_MARKER.length)
    return `${base}/sb/${rest}${parsed.search}`
  }

  // Allowlisted scraped host → /ext/<host>/<path>
  if (EXT_ALLOWLIST.has(parsed.hostname)) {
    return `${base}/ext/${parsed.hostname}${parsed.pathname}${parsed.search}`
  }

  return url
}
