import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SpotDetail } from './domain'
import { Stars } from '~/components/ui/Stars'
import { Icon } from '~/components/ui/Icon'
import { Button } from '~/components/ui/Button'
import { resolveLabel } from '~/features/taxonomy/queries'
import { useSaveSpot } from '~/features/likes/useSaveSpot'
import { useAuthGate } from '~/features/auth/useAuthGate'
import { ReviewList } from '~/features/reviews/ReviewList'
import { ReviewForm } from '~/features/reviews/ReviewForm'
import { AddSpotWizard } from '~/features/add-spot/AddSpotWizard'
import type { AddSpotInput } from '~/features/add-spot/schema'

export function Detail({ spot, onClose }: { spot: SpotDetail; onClose: () => void }) {
  const { t } = useTranslation()
  const [imgIdx, setImgIdx] = useState(0)
  const [editOpen, setEditOpen] = useState(false)
  const { liked, toggle, pending } = useSaveSpot(spot.id)
  const gate = useAuthGate()

  const editInitialValues: AddSpotInput = {
    position: { lng: spot.longitude, lat: spot.latitude },
    address: spot.address,
    city: spot.city,
    region: spot.region,
    country: spot.country,
    name: spot.name,
    description: spot.description ?? '',
    isOpen24h: spot.isOpen24h,
    disciplines: spot.disciplines.map((d) => d.id),
    equipment: spot.equipment.map((e) => e.id),
  }

  const hasImages = spot.images.length > 0
  const currentImg = spot.images[imgIdx]

  return (
    <div className="detail">
      <div className="detail-hero">
        {hasImages && currentImg ? (
          <img
            src={currentImg.url}
            alt={spot.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            className="swatch"
            style={{ '--c1': '#6366f1', '--c2': '#8b5cf6' } as React.CSSProperties}
          />
        )}
        <div className="detail-hero-overlay" />
        <button className="detail-close" type="button" onClick={onClose} aria-label="Close">
          <Icon name="close" size={16} />
        </button>
        {hasImages && spot.images.length > 1 && (
          <div className="detail-thumbs">
            {spot.images.map((img, i) => (
              <button
                key={img.id}
                className={'t' + (i === imgIdx ? ' active' : '')}
                type="button"
                onClick={() => setImgIdx(i)}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="detail-body">
        <div className="detail-title-row">
          <h2>{spot.name}</h2>
          <span className="rating-badge">
            <Stars value={spot.averageRating} size={12} />
            <span>{spot.averageRating}</span>
          </span>
        </div>

        <div className="detail-address">
          <Icon name="mappin" size={13} />
          <span>
            {spot.address}
            {spot.city ? `, ${spot.city}` : ''}
          </span>
        </div>

        <div className="detail-stats">
          <div className="stat">
            <span className="stat-v">{spot.averageRating}</span>
            <span className="stat-l">{t('detail.rating')}</span>
          </div>
          <div className="stat-sep" />
          <div className="stat">
            <span className="stat-v">{spot.ratingCount}</span>
            <span className="stat-l">{t('detail.reviews')}</span>
          </div>
          <div className="stat-sep" />
          <div className="stat">
            <span className="stat-v">{spot.equipment.length}</span>
            <span className="stat-l">{t('detail.equipment')}</span>
          </div>
        </div>

        {spot.description && (
          <>
            <div className="section-title">{t('detail.about')}</div>
            <p className="detail-desc">{spot.description}</p>
          </>
        )}

        {spot.disciplines.length > 0 && (
          <>
            <div className="section-title">{t('detail.disciplines')}</div>
            <div className="tag-grid">
              {spot.disciplines.map((d) => (
                <span key={d.id} className="tag-chip v">
                  {resolveLabel(d.localeKey, d.name, t)}
                </span>
              ))}
            </div>
          </>
        )}

        {spot.equipment.length > 0 && (
          <>
            <div className="section-title">{t('detail.equipment')}</div>
            <div className="tag-grid">
              {spot.equipment.map((eq) => (
                <span key={eq.id} className="tag-chip">
                  {resolveLabel(eq.localeKey, eq.name, t)}
                </span>
              ))}
            </div>
          </>
        )}

        {spot.source && spot.sourceUrl ? (
          <a
            className="tag-chip source-credit"
            href={spot.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={spot.sourceUrl}
          >
            <Icon name="share" size={12} />
            {t('detail.sourceThanks', { source: spot.source })}
          </a>
        ) : spot.addedByUser ? (
          <p className="detail-credit">
            {spot.contributorName
              ? t('detail.addedBy', { name: spot.contributorName })
              : t('detail.addedByMember')}
          </p>
        ) : null}

        <div className="section-title">{t('detail.reviews')}</div>
        <ReviewList comments={spot.comments} />
        <ReviewForm spotId={spot.id} />

        <div className="detail-actions">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <Icon name="route" size={14} />
            {t('detail.getDirections')}
          </a>
          <Button
            variant="secondary"
            onClick={toggle}
            disabled={pending}
            aria-pressed={liked}
            data-testid="save-button"
          >
            <Icon name="heart" size={14} />
            {liked ? t('detail.saved') : t('detail.save')}
          </Button>
          <Button
            variant="secondary"
            onClick={() => gate(() => setEditOpen(true))}
            data-testid="edit-button"
          >
            <Icon name="edit" size={14} />
            {t('editSpot.title')}
          </Button>
        </div>
      </div>

      <AddSpotWizard
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        spotId={spot.id}
        initialValues={editInitialValues}
        initialImages={spot.images}
        onSaved={() => setEditOpen(false)}
      />
    </div>
  )
}
