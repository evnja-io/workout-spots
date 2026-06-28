import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { forwardGeocode, type GeocodeResult } from '~/lib/mapbox/geocoding'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'

const DEBOUNCE_MS = 300
const SUGGESTION_LIMIT = 5

/**
 * Sidebar geosuggest: type an address/city, pick a Mapbox result. The selection
 * is handed up via `onSelect` so the route can recenter the map (which in turn
 * reloads the viewport spots). Degrades to no suggestions when geocoding fails
 * (e.g. no Mapbox token) so it never throws into the render tree.
 */
export function LocationSearch({ onSelect }: { onSelect: (r: GeocodeResult) => void }) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const abortRef = useRef<AbortController | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (q: string) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    try {
      const results = await forwardGeocode(q, { signal: controller.signal, limit: SUGGESTION_LIMIT })
      if (!controller.signal.aborted) {
        setSuggestions(results)
        setActiveIndex(-1)
      }
    } catch {
      // No token or network error — degrade silently.
      if (!controller.signal.aborted) setSuggestions([])
    }
  }, [])

  function handleChange(value: string) {
    setQuery(value)
    setSuggestions([])
    setActiveIndex(-1)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!value.trim()) return
    timerRef.current = setTimeout(() => void search(value), DEBOUNCE_MS)
  }

  function handleSelect(r: GeocodeResult) {
    setQuery(r.placeName)
    setSuggestions([])
    setActiveIndex(-1)
    onSelect(r)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === 'Enter') {
      const pick = suggestions[activeIndex] ?? suggestions[0]
      if (pick) {
        e.preventDefault()
        handleSelect(pick)
      }
    } else if (e.key === 'Escape') {
      setSuggestions([])
      setActiveIndex(-1)
    }
  }

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-3 py-2 bg-surface-2 border border-transparent rounded-[10px] transition-[border-color,background-color] duration-150 focus-within:bg-surface focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--accent-softer)]">
        <Icon name="search" size={16} color="var(--text-3)" />
        <input
          type="search"
          placeholder={t('discover.searchPlaceholder')}
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label={t('discover.searchPlaceholder')}
          aria-autocomplete="list"
          aria-haspopup={suggestions.length > 0 ? 'listbox' : undefined}
          aria-expanded={suggestions.length > 0}
          className="w-full border-0 bg-transparent text-[13.5px] placeholder:text-text-4"
        />
      </div>
      {suggestions.length > 0 && (
        <ul
          role="listbox"
          aria-label={t('discover.suggestions')}
          className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 m-0 list-none overflow-hidden rounded-[10px] border border-border bg-surface p-1 shadow-[var(--shadow-md)]"
        >
          {suggestions.map((r, i) => (
            <li
              key={`${r.placeName}-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => {
                // mousedown (not click) so selection fires before the input blurs
                e.preventDefault()
                handleSelect(r)
              }}
              onMouseEnter={() => setActiveIndex(i)}
              className={cx(
                'cursor-pointer rounded-[7px] px-3 py-2 text-[13px] text-text',
                i === activeIndex && 'bg-surface-2',
              )}
            >
              {r.placeName}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
