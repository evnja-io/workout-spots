/**
 * evnja-img-cdn — image reverse-proxy + edge cache for spots.evnja.gg.
 *
 * Fronts the app's image origins on a single Cloudflare-proxied hostname
 * (img.evnja.gg) so responses are cached at the edge. The app rewrites image
 * URLs to this host via src/lib/cdn/images.ts (cdnImageUrl).
 *
 * Routes (path prefix → upstream):
 *   /sb/<rest>        → https://<SUPABASE>/storage/v1/object/public/<rest>
 *   /ext/<host>/<p>   → https://<host>/<p>   (only if <host> is allowlisted)
 *   /app/<p>          → https://spots.evnja.gg/<p>   (static assets, e.g. og-image)
 *   anything else     → 404
 *
 * Caching: Cache API (caches.default). Successful responses are stored with a
 * 1-year immutable Cache-Control (Supabase otherwise sends only max-age=3600).
 * The query string is part of the cache key, so cache-busted URLs (avatars use
 * ?v=<ts>, covers embed a timestamp in the filename) stay correct.
 */

const SUPABASE_ORIGIN = 'https://puewbgczxvlcckspbfzv.supabase.co'
const SUPABASE_PUBLIC_PREFIX = '/storage/v1/object/public/'
const APP_ORIGIN = 'https://spots.evnja.gg'

// Hosts the /ext proxy is allowed to fetch from. Keep in sync with
// EXT_ALLOWLIST in src/lib/cdn/images.ts. Prevents an open image proxy.
const EXT_ALLOWLIST = new Set([
  'calisthenics-parks.com',
  'www.lvbarstarzz.com',
  'www.calisthenicsnederland.nl',
])

const IMMUTABLE_CACHE = 'public, max-age=31536000, immutable'

// Some upstreams (e.g. calisthenics-parks.com) serve real image bytes with a
// wrong `text/html` content-type. Infer a correct type from the file extension
// when the upstream type isn't already image/*.
const EXT_CONTENT_TYPES = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
  bmp: 'image/bmp',
  svg: 'image/svg+xml',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  ico: 'image/x-icon',
}

function contentTypeFor(pathname, upstreamType) {
  if (upstreamType && upstreamType.startsWith('image/')) return upstreamType
  const ext = pathname.split('.').pop()?.toLowerCase()
  return (ext && EXT_CONTENT_TYPES[ext]) || upstreamType || 'application/octet-stream'
}

/** Resolve the incoming request path to an upstream URL, or null/forbidden. */
function resolveUpstream(url) {
  const { pathname, search } = url

  if (pathname.startsWith('/sb/')) {
    const rest = pathname.slice('/sb/'.length)
    return { url: `${SUPABASE_ORIGIN}${SUPABASE_PUBLIC_PREFIX}${rest}${search}` }
  }

  if (pathname.startsWith('/ext/')) {
    const rest = pathname.slice('/ext/'.length)
    const slash = rest.indexOf('/')
    if (slash === -1) return { status: 404 }
    const host = rest.slice(0, slash)
    const path = rest.slice(slash) // includes leading '/'
    if (!EXT_ALLOWLIST.has(host)) return { status: 403 }
    return { url: `https://${host}${path}${search}` }
  }

  if (pathname.startsWith('/app/')) {
    const rest = pathname.slice('/app/'.length)
    return { url: `${APP_ORIGIN}/${rest}${search}` }
  }

  return { status: 404 }
}

export default {
  async fetch(request, _env, ctx) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405 })
    }

    const url = new URL(request.url)
    const target = resolveUpstream(url)
    if (target.status) {
      return new Response(target.status === 403 ? 'Forbidden' : 'Not Found', {
        status: target.status,
      })
    }

    const cache = caches.default
    const cacheKey = new Request(url.toString(), { method: 'GET' })

    const cached = await cache.match(cacheKey)
    if (cached) return cached

    let upstream
    try {
      upstream = await fetch(target.url, {
        method: 'GET',
        headers: { accept: request.headers.get('accept') || 'image/*,*/*' },
        redirect: 'follow',
      })
    } catch {
      return new Response('Bad Gateway', { status: 502 })
    }

    // Don't cache errors as if they were images — pass the status through.
    if (!upstream.ok) {
      return new Response(upstream.body, {
        status: upstream.status,
        headers: { 'cache-control': 'no-store' },
      })
    }

    const headers = new Headers()
    headers.set('content-type', contentTypeFor(url.pathname, upstream.headers.get('content-type')))
    headers.set('cache-control', IMMUTABLE_CACHE)
    headers.set('access-control-allow-origin', '*')
    headers.set('x-img-cdn', 'evnja')

    const response = new Response(upstream.body, { status: 200, headers })
    ctx.waitUntil(cache.put(cacheKey, response.clone()))
    return response
  },
}
