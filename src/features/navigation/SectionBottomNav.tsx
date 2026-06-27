import { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import { Sheet } from '~/components/ui/Sheet'
import { useSessionContext } from '~/features/auth/session'

export interface SectionBottomNavProps {
  onOpenSettings: () => void
}

const tab = 'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium'

/**
 * Mobile-only bottom navigation for the dedicated Clubs/Events sections
 * (hidden on `md+`, where the Rail is shown). The spots map has its own richer
 * BottomNav; this is the lighter cross-section switcher used by SectionShell.
 */
export function SectionBottomNav({ onOpenSettings }: SectionBottomNavProps) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { status, openSignIn, signOut } = useSessionContext()
  const [accountOpen, setAccountOpen] = useState(false)

  function handleAccount() {
    if (status === 'authed') setAccountOpen(true)
    else openSignIn()
  }

  const link = (active: boolean) => cx(tab, active ? 'text-accent' : 'text-text-3')

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label="Section navigation"
      >
        <Link to="/spots" className={link(pathname.startsWith('/spots'))} aria-label={t('nav.spots')}>
          <Icon name="map" size={22} />
          {t('nav.spots')}
        </Link>
        <Link to="/clubs" className={link(pathname.startsWith('/clubs'))} aria-label={t('nav.clubs')}>
          <Icon name="users" size={22} />
          {t('nav.clubs')}
        </Link>
        <Link
          to="/events"
          className={link(pathname.startsWith('/events'))}
          aria-label={t('nav.events')}
        >
          <Icon name="clock" size={22} />
          {t('nav.events')}
        </Link>
        <button type="button" onClick={onOpenSettings} className={link(false)} aria-label={t('settings.title')}>
          <Icon name="settings" size={22} />
          {t('settings.title')}
        </button>
        <button type="button" onClick={handleAccount} className={link(false)} aria-label={t('auth.account')}>
          <Icon name="user" size={22} />
          {t('auth.account')}
        </button>
      </nav>

      <Sheet open={accountOpen} onClose={() => setAccountOpen(false)} title={t('auth.account')}>
        <div className="px-4 pb-4">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-[10px] px-3 py-3 text-left text-[14px] text-text transition-colors duration-150 hover:bg-surface-2"
            onClick={() => {
              setAccountOpen(false)
              signOut()
            }}
          >
            <Icon name="user" size={18} />
            {t('auth.signOut')}
          </button>
        </div>
      </Sheet>
    </>
  )
}
