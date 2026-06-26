import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

const ICONS: ReactNode[] = [
  <>
    <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z" />
    <circle cx="12" cy="10" r="3" />
  </>,
  <>
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="7" y1="12" x2="17" y2="12" />
    <line x1="10" y1="18" x2="14" y2="18" />
  </>,
  <>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M8 4v16M16 4v16M3 10h5M16 10h5M3 14h5M16 14h5" />
  </>,
  <path d="m12 2 3 7h7l-5.5 4.5L18.5 22 12 17.5 5.5 22 7.5 13.5 2 9h7Z" />,
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>,
  <>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </>,
]

export function Features() {
  const { t } = useTranslation()
  const items = t('landing.features.items', { returnObjects: true }) as {
    title: string
    desc: string
  }[]

  return (
    <section className="section" id="features">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="eyebrow">{t('landing.features.eyebrow')}</p>
          <h2>{t('landing.features.title')}</h2>
          <p>{t('landing.features.sub')}</p>
        </div>
        <div className="feat-grid">
          {items.map((item, i) => (
            <article className="feat reveal" key={item.title} style={{ transitionDelay: `${i * 70}ms` }}>
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {ICONS[i]}
                </svg>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
