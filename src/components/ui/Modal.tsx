import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cx } from './cx'

type ModalProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  labelledBy?: string
  /** Extra class on the `.modal` card (e.g. a size variant). */
  className?: string
}

export function Modal({ open, onClose, children, labelledBy, className }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab') {
        const el = modalRef.current
        if (!el) return
        const focusable = el.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!first || !last) return
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    modalRef.current?.focus()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  if (typeof document === 'undefined') return null

  const handleBackdropClick = () => {
    onClose()
  }

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return createPortal(
    <div
      data-testid="modal-backdrop"
      className="fixed inset-0 z-20 grid place-items-center bg-[rgba(15,23,42,0.35)] backdrop-blur-[4px] animate-[fadeIn_0.2s_ease]"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={cx(
          'flex w-[540px] max-w-[calc(100vw-40px)] max-h-[calc(100vh-40px)] flex-col overflow-hidden rounded-[18px] bg-surface shadow-[var(--shadow-lg)]',
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        onClick={stopPropagation}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
