// Visual seeds shared by the Clubs and Events landing showcases. These are
// static marketing mockups (no DB), so they mirror the app's deterministic
// coverGradient/initials approach: every card always looks designed.

/** Vibrant cover gradients for the mock poster cards. */
export const COVERS = [
  'linear-gradient(150deg,#e11d48,#7a1133)',
  'linear-gradient(150deg,#fb7a1e,#7a2d12)',
  'linear-gradient(150deg,#7c3aed,#2a1140)',
  'linear-gradient(150deg,#0ea5e9,#0c2a4a)',
  'linear-gradient(150deg,#10b981,#0a3b2e)',
  'linear-gradient(150deg,#f43f5e,#3a1340)',
]

const AV_COLORS = ['#e11d48', '#fb7a1e', '#7c3aed', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899']

type AvatarsProps = {
  /** Initials shown in the overlapping stack, e.g. ['AK', 'ML']. */
  people: readonly string[]
  /** Count for the trailing "+N" overflow bubble (omitted when 0). */
  more?: number
  /** Optional trailing label, e.g. "18 going". */
  label?: string
}

/** Overlapping initials avatars + "+N" overflow + optional label, mirroring the app AvatarStack visually. */
export function PosterAvatars({ people, more = 0, label }: AvatarsProps) {
  return (
    <div className="lp-avstack">
      {people.map((p, i) => (
        <span
          key={p + i}
          className="av"
          style={{ background: AV_COLORS[i % AV_COLORS.length] }}
          aria-hidden="true"
        >
          {p}
        </span>
      ))}
      {more > 0 && (
        <span className="av more" aria-hidden="true">
          +{more}
        </span>
      )}
      {label && <span className="lbl">{label}</span>}
    </div>
  )
}
