import { useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'

export type NavItem = { label: string; href: string }

type Props = {
  open: boolean
  onClose: () => void
  items: NavItem[]
  onNavigate: (href: string) => void
  ctaLabel: string
  closeLabel: string
}

/**
 * Accessible mobile navigation — a focus-trapped disclosure panel replacing the
 * design's broken `onclick=scrollIntoView` toggle. Closes on Esc, on backdrop
 * click and after a link is chosen; locks body scroll and traps Tab while open
 * (NN/g: user control & freedom; WCAG focus management).
 */
export function MobileMenu({ open, onClose, items, onNavigate, ctaLabel, closeLabel }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )

    // Move focus into the panel.
    focusables()[0]?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const f = focusables()
      const first = f[0]
      const last = f[f.length - 1]
      if (!first || !last) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="nav-menu" style={{ display: 'block' }}>
      <div className="nav-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className="nav-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <button type="button" className="nav-close" onClick={onClose} aria-label={closeLabel}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => {
              e.preventDefault()
              onNavigate(item.href)
            }}
          >
            {item.label}
          </a>
        ))}
        <Link to="/spots" className="btn btn-primary" onClick={onClose}>
          {ctaLabel}
        </Link>
      </div>
    </div>
  )
}
