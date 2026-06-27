import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import type { EventListItem, EventTag } from '../domain'
import { EventCard, EventCardSkeleton } from './EventCard'

const chip =
  'rounded-full border px-3 py-1 text-[12.5px] font-medium transition-colors cursor-pointer'
const chipOff = 'border-border text-text-3 hover:bg-surface-2'
const chipOn = 'border-accent bg-accent-soft text-accent'

type PriceFilter = 'all' | 'free' | 'paid'

export function EventsBrowse({
  events,
  loading,
  onOpen,
  onCreate,
}: {
  events: EventListItem[]
  loading: boolean
  onOpen: (id: string) => void
  onCreate: () => void
}) {
  const { t, i18n } = useTranslation()
  const [query, setQuery] = useState('')
  const [tagIds, setTagIds] = useState<string[]>([])
  const [price, setPrice] = useState<PriceFilter>('all')

  const allTags = useMemo(() => {
    const map = new Map<string, EventTag>()
    for (const e of events) for (const tag of e.tags) map.set(tag.id, tag)
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
  }, [events])

  const toggleTag = (id: string) =>
    setTagIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return events.filter((e) => {
      if (q && !e.title.toLowerCase().includes(q)) return false
      if (price === 'free' && !e.isFree) return false
      if (price === 'paid' && e.isFree) return false
      if (tagIds.length && !tagIds.every((id) => e.tags.some((tag) => tag.id === id))) return false
      return true
    })
  }, [events, query, price, tagIds])

  const hasFilters = query !== '' || tagIds.length > 0 || price !== 'all'
  const showEmpty = !loading && filtered.length === 0
  const clearAll = () => {
    setQuery('')
    setTagIds([])
    setPrice('all')
  }
  const tagLabel = (tag: EventTag) => (i18n.language === 'fr' && tag.nameFr ? tag.nameFr : tag.name)

  return (
    <div className="mx-auto max-w-6xl px-5 py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-text">{t('events.title')}</h1>
          <p className="mt-0.5 text-[13.5px] text-text-3">{t('events.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="hidden shrink-0 items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-2 sm:inline-flex"
        >
          <Icon name="plus" size={15} />
          {t('events.create')}
        </button>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2">
        <Icon name="search" size={16} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('events.searchPlaceholder')}
          className="min-w-0 flex-1 bg-transparent text-[14px] text-text outline-none placeholder:text-text-4"
        />
        {query && (
          <button type="button" aria-label={t('common.cancel')} onClick={() => setQuery('')}>
            <Icon name="close" size={14} />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[12px] font-medium text-text-4">{t('events.price')}</span>
        {(['all', 'free', 'paid'] as const).map((p) => (
          <button
            key={p}
            type="button"
            className={cx(chip, price === p ? chipOn : chipOff)}
            onClick={() => setPrice(p)}
          >
            {t(`events.price_${p}`)}
          </button>
        ))}
      </div>
      {allTags.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[12px] font-medium text-text-4">{t('events.tags')}</span>
          {allTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              className={cx(chip, tagIds.includes(tag.id) ? chipOn : chipOff)}
              onClick={() => toggleTag(tag.id)}
            >
              {tagLabel(tag)}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onCreate}
        className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-[13px] font-medium text-white sm:hidden"
      >
        <Icon name="plus" size={15} />
        {t('events.create')}
      </button>

      {loading ? (
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : showEmpty ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-12 text-center">
          <div className="grid size-12 place-items-center rounded-full bg-surface-2 text-text-3">
            <Icon name={hasFilters ? 'search' : 'clock'} size={24} />
          </div>
          <h3 className="text-[15px] font-semibold text-text">
            {hasFilters ? t('events.noMatchTitle') : t('events.emptyTitle')}
          </h3>
          <p className="max-w-xs text-[13px] text-text-3">
            {hasFilters ? t('events.noMatchBody') : t('events.emptyBody')}
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearAll}
              className="rounded-full border border-border px-4 py-2 text-[13px] font-medium text-text hover:bg-surface-2"
            >
              {t('events.clearFilters')}
            </button>
          ) : (
            <button
              type="button"
              onClick={onCreate}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-white"
            >
              <Icon name="plus" size={15} />
              {t('events.create')}
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="mt-5 text-[13px] text-text-3">
            {t('events.count', { count: filtered.length })}
          </p>
          <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {filtered.map((e) => (
              <EventCard key={e.id} event={e} onOpen={onOpen} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
