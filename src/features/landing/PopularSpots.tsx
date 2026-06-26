import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { SpotListItem, Equipment, Discipline } from '~/features/spots/domain'
import { resolveLabel } from '~/features/taxonomy/queries'

const GRADIENTS = [
  'linear-gradient(135deg,#3a1340,#1a0a20)',
  'linear-gradient(135deg,#43204a,#1a0a20)',
  'linear-gradient(135deg,#3a2340,#1a0a20)',
  'linear-gradient(135deg,#3a1840,#1a0a20)',
  'linear-gradient(135deg,#34203f,#1a0a20)',
  'linear-gradient(135deg,#3a2540,#1a0a20)',
]

function starString(rating: number): string {
  const full = Math.max(0, Math.min(5, Math.round(rating)))
  return '★'.repeat(full) + '☆'.repeat(5 - full)
}

type Props = {
  spots: SpotListItem[]
  equipments: Equipment[]
  disciplines: Discipline[]
}

export function PopularSpots({ spots, equipments, disciplines }: Props) {
  const { t } = useTranslation()

  const eqMap = new Map(equipments.map((e) => [e.id, e]))
  const discMap = new Map(disciplines.map((d) => [d.id, d]))

  // Top 6 by rating, then by number of ratings as a tiebreak.
  const top = [...spots]
    .sort((a, b) => b.averageRating - a.averageRating || b.ratingCount - a.ratingCount)
    .slice(0, 6)

  return (
    <section className="section" id="spots">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="eyebrow">{t('landing.spots.eyebrow')}</p>
          <h2>{t('landing.spots.title')}</h2>
          <p>{t('landing.spots.sub')}</p>
        </div>
        <div className="spots-grid">
          {top.length > 0
            ? top.map((spot, i) => {
                const disc = spot.disciplineIds[0] ? discMap.get(spot.disciplineIds[0]) : undefined
                const badge = disc ? resolveLabel(disc.localeKey, disc.name, t) : null
                const tags = spot.equipmentIds
                  .map((id) => eqMap.get(id))
                  .filter((e): e is Equipment => e != null)
                  .slice(0, 3)
                  .map((e) => resolveLabel(e.localeKey, e.name, t))
                const loc = spot.city || spot.address
                return (
                  <Link
                    key={spot.id}
                    to="/spots/$spotId"
                    params={{ spotId: spot.id }}
                    className="spot reveal"
                    style={{ transitionDelay: `${(i % 3) * 70}ms` }}
                  >
                    <div className="ph">
                      {badge && <span className="badge">{badge}</span>}
                      {spot.isOpen24h && <span className="open">{t('landing.spots.open24')}</span>}
                      {spot.thumbnailUrl ? (
                        <img src={spot.thumbnailUrl} alt={spot.name} loading="lazy" />
                      ) : (
                        <div className="ph-fallback" aria-hidden="true" style={{ background: GRADIENTS[i % GRADIENTS.length] }} />
                      )}
                    </div>
                    <div className="body">
                      <h3>{spot.name}</h3>
                      {loc && <div className="loc">{loc}</div>}
                      {spot.averageRating > 0 && (
                        <div className="meta">
                          <span className="stars" aria-hidden="true">
                            {starString(spot.averageRating)}
                          </span>
                          <span className="rate">{spot.averageRating.toFixed(1)}</span>
                          {spot.ratingCount > 0 && (
                            <span className="cnt">· {t('landing.spots.reviews', { count: spot.ratingCount })}</span>
                          )}
                        </div>
                      )}
                      {tags.length > 0 && (
                        <div className="tags">
                          {tags.map((tag) => (
                            <span className="tag" key={tag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })
            : /* Graceful fallback when Supabase has no data (mocks-first / unconfigured) */
              (t('landing.spots.showcase', { returnObjects: true }) as ShowcaseCard[]).map((card, i) => (
                <Link key={card.name} to="/spots" className="spot reveal" style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
                  <div className="ph">
                    <span className="badge">{card.badge}</span>
                    {card.open && <span className="open">{t('landing.spots.open24')}</span>}
                    <div className="ph-fallback" aria-hidden="true" style={{ background: GRADIENTS[i % GRADIENTS.length] }} />
                  </div>
                  <div className="body">
                    <h3>{card.name}</h3>
                    <div className="loc">{card.loc}</div>
                    <div className="meta">
                      <span className="stars" aria-hidden="true">
                        {starString(card.rating)}
                      </span>
                      <span className="rate">{card.rating.toFixed(1)}</span>
                      <span className="cnt">· {t('landing.spots.reviews', { count: card.reviews })}</span>
                    </div>
                    <div className="tags">
                      {card.tags.map((tag) => (
                        <span className="tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  )
}

type ShowcaseCard = {
  name: string
  loc: string
  badge: string
  open: boolean
  rating: number
  reviews: number
  tags: string[]
}
