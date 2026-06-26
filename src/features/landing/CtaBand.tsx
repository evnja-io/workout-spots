import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export function CtaBand() {
  const { t } = useTranslation()
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="cta-band reveal">
          <div className="glow" />
          <h2>{t('landing.cta.title')}</h2>
          <p>{t('landing.cta.sub')}</p>
          <div className="hero-actions">
            <Link to="/spots" className="btn btn-primary btn-lg">
              {t('landing.cta.addSpot')}
            </Link>
            <Link to="/spots" className="btn btn-ghost btn-lg">
              {t('landing.cta.explore')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
