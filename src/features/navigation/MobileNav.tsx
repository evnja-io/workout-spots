import { useState } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import { Sheet } from '~/components/ui/Sheet'
import { useSessionContext } from '~/features/auth/session'

export interface MobileNavProps {
  /**
   * Spots-only: open the add-spot wizard directly. When absent (clubs/events,
   * where the wizard isn't mounted), the "Add a spot" choice routes to
   * `/spots?create=spot` and the spots route opens the wizard on arrival.
   */
  onCreateSpot?: () => void
  onOpenSettings: () => void
}

const tab = 'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium'
const acctItem =
  'flex w-full items-center gap-2 rounded-[10px] px-3 py-3 text-left text-[14px] text-text transition-colors duration-150 hover:bg-surface-2'

/**
 * Unified mobile bottom navigation (hidden on `md+`, where the Rail is shown).
 * Used across every section so Clubs and Events are always reachable. The center
 * (+) opens a sheet offering all three create choices (spot / club / event), so
 * the action is explicit rather than depending on the current tab. Account opens
 * a sheet that also hosts Settings.
 */
export function MobileNav({ onCreateSpot, onOpenSettings }: MobileNavProps) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { status, openSignIn, signOut } = useSessionContext()
  const [accountOpen, setAccountOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  const link = (active: boolean) => cx(tab, active ? 'text-accent' : 'text-text-3')

  function handleAddSpot() {
    setCreateOpen(false)
    if (onCreateSpot) onCreateSpot()
    else void navigate({ to: '/spots', search: { create: 'spot' } })
  }

  function handleCreateClub() {
    setCreateOpen(false)
    void navigate({ to: '/clubs/new' })
  }

  function handleCreateEvent() {
    setCreateOpen(false)
    void navigate({ to: '/events/new' })
  }

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

        {/* Create FAB — lifted center; opens the three-choice sheet */}
        <div className="flex flex-1 justify-center">
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            data-testid="mobile-create-fab"
            aria-label={t('nav.create')}
            className="-mt-5 grid size-12 place-items-center rounded-full bg-accent text-white shadow-[var(--shadow-md)] transition-transform duration-150 active:translate-y-px"
          >
            <Icon name="plus" size={24} strokeWidth={2.5} />
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

      <Sheet open={createOpen} onClose={() => setCreateOpen(false)} title={t('nav.createTitle')}>
        <div className="flex flex-col px-3 pb-4">
          <button type="button" className={acctItem} onClick={handleAddSpot}>
            <Icon name="mappin" size={18} />
            {t('discover.addSpot')}
          </button>
          <button type="button" className={acctItem} onClick={handleCreateClub}>
            <Icon name="users" size={18} />
            {t('clubs.create')}
          </button>
          <button type="button" className={acctItem} onClick={handleCreateEvent}>
            <Icon name="clock" size={18} />
            {t('events.create')}
          </button>
        </div>
      </Sheet>

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
