import { useEffect, useRef, useState } from 'react'
import { useLocation, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
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

  const railBtn =
    'grid size-10 place-items-center rounded-[10px] text-text-3 transition-colors duration-150 hover:bg-surface-2 hover:text-text'
  // `active` is a style-neutral marker (no bare `.active` CSS rule, and `.rail-btn`
  // is no longer applied) kept so tests can assert the active state by class name.
  const railBtnActive = 'active bg-accent-soft text-accent'

  return (
    <nav
      className="hidden flex-col items-center gap-1 border-r border-border bg-surface py-3.5 md:flex"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div
        className="mb-2.5 grid size-9 place-items-center rounded-[10px] bg-accent font-bold tracking-[-0.02em] text-white shadow-[var(--shadow-sm)]"
        aria-label="Workout Spots"
      >
        WS
      </div>

      {/* Map view button */}
      <button
        type="button"
        className={cx(railBtn, isMapActive && railBtnActive)}
        aria-label="Map"
        title="Map"
        onClick={() => onViewChange?.('map')}
      >
        <Icon name="map" size={20} />
      </button>

      {/* List view button */}
      <button
        type="button"
        className={cx(railBtn, isListActive && railBtnActive)}
        aria-label="List"
        title="List"
        onClick={() => onViewChange?.('list')}
      >
        <Icon name="list" size={20} />
      </button>

      {/* Saved */}
      <Link
        to="/saved"
        className={cx(railBtn, isSavedActive && railBtnActive)}
        aria-label="Saved"
        title="Saved"
      >
        <Icon name="heart" size={20} />
      </Link>

      <div className="flex-1" />

      {/* Settings button */}
      <button
        type="button"
        className={railBtn}
        aria-label="Settings"
        title="Settings"
        onClick={() => onOpenSettings?.()}
      >
        <Icon name="settings" size={20} />
      </button>

      {/* Account */}
      <div className="relative grid place-items-center" ref={accountRef}>
        <button
          type="button"
          className="grid size-9 place-items-center rounded-full bg-[linear-gradient(135deg,#c4b5fd,#7c3aed)] text-[13px] font-semibold text-white"
          aria-label={t('auth.account')}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={handleAccountClick}
        >
          {initial ?? <Icon name="user" size={16} />}
        </button>

        {menuOpen && status === 'authed' && (
          <div
            className="absolute bottom-0 left-[calc(100%+10px)] z-50 min-w-[180px] rounded-[12px] border border-border bg-surface p-1.5 shadow-[var(--shadow-lg)] animate-[fadeIn_0.12s_ease]"
            role="menu"
          >
            <div className="px-2.5 pt-1.5 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-text-4">
              {t('auth.signedInAs')}
            </div>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-2 text-left text-[13px] text-text transition-colors duration-150 hover:bg-surface-2"
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
