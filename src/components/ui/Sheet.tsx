import type { ReactNode } from 'react'
import { Drawer } from 'vaul'
import { cx } from './cx'

type SheetProps = {
  open: boolean
  onClose: () => void
  /** Visible header title; also used as the accessible dialog title. */
  title?: string
  children: ReactNode
  /** Extra classes on the sheet content card. */
  className?: string
}

/**
 * Mobile bottom sheet built on `vaul` — gives swipe-to-dismiss, drag-follow, and
 * spring open/close animation for free. Used as the mobile counterpart of desktop
 * modals/overlays (see ResponsiveOverlay).
 */
export function Sheet({ open, onClose, title, children, className }: SheetProps) {
  return (
    <Drawer.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Drawer.Content
          className={cx(
            'fixed inset-x-0 bottom-0 z-50 flex max-h-[92vh] flex-col rounded-t-[18px] border-t border-border bg-surface outline-none',
            className,
          )}
        >
          {/* Drag handle */}
          <div
            className="mx-auto mt-2.5 mb-1 h-1 w-9 shrink-0 rounded-full bg-border-strong"
            aria-hidden="true"
          />
          {title ? (
            <Drawer.Title className="shrink-0 px-5 pt-1 pb-2 text-[16px] font-semibold tracking-[-0.01em] text-text">
              {title}
            </Drawer.Title>
          ) : (
            <Drawer.Title className="sr-only">Sheet</Drawer.Title>
          )}
          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
