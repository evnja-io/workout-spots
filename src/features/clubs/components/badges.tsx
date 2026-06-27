import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import type { ClubPrivacy, ClubRole } from '../domain'

const pill = 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium'

export function PrivacyBadge({
  privacy,
  onCover = false,
}: {
  privacy: ClubPrivacy
  onCover?: boolean
}) {
  const isPrivate = privacy === 'private'
  return (
    <span
      className={cx(
        pill,
        onCover
          ? 'bg-black/35 text-white backdrop-blur-sm'
          : isPrivate
            ? 'bg-surface-2 text-text-2'
            : 'bg-accent-soft text-accent',
      )}
    >
      <span className={cx('size-1.5 rounded-full', isPrivate ? 'bg-current' : 'bg-current')} />
      {isPrivate ? 'Private' : 'Public'}
    </span>
  )
}

export function CategoryChip({ category, onCover = false }: { category: string; onCover?: boolean }) {
  if (!category) return null
  return (
    <span className={cx(pill, onCover ? 'bg-black/35 text-white backdrop-blur-sm' : 'bg-surface-2 text-text-2')}>
      <Icon name="dumbbell" size={12} />
      {category}
    </span>
  )
}

export function RoleBadge({ role }: { role: ClubRole }) {
  if (role === 'member') return <span className={cx(pill, 'bg-surface-2 text-text-3')}>Member</span>
  return (
    <span className={cx(pill, 'bg-accent-soft text-accent capitalize')}>
      {role === 'owner' && <Icon name="star" size={11} />}
      {role}
    </span>
  )
}
