import { useEffect, useRef, useState } from 'react'
import { useLocation, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { useSessionContext } from '~/features/auth/session'

export interface RailProps {
  onOpenSettings?: () => void
  view?: 'map' | 'list'
  onViewChange?: (v: 'map' | 'list') => void
}

export function Rail({ onOpenSettings, view = 'map', onViewChange }: RailProps) {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { userId, status, openSignIn, signOut } = useSessionContext()
  const [menuOpen, setMenuOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)

  const isMapActive = pathname === '/spots' && view === 'map'
  const isListActive = pathname === '/spots' && view === 'list'
  const isSavedActive = pathname.startsWith('/saved')

  // Use first char of userId as avatar initial; fall back to icon for anon
  const initial = userId ? userId.charAt(0).toUpperCase() : null

  // Close the account menu on outside click / Escape.
  useEffect(() => {
    if (!menuOpen) return
    const onDocClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  function handleAccountClick() {
    if (status === 'authed') {
      setMenuOpen((v) => !v)
    } else {
      openSignIn()
    }
  }

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

      {/* Account */}
      <div className="account-wrap" ref={accountRef}>
        <button
          type="button"
          className="rail-avatar"
          aria-label={t('auth.account')}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={handleAccountClick}
        >
          {initial ?? <Icon name="user" size={16} />}
        </button>

        {menuOpen && status === 'authed' && (
          <div className="account-menu" role="menu">
            <div className="account-menu-head">{t('auth.signedInAs')}</div>
            <button
              type="button"
              className="account-menu-item"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false)
                signOut()
              }}
            >
              <Icon name="user" size={16} />
              {t('auth.signOut')}
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
