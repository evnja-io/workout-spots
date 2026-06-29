import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import { createClubSchema } from '../schema'
import { useCreateClub } from '../mutations'
import type { LinkableSpot } from '../queries'
import { SpotLinker } from './SpotLinker'
import { TagInput } from './TagInput'

const inputCls =
  'w-full rounded-[12px] border border-border bg-surface px-3 py-2.5 text-[14px] text-text outline-none placeholder:text-text-4 focus:border-accent'

export function ClubCreate({ onCancel }: { onCancel: () => void }) {
  const { t } = useTranslation()
  const { create, pending } = useCreateClub()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public')
  const [rules, setRules] = useState('')
  const [cover, setCover] = useState<File | null>(null)
  const [spots, setSpots] = useState<LinkableSpot[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const submit = () => {
    setError(null)
    const parsed = createClubSchema.safeParse({
      name,
      description,
      category,
      privacy,
      rules,
      linkedSpotIds: spots.map((s) => s.id),
      tags,
    })
    if (!parsed.success) {
      setError(t('clubs.formInvalid'))
      return
    }
    create(parsed.data, cover)
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-8">
      <button
        type="button"
        onClick={onCancel}
        className="mb-4 inline-flex items-center gap-1 text-[13px] font-medium text-text-3 hover:text-text"
      >
        <Icon name="chevronL" size={16} />
        {t('clubs.backToClubs')}
      </button>
      <h1 className="font-display text-[30px] uppercase tracking-[0.02em] text-text">
        {t('clubs.create')}
      </h1>

      <div className="mt-6 flex flex-col gap-5">
        <Field label={t('clubs.fieldName')}>
          <input
            className={inputCls}
            value={name}
            maxLength={100}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('clubs.fieldNamePlaceholder')}
          />
        </Field>

        <Field label={t('clubs.fieldDescription')}>
          <textarea
            className={cx(inputCls, 'resize-none')}
            rows={3}
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('clubs.fieldDescriptionPlaceholder')}
          />
        </Field>

        <Field label={t('clubs.fieldCategory')}>
          <input
            className={inputCls}
            value={category}
            maxLength={50}
            onChange={(e) => setCategory(e.target.value)}
            placeholder={t('clubs.fieldCategoryPlaceholder')}
          />
        </Field>

        <Field label={t('clubs.fieldPrivacy')}>
          <div className="flex gap-2">
            {(['public', 'private'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPrivacy(p)}
                className={cx(
                  'flex-1 rounded-lg border px-3 py-2 text-[13.5px] font-medium transition-colors',
                  privacy === p
                    ? 'border-accent bg-accent-soft text-accent'
                    : 'border-border text-text-3 hover:bg-surface-2',
                )}
              >
                {t(`clubs.privacy_${p}`)}
              </button>
            ))}
          </div>
        </Field>

        <Field label={t('clubs.fieldRules')}>
          <textarea
            className={cx(inputCls, 'resize-none')}
            rows={3}
            maxLength={1000}
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            placeholder={t('clubs.fieldRulesPlaceholder')}
          />
        </Field>

        <Field label={t('clubs.fieldCover')}>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2.5 text-[13.5px] text-text-3 hover:bg-surface-2">
            <Icon name="image" size={16} />
            {cover ? <span className="truncate">{cover.name}</span> : t('clubs.fieldCoverHint')}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setCover(e.target.files?.[0] ?? null)}
            />
          </label>
        </Field>

        <Field label={t('clubs.linkedSpots')}>
          <SpotLinker selected={spots} onChange={setSpots} />
        </Field>

        <Field label={t('clubs.tags')}>
          <TagInput value={tags} onChange={setTags} />
        </Field>

        {error && <p className="text-[13px] text-red-500">{error}</p>}

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-border px-4 py-2 text-[13px] font-medium text-text hover:bg-surface-2"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={pending || name.trim() === '' || category.trim() === ''}
            className="rounded-full bg-hot px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_6px_20px_-6px_rgba(244,55,79,0.6)] transition-[filter] hover:brightness-105 disabled:opacity-50"
          >
            {t('clubs.create')}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-display text-[15px] uppercase tracking-[0.02em] text-text">
        {label}
      </span>
      {children}
    </label>
  )
}
