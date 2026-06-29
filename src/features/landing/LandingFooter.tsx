import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Logo } from '~/features/spots/Logo'
import { SectionLink } from './SectionLink'

type Props = {
  variant?: 'landing' | 'page'
}

export function LandingFooter({ variant = 'landing' }: Props) {
  const { t } = useTranslation()
  const year = 2026

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Link to="/" className="brand" aria-label={t('landing.nav.homeAria')}>
              <Logo size={34} className="m" title="Workout Spots" />
              <b>Workout Spots</b>
            </Link>
            <p>{t('landing.footer.blurb')}</p>
          </div>

          <div className="foot-col">
            <h4>{t('landing.footer.product')}</h4>
            <SectionLink id="features" variant={variant}>
              {t('landing.nav.features')}
            </SectionLink>
            <SectionLink id="how" variant={variant}>
              {t('landing.nav.how')}
            </SectionLink>
            <SectionLink id="spots" variant={variant}>
              {t('landing.footer.popularSpots')}
            </SectionLink>
            <Link to="/clubs">{t('landing.nav.clubs')}</Link>
            <Link to="/events">{t('landing.nav.events')}</Link>
            <Link to="/spots">{t('landing.nav.openMap')}</Link>
          </div>

          <div className="foot-col">
            <h4>{t('landing.footer.disciplines')}</h4>
            <Link to="/spots">{t('landing.disciplines.calisthenics')}</Link>
            <Link to="/spots">{t('landing.disciplines.streetWorkout')}</Link>
            <Link to="/spots">{t('landing.disciplines.parkour')}</Link>
            <Link to="/spots">{t('landing.disciplines.running')}</Link>
          </div>

          <div className="foot-col">
            <h4>{t('landing.footer.company')}</h4>
            <Link to="/about">{t('landing.footer.about')}</Link>
            <Link to="/contact">{t('landing.footer.contact')}</Link>
            <Link to="/privacy">{t('landing.footer.privacy')}</Link>
            <Link to="/terms">{t('landing.footer.terms')}</Link>
          </div>
        </div>

        <div className="foot-bottom">
          <span>{t('landing.footer.copyright', { year })}</span>
          <div className="socials">
            <a
              href="https://www.instagram.com/workout.spots/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
