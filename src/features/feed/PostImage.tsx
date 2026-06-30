import { cdnImageUrl } from '~/lib/cdn/images'

/**
 * A feed post image shown in full (no crop), at natural aspect ratio, full column
 * width, capped in height. Clicking opens it in the lightbox.
 */
export function PostImage({ url, onOpen }: { url: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="mt-2.5 block w-full overflow-hidden rounded-lg"
    >
      <img
        src={cdnImageUrl(url)}
        alt=""
        loading="lazy"
        className="mx-auto block h-auto max-h-[70vh] w-full object-contain"
      />
    </button>
  )
}
