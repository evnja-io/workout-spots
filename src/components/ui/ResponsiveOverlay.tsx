import type { ReactNode } from 'react'
import { Modal } from './Modal'
import { Sheet } from './Sheet'
import { useIsMobile } from '~/lib/hooks/useMediaQuery'

type ResponsiveOverlayProps = {
  open: boolean
  onClose: () => void
  labelledBy?: string
  /** Extra classes applied to the desktop Modal card (size variants, etc.). */
  desktopClassName?: string
  children: ReactNode
}

/**
 * Renders a centered Modal on desktop and a bottom Sheet on mobile, sharing the
 * same children. The children keep their own header/body/footer markup; this
 * component only swaps the surrounding chrome based on viewport.
 *
 * SSR renders the desktop Modal (useIsMobile is false until mount), then swaps to
 * the Sheet on mobile after hydration — overlays open via user interaction, so
 * this never causes a hydration mismatch.
 */
export function ResponsiveOverlay({
  open,
  onClose,
  labelledBy,
  desktopClassName,
  children,
}: ResponsiveOverlayProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Sheet open={open} onClose={onClose}>
        {children}
      </Sheet>
    )
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy={labelledBy} className={desktopClassName}>
      {children}
    </Modal>
  )
}
