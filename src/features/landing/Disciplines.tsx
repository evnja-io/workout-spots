import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

const KEYS = [
  'calisthenics',
  'streetWorkout',
  'parkour',
  'running',
  'crossfit',
  'yoga',
  'boxing',
  'climbing',
] as const

export function Disciplines() {
  const { t } = useTranslation()
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head reveal">
          <p className="eyebrow">{t('landing.disciplines.eyebrow')}</p>
          <h2>{t('landing.disciplines.title')}</h2>
        </div>
        <div className="disc-band reveal">
          {KEYS.map((k) => (
            <Link key={k} to="/spots" className="disc">
              {t(`landing.disciplines.${k}`)}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
