import type { SpotListItem } from './domain'
import { Icon } from '~/components/ui/Icon'
import { Tag } from '~/components/ui/Tag'
import { RatingBadge } from '~/components/ui/RatingBadge'
import { ImageWithShimmer } from '~/components/ui/ImageWithShimmer'
import { cx } from '~/components/ui/cx'

type SpotCardProps = {
  spot: SpotListItem
  active: boolean
  onClick: () => void
}

export function SpotCard({ spot, active, onClick }: SpotCardProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <div
      className={cx(
        'grid grid-cols-[72px_1fr] gap-3 p-2.5 rounded-lg border border-transparent cursor-pointer transition-[background-color,border-color] duration-150 hover:bg-surface-2',
        active && 'bg-accent-softer border-accent-soft',
      )}
      data-active={active || undefined}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div
        className={cx(
          'relative size-[72px] overflow-hidden rounded-[10px]',
          "after:absolute after:inset-0 after:z-10 after:content-[''] after:bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.15))]",
          !spot.thumbnailUrl && 'bg-[repeating-linear-gradient(135deg,#e5e7eb_0_8px,#eef0f3_8px_16px)]',
        )}
      >
        {spot.thumbnailUrl && (
          <ImageWithShimmer src={spot.thumbnailUrl} alt={spot.name} className="h-full w-full" />
        )}
      </div>
      <div>
        <h3 className="m-0 mb-0.5 text-[14px] font-semibold tracking-[-0.005em] line-clamp-1">
          {spot.name}
        </h3>
        <div className="flex items-center gap-2 mb-1.5 text-[12px] text-text-3">
          <span>{spot.city}</span>
          <RatingBadge>
            <Icon name="star" size={12} />
            {spot.averageRating.toFixed(1)}
          </RatingBadge>
        </div>
        {(spot.isOpen24h || spot.disciplineIds.length > 0 || spot.equipmentIds.length > 0) && (
          <div className="flex flex-wrap gap-1">
            {spot.isOpen24h && <Tag accent>24/7</Tag>}
            {spot.disciplineIds.length > 0 && <Tag>{spot.disciplineIds.length} disciplines</Tag>}
            {spot.equipmentIds.length > 0 && <Tag>{spot.equipmentIds.length} equipment</Tag>}
          </div>
        )}
      </div>
    </div>
  )
}
