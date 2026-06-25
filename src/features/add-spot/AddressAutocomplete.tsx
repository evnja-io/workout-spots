import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { forwardGeocode, type GeocodeResult } from '~/lib/mapbox/geocoding'
import { Input } from '~/components/ui/Field'

interface AddressAutocompleteProps {
  value: string
  onSelect: (r: GeocodeResult) => void
}

export function AddressAutocomplete({ value, onSelect }: AddressAutocompleteProps) {
  const { t } = useTranslation()
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([])
  const abortRef = useRef<AbortController | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync when external value changes (e.g., after reverse-geocode fills address)
  useEffect(() => {
    setQuery(value)
  }, [value])

  const search = useCallback(async (q: string) => {
    // Cancel previous in-flight request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const results = await forwardGeocode(q, { signal: controller.signal, limit: 5 })
      if (!controller.signal.aborted) {
        setSuggestions(results)
      }
    } catch {
      // No token or network error — degrade silently
      if (!controller.signal.aborted) {
        setSuggestions([])
      }
    }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setQuery(q)
    setSuggestions([])

    if (timerRef.current) clearTimeout(timerRef.current)
    if (!q.trim()) return

    timerRef.current = setTimeout(() => {
      void search(q)
    }, 300)
  }

  function handleSelect(r: GeocodeResult) {
    setQuery(r.placeName)
    setSuggestions([])
    onSelect(r)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <Input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={t('addSpot.addressPlaceholder')}
        aria-label={t('addSpot.addressLabel')}
        aria-autocomplete="list"
        aria-haspopup={suggestions.length > 0 ? 'listbox' : undefined}
      />
      {suggestions.length > 0 && (
        <ul
          role="listbox"
          aria-label={t('addSpot.suggestions')}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 10,
            background: 'var(--surface)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-md)',
            listStyle: 'none',
            margin: '4px 0 0',
            padding: '4px 0',
          }}
        >
          {suggestions.map((r, i) => (
            <li
              key={i}
              role="option"
              aria-selected={false}
              onClick={() => handleSelect(r)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '13px',
                color: 'var(--text)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface-2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = ''
              }}
            >
              {r.placeName}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
