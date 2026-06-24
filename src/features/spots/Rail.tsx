import { useLocation, Link } from '@tanstack/react-router'
import { Icon } from '~/components/ui/Icon'
import { useSession } from '~/features/auth/session'

export interface RailProps {
  onOpenSettings?: () => void
  view?: 'map' | 'list'
  onViewChange?: (v: 'map' | 'list') => void
}

export function Rail({ onOpenSettings, view = 'map', onViewChange }: RailProps) {
  const { pathname } = useLocation()
  const { userId } = useSession()

  const isMapActive = pathname === '/spots' && view === 'map'
  const isListActive = pathname === '/spots' && view === 'list'
  const isSavedActive = pathname.startsWith('/saved')

  // Use first char of userId as avatar initial; fall back to icon for anon
  const initial = userId ? userId.charAt(0).toUpperCase() : null

  return (
    <nav className="rail" aria-label="Main navigation">
      {/* Logo */}
      <div className="rail-logo" aria-label="Workout Spots">
        WS
      </div>

      {/* Map view button */}
      <button
        type="button"
        className={`rail-btn${isMapActive ? ' active' : ''}`}
        aria-label="Map"
        title="Map"
        onClick={() => onViewChange?.('map')}
      >
        <Icon name="map" size={20} />
      </button>

      {/* List view button */}
      <button
        type="button"
        className={`rail-btn${isListActive ? ' active' : ''}`}
        aria-label="List"
        title="List"
        onClick={() => onViewChange?.('list')}
      >
        <Icon name="list" size={20} />
      </button>

      {/* Saved */}
      <Link
        to="/saved"
        className={`rail-btn${isSavedActive ? ' active' : ''}`}
        aria-label="Saved"
        title="Saved"
      >
        <Icon name="heart" size={20} />
      </Link>

      <div className="rail-spacer" />

      {/* Settings button */}
      <button
        type="button"
        className="rail-btn"
        aria-label="Settings"
        title="Settings"
        onClick={() => onOpenSettings?.()}
      >
        <Icon name="settings" size={20} />
      </button>

      {/* Avatar */}
      <div className="rail-avatar" aria-label={initial ? `Account (${initial})` : 'Account'}>
        {initial ?? <Icon name="user" size={16} />}
      </div>
    </nav>
  )
}
