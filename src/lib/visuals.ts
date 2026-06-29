// Shared visual helpers for image-less cards/avatars across Clubs and Events:
// deterministic cover gradients, avatar initials, and compact relative time.

const PALETTE: ReadonlyArray<readonly [string, string]> = [
  ['#E11D48', '#FB7A1E'],
  ['#6D28D9', '#A78BFA'],
  ['#0F2E22', '#34D399'],
  ['#2563EB', '#60A5FA'],
  ['#D97706', '#FBBF24'],
  ['#475569', '#94A3B8'],
]
const FALLBACK = ['#E11D48', '#FB7A1E'] as const

function hash(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return h
}

/** Deterministic `linear-gradient(...)` derived from a seed (id/name). */
export function coverGradient(seed: string): string {
  const [a, b] = PALETTE[hash(seed) % PALETTE.length] ?? FALLBACK
  return `linear-gradient(135deg, ${a}, ${b})`
}

/** Compact relative time ("just now", "3h", "2d", or a short date). */
export function timeAgo(iso: string, now: number = Date.now()): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const s = Math.max(0, Math.round((now - then) / 1000))
  if (s < 60) return 'just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.round(h / 24)
  if (d < 7) return `${d}d`
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function initials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?'
  )
}
