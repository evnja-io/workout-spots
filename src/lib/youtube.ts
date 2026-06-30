// Pure helpers for embedding YouTube videos in feed posts.

const ID_RE = /^[A-Za-z0-9_-]{11}$/

/**
 * Extract the 11-char video id from any common YouTube URL form:
 * `watch?v=`, `youtu.be/`, `/embed/`, `/shorts/`, `/live/`, or a bare id.
 * Returns null when the input isn't a recognisable YouTube reference.
 */
export function parseYouTubeId(input: string): string | null {
  const raw = input.trim()
  if (!raw) return null
  if (ID_RE.test(raw)) return raw

  let url: URL
  try {
    url = new URL(raw.includes('://') ? raw : `https://${raw}`)
  } catch {
    return null
  }

  const host = url.hostname.replace(/^www\./, '').toLowerCase()
  const youtubeHosts = ['youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'youtu.be']
  if (!youtubeHosts.includes(host)) return null

  if (host === 'youtu.be') {
    const id = url.pathname.slice(1).split('/')[0] ?? ''
    return ID_RE.test(id) ? id : null
  }

  const v = url.searchParams.get('v')
  if (v && ID_RE.test(v)) return v

  const segments = url.pathname.split('/').filter(Boolean)
  const prefixes = ['embed', 'shorts', 'live', 'v']
  const [head, id] = segments
  if (head && id && prefixes.includes(head) && ID_RE.test(id)) {
    return id
  }
  return null
}

/** Default-quality thumbnail for a video id. */
export function youTubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

/** Privacy-friendly embed URL; autoplay since it only loads after a user click. */
export function youTubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
}
