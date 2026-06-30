import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { parseYouTubeId, youTubeEmbedUrl, youTubeThumbnail } from '~/lib/youtube'

/**
 * YouTube post block. Shows the thumbnail + play button; clicking swaps to an
 * inline iframe player (so the third-party embed only loads on demand). Falls
 * back to a plain link if the URL isn't a recognisable YouTube reference.
 */
export function VideoBlock({ url }: { url: string }) {
  const { t } = useTranslation()
  const [playing, setPlaying] = useState(false)
  const id = parseYouTubeId(url)

  if (!id) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2.5 inline-flex items-center gap-1.5 text-[13.5px] text-accent hover:underline"
      >
        <Icon name="play" size={14} fill="currentColor" />
        {url}
      </a>
    )
  }

  if (playing) {
    return (
      <div className="mt-2.5 aspect-video w-full overflow-hidden rounded-lg bg-black">
        <iframe
          src={youTubeEmbedUrl(id)}
          title="YouTube video"
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={t('feed.playVideo')}
      className="group relative mt-2.5 block aspect-video w-full overflow-hidden rounded-lg bg-black"
    >
      <img
        src={youTubeThumbnail(id)}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
      />
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid size-16 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm transition group-hover:bg-black/70">
          <Icon name="play" size={26} fill="currentColor" />
        </span>
      </span>
    </button>
  )
}
