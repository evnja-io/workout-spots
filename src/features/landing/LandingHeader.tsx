import { useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Logo } from '~/features/spots/Logo'
import { useScrolled, useScrollSpy, scrollToAnchor } from './hooks'
import { MobileMenu, type NavItem } from './MobileMenu'

const SECTION_IDS = ['features', 'clubs', 'events', 'how', 'spots', 'faq']

type Props = {
  /** 'landing' enables smooth-scroll + scroll-spy; 'page' links back to the home sections. */
  variant?: 'landing' | 'page'
}

export function LandingHeader({ variant = 'landing' }: Props) {
  const { t } = useTranslation()
  const scrolled = useScrolled()
  const activeId = useScrollSpy(variant === 'landing' ? SECTION_IDS : [])
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const items: NavItem[] = [
    { label: t('landing.nav.features'), href: '#features' },
    { label: t('landing.nav.clubs'), href: '#clubs' },
    { label: t('landing.nav.events'), href: '#events' },
    { label: t('landing.nav.how'), href: '#how' },
    { label: t('landing.nav.spots'), href: '#spots' },
    { label: t('landing.nav.faq'), href: '#faq' },
  ]

  function handleNav(href: string) {
    setMenuOpen(false)
    const id = href.replace(/^#/, '')
    if (variant === 'landing') {
      scrollToAnchor(href)
    } else {
      void navigate({ to: '/', hash: id })
    }
  }

  function closeMenu() {
    setMenuOpen(false)
    toggleRef.current?.focus()
  }

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap nav">
        <Link to="/" className="brand" aria-label={t('landing.nav.homeAria')}>
          <Logo size={34} className="m" title="Workout Spots" />
          <b>Workout Spots</b>
        </Link>

        <nav className="nav-links" aria-label={t('landing.nav.primaryAria')}>
          {items.map((item) => {
            const id = item.href.replace(/^#/, '')
            return (
              <a
                key={item.href}
                href={variant === 'landing' ? item.href : `/${item.href}`}
                aria-current={variant === 'landing' && activeId === id ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  handleNav(item.href)
                }}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className="nav-cta">
          <Link to="/spots" className="btn btn-primary">
            {t('landing.nav.openMap')}
          </Link>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-label={t('landing.nav.openMenu')}
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
          onClick={() => setMenuOpen(true)}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="7" x2="21" y2="7" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="17" x2="21" y2="17" />
          </svg>
        </button>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        items={items}
        onNavigate={handleNav}
        ctaLabel={t('landing.nav.openMap')}
        closeLabel={t('landing.nav.closeMenu')}
      />
    </header>
  )
}
