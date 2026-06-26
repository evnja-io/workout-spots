import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { scrollToAnchor } from './hooks'

export function Hero() {
  const { t } = useTranslation()
  const mapRef = useRef<HTMLDivElement>(null)

  // Subtle pointer parallax on the map mock. Disabled under reduced-motion and
  // on coarse pointers (touch) so it never interferes with scrolling.
  function onPointerMove(e: React.PointerEvent) {
    const el = mapRef.current
    if (!el || e.pointerType !== 'mouse') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--px', String((e.clientX - r.left) / r.width - 0.5))
    el.style.setProperty('--py', String((e.clientY - r.top) / r.height - 0.5))
  }
  function resetTilt() {
    const el = mapRef.current
    if (!el) return
    el.style.setProperty('--px', '0')
    el.style.setProperty('--py', '0')
  }

  return (
    <section className="hero">
      <div className="hero-glow" />
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">{t('landing.hero.eyebrow')}</p>
          <h1>
            {t('landing.hero.titleLead')} <span className="gradtext">{t('landing.hero.titleHighlight')}</span>
          </h1>
          <p className="hero-sub">{t('landing.hero.sub')}</p>
          <div className="hero-actions">
            <Link to="/spots" className="btn btn-primary btn-lg">
              {t('landing.hero.explore')}
            </Link>
            <a
              href="#how"
              className="btn btn-ghost btn-lg"
              onClick={(e) => {
                e.preventDefault()
                scrollToAnchor('#how')
              }}
            >
              {t('landing.hero.how')}
            </a>
          </div>
          <div className="hero-trust">
            <span className="stars" aria-hidden="true">
              ★★★★★
            </span>
            <span>{t('landing.hero.trustRating')}</span>
            <span className="dot" aria-hidden="true" />
            <span>{t('landing.hero.trustSpots')}</span>
          </div>
        </div>

        <div
          ref={mapRef}
          className="map-mock"
          role="img"
          aria-label={t('landing.hero.mapAria')}
          onPointerMove={onPointerMove}
          onPointerLeave={resetTilt}
        >
          <div className="grid" />
          <div className="river" />
          <span className="road r1" />
          <span className="road r2" />
          <span className="road r3" />
          <div className="pin f" style={{ top: '30%', left: '28%' }}>
            <div className="head" />
          </div>
          <div className="pin f2" style={{ top: '46%', left: '62%' }}>
            <div className="head" />
          </div>
          <div className="pin f3" style={{ top: '64%', left: '40%' }}>
            <div className="head" />
          </div>
          <div className="pin lg" style={{ top: '39%', left: '47%' }}>
            <div className="ring" />
            <div className="head" />
          </div>
          <div className="pin f" style={{ top: '72%', left: '74%' }}>
            <div className="head" />
          </div>
          <div className="map-card">
            <div className="thumb" />
            <div className="info">
              <b>{t('landing.hero.mapCardName')}</b>
              <span>{t('landing.hero.mapCardMeta')}</span>
            </div>
            <div className="rate">★ 4.8</div>
          </div>
        </div>
      </div>
    </section>
  )
}
