import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'

/** Free-form tag entry — add on Enter/comma, remove via chip. */
export function TagInput({
  value,
  onChange,
}: {
  value: string[]
  onChange: (next: string[]) => void
}) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState('')

  const commit = () => {
    const tag = draft.trim().toLowerCase()
    if (tag && !value.includes(tag)) onChange([...value, tag])
    setDraft('')
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
        <Icon name="filter" size={15} />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              commit()
            }
          }}
          placeholder={t('clubs.tagPlaceholder')}
          className="min-w-0 flex-1 bg-transparent text-[14px] text-text outline-none placeholder:text-text-4"
        />
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 py-1 pl-2.5 pr-1.5 text-[12.5px] text-text"
            >
              {tag}
              <button
                type="button"
                aria-label={t('common.cancel')}
                onClick={() => onChange(value.filter((x) => x !== tag))}
                className="grid size-4 place-items-center rounded-full text-text-3 hover:bg-surface hover:text-text"
              >
                <Icon name="close" size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
