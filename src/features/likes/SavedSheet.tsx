import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ResponsiveOverlay } from '~/components/ui/ResponsiveOverlay'
import { Icon } from '~/components/ui/Icon'
import { useSession } from '~/features/auth/session'
import { savedSpotsQueryOptions } from '~/features/likes/queries'
import { SpotCard } from '~/features/spots/SpotCard'

interface SavedSheetProps {
  open: boolean
  /** Dismiss the overlay (backdrop / escape / close button / swipe-down). */
  onClose: () => void
  /** Navigate to a spot's detail; the overlay closes itself first. */
  onSelectSpot: (spotId: string) => void
}

/**
 * Saved (liked) spots shown as a dismissible overlay — a bottom Sheet on mobile
 * and a centered Modal on desktop (see ResponsiveOverlay), mirroring the sign-in
 * / onboarding chrome. Replaces the former standalone `/saved` page, which had no
 * way back to the map.
 */
export function SavedSheet({ open, onClose, onSelectSpot }: SavedSheetProps) {
  const { t } = useTranslation()
  const { userId } = useSession()
  const { data: spots = [] } = useQuery(savedSpotsQueryOptions(userId))

  const titleId = 'saved-sheet-title'

  return (
    <ResponsiveOverlay open={open} onClose={onClose} labelledBy={titleId} desktopClassName="w-[480px]">
      <div className="flex items-center justify-between border-b border-border px-[22px] py-[18px]">
        <h2 id={titleId} className="m-0 text-[17px] font-semibold tracking-[-0.01em]">
          {t('saved.title')}
        </h2>
        <button
          type="button"
          className="grid size-[30px] place-items-center rounded-[8px] text-text-3 transition-colors duration-150 hover:bg-surface-2 hover:text-text"
          aria-label={t('common.cancel')}
          onClick={onClose}
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-[14px] py-[10px] md:max-h-[60vh]">
        {spots.length === 0 ? (
          <p className="px-2 py-8 text-center text-[13px] text-text-3">{t('saved.empty')}</p>
        ) : (
          spots.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              active={false}
              onClick={() => {
                onClose()
                onSelectSpot(spot.id)
              }}
            />
          ))
        )}
      </div>
    </ResponsiveOverlay>
  )
}
