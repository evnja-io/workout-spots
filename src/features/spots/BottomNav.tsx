import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon, type IconName } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import { Sheet } from '~/components/ui/Sheet'
import { useSessionContext } from '~/features/auth/session'

export interface BottomNavProps {
  onOpenList: () => void
  onOpenAdd: () => void
  onOpenSettings: () => void
  onOpenSaved: () => void
  /** Highlight the Saved tab while its overlay is open. */
  savedActive?: boolean
}

const tab = 'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium'

function TabButton({
  icon,
  label,
  active,
  iconFilled,
  onClick,
}: {
  icon: IconName
  label: string
  active?: boolean
  /** Render the icon solid (used for the Saved heart when active). */
  iconFilled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(tab, active ? 'text-accent' : 'text-text-3')}
      aria-label={label}
      aria-current={active || undefined}
    >
      <Icon name={icon} size={22} fill={iconFilled ? 'currentColor' : 'none'} />
      {label}
    </button>
  )
}

/**
 * Mobile-only bottom navigation bar (hidden on `md+`, where the Rail is shown).
 * Replaces the Rail's actions: List sheet, Saved, a center Add FAB, Settings,
 * and Account (sign-in / sign-out).
 */
export function BottomNav({
  onOpenList,
  onOpenAdd,
  onOpenSettings,
  onOpenSaved,
  savedActive = false,
}: BottomNavProps) {
  const { t } = useTranslation()
  const { status, openSignIn, signOut } = useSessionContext()
  const [accountOpen, setAccountOpen] = useState(false)

  function handleAccount() {
    if (status === 'authed') setAccountOpen(true)
    else openSignIn()
  }

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label="Main navigation"
      >
        <TabButton icon="list" label={t('discover.title')} onClick={onOpenList} />

        <TabButton
          icon="heart"
          label={t('saved.title')}
          active={savedActive}
          iconFilled={savedActive}
          onClick={onOpenSaved}
        />

        {/* Center Add FAB — lifted above the bar */}
        <div className="flex flex-1 justify-center">
          <button
            type="button"
            onClick={onOpenAdd}
            data-testid="add-spot-fab"
            aria-label={t('discover.addSpot')}
            className="-mt-5 grid size-12 place-items-center rounded-full bg-accent text-white shadow-[var(--shadow-md)] transition-transform duration-150 active:translate-y-px"
          >
            <Icon name="plus" size={24} />
          </button>
        </div>

        <TabButton icon="settings" label={t('settings.title')} onClick={onOpenSettings} />
        <TabButton icon="user" label={t('auth.account')} onClick={handleAccount} />
      </nav>

      {/* Account actions sheet (authed only) */}
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
