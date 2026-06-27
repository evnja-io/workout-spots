import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import type { ClubDetail, ClubMember } from '../domain'
import { clubPendingRequestsQueryOptions, type LinkableSpot } from '../queries'
import {
  useApproveMember,
  useChangeMemberRole,
  useKickMember,
  useRejectMember,
  useTransferOwnership,
  useUpdateClub,
} from '../staffMutations'
import { createClubSchema } from '../schema'
import { Avatar } from './Avatar'
import { RoleBadge } from './badges'
import { SpotLinker } from './SpotLinker'
import { TagInput } from './TagInput'
import { timeAgo } from './visuals'

type ManageTab = 'requests' | 'members' | 'edit'

export function ClubManage({ club, onBack }: { club: ClubDetail; onBack: () => void }) {
  const { t } = useTranslation()
  const [tab, setTab] = useState<ManageTab>('requests')

  const isStaff = club.viewerRole === 'owner' || club.viewerRole === 'moderator'
  const isOwner = club.viewerRole === 'owner'

  if (!isStaff) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center text-[14px] text-text-3">
        {t('clubs.notStaff')}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1 text-[13px] font-medium text-text-3 hover:text-text"
      >
        <Icon name="chevronL" size={16} />
        {club.name}
      </button>
      <h1 className="text-[22px] font-semibold text-text">{t('clubs.manage')}</h1>

      <div className="mt-4 flex gap-1 border-b border-border">
        <Tab
          active={tab === 'requests'}
          label={t('clubs.manageRequests')}
          onClick={() => setTab('requests')}
        />
        <Tab
          active={tab === 'members'}
          label={t('clubs.manageMembers')}
          onClick={() => setTab('members')}
        />
        {isOwner && (
          <Tab
            active={tab === 'edit'}
            label={t('clubs.manageEdit')}
            onClick={() => setTab('edit')}
          />
        )}
      </div>

      <div className="mt-5">
        {tab === 'requests' && <Requests clubId={club.id} />}
        {tab === 'members' && <Members club={club} isOwner={isOwner} />}
        {tab === 'edit' && isOwner && <EditClub club={club} onSaved={onBack} />}
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

function Requests({ clubId }: { clubId: string }) {
  const { t } = useTranslation()
  const { data: requests = [], isPending } = useQuery(clubPendingRequestsQueryOptions(clubId))
  const { approve } = useApproveMember(clubId)
  const { reject } = useRejectMember(clubId)

  if (isPending) return <p className="text-[13px] text-text-3">…</p>
  if (requests.length === 0)
    return <p className="text-[13px] text-text-3">{t('clubs.noRequests')}</p>

  return (
    <div className="flex flex-col gap-2">
      {requests.map((r) => (
        <div
          key={r.membershipId}
          className="flex items-center gap-3 rounded-lg border border-border p-2.5"
        >
          <Avatar name={r.user.name} avatarUrl={r.user.avatarUrl} size={36} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[14px] font-medium text-text">{r.user.name}</div>
            <div className="text-[12px] text-text-4">{timeAgo(r.requestedAt)}</div>
          </div>
          <button
            type="button"
            onClick={() => approve(r.membershipId)}
            className="rounded-full bg-accent px-3 py-1.5 text-[12.5px] font-medium text-white hover:bg-accent-2"
          >
            {t('clubs.approve')}
          </button>
          <button
            type="button"
            onClick={() => reject(r.membershipId)}
            className="rounded-full border border-border px-3 py-1.5 text-[12.5px] font-medium text-text hover:bg-surface-2"
          >
            {t('clubs.reject')}
          </button>
        </div>
      ))}
    </div>
  )
}

function Members({ club, isOwner }: { club: ClubDetail; isOwner: boolean }) {
  const { changeRole } = useChangeMemberRole(club.id)
  const { kick } = useKickMember(club.id)
  const { transfer } = useTransferOwnership(club.id)

  return (
    <div className="flex flex-col gap-2">
      {club.members.map((m) => (
        <MemberManageRow
          key={m.userId}
          member={m}
          isOwner={isOwner}
          onPromote={() => changeRole(m.userId, 'moderator')}
          onDemote={() => changeRole(m.userId, 'member')}
          onKick={() => kick(m.userId)}
          onTransfer={() => transfer(m.userId)}
        />
      ))}
    </div>
  )
}

function MemberManageRow({
  member,
  isOwner,
  onPromote,
  onDemote,
  onKick,
  onTransfer,
}: {
  member: ClubMember
  isOwner: boolean
  onPromote: () => void
  onDemote: () => void
  onKick: () => void
  onTransfer: () => void
}) {
  const { t } = useTranslation()
  const isClubOwner = member.role === 'owner'
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-2.5">
      <Avatar name={member.name} avatarUrl={member.avatarUrl} size={36} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-medium text-text">{member.name}</div>
      </div>
      <RoleBadge role={member.role} />
      {isOwner && !isClubOwner && (
        <div className="flex items-center gap-1">
          {member.role === 'member' ? (
            <ActionBtn label={t('clubs.promote')} onClick={onPromote} />
          ) : (
            <ActionBtn label={t('clubs.demote')} onClick={onDemote} />
          )}
          <ActionBtn label={t('clubs.makeOwner')} onClick={onTransfer} />
          <ActionBtn label={t('clubs.kick')} danger onClick={onKick} />
        </div>
      )}
    </div>
  )
}

function ActionBtn({
  label,
  onClick,
  danger,
}: {
  label: string
  onClick: () => void
  danger?: boolean
}) {
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

function EditClub({ club, onSaved }: { club: ClubDetail; onSaved: () => void }) {
  const { t } = useTranslation()
  const { update, pending } = useUpdateClub(club.id)

  const [name, setName] = useState(club.name)
  const [description, setDescription] = useState(club.description ?? '')
  const [category, setCategory] = useState(club.category)
  const [privacy, setPrivacy] = useState<'public' | 'private'>(club.privacy)
  const [rules, setRules] = useState(club.rules ?? '')
  const [cover, setCover] = useState<File | null>(null)
  const [spots, setSpots] = useState<LinkableSpot[]>(
    club.linkedSpots.map((s) => ({ id: s.id, name: s.name, city: s.city })),
  )
  const [tags, setTags] = useState<string[]>(club.tags)

  const save = () => {
    const parsed = createClubSchema.safeParse({
      name,
      description,
      category,
      privacy,
      rules,
      linkedSpotIds: spots.map((s) => s.id),
      tags,
    })
    if (!parsed.success) return
    update(parsed.data, cover)
    onSaved()
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-text-2">{t('clubs.fieldName')}</span>
        <input
          className={inputCls}
          value={name}
          maxLength={100}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-text-2">{t('clubs.fieldDescription')}</span>
        <textarea
          className={cx(inputCls, 'resize-none')}
          rows={3}
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-text-2">{t('clubs.fieldCategory')}</span>
        <input
          className={inputCls}
          value={category}
          maxLength={50}
          onChange={(e) => setCategory(e.target.value)}
        />
      </label>
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-text-2">{t('clubs.fieldPrivacy')}</span>
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
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-text-2">{t('clubs.fieldRules')}</span>
        <textarea
          className={cx(inputCls, 'resize-none')}
          rows={3}
          maxLength={1000}
          value={rules}
          onChange={(e) => setRules(e.target.value)}
        />
      </label>
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-text-2">{t('clubs.fieldCover')}</span>
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
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-text-2">{t('clubs.linkedSpots')}</span>
        <SpotLinker selected={spots} onChange={setSpots} />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-text-2">{t('clubs.tags')}</span>
        <TagInput value={tags} onChange={setTags} />
      </div>
      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={save}
          disabled={pending || name.trim() === '' || category.trim() === ''}
          className="rounded-full bg-accent px-5 py-2 text-[13px] font-medium text-white hover:bg-accent-2 disabled:opacity-50"
        >
          {t('common.save')}
        </button>
      </div>
    </div>
  )
}
