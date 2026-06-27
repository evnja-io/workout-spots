import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import type { ClubListItem } from '../domain'
import { ClubCard, ClubCardSkeleton } from './ClubCard'

const chip =
  'rounded-full border px-3 py-1 text-[12.5px] font-medium transition-colors cursor-pointer'
const chipOff = 'border-border text-text-3 hover:bg-surface-2'
const chipOn = 'border-accent bg-accent-soft text-accent'

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
    <div className="mx-auto max-w-5xl px-5 py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-text">{t('clubs.title')}</h1>
          <p className="mt-0.5 text-[13.5px] text-text-3">{t('clubs.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="hidden shrink-0 items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-2 sm:inline-flex"
        >
          <Icon name="plus" size={15} />
          {t('clubs.create')}
        </button>
      </div>

      {/* Search */}
      <div className="mt-5 flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2">
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

      {/* Filters */}
      {categories.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[12px] font-medium text-text-4">{t('clubs.category')}</span>
          <button
            type="button"
            className={cx(chip, category === null ? chipOn : chipOff)}
            onClick={() => setCategory(null)}
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
        </div>
      )}
      {allTags.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[12px] font-medium text-text-4">{t('clubs.tags')}</span>
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

      <button
        type="button"
        onClick={onCreate}
        className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-[13px] font-medium text-white sm:hidden"
      >
        <Icon name="plus" size={15} />
        {t('clubs.create')}
      </button>

      {/* Grid / states */}
      {loading ? (
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ClubCardSkeleton key={i} />
          ))}
        </div>
      ) : showEmpty ? (
        <EmptyState hasFilters={hasFilters} onClear={clearAll} onCreate={onCreate} />
      ) : (
        <>
          <p className="mt-5 text-[13px] text-text-3">
            {t('clubs.count', { count: filtered.length })}
          </p>
          <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {filtered.map((c) => (
              <ClubCard key={c.id} club={c} onOpen={onOpen} />
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
    <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-12 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-surface-2 text-text-3">
        <Icon name={hasFilters ? 'search' : 'users'} size={24} />
      </div>
      <h3 className="text-[15px] font-semibold text-text">
        {hasFilters ? t('clubs.noMatchTitle') : t('clubs.emptyTitle')}
      </h3>
      <p className="max-w-xs text-[13px] text-text-3">
        {hasFilters ? t('clubs.noMatchBody') : t('clubs.emptyBody')}
      </p>
      {hasFilters ? (
        <button
          type="button"
          onClick={onClear}
          className="rounded-full border border-border px-4 py-2 text-[13px] font-medium text-text hover:bg-surface-2"
        >
          {t('clubs.clearFilters')}
        </button>
      ) : (
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-white"
        >
          <Icon name="plus" size={15} />
          {t('clubs.create')}
        </button>
      )}
    </div>
  )
}
