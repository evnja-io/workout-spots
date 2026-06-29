import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import type { ClubPrivacy, ClubRole } from '../domain'

const coverPill =
  'inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm'
const surfacePill =
  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold'

export function PrivacyBadge({
  privacy,
  onCover = false,
}: {
  privacy: ClubPrivacy
  onCover?: boolean
}) {
  const { t } = useTranslation()
  const isPrivate = privacy === 'private'
  const icon = isPrivate ? 'lock' : 'globe'
  const label = isPrivate ? t('clubs.privacy_private') : t('clubs.privacy_public')

  if (onCover) {
    return (
      <span className={coverPill}>
        <Icon name={icon} size={11} />
        {label}
      </span>
    )
  }
  return (
    <span
      className={cx(
        surfacePill,
        isPrivate ? 'bg-accent-soft text-accent' : 'bg-surface-2 text-text-2',
      )}
    >
      <Icon name={icon} size={11} />
      {label}
    </span>
  )
}

export function CategoryChip({
  category,
  onCover = false,
}: {
  category: string
  onCover?: boolean
}) {
  if (!category) return null
  return (
    <span className={onCover ? coverPill : cx(surfacePill, 'bg-accent-soft text-accent')}>
      <Icon name="dumbbell" size={12} />
      {category}
    </span>
  )
}

export function RoleBadge({ role }: { role: ClubRole }) {
  const { t } = useTranslation()
  if (role === 'owner') {
    return (
      <span
        className={cx(
          surfacePill,
          'bg-amber-500/15 capitalize text-amber-600 [[data-theme=dark]_&]:text-amber-400',
        )}
      >
        <Icon name="crown" size={11} />
        {t('clubs.role_owner')}
      </span>
    )
  }
  if (role === 'moderator') {
    return (
      <span className={cx(surfacePill, 'bg-accent-soft capitalize text-accent')}>
        <Icon name="shield" size={11} />
        {t('clubs.role_moderator')}
      </span>
    )
  }
  return (
    <span className={cx(surfacePill, 'bg-surface-2 text-text-3')}>{t('clubs.role_member')}</span>
  )
}
