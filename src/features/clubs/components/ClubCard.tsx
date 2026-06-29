import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { AvatarStack } from '~/components/ui/AvatarStack'
import { PosterCard, type PosterVariant } from '~/components/ui/PosterCard'
import { Skeleton } from '~/components/ui/Skeleton'
import { cx } from '~/components/ui/cx'
import type { ClubListItem } from '../domain'
import { CategoryChip, PrivacyBadge } from './badges'

const TITLE_SIZE: Record<PosterVariant, string> = {
  rail: 'text-[24px]',
  feed: 'text-[28px]',
  spot: 'text-[clamp(28px,4vw,48px)]',
}

export function ClubCard({
  club,
  onOpen,
  variant = 'feed',
}: {
  club: ClubListItem
  onOpen: (id: string) => void
  variant?: PosterVariant
}) {
  const { t } = useTranslation()
  const isPrivate = club.privacy === 'private'
  const tagMax = variant === 'spot' ? 4 : 3

  const top = (
    <>
      <CategoryChip category={club.category} onCover />
      <PrivacyBadge privacy={club.privacy} onCover />
    </>
  )

  return (
    <PosterCard
      seedId={club.id}
      imageUrl={club.coverImageUrl}
      variant={variant}
      onClick={() => onOpen(club.id)}
      top={top}
    >
      {club.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {club.tags.slice(0, tagMax).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <h3
        className={cx(
          'font-display leading-[0.96] [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]',
          'line-clamp-2',
          TITLE_SIZE[variant],
        )}
      >
        {club.name}
      </h3>
      <div className="flex flex-wrap items-center gap-1.5 text-[13px] font-semibold text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]">
        <Icon name="mappin" size={13} />
        {t('clubs.spots', { count: club.spotCount })}
        {club.category && (
          <>
            <span className="opacity-50">·</span>
            <Icon name="dumbbell" size={13} />
            <span className="truncate">{club.category}</span>
          </>
        )}
      </div>
      <div
        className={cx(
          'flex items-center justify-between gap-2.5 border-t border-white/15 pt-2.5',
          variant === 'spot' && 'flex-wrap',
        )}
      >
        <AvatarStack
          people={club.sampleMembers}
          total={club.memberCount}
          max={variant === 'spot' ? 5 : 3}
          size={variant === 'spot' ? 32 : 26}
          onPoster
          label={
            <span className="text-white/90">{t('clubs.members', { count: club.memberCount })}</span>
          }
        />
        <span
          className={cx(
            'inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-extrabold',
            isPrivate
              ? 'border border-white/25 bg-white/15 text-white backdrop-blur-sm'
              : 'bg-white text-[#11070f]',
          )}
        >
          {isPrivate ? t('clubs.request') : t('clubs.join')}
          {variant === 'spot' && <Icon name="chevronR" size={15} />}
        </span>
      </div>
    </PosterCard>
  )
}

export function ClubCardSkeleton({ variant = 'feed' }: { variant?: PosterVariant }) {
  const aspect =
    variant === 'rail'
      ? 'w-[248px] shrink-0 aspect-[3/4.2]'
      : variant === 'spot'
        ? 'aspect-[21/9] max-md:aspect-[4/4.6]'
        : 'aspect-[16/12] max-md:aspect-[4/4.4]'
  return <Skeleton className={cx('rounded-[22px]', aspect)} />
}
