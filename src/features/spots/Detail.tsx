import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SpotDetail } from './domain'
import { Stars } from '~/components/ui/Stars'
import { Icon } from '~/components/ui/Icon'
import { Button } from '~/components/ui/Button'
import { TagChip } from '~/components/ui/Tag'
import { RatingBadge } from '~/components/ui/RatingBadge'
import { Sheet } from '~/components/ui/Sheet'
import { useIsMobile } from '~/lib/hooks/useMediaQuery'
import { resolveLabel } from '~/features/taxonomy/queries'
import { useSaveSpot } from '~/features/likes/useSaveSpot'
import { useAuthGate } from '~/features/auth/useAuthGate'
import { trackEvent } from '~/features/analytics/gtag'
import { ReviewList } from '~/features/reviews/ReviewList'
import { ReviewForm } from '~/features/reviews/ReviewForm'
import { SpotGallery } from './SpotGallery'
import { AddSpotWizard } from '~/features/add-spot/AddSpotWizard'
import type { AddSpotInput } from '~/features/add-spot/schema'
import { ReportDialog } from '~/features/reports/ReportDialog'

export function Detail({ spot, onClose }: { spot: SpotDetail; onClose: () => void }) {
  const { t } = useTranslation()
  const [editOpen, setEditOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
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

  const isMobile = useIsMobile()

  const content = (
    <>
      <div className="relative h-[210px] shrink-0 overflow-hidden bg-surface-2">
        <SpotGallery images={spot.images} alt={spot.name} />
        <button
          className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-[rgba(255,255,255,0.95)] text-text shadow-[var(--shadow-sm)] transition-[background-color] duration-150 hover:bg-white [[data-theme=dark]_&]:bg-[rgba(20,23,28,0.92)] [[data-theme=dark]_&]:text-text [[data-theme=dark]_&]:hover:bg-surface"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          <Icon name="close" size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4.5 pb-5">
        <div className="mb-1.5 flex items-start justify-between gap-2.5">
          <h2 className="m-0 text-[20px] font-semibold leading-[1.2] tracking-[-0.01em]">
            {spot.name}
          </h2>
          <RatingBadge>
            <Stars value={spot.averageRating} size={12} />
            <span>{spot.averageRating}</span>
          </RatingBadge>
        </div>

        <div className="mb-3 flex items-center gap-1.5 text-[13px] text-text-3">
          <Icon name="mappin" size={13} />
          <span>
            {spot.address}
            {spot.city ? `, ${spot.city}` : ''}
          </span>
        </div>

        <div className="mb-3.5 flex items-center gap-3.5 border-t border-b border-border py-3">
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold">{spot.averageRating}</span>
            <span className="text-[11px] tracking-[0.01em] text-text-3">{t('detail.rating')}</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold">{spot.ratingCount}</span>
            <span className="text-[11px] tracking-[0.01em] text-text-3">{t('detail.reviews')}</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold">{spot.equipment.length}</span>
            <span className="text-[11px] tracking-[0.01em] text-text-3">{t('detail.equipment')}</span>
          </div>
        </div>

        {spot.description && (
          <>
            <div className="mx-0 mt-4 mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-3">{t('detail.about')}</div>
            <p className="text-[13.5px] leading-[1.55] text-text-2">{spot.description}</p>
          </>
        )}

        {spot.disciplines.length > 0 && (
          <>
            <div className="mx-0 mt-4 mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-3">{t('detail.disciplines')}</div>
            <div className="flex flex-wrap gap-1.5">
              {spot.disciplines.map((d) => (
                <TagChip key={d.id} accent>
                  {resolveLabel(d.localeKey, d.name, t)}
                </TagChip>
              ))}
            </div>
          </>
        )}

        {spot.equipment.length > 0 && (
          <>
            <div className="mx-0 mt-4 mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-3">{t('detail.equipment')}</div>
            <div className="flex flex-wrap gap-1.5">
              {spot.equipment.map((eq) => (
                <TagChip key={eq.id}>
                  {resolveLabel(eq.localeKey, eq.name, t)}
                </TagChip>
              ))}
            </div>
          </>
        )}

        {spot.source && spot.sourceUrl ? (
          <a
            className="mt-3.5 inline-flex items-center gap-1.5 rounded-[8px] bg-surface-2 px-2.5 py-[5px] text-[12px] font-medium text-text-2 no-underline transition-colors duration-150 hover:text-accent hover:underline"
            href={spot.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={spot.sourceUrl}
          >
            <Icon name="share" size={12} />
            {t('detail.sourceThanks', { source: spot.source })}
          </a>
        ) : spot.addedByUser ? (
          <p className="mt-3.5 text-[12px] text-text-3">
            {spot.contributorName
              ? t('detail.addedBy', { name: spot.contributorName })
              : t('detail.addedByMember')}
          </p>
        ) : null}

        <div className="mx-0 mt-4 mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-3">{t('detail.reviews')}</div>
        <ReviewList spotId={spot.id} comments={spot.comments} />
        <ReviewForm spotId={spot.id} />

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-w-0 flex-[1_1_8rem] items-center justify-center gap-1.5 rounded-[10px] bg-accent px-3.5 py-2.5 text-[13px] font-medium text-accent-fg transition-[background-color,border-color,color,opacity] duration-150 hover:bg-accent-2"
            onClick={() => trackEvent('get_directions', { spot_id: spot.id })}
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
            className={liked ? 'border-accent bg-accent-soft text-accent hover:bg-accent-soft' : undefined}
          >
            <Icon name="heart" size={14} fill={liked ? 'currentColor' : 'none'} />
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
          <Button
            variant="secondary"
            onClick={() => setReportOpen(true)}
            data-testid="report-button"
          >
            <Icon name="flag" size={14} />
            {t('report.button')}
          </Button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {isMobile ? (
        <Sheet open onClose={onClose}>
          {content}
        </Sheet>
      ) : (
        <div className="absolute top-[14px] right-[14px] z-[4] flex max-h-[calc(100vh-28px)] w-[420px] flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-[var(--shadow-lg)] animate-[slideIn_0.25s_ease]">
          {content}
        </div>
      )}

      <AddSpotWizard
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        spotId={spot.id}
        initialValues={editInitialValues}
        initialImages={spot.images}
        onSaved={() => setEditOpen(false)}
      />

      <ReportDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        targetType="spot"
        targetId={spot.id}
      />
    </>
  )
}
