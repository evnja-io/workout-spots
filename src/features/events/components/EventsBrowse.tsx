import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import type { EventListItem, EventStatus, EventTag } from '../domain'
import { EventCard, EventCardSkeleton } from './EventCard'

const chip =
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors cursor-pointer'
const chipOff = 'border-border bg-surface text-text-2 hover:border-border-strong hover:text-text'
const chipOn = 'border-text bg-text text-bg'

type PriceFilter = 'all' | 'free' | 'paid'
type Layout = 'rails' | 'feed'

// Rails group events into a few horizontal shelves; order matters.
const RAIL_BUCKETS: { key: string; match: (s: EventStatus) => boolean }[] = [
  { key: 'events.railLive', match: (s) => s === 'ongoing' },
  { key: 'events.railUpcoming', match: (s) => s === 'upcoming' || s === 'cancelled' },
  { key: 'events.railWrapped', match: (s) => s === 'completed' },
]

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
  const [layout, setLayout] = useState<Layout>('feed')

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

  const rails = useMemo(
    () =>
      RAIL_BUCKETS.map((b) => ({
        key: b.key,
        items: filtered.filter((e) => b.match(e.status)),
      })).filter((r) => r.items.length > 0),
    [filtered],
  )

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-2 md:px-8">
      {/* Hero */}
      <header className="flex flex-wrap items-end justify-between gap-4 pt-6">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-accent">
            <span className="size-[7px] rounded-full bg-[#FF3B6B] [animation:livePulse_1.4s_ease-in-out_infinite]" />
            {t('events.kicker')}
          </span>
          <h1 className="mt-4 font-display text-[clamp(40px,7vw,76px)] uppercase leading-[0.95] tracking-[0.005em] text-text">
            {t('events.title')}
          </h1>
          <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-text-3">
            {t('events.tagline')}
          </p>
        </div>
        {/* Mobile uses the bottom-nav (+) FAB to create; show this only on desktop. */}
        <button
          type="button"
          onClick={onCreate}
          className="hidden shrink-0 items-center gap-2 rounded-full bg-hot px-5 py-3 text-[14.5px] font-bold text-white shadow-[0_10px_28px_-8px_rgba(244,55,79,0.8)] transition-[filter,transform] hover:brightness-105 active:translate-y-px md:inline-flex"
        >
          <Icon name="plus" size={16} />
          {t('events.create')}
        </button>
      </header>

      {/* Toolbar */}
      <div className="mt-6 flex flex-col gap-3.5">
        <div className="flex items-center gap-2.5 rounded-[14px] border border-border bg-surface px-3.5 py-3 shadow-[var(--shadow-sm)] focus-within:border-accent">
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

        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
          {allTags.length > 0 && <span className="h-5 w-px shrink-0 bg-border" />}
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

          <div className="ml-auto inline-flex shrink-0 gap-0.5 rounded-full border border-border bg-surface-2 p-[3px]">
            {(['rails', 'feed'] as const).map((l) => (
              <button
                key={l}
                type="button"
                aria-label={t(`events.layout_${l}`)}
                aria-pressed={layout === l}
                onClick={() => setLayout(l)}
                className={cx(
                  'grid h-[30px] w-[34px] place-items-center rounded-full text-text-3',
                  layout === l && 'bg-surface text-accent shadow-[var(--shadow-sm)]',
                )}
              >
                <Icon name={l === 'rails' ? 'map' : 'list'} size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : showEmpty ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-[18px] border border-dashed border-border-strong px-6 py-12 text-center">
          <div className="grid size-16 place-items-center rounded-[20px] bg-hot-soft text-accent">
            <Icon name={hasFilters ? 'search' : 'clock'} size={26} />
          </div>
          <h3 className="font-display text-[24px] uppercase tracking-[0.02em] text-text">
            {hasFilters ? t('events.noMatchTitle') : t('events.emptyTitle')}
          </h3>
          <p className="max-w-xs text-[13.5px] text-text-3">
            {hasFilters ? t('events.noMatchBody') : t('events.emptyBody')}
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearAll}
              className="rounded-full border border-border-strong px-4 py-2 text-[13px] font-semibold text-text hover:border-accent hover:text-accent"
            >
              {t('events.clearFilters')}
            </button>
          ) : (
            <button
              type="button"
              onClick={onCreate}
              className="inline-flex items-center gap-1.5 rounded-full bg-hot px-4 py-2.5 text-[13px] font-bold text-white"
            >
              <Icon name="plus" size={15} />
              {t('events.create')}
            </button>
          )}
        </div>
      ) : layout === 'rails' ? (
        <div className="mt-2">
          {rails.map((rail) => (
            <section key={rail.key} className="mt-9">
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 className="font-display text-[26px] uppercase tracking-[0.01em] text-text">
                  {t(rail.key)}
                </h2>
                <span className="text-[13px] font-semibold text-text-3">
                  {t('events.count', { count: rail.items.length })}
                </span>
              </div>
              {/* pt/pb give the cards' hover lift + shadow room — overflow-x:auto
                  forces overflow-y:auto, which would otherwise clip them. */}
              <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 pt-3 md:-mx-8 md:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {rail.items.map((e) => (
                  <EventCard key={e.id} event={e} onOpen={onOpen} variant="rail" />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <>
          <p className="mt-5 text-right text-[13px] font-semibold text-text-3">
            {t('events.count', { count: filtered.length })}
          </p>
          <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2">
            {filtered.map((e) => (
              <EventCard key={e.id} event={e} onOpen={onOpen} variant="feed" />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
