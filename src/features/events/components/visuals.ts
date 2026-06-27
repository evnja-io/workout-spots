// Deterministic featured-image gradients + avatar initials (events have no
// uploaded organizer avatar — we derive one from the name).
const PALETTE: ReadonlyArray<readonly [string, string]> = [
  ['#E11D48', '#FB7A1E'],
  ['#6D28D9', '#A78BFA'],
  ['#0F2E22', '#34D399'],
  ['#2563EB', '#60A5FA'],
  ['#D97706', '#FBBF24'],
  ['#475569', '#94A3B8'],
]
const FALLBACK = ['#2563EB', '#60A5FA'] as const

function hash(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return h
}

export function coverGradient(seed: string): string {
  const [a, b] = PALETTE[hash(seed) % PALETTE.length] ?? FALLBACK
  return `linear-gradient(135deg, ${a}, ${b})`
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
