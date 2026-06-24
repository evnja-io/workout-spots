import type { SpotListItem } from './domain'
import { Icon } from '~/components/ui/Icon'

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
      className={`spot-card${active ? ' active' : ''}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`spot-thumb${spot.thumbnailUrl ? '' : ' placeholder'}`}
        style={spot.thumbnailUrl ? { backgroundImage: `url(${spot.thumbnailUrl})` } : undefined}
      />
      <div className="spot-body">
        <h3>{spot.name}</h3>
        <div className="spot-meta">
          <span>{spot.city}</span>
          <span className="rating-badge">
            <Icon name="star" size={12} />
            {spot.averageRating.toFixed(1)}
          </span>
        </div>
        {(spot.isOpen24h || spot.disciplineIds.length > 0 || spot.equipmentIds.length > 0) && (
          <div className="spot-tags">
            {spot.isOpen24h && <span className="tag v">24/7</span>}
            {spot.disciplineIds.length > 0 && (
              <span className="tag">{spot.disciplineIds.length} disciplines</span>
            )}
            {spot.equipmentIds.length > 0 && (
              <span className="tag">{spot.equipmentIds.length} equipment</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
