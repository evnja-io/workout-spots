import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import type { IconName } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import { parseYouTubeId, youTubeThumbnail } from '~/lib/youtube'
import type { CreateMedia } from './types'

type Mode = 'image' | 'video' | 'poll' | null

const MAX_OPTIONS = 6
const MIN_OPTIONS = 2

/**
 * Shared feed composer: text plus an optional, mutually-exclusive media block
 * (image | YouTube video | poll). Used by both the club and event feeds.
 */
export function Composer({
  pending,
  placeholder,
  onSubmit,
}: {
  pending: boolean
  placeholder: string
  onSubmit: (content: string, media: CreateMedia) => void
}) {
  const { t } = useTranslation()
  const [content, setContent] = useState('')
  const [mode, setMode] = useState<Mode>(null)
  const [file, setFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [options, setOptions] = useState<string[]>(['', ''])
  const [deadline, setDeadline] = useState('')

  const videoId = parseYouTubeId(videoUrl)
  const pollOptions = options.map((o) => o.trim()).filter(Boolean)

  const reset = () => {
    setContent('')
    setMode(null)
    setFile(null)
    setVideoUrl('')
    setOptions(['', ''])
    setDeadline('')
  }

  const selectMode = (m: Mode) => {
    setMode((cur) => (cur === m ? null : m))
    setFile(null)
    setVideoUrl('')
    setOptions(['', ''])
    setDeadline('')
  }

  const buildMedia = (): CreateMedia => {
    if (mode === 'image' && file) return { kind: 'image', file }
    if (mode === 'video' && videoId) return { kind: 'video', url: videoUrl.trim() }
    if (mode === 'poll' && pollOptions.length >= MIN_OPTIONS) {
      return {
        kind: 'poll',
        options: pollOptions,
        closesAt: deadline ? new Date(deadline).toISOString() : null,
      }
    }
    return null
  }

  const modeIncomplete =
    (mode === 'image' && !file) ||
    (mode === 'video' && !videoId) ||
    (mode === 'poll' && pollOptions.length < MIN_OPTIONS)

  const media = buildMedia()
  const canSubmit = !pending && !modeIncomplete && (content.trim() !== '' || media !== null)

  const submit = () => {
    if (!canSubmit) return
    onSubmit(content.trim(), media)
    reset()
  }

  return (
    <div className="rounded-[18px] border border-border bg-surface p-3.5">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        maxLength={2000}
        className="w-full resize-none bg-transparent text-[14.5px] text-text outline-none placeholder:text-text-4"
      />

      {mode === 'image' && (
        <label className="mt-1 flex cursor-pointer items-center gap-2 rounded-[10px] border border-dashed border-border px-3 py-2.5 text-[13px] text-text-3 hover:bg-surface-2">
          <Icon name="image" size={16} />
          {file ? (
            <span className="max-w-[200px] truncate">{file.name}</span>
          ) : (
            t('feed.addImage')
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
      )}

      {mode === 'video' && (
        <div className="mt-1 flex flex-col gap-2">
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder={t('feed.videoUrlPlaceholder')}
            className="w-full rounded-[10px] border border-border bg-surface px-3 py-2.5 text-[13.5px] text-text outline-none placeholder:text-text-4 focus:border-accent"
          />
          {videoUrl.trim() !== '' &&
            (videoId ? (
              <img
                src={youTubeThumbnail(videoId)}
                alt=""
                className="aspect-video w-full rounded-lg object-cover"
              />
            ) : (
              <p className="text-[12px] text-hot">{t('feed.invalidVideoUrl')}</p>
            ))}
        </div>
      )}

      {mode === 'poll' && (
        <div className="mt-1 flex flex-col gap-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={opt}
                onChange={(e) =>
                  setOptions((prev) => prev.map((o, j) => (j === i ? e.target.value : o)))
                }
                placeholder={t('feed.pollOptionPlaceholder', { n: i + 1 })}
                maxLength={100}
                className="min-w-0 flex-1 rounded-[10px] border border-border bg-surface px-3 py-2 text-[13.5px] text-text outline-none placeholder:text-text-4 focus:border-accent"
              />
              {options.length > MIN_OPTIONS && (
                <button
                  type="button"
                  aria-label={t('feed.removeOption')}
                  onClick={() => setOptions((prev) => prev.filter((_, j) => j !== i))}
                  className="shrink-0 text-text-4 hover:text-text"
                >
                  <Icon name="close" size={16} />
                </button>
              )}
            </div>
          ))}
          {options.length < MAX_OPTIONS && (
            <button
              type="button"
              onClick={() => setOptions((prev) => [...prev, ''])}
              className="inline-flex items-center gap-1.5 self-start text-[13px] text-accent hover:underline"
            >
              <Icon name="plus" size={15} />
              {t('feed.addOption')}
            </button>
          )}
          <label className="mt-1 flex flex-col gap-1 text-[12px] text-text-3">
            {t('feed.pollDeadline')}
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-[10px] border border-border bg-surface px-3 py-2 text-[13.5px] text-text outline-none focus:border-accent"
            />
          </label>
        </div>
      )}

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <MediaButton name="image" label={t('feed.addImage')} active={mode === 'image'} onClick={() => selectMode('image')} />
          <MediaButton name="play" label={t('feed.addVideo')} active={mode === 'video'} onClick={() => selectMode('video')} />
          <MediaButton name="poll" label={t('feed.addPoll')} active={mode === 'poll'} onClick={() => selectMode('poll')} />
        </div>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={submit}
          className="rounded-full bg-hot px-4 py-2 text-[13px] font-bold text-white transition-[filter] hover:brightness-105 disabled:opacity-50"
        >
          {t('clubs.post')}
        </button>
      </div>
    </div>
  )
}

function MediaButton({
  name,
  label,
  active,
  onClick,
}: {
  name: IconName
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cx(
        'grid size-9 place-items-center rounded-full transition-colors',
        active ? 'bg-accent-soft text-accent' : 'text-text-3 hover:bg-surface-2',
      )}
    >
      <Icon name={name} size={17} />
    </button>
  )
}
