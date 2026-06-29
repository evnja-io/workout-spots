import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { COVERS, PosterAvatars } from './posterMocks'

type EventCard = {
  title: string
  month: string
  day: string
  meta: string
  price: string
  status: string
  tags: string[]
}
type Step = { title: string; desc: string }

// Visual seed paired by index with landing.events.showcase.
const SEED = [
  { live: true, going: 18, avatars: ['AK', 'ML', 'JD', 'RN'], more: 14 },
  { live: false, going: 7, avatars: ['TC', 'MB', 'LF'], more: 4 },
  { live: false, going: 24, avatars: ['NR', 'PD', 'SG', 'AV'], more: 20 },
] as const

export function Events() {
  const { t } = useTranslation()
  const cards = t('landing.events.showcase', { returnObjects: true }) as EventCard[]
  const steps = t('landing.events.steps', { returnObjects: true }) as Step[]

  return (
    <section className="section" id="events">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="eyebrow eyebrow-live">{t('landing.events.eyebrow')}</p>
          <h2>{t('landing.events.title')}</h2>
          <p>{t('landing.events.sub')}</p>
        </div>

        <div className="poster-grid">
          {cards.map((card, i) => {
            const seed = SEED[i % SEED.length] ?? SEED[0]
            return (
              <Link
                key={card.title}
                to="/events"
                className="pcard reveal"
                style={{ transitionDelay: `${(i % 3) * 70}ms` }}
              >
                <div
                  className="cover"
                  aria-hidden="true"
                  style={{ background: COVERS[(i + 3) % COVERS.length] }}
                />
                <div className="scrim" aria-hidden="true" />
                <div className="ptop">
                  <span className="lp-cal" aria-hidden="true">
                    <span className="m">{card.month}</span>
                    <span className="d">{card.day}</span>
                  </span>
                  <span className="pill price">{card.price}</span>
                </div>
                <div className="meat">
                  <div className="ptags">
                    <span className={`ptag status${seed.live ? ' live' : ''}`}>
                      {seed.live && <i className="dot" aria-hidden="true" />}
                      {card.status}
                    </span>
                    {card.tags.map((tag) => (
                      <span className="ptag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="ptitle">{card.title}</h3>
                  <p className="pmeta">{card.meta}</p>
                  <PosterAvatars
                    people={seed.avatars}
                    more={seed.more}
                    label={t('events.goingCount', { count: seed.going })}
                  />
                </div>
              </Link>
            )
          })}
        </div>

        <div className="lp-flow reveal">
          {steps.map((step, i) => (
            <div className="lp-flow-item" key={step.title}>
              <span className="lp-flow-n">{i + 1}</span>
              <div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="section-cta reveal">
          <Link to="/events" className="btn btn-primary btn-lg">
            {t('landing.events.cta')}
          </Link>
        </div>
      </div>
    </section>
  )
}
