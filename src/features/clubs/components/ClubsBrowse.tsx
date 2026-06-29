import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import type { ClubListItem } from '../domain'
import { ClubCard, ClubCardSkeleton } from './ClubCard'

const chip =
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors cursor-pointer'
const chipOff = 'border-border bg-surface text-text-2 hover:border-border-strong hover:text-text'
const chipOn = 'border-text bg-text text-bg'

export function ClubsBrowse({
  clubs,
  loading,
  onOpen,
  onCreate,
}: {
  clubs: ClubListItem[]
  loading: boolean
  onOpen: (id: string) => void
  onCreate: () => void
}) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])

  const categories = useMemo(
    () => Array.from(new Set(clubs.map((c) => c.category).filter(Boolean))).sort(),
    [clubs],
  )
  const allTags = useMemo(() => Array.from(new Set(clubs.flatMap((c) => c.tags))).sort(), [clubs])

  const toggleTag = (tag: string) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]))

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return clubs.filter((c) => {
      if (q) {
        const hit =
          c.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.tags.some((tag) => tag.toLowerCase().includes(q))
        if (!hit) return false
      }
      if (category && c.category !== category) return false
      if (tags.length && !tags.every((tag) => c.tags.includes(tag))) return false
      return true
    })
  }, [clubs, query, category, tags])

  const hasFilters = query !== '' || category !== null || tags.length > 0
  const showEmpty = !loading && filtered.length === 0
  const clearAll = () => {
    setQuery('')
    setCategory(null)
    setTags([])
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-2 md:px-8">
      {/* Hero */}
      <header className="flex flex-wrap items-end justify-between gap-4 pt-6">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-accent">
            <Icon name="users" size={13} />
            {t('clubs.kicker')}
          </span>
          <h1 className="mt-4 font-display text-[clamp(40px,7vw,76px)] uppercase leading-[0.95] tracking-[0.005em] text-text">
            {t('clubs.title')}
          </h1>
          <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-text-3">
            {t('clubs.tagline')}
          </p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-hot px-5 py-3 text-[14.5px] font-bold text-white shadow-[0_10px_28px_-8px_rgba(244,55,79,0.8)] transition-[filter,transform] hover:brightness-105 active:translate-y-px"
        >
          <Icon name="plus" size={16} />
          {t('clubs.create')}
        </button>
      </header>

      {/* Toolbar */}
      <div className="mt-6 flex flex-col gap-3.5">
        <div className="flex items-center gap-2.5 rounded-[14px] border border-border bg-surface px-3.5 py-3 shadow-[var(--shadow-sm)] focus-within:border-accent">
          <Icon name="search" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('clubs.searchPlaceholder')}
            className="min-w-0 flex-1 bg-transparent text-[14px] text-text outline-none placeholder:text-text-4"
          />
          {query && (
            <button type="button" aria-label={t('common.cancel')} onClick={() => setQuery('')}>
              <Icon name="close" size={14} />
            </button>
          )}
        </div>

        {(categories.length > 0 || allTags.length > 0) && (
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              className={cx(chip, category === null && tags.length === 0 ? chipOn : chipOff)}
              onClick={clearAll}
            >
              {t('clubs.all')}
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={cx(chip, category === c ? chipOn : chipOff)}
                onClick={() => setCategory(category === c ? null : c)}
              >
                {c}
              </button>
            ))}
            {categories.length > 0 && allTags.length > 0 && (
              <span className="h-5 w-px shrink-0 bg-border" />
            )}
            {allTags.slice(0, 14).map((tag) => (
              <button
                key={tag}
                type="button"
                className={cx(chip, tags.includes(tag) ? chipOn : chipOff)}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid / states */}
      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <ClubCardSkeleton key={i} />
          ))}
        </div>
      ) : showEmpty ? (
        <EmptyState hasFilters={hasFilters} onClear={clearAll} onCreate={onCreate} />
      ) : (
        <>
          <p className="mt-5 text-[13px] font-semibold text-text-3">
            {t('clubs.count', { count: filtered.length })}
          </p>
          <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2">
            {filtered.map((c) => (
              <ClubCard key={c.id} club={c} onOpen={onOpen} variant="feed" />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function EmptyState({
  hasFilters,
  onClear,
  onCreate,
}: {
  hasFilters: boolean
  onClear: () => void
  onCreate: () => void
}) {
  const { t } = useTranslation()
  return (
    <div className="mt-10 flex flex-col items-center gap-3 rounded-[18px] border border-dashed border-border-strong px-6 py-12 text-center">
      <div className="grid size-16 place-items-center rounded-[20px] bg-hot-soft text-accent">
        <Icon name={hasFilters ? 'search' : 'users'} size={26} />
      </div>
      <h3 className="font-display text-[24px] uppercase tracking-[0.02em] text-text">
        {hasFilters ? t('clubs.noMatchTitle') : t('clubs.emptyTitle')}
      </h3>
      <p className="max-w-xs text-[13.5px] text-text-3">
        {hasFilters ? t('clubs.noMatchBody') : t('clubs.emptyBody')}
      </p>
      {hasFilters ? (
        <button
          type="button"
          onClick={onClear}
          className="rounded-full border border-border-strong px-4 py-2 text-[13px] font-semibold text-text hover:border-accent hover:text-accent"
        >
          {t('clubs.clearFilters')}
        </button>
      ) : (
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-1.5 rounded-full bg-hot px-4 py-2.5 text-[13px] font-bold text-white"
        >
          <Icon name="plus" size={15} />
          {t('clubs.create')}
        </button>
      )}
    </div>
  )
}
