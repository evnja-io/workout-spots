import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { cdnImageUrl } from '~/lib/cdn/images'
import { Icon } from './Icon'

export type LightboxImage = { url: string; caption?: string | null }

/**
 * Fullscreen image viewer. Renders the image uncropped (`object-contain`) over a
 * dim backdrop, with prev/next + counter when there is more than one image.
 * Click-outside, Escape, and Arrow keys are all wired to close / navigate.
 */
export function Lightbox({
  images,
  index,
  onClose,
  onNav,
}: {
  images: LightboxImage[]
  index: number
  onClose: () => void
  onNav: (delta: number) => void
}) {
  const { t } = useTranslation()
  const img = images[index]
  const multiple = images.length > 1

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (multiple && e.key === 'ArrowLeft') onNav(-1)
      else if (multiple && e.key === 'ArrowRight') onNav(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [multiple, onClose, onNav])

  if (!img) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
        onClick={onClose}
        aria-label={t('feed.close')}
      >
        <Icon name="close" size={20} />
      </button>
      {multiple && (
        <button
          className="absolute left-5 grid size-12 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
          onClick={(e) => {
            e.stopPropagation()
            onNav(-1)
          }}
          aria-label={t('feed.prev')}
        >
          <Icon name="chevronL" size={24} />
        </button>
      )}
      <img
        src={cdnImageUrl(img.url)}
        alt={img.caption ?? ''}
        className="max-h-[85vh] max-w-full rounded-[18px] object-contain shadow-[var(--shadow-lg)]"
        onClick={(e) => e.stopPropagation()}
      />
      {multiple && (
        <button
          className="absolute right-5 grid size-12 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
          onClick={(e) => {
            e.stopPropagation()
            onNav(1)
          }}
          aria-label={t('feed.next')}
        >
          <Icon name="chevronR" size={24} />
        </button>
      )}
      {multiple && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[13px] font-bold text-white/85">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  )
}
