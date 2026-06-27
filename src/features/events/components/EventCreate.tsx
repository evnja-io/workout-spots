import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import { useSession } from '~/features/auth/session'
import { createEventSchema, type EventLocationInput } from '../schema'
import { eventTagsQueryOptions, userClubsQueryOptions } from '../queries'
import { useCreateEvent } from '../mutations'
import { EventLocationPicker } from './EventLocationPicker'

const inputCls =
  'w-full rounded-lg border border-border bg-surface px-3 py-2 text-[14px] text-text outline-none placeholder:text-text-4 focus:border-accent'

export function EventCreate({ onCancel }: { onCancel: () => void }) {
  const { t, i18n } = useTranslation()
  const { userId } = useSession()
  const { create, pending } = useCreateEvent()
  const { data: tags = [] } = useQuery(eventTagsQueryOptions())
  const { data: userClubs = [] } = useQuery(userClubsQueryOptions(userId))

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startsLocal, setStartsLocal] = useState('')
  const [endsLocal, setEndsLocal] = useState('')
  const [timezone, setTimezone] = useState('UTC')
  const [locations, setLocations] = useState<EventLocationInput[]>([])
  const [minParticipants, setMinParticipants] = useState('1')
  const [maxParticipants, setMaxParticipants] = useState('')
  const [deadlineLocal, setDeadlineLocal] = useState('')
  const [isFree, setIsFree] = useState(true)
  const [priceAmount, setPriceAmount] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'private' | 'club_only'>('public')
  const [clubId, setClubId] = useState('')
  const [requiresApproval, setRequiresApproval] = useState(false)
  const [organizerName, setOrganizerName] = useState('')
  const [featured, setFeatured] = useState<File | null>(null)
  const [tagIds, setTagIds] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  // Set the timezone from the browser after hydration (avoids an SSR mismatch).
  useEffect(() => {
    try {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')
    } catch {
      /* keep UTC */
    }
  }, [])

  const toggleTag = (id: string) =>
    setTagIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const submit = () => {
    setError(null)
    const parsed = createEventSchema.safeParse({
      title,
      description,
      startsAt: startsLocal ? new Date(startsLocal).toISOString() : '',
      endsAt: endsLocal ? new Date(endsLocal).toISOString() : '',
      timezone,
      locations,
      minParticipants: Number(minParticipants) || 1,
      maxParticipants: maxParticipants ? Number(maxParticipants) : null,
      registrationDeadline: deadlineLocal ? new Date(deadlineLocal).toISOString() : null,
      isFree,
      priceAmount: isFree ? null : Number(priceAmount) || null,
      priceCurrency: 'EUR',
      visibility,
      clubId: visibility === 'club_only' ? clubId || null : null,
      requiresApproval,
      organizerName,
      organizerContact: '',
      tagIds,
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t('events.formInvalid'))
      return
    }
    create(parsed.data, featured)
  }

  const tagLabel = (tag: { name: string; nameFr: string }) =>
    i18n.language === 'fr' && tag.nameFr ? tag.nameFr : tag.name

  return (
    <div className="mx-auto max-w-xl px-5 py-8">
      <button
        type="button"
        onClick={onCancel}
        className="mb-4 inline-flex items-center gap-1 text-[13px] font-medium text-text-3 hover:text-text"
      >
        <Icon name="chevronL" size={16} />
        {t('events.backToEvents')}
      </button>
      <h1 className="text-[22px] font-semibold text-text">{t('events.create')}</h1>

      <div className="mt-6 flex flex-col gap-5">
        <Field label={t('events.fieldTitle')}>
          <input
            className={inputCls}
            value={title}
            maxLength={100}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('events.fieldTitlePlaceholder')}
          />
        </Field>

        <Field label={t('events.fieldDescription')}>
          <textarea
            className={cx(inputCls, 'resize-none')}
            rows={3}
            maxLength={2000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t('events.fieldStart')}>
            <input
              type="datetime-local"
              className={inputCls}
              value={startsLocal}
              onChange={(e) => setStartsLocal(e.target.value)}
            />
          </Field>
          <Field label={t('events.fieldEnd')}>
            <input
              type="datetime-local"
              className={inputCls}
              value={endsLocal}
              onChange={(e) => setEndsLocal(e.target.value)}
            />
          </Field>
        </div>
        <p className="-mt-3 text-[12px] text-text-4">
          {t('events.timezoneNote', { tz: timezone })}
        </p>

        <Field label={t('events.fieldLocations')}>
          <EventLocationPicker value={locations} onChange={setLocations} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t('events.fieldMin')}>
            <input
              type="number"
              min={1}
              className={inputCls}
              value={minParticipants}
              onChange={(e) => setMinParticipants(e.target.value)}
            />
          </Field>
          <Field label={t('events.fieldMax')}>
            <input
              type="number"
              min={1}
              className={inputCls}
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              placeholder={t('events.unlimited')}
            />
          </Field>
        </div>

        <Field label={t('events.fieldDeadline')}>
          <input
            type="datetime-local"
            className={inputCls}
            value={deadlineLocal}
            onChange={(e) => setDeadlineLocal(e.target.value)}
          />
        </Field>

        <Field label={t('events.fieldPrice')}>
          <div className="flex items-center gap-2">
            {[true, false].map((free) => (
              <button
                key={String(free)}
                type="button"
                onClick={() => setIsFree(free)}
                className={cx(
                  'flex-1 rounded-lg border px-3 py-2 text-[13.5px] font-medium transition-colors',
                  isFree === free
                    ? 'border-accent bg-accent-soft text-accent'
                    : 'border-border text-text-3 hover:bg-surface-2',
                )}
              >
                {free ? t('events.free') : t('events.paid')}
              </button>
            ))}
            {!isFree && (
              <input
                type="number"
                min={1}
                className={cx(inputCls, 'w-28')}
                value={priceAmount}
                onChange={(e) => setPriceAmount(e.target.value)}
                placeholder="€"
              />
            )}
          </div>
        </Field>

        <Field label={t('events.fieldVisibility')}>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {(['public', 'private', 'club_only'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVisibility(v)}
                  className={cx(
                    'flex-1 rounded-lg border px-2 py-2 text-[12.5px] font-medium transition-colors',
                    visibility === v
                      ? 'border-accent bg-accent-soft text-accent'
                      : 'border-border text-text-3 hover:bg-surface-2',
                  )}
                >
                  {t(`events.visibility_${v}`)}
                </button>
              ))}
            </div>
            {visibility === 'club_only' && (
              <select
                className={inputCls}
                value={clubId}
                onChange={(e) => setClubId(e.target.value)}
              >
                <option value="">{t('events.pickClub')}</option>
                {userClubs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </Field>

        <label className="flex items-center gap-2 text-[14px] text-text-2">
          <input
            type="checkbox"
            checked={requiresApproval}
            onChange={(e) => setRequiresApproval(e.target.checked)}
          />
          {t('events.requiresApproval')}
        </label>

        <Field label={t('events.fieldOrganizer')}>
          <input
            className={inputCls}
            value={organizerName}
            onChange={(e) => setOrganizerName(e.target.value)}
            placeholder={t('events.fieldOrganizerPlaceholder')}
          />
        </Field>

        <Field label={t('events.fieldFeatured')}>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2.5 text-[13.5px] text-text-3 hover:bg-surface-2">
            <Icon name="image" size={16} />
            {featured ? (
              <span className="truncate">{featured.name}</span>
            ) : (
              t('events.fieldFeaturedHint')
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFeatured(e.target.files?.[0] ?? null)}
            />
          </label>
        </Field>

        {tags.length > 0 && (
          <Field label={t('events.tags')}>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={cx(
                    'rounded-full border px-3 py-1 text-[12.5px] font-medium transition-colors',
                    tagIds.includes(tag.id)
                      ? 'border-accent bg-accent-soft text-accent'
                      : 'border-border text-text-3 hover:bg-surface-2',
                  )}
                >
                  {tagLabel(tag)}
                </button>
              ))}
            </div>
          </Field>
        )}

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
            disabled={pending || title.trim().length < 3}
            className="rounded-full bg-accent px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-2 disabled:opacity-50"
          >
            {t('events.create')}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-text-2">{label}</span>
      {children}
    </label>
  )
}
