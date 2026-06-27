import { useEffect, useRef, useState } from 'react'
import { useLocation, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import { Logo } from '~/features/spots/Logo'
import { useSessionContext } from '~/features/auth/session'
import { currentUserProfileQueryOptions } from '~/features/auth/profile'

export interface RailProps {
  onOpenSettings?: () => void
}

export function Rail({ onOpenSettings }: RailProps) {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { userId, status, openSignIn, signOut } = useSessionContext()
  const [menuOpen, setMenuOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)

  // Section nav — the rail is the cross-section switcher (Spots / Clubs / Events).
  const isSpotsActive = pathname.startsWith('/spots')
  const isClubsActive = pathname.startsWith('/clubs')
  const isEventsActive = pathname.startsWith('/events')

  const { data: profile } = useQuery({
    ...currentUserProfileQueryOptions(userId),
    enabled: status === 'authed' && !!userId,
  })

  const pseudo = profile?.pseudo ?? null
  const avatarUrl = profile?.profilePictureUrl ?? null
  // Avatar initial derives from the nickname (never the userId UUID); the icon
  // is the fallback when there's no pseudo yet.
  const initial = pseudo ? pseudo.trim().charAt(0).toUpperCase() : null

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
      {/* Logo → landing page */}
      <Link
        to="/"
        className="mb-2.5 grid size-9 place-items-center rounded-[10px] transition-colors duration-150 hover:bg-surface-2"
        aria-label="Workout Spots — home"
      >
        <Logo size={32} />
      </Link>

      {/* Spots section */}
      <Link
        to="/spots"
        className={cx(railBtn, isSpotsActive && railBtnActive)}
        aria-label={t('nav.spots')}
        title={t('nav.spots')}
        aria-current={isSpotsActive ? 'page' : undefined}
      >
        <Icon name="map" size={20} />
      </Link>

      {/* Clubs section */}
      <Link
        to="/clubs"
        className={cx(railBtn, isClubsActive && railBtnActive)}
        aria-label={t('nav.clubs')}
        title={t('nav.clubs')}
        aria-current={isClubsActive ? 'page' : undefined}
      >
        <Icon name="users" size={20} />
      </Link>

      {/* Events section */}
      <Link
        to="/events"
        className={cx(railBtn, isEventsActive && railBtnActive)}
        aria-label={t('nav.events')}
        title={t('nav.events')}
        aria-current={isEventsActive ? 'page' : undefined}
      >
        <Icon name="clock" size={20} />
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
          className="grid size-9 place-items-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#FB7A1E,#E11D48)] text-[13px] font-semibold text-white"
          aria-label={t('auth.account')}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={handleAccountClick}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="size-full object-cover" />
          ) : (
            (initial ?? <Icon name="user" size={16} />)
          )}
        </button>

        {menuOpen && status === 'authed' && (
          <div
            className="absolute bottom-0 left-[calc(100%+10px)] z-50 min-w-[180px] rounded-[12px] border border-border bg-surface p-1.5 shadow-[var(--shadow-lg)] animate-[fadeIn_0.12s_ease]"
            role="menu"
          >
            <div className="px-2.5 pt-1.5 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-text-4">
              {pseudo ? t('auth.signedInAsName', { name: pseudo }) : t('auth.signedInAs')}
            </div>
            <Link
              to="/profile"
              className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-2 text-left text-[13px] text-text transition-colors duration-150 hover:bg-surface-2"
              role="menuitem"
              onClick={() => setMenuOpen(false)}
            >
              <Icon name="edit" size={16} />
              {t('profile.menuItem')}
            </Link>
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
