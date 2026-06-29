import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { COVERS, PosterAvatars } from './posterMocks'

type ClubCard = { name: string; category: string; meta: string; tags: string[] }
type Step = { title: string; desc: string }

// Visual seed paired by index with landing.clubs.showcase (translatable copy
// lives in i18n; privacy + avatar initials stay here).
const SEED = [
  { privacy: 'public', avatars: ['AK', 'ML', 'JD', 'RN'], more: 124 },
  { privacy: 'private', avatars: ['TC', 'MB', 'LF'], more: 61 },
  { privacy: 'public', avatars: ['NR', 'PD', 'SG', 'AV'], more: 208 },
] as const

function PrivacyIcon({ privacy }: { privacy: 'public' | 'private' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {privacy === 'private' ? (
        <>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </>
      )}
    </svg>
  )
}

export function Clubs() {
  const { t } = useTranslation()
  const cards = t('landing.clubs.showcase', { returnObjects: true }) as ClubCard[]
  const steps = t('landing.clubs.steps', { returnObjects: true }) as Step[]

  return (
    <section className="section" id="clubs">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="eyebrow">{t('landing.clubs.eyebrow')}</p>
          <h2>{t('landing.clubs.title')}</h2>
          <p>{t('landing.clubs.sub')}</p>
        </div>

        <div className="poster-grid">
          {cards.map((card, i) => {
            const seed = SEED[i % SEED.length] ?? SEED[0]
            return (
              <Link
                key={card.name}
                to="/clubs"
                className="pcard reveal"
                style={{ transitionDelay: `${(i % 3) * 70}ms` }}
              >
                <div
                  className="cover"
                  aria-hidden="true"
                  style={{ background: COVERS[i % COVERS.length] }}
                />
                <div className="scrim" aria-hidden="true" />
                <div className="ptop">
                  <span className="pill">{card.category}</span>
                  <span className="pill ico">
                    <PrivacyIcon privacy={seed.privacy} />
                  </span>
                </div>
                <div className="meat">
                  <div className="ptags">
                    {card.tags.map((tag) => (
                      <span className="ptag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="ptitle">{card.name}</h3>
                  <p className="pmeta">{card.meta}</p>
                  <PosterAvatars people={seed.avatars} more={seed.more} />
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
          <Link to="/clubs" className="btn btn-primary btn-lg">
            {t('landing.clubs.cta')}
          </Link>
        </div>
      </div>
    </section>
  )
}
