import { Icon } from '~/components/ui/Icon'
import { ImageWithShimmer } from '~/components/ui/ImageWithShimmer'
import { cx } from '~/components/ui/cx'
import type { ClubListItem } from '../domain'
import { coverGradient } from './visuals'
import { CategoryChip, PrivacyBadge } from './badges'

export function ClubCard({ club, onOpen }: { club: ClubListItem; onOpen: (id: string) => void }) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen(club.id)
    }
  }

  return (
    <div
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-surface transition-[border-color,box-shadow] duration-150 hover:border-accent-soft hover:shadow-[var(--shadow-md)]"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(club.id)}
      onKeyDown={handleKeyDown}
    >
      <div
        className={cx('relative h-28 w-full', !club.coverImageUrl && 'text-white')}
        style={!club.coverImageUrl ? { backgroundImage: coverGradient(club.id) } : undefined}
      >
        {club.coverImageUrl && (
          <ImageWithShimmer src={club.coverImageUrl} alt="" className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-x-2 top-2 flex items-center justify-between gap-1">
          <CategoryChip category={club.category} onCover />
          <PrivacyBadge privacy={club.privacy} onCover />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-1 text-[15px] font-semibold tracking-[-0.005em] text-text">
          {club.name}
        </h3>
        {club.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {club.tags.slice(0, 3).map((t) => (
              <span key={t} className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-text-3">
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center gap-3 pt-1 text-[12px] text-text-3">
          <span className="inline-flex items-center gap-1">
            <Icon name="users" size={14} />
            <strong className="text-text">{club.memberCount.toLocaleString()}</strong>
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon name="mappin" size={14} />
            <strong className="text-text">{club.spotCount}</strong> spots
          </span>
        </div>
      </div>
    </div>
  )
}

export function ClubCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <div className="h-28 w-full animate-pulse bg-surface-2" />
      <div className="flex flex-col gap-2 p-3">
        <div className="h-4 w-2/3 animate-pulse rounded bg-surface-2" />
        <div className="flex gap-1">
          <div className="h-4 w-14 animate-pulse rounded-full bg-surface-2" />
          <div className="h-4 w-12 animate-pulse rounded-full bg-surface-2" />
        </div>
        <div className="h-3 w-1/2 animate-pulse rounded bg-surface-2" />
      </div>
    </div>
  )
}
