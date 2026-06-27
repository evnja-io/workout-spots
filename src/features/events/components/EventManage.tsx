import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import type { EventDetail, EventParticipant } from '../domain'
import { eventParticipantsQueryOptions } from '../queries'
import { useCancelEvent, useSetParticipantStatus, useUpdateEvent } from '../organizerMutations'
import { initials } from './visuals'

type ManageTab = 'participants' | 'settings'

export function EventManage({ event, onBack }: { event: EventDetail; onBack: () => void }) {
  const { t } = useTranslation()
  const [tab, setTab] = useState<ManageTab>('participants')

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1 text-[13px] font-medium text-text-3 hover:text-text"
      >
        <Icon name="chevronL" size={16} />
        {event.title}
      </button>
      <h1 className="text-[22px] font-semibold text-text">{t('events.manage')}</h1>

      <div className="mt-4 flex gap-1 border-b border-border">
        <Tab
          active={tab === 'participants'}
          label={t('events.manageParticipants')}
          onClick={() => setTab('participants')}
        />
        <Tab
          active={tab === 'settings'}
          label={t('events.manageSettings')}
          onClick={() => setTab('settings')}
        />
      </div>

      <div className="mt-5">
        {tab === 'participants' ? (
          <Participants eventId={event.id} />
        ) : (
          <Settings event={event} onCancelled={onBack} />
        )}
      </div>
    </div>
  )
}

function Tab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        '-mb-px border-b-2 px-3 py-2 text-[13.5px] font-medium transition-colors',
        active ? 'border-accent text-text' : 'border-transparent text-text-3 hover:text-text',
      )}
    >
      {label}
    </button>
  )
}

function Participants({ eventId }: { eventId: string }) {
  const { t } = useTranslation()
  const { data: participants = [], isPending } = useQuery(eventParticipantsQueryOptions(eventId))
  const actions = useSetParticipantStatus(eventId)

  const groups = useMemo(() => {
    const going = participants.filter((p) => p.status === 'approved' && p.type === 'participating')
    const pending = participants.filter((p) => p.status === 'pending')
    const waitlisted = participants.filter((p) => p.status === 'waitlisted')
    const interested = participants.filter(
      (p) => p.type === 'interested' && p.status === 'approved',
    )
    const rejected = participants.filter((p) => p.status === 'rejected')
    return { going, pending, waitlisted, interested, rejected }
  }, [participants])

  if (isPending) return <p className="text-[13px] text-text-3">…</p>
  if (participants.length === 0)
    return <p className="text-[13px] text-text-3">{t('events.noParticipants')}</p>

  return (
    <div className="flex flex-col gap-5">
      <Group title={t('events.groupPending')} list={groups.pending}>
        {(p) => (
          <>
            <Act label={t('events.approve')} onClick={() => actions.approve(p.id)} />
            <Act label={t('events.toWaitlist')} onClick={() => actions.waitlist(p.id)} />
            <Act label={t('events.reject')} danger onClick={() => actions.reject(p.id)} />
          </>
        )}
      </Group>
      <Group title={t('events.groupWaitlisted')} list={groups.waitlisted}>
        {(p) => (
          <>
            <Act label={t('events.approve')} onClick={() => actions.approve(p.id)} />
            <Act label={t('events.reject')} danger onClick={() => actions.reject(p.id)} />
          </>
        )}
      </Group>
      <Group title={t('events.groupGoing')} list={groups.going}>
        {(p) => (
          <>
            <Act label={t('events.toWaitlist')} onClick={() => actions.waitlist(p.id)} />
            <Act label={t('events.remove')} danger onClick={() => actions.reject(p.id)} />
          </>
        )}
      </Group>
      <Group title={t('events.groupInterested')} list={groups.interested} />
      <Group title={t('events.groupRejected')} list={groups.rejected}>
        {(p) => <Act label={t('events.approve')} onClick={() => actions.approve(p.id)} />}
      </Group>
    </div>
  )
}

function Group({
  title,
  list,
  children,
}: {
  title: string
  list: EventParticipant[]
  children?: (p: EventParticipant) => React.ReactNode
}) {
  if (list.length === 0) return null
  return (
    <section>
      <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-text-4">
        {title} · {list.length}
      </h2>
      <div className="flex flex-col gap-2">
        {list.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-2.5"
          >
            <div
              className="grid size-9 shrink-0 place-items-center rounded-full text-[12px] font-semibold text-white"
              style={{ background: 'var(--accent)' }}
            >
              {p.user.avatarUrl ? (
                <img
                  src={p.user.avatarUrl}
                  alt=""
                  className="size-full rounded-full object-cover"
                />
              ) : (
                initials(p.user.name)
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14px] font-medium text-text">{p.user.name}</div>
              {p.note && <div className="truncate text-[12px] text-text-3">“{p.note}”</div>}
            </div>
            {children && <div className="flex items-center gap-1">{children(p)}</div>}
          </div>
        ))}
      </div>
    </section>
  )
}

function Act({ label, onClick, danger }: { label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors',
        danger
          ? 'border-border text-red-500 hover:bg-red-500/10'
          : 'border-border text-text-2 hover:bg-surface-2',
      )}
    >
      {label}
    </button>
  )
}

const inputCls =
  'w-full rounded-lg border border-border bg-surface px-3 py-2 text-[14px] text-text outline-none placeholder:text-text-4 focus:border-accent'

function Settings({ event, onCancelled }: { event: EventDetail; onCancelled: () => void }) {
  const { t } = useTranslation()
  const update = useUpdateEvent(event.id)
  const cancelEvent = useCancelEvent(event.id)

  const [title, setTitle] = useState(event.title)
  const [description, setDescription] = useState(event.description ?? '')
  const [maxParticipants, setMaxParticipants] = useState(
    event.maxParticipants != null ? String(event.maxParticipants) : '',
  )
  const [requiresApproval, setRequiresApproval] = useState(event.requiresApproval)
  const [reason, setReason] = useState('')
  const [confirmCancel, setConfirmCancel] = useState(false)

  const save = () =>
    update.update({
      title: title.trim(),
      description,
      maxParticipants: maxParticipants ? Number(maxParticipants) : null,
      registrationDeadline: event.registrationDeadline,
      requiresApproval,
    })

  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-text-2">{t('events.fieldTitle')}</span>
        <input
          className={inputCls}
          value={title}
          maxLength={100}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-text-2">{t('events.fieldDescription')}</span>
        <textarea
          className={cx(inputCls, 'resize-none')}
          rows={3}
          maxLength={2000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-text-2">{t('events.fieldMax')}</span>
        <input
          type="number"
          min={1}
          className={inputCls}
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(e.target.value)}
          placeholder={t('events.unlimited')}
        />
      </label>
      <label className="flex items-center gap-2 text-[14px] text-text-2">
        <input
          type="checkbox"
          checked={requiresApproval}
          onChange={(e) => setRequiresApproval(e.target.checked)}
        />
        {t('events.requiresApproval')}
      </label>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={update.pending || title.trim().length < 3}
          className="rounded-full bg-accent px-5 py-2 text-[13px] font-medium text-white hover:bg-accent-2 disabled:opacity-50"
        >
          {t('common.save')}
        </button>
      </div>

      {/* Danger zone */}
      <div className="mt-2 rounded-xl border border-red-500/30 p-3.5">
        <h3 className="text-[13px] font-semibold text-red-500">{t('events.cancelEvent')}</h3>
        {event.status === 'cancelled' ? (
          <p className="mt-1 text-[13px] text-text-3">{t('events.alreadyCancelled')}</p>
        ) : !confirmCancel ? (
          <button
            type="button"
            onClick={() => setConfirmCancel(true)}
            className="mt-2 rounded-full border border-red-500/40 px-4 py-1.5 text-[13px] font-medium text-red-500 hover:bg-red-500/10"
          >
            {t('events.cancelEvent')}
          </button>
        ) : (
          <div className="mt-2 flex flex-col gap-2">
            <textarea
              className={cx(inputCls, 'resize-none')}
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('events.cancelReasonPlaceholder')}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmCancel(false)}
                className="rounded-full border border-border px-4 py-1.5 text-[13px] font-medium text-text hover:bg-surface-2"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                disabled={cancelEvent.pending}
                onClick={() => {
                  cancelEvent.cancelEvent(reason)
                  onCancelled()
                }}
                className="rounded-full bg-red-500 px-4 py-1.5 text-[13px] font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                {t('events.confirmCancel')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
