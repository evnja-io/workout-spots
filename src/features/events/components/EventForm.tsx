import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import { useSession } from '~/features/auth/session'
import type { EventDetail } from '../domain'
import { createEventSchema, type CreateEventParsed, type EventLocationInput } from '../schema'
import { eventTagsQueryOptions, userClubsQueryOptions } from '../queries'
import { EventLocationPicker } from './EventLocationPicker'

const inputCls =
  'w-full rounded-lg border border-border bg-surface px-3 py-2 text-[14px] text-text outline-none placeholder:text-text-4 focus:border-accent'

export type EventFormState = {
  title: string
  description: string
  startsLocal: string
  endsLocal: string
  timezone: string
  locations: EventLocationInput[]
  minParticipants: string
  maxParticipants: string
  deadlineLocal: string
  isFree: boolean
  priceAmount: string
  visibility: 'public' | 'private' | 'club_only'
  clubId: string
  requiresApproval: boolean
  organizerName: string
  tagIds: string[]
}

export type EventFormSubmit = {
  values: CreateEventParsed
  featured: File | null
  gallery: File[]
}

const EMPTY: EventFormState = {
  title: '',
  description: '',
  startsLocal: '',
  endsLocal: '',
  timezone: 'UTC',
  locations: [],
  minParticipants: '1',
  maxParticipants: '',
  deadlineLocal: '',
  isFree: true,
  priceAmount: '',
  visibility: 'public',
  clubId: '',
  requiresApproval: false,
  organizerName: '',
  tagIds: [],
}

function isoToLocalInput(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Build form state from an existing event (edit mode). */
export function eventDetailToFormState(event: EventDetail): EventFormState {
  return {
    title: event.title,
    description: event.description ?? '',
    startsLocal: isoToLocalInput(event.startsAt),
    endsLocal: isoToLocalInput(event.endsAt),
    timezone: event.timezone,
    locations: event.locations.map((l) => ({
      locationId: l.id,
      name: l.name,
      city: l.city,
      isPrimary: l.isPrimary,
      note: l.notes ?? '',
    })),
    minParticipants: String(event.minParticipants),
    maxParticipants: event.maxParticipants != null ? String(event.maxParticipants) : '',
    deadlineLocal: isoToLocalInput(event.registrationDeadline),
    isFree: event.isFree,
    priceAmount: event.priceAmount != null ? String(event.priceAmount) : '',
    visibility: event.visibility,
    clubId: event.clubId ?? '',
    requiresApproval: event.requiresApproval,
    organizerName: event.organizerName ?? '',
    tagIds: event.tags.map((t) => t.id),
  }
}

export function EventForm({
  initial,
  submitLabel,
  pending,
  existingGalleryCount = 0,
  onCancel,
  onSubmit,
}: {
  initial?: EventFormState
  submitLabel: string
  pending: boolean
  existingGalleryCount?: number
  onCancel: () => void
  onSubmit: (payload: EventFormSubmit) => void
}) {
  const { t, i18n } = useTranslation()
  const { userId } = useSession()
  const { data: tags = [] } = useQuery(eventTagsQueryOptions())
  const { data: userClubs = [] } = useQuery(userClubsQueryOptions(userId))

  const [s, setS] = useState<EventFormState>(initial ?? EMPTY)
  const [featured, setFeatured] = useState<File | null>(null)
  const [gallery, setGallery] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const set = <K extends keyof EventFormState>(k: K, v: EventFormState[K]) =>
    setS((prev) => ({ ...prev, [k]: v }))

  // For create mode (no initial), pick up the browser timezone after hydration.
  useEffect(() => {
    if (initial) return
    try {
      set('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')
    } catch {
      /* keep UTC */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleTag = (id: string) =>
    set('tagIds', s.tagIds.includes(id) ? s.tagIds.filter((x) => x !== id) : [...s.tagIds, id])

  const submit = () => {
    setError(null)
    const parsed = createEventSchema.safeParse({
      title: s.title,
      description: s.description,
      startsAt: s.startsLocal ? new Date(s.startsLocal).toISOString() : '',
      endsAt: s.endsLocal ? new Date(s.endsLocal).toISOString() : '',
      timezone: s.timezone,
      locations: s.locations,
      minParticipants: Number(s.minParticipants) || 1,
      maxParticipants: s.maxParticipants ? Number(s.maxParticipants) : null,
      registrationDeadline: s.deadlineLocal ? new Date(s.deadlineLocal).toISOString() : null,
      isFree: s.isFree,
      priceAmount: s.isFree ? null : Number(s.priceAmount) || null,
      priceCurrency: 'EUR',
      visibility: s.visibility,
      clubId: s.visibility === 'club_only' ? s.clubId || null : null,
      requiresApproval: s.requiresApproval,
      organizerName: s.organizerName,
      organizerContact: '',
      tagIds: s.tagIds,
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t('events.formInvalid'))
      return
    }
    onSubmit({ values: parsed.data, featured, gallery })
  }

  const tagLabel = (tag: { name: string; nameFr: string }) =>
    i18n.language === 'fr' && tag.nameFr ? tag.nameFr : tag.name
  const galleryRemaining = Math.max(0, 10 - existingGalleryCount)

  return (
    <div className="flex flex-col gap-5">
      <Field label={t('events.fieldTitle')}>
        <input
          className={inputCls}
          value={s.title}
          maxLength={100}
          onChange={(e) => set('title', e.target.value)}
          placeholder={t('events.fieldTitlePlaceholder')}
        />
      </Field>

      <Field label={t('events.fieldDescription')}>
        <textarea
          className={cx(inputCls, 'resize-none')}
          rows={3}
          maxLength={2000}
          value={s.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label={t('events.fieldStart')}>
          <input
            type="datetime-local"
            className={inputCls}
            value={s.startsLocal}
            onChange={(e) => set('startsLocal', e.target.value)}
          />
        </Field>
        <Field label={t('events.fieldEnd')}>
          <input
            type="datetime-local"
            className={inputCls}
            value={s.endsLocal}
            onChange={(e) => set('endsLocal', e.target.value)}
          />
        </Field>
      </div>
      <p className="-mt-3 text-[12px] text-text-4">
        {t('events.timezoneNote', { tz: s.timezone })}
      </p>

      <Field label={t('events.fieldLocations')}>
        <EventLocationPicker value={s.locations} onChange={(v) => set('locations', v)} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label={t('events.fieldMin')}>
          <input
            type="number"
            min={1}
            className={inputCls}
            value={s.minParticipants}
            onChange={(e) => set('minParticipants', e.target.value)}
          />
        </Field>
        <Field label={t('events.fieldMax')}>
          <input
            type="number"
            min={1}
            className={inputCls}
            value={s.maxParticipants}
            onChange={(e) => set('maxParticipants', e.target.value)}
            placeholder={t('events.unlimited')}
          />
        </Field>
      </div>

      <Field label={t('events.fieldDeadline')}>
        <input
          type="datetime-local"
          className={inputCls}
          value={s.deadlineLocal}
          onChange={(e) => set('deadlineLocal', e.target.value)}
        />
      </Field>

      <Field label={t('events.fieldPrice')}>
        <div className="flex items-center gap-2">
          {[true, false].map((free) => (
            <button
              key={String(free)}
              type="button"
              onClick={() => set('isFree', free)}
              className={cx(
                'flex-1 rounded-lg border px-3 py-2 text-[13.5px] font-medium transition-colors',
                s.isFree === free
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-border text-text-3 hover:bg-surface-2',
              )}
            >
              {free ? t('events.free') : t('events.paid')}
            </button>
          ))}
          {!s.isFree && (
            <input
              type="number"
              min={1}
              className={cx(inputCls, 'w-28')}
              value={s.priceAmount}
              onChange={(e) => set('priceAmount', e.target.value)}
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
                onClick={() => set('visibility', v)}
                className={cx(
                  'flex-1 rounded-lg border px-2 py-2 text-[12.5px] font-medium transition-colors',
                  s.visibility === v
                    ? 'border-accent bg-accent-soft text-accent'
                    : 'border-border text-text-3 hover:bg-surface-2',
                )}
              >
                {t(`events.visibility_${v}`)}
              </button>
            ))}
          </div>
          {s.visibility === 'club_only' && (
            <select
              className={inputCls}
              value={s.clubId}
              onChange={(e) => set('clubId', e.target.value)}
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
          checked={s.requiresApproval}
          onChange={(e) => set('requiresApproval', e.target.checked)}
        />
        {t('events.requiresApproval')}
      </label>

      <Field label={t('events.fieldOrganizer')}>
        <input
          className={inputCls}
          value={s.organizerName}
          onChange={(e) => set('organizerName', e.target.value)}
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

      <Field label={t('events.fieldGallery')}>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2.5 text-[13.5px] text-text-3 hover:bg-surface-2">
          <Icon name="image" size={16} />
          {gallery.length > 0
            ? t('events.galleryChosen', { count: gallery.length })
            : t('events.fieldGalleryHint')}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) =>
              setGallery(Array.from(e.target.files ?? []).slice(0, galleryRemaining))
            }
          />
        </label>
        {existingGalleryCount > 0 && (
          <span className="mt-1 text-[12px] text-text-4">
            {t('events.galleryExisting', { count: existingGalleryCount })}
          </span>
        )}
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
                  s.tagIds.includes(tag.id)
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
          disabled={pending || s.title.trim().length < 3}
          className="rounded-full bg-accent px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-2 disabled:opacity-50"
        >
          {submitLabel}
        </button>
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
