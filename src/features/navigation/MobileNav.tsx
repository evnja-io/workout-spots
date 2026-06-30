import { useState } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import { Sheet } from '~/components/ui/Sheet'
import { useSessionContext } from '~/features/auth/session'

export interface MobileNavProps {
  /** Spots-only: open the add-spot wizard. On clubs/events the + navigates to the create route. */
  onCreateSpot?: () => void
  onOpenSettings: () => void
}

const tab = 'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium'
const acctItem =
  'flex w-full items-center gap-2 rounded-[10px] px-3 py-3 text-left text-[14px] text-text transition-colors duration-150 hover:bg-surface-2'

/**
 * Unified mobile bottom navigation (hidden on `md+`, where the Rail is shown).
 * Used across every section so Clubs and Events are always reachable. The center
 * (+) is context-aware (add spot / create club / create event); Account opens a
 * sheet that also hosts Settings.
 */
export function MobileNav({ onCreateSpot, onOpenSettings }: MobileNavProps) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { status, openSignIn, signOut } = useSessionContext()
  const [accountOpen, setAccountOpen] = useState(false)

  const link = (active: boolean) => cx(tab, active ? 'text-accent' : 'text-text-3')

  function handleCreate() {
    if (pathname.startsWith('/clubs')) void navigate({ to: '/clubs/new' })
    else if (pathname.startsWith('/events')) void navigate({ to: '/events/new' })
    else onCreateSpot?.()
  }

  // Context-aware create affordance: show what the (+) will add on the current tab.
  const create = pathname.startsWith('/clubs')
    ? { icon: 'users' as const, label: t('clubs.create') }
    : pathname.startsWith('/events')
      ? { icon: 'clock' as const, label: t('events.create') }
      : { icon: 'mappin' as const, label: t('discover.addSpot') }

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label="Main navigation"
      >
        <Link
          to="/spots"
          className={link(pathname.startsWith('/spots'))}
          aria-label={t('nav.spots')}
        >
          <Icon name="map" size={22} />
          {t('nav.spots')}
        </Link>
        <Link
          to="/clubs"
          className={link(pathname.startsWith('/clubs'))}
          aria-label={t('nav.clubs')}
        >
          <Icon name="users" size={22} />
          {t('nav.clubs')}
        </Link>

        {/* Context-aware create FAB — lifted center */}
        <div className="flex flex-1 justify-center">
          <button
            type="button"
            onClick={handleCreate}
            data-testid="mobile-create-fab"
            aria-label={create.label}
            className="-mt-5 grid size-12 place-items-center rounded-full bg-accent text-white shadow-[var(--shadow-md)] transition-transform duration-150 active:translate-y-px"
          >
            <span className="relative grid place-items-center">
              <Icon name={create.icon} size={22} />
              <span className="absolute -bottom-2 -right-2 grid size-[15px] place-items-center rounded-full bg-white text-accent shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                <Icon name="plus" size={11} strokeWidth={3} />
              </span>
            </span>
          </button>
        </div>

        <Link
          to="/events"
          className={link(pathname.startsWith('/events'))}
          aria-label={t('nav.events')}
        >
          <Icon name="clock" size={22} />
          {t('nav.events')}
        </Link>
        <button
          type="button"
          onClick={() => setAccountOpen(true)}
          className={link(false)}
          aria-label={t('auth.account')}
        >
          <Icon name="user" size={22} />
          {t('auth.account')}
        </button>
      </nav>

      <Sheet open={accountOpen} onClose={() => setAccountOpen(false)} title={t('auth.account')}>
        <div className="flex flex-col px-3 pb-4">
          {status === 'authed' && (
            <Link to="/profile" className={acctItem} onClick={() => setAccountOpen(false)}>
              <Icon name="edit" size={18} />
              {t('profile.menuItem')}
            </Link>
          )}
          <button
            type="button"
            className={acctItem}
            onClick={() => {
              setAccountOpen(false)
              onOpenSettings()
            }}
          >
            <Icon name="settings" size={18} />
            {t('settings.title')}
          </button>
          {status === 'authed' ? (
            <button
              type="button"
              className={acctItem}
              onClick={() => {
                setAccountOpen(false)
                signOut()
              }}
            >
              <Icon name="user" size={18} />
              {t('auth.signOut')}
            </button>
          ) : (
            <button
              type="button"
              className={acctItem}
              onClick={() => {
                setAccountOpen(false)
                openSignIn()
              }}
            >
              <Icon name="user" size={18} />
              {t('auth.signInTitle')}
            </button>
          )}
        </div>
      </Sheet>
    </>
  )
}
