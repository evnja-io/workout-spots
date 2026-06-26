import { useTranslation } from 'react-i18next'
import { ContentPage } from './ContentPage'

const CONTACT_EMAIL = 'hello@evnja.gg'

export function ContactPage() {
  const { t } = useTranslation()
  return (
    <ContentPage>
      <article className="lp-prose">
        <span className="eyebrow">{t('pages.contact.eyebrow')}</span>
        <h1>{t('pages.contact.title')}</h1>
        <p className="lead">{t('pages.contact.lead')}</p>

        <div className="lp-contact-grid">
          <div className="lp-contact-card">
            <h2>{t('pages.contact.emailHeading')}</h2>
            <p>{t('pages.contact.emailBody')}</p>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </div>
          <div className="lp-contact-card">
            <h2>{t('pages.contact.socialHeading')}</h2>
            <p>{t('pages.contact.socialBody')}</p>
            <a href="https://www.instagram.com/workout.spots/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>
      </article>
    </ContentPage>
  )
}
