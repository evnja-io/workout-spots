import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components/ui/Icon'
import { ImageWithShimmer } from '~/components/ui/ImageWithShimmer'
import { cx } from '~/components/ui/cx'
import type { ClubDetail as ClubDetailType, ClubLinkedSpot, ClubMember } from '../domain'
import { resolveClubViewer } from '../membership'
import { useJoinClub, useLeaveClub } from '../mutations'
import { coverGradient } from './visuals'
import { Avatar } from './Avatar'
import { CategoryChip, PrivacyBadge, RoleBadge } from './badges'
import { JoinControl } from './JoinControl'
import { ClubFeed } from './ClubFeed'

export function ClubDetail({
  club,
  onBack,
  onOpenSpot,
  onManage,
}: {
  club: ClubDetailType
  onBack: () => void
  onOpenSpot: (spotId: string) => void
  onManage: () => void
}) {
  const { t } = useTranslation()
  const [tab, setTab] = useState<'overview' | 'feed'>('overview')
  const state = resolveClubViewer(club.privacy, {
    role: club.viewerRole,
    status: club.viewerStatus,
  })
  const { join, pending: joinPending } = useJoinClub(club.id, club.privacy)
  const { leave, pending: leavePending } = useLeaveClub(club.id)

  const joinControl = (
    <JoinControl
      state={state}
      joinPending={joinPending}
      leavePending={leavePending}
      onJoin={join}
      onLeave={leave}
      onManage={onManage}
    />
  )

  return (
    <div className="mx-auto max-w-5xl pb-24 md:pb-8">
      {/* Cover */}
      <div
        className="relative flex h-48 flex-col justify-between p-4 text-white md:h-60"
        style={club.coverImageUrl ? undefined : { backgroundImage: coverGradient(club.id) }}
      >
        {club.coverImageUrl && (
          <>
            <ImageWithShimmer
              src={club.coverImageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25),rgba(0,0,0,0.55))]" />
          </>
        )}
        <div className="relative">
          <button
            type="button"
            onClick={onBack}
            aria-label={t('clubs.backToClubs')}
            className="grid size-9 place-items-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
          >
            <Icon name="chevronL" size={18} />
          </button>
        </div>
        <div className="relative">
          <div className="flex items-center gap-2">
            <CategoryChip category={club.category} onCover />
            <PrivacyBadge privacy={club.privacy} onCover />
          </div>
          <h1 className="mt-2 text-[26px] font-semibold leading-tight">{club.name}</h1>
          <div className="mt-1.5 flex items-center gap-2 text-[13px] opacity-95">
            <span className="inline-flex items-center gap-1">
              <Icon name="users" size={15} />
              {t('clubs.members', { count: club.memberCount })}
            </span>
            <span className="opacity-60">·</span>
            <span className="inline-flex items-center gap-1">
              <Icon name="mappin" size={15} />
              {t('clubs.spots', { count: club.linkedSpots.length })}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="grid gap-6 px-5 py-6 md:grid-cols-[1fr_300px]">
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex gap-1 border-b border-border">
            <TabButton
              active={tab === 'overview'}
              label={t('clubs.tabOverview')}
              onClick={() => setTab('overview')}
            />
            <TabButton
              active={tab === 'feed'}
              label={t('clubs.tabFeed')}
              onClick={() => setTab('feed')}
            />
          </div>

          {tab === 'feed' ? (
            <ClubFeed clubId={club.id} locked={state.locked} canCompose={state.isMember} />
          ) : (
            <div className="flex flex-col gap-7">
              {club.description && (
                <p className="text-[15px] leading-relaxed text-text-2">{club.description}</p>
              )}

              {club.rules && <Rules rules={club.rules} />}

              {club.tags.length > 0 && (
                <Section title={t('clubs.tags')}>
                  <div className="flex flex-wrap gap-1.5">
                    {club.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface-2 px-2.5 py-1 text-[12.5px] text-text-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              <Section title={`${t('clubs.membersTitle')} · ${club.memberCount.toLocaleString()}`}>
                {state.locked ? (
                  <p className="text-[13px] text-text-3">{t('clubs.memberListLocked')}</p>
                ) : club.members.length === 0 ? (
                  <p className="text-[13px] text-text-3">{t('clubs.noMembers')}</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {club.members.slice(0, 8).map((m) => (
                      <MemberRow key={m.userId} member={m} />
                    ))}
                  </div>
                )}
              </Section>

              <Section title={`${t('clubs.linkedSpots')} · ${club.linkedSpots.length}`}>
                {club.linkedSpots.length === 0 ? (
                  <p className="text-[13px] text-text-3">{t('clubs.noLinkedSpots')}</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {club.linkedSpots.map((s) => (
                      <LinkedSpotRow key={s.id} spot={s} onOpen={() => onOpenSpot(s.id)} />
                    ))}
                  </div>
                )}
              </Section>
            </div>
          )}
        </div>

        {/* Aside (desktop) */}
        <aside className="hidden md:block">
          <div className="sticky top-4 flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <Stat value={club.memberCount} label={t('clubs.membersTitle')} />
              <Stat value={club.linkedSpots.length} label={t('clubs.spotsLabel')} />
              <Stat value={club.tags.length} label={t('clubs.tags')} />
            </div>
            <div className="h-px bg-border" />
            {joinControl}
          </div>
        </aside>
      </div>

      {/* Mobile sticky join bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface p-3 pb-[calc(12px+env(safe-area-inset-bottom))] md:hidden">
        {joinControl}
      </div>
    </div>
  )
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        '-mb-px border-b-2 px-3 py-2 text-[14px] font-medium transition-colors',
        active ? 'border-accent text-text' : 'border-transparent text-text-3 hover:text-text',
      )}
    >
      {label}
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2.5 text-[13px] font-semibold uppercase tracking-[0.04em] text-text-4">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="text-[18px] font-semibold text-text">{value.toLocaleString()}</div>
      <div className="text-[11px] text-text-4">{label}</div>
    </div>
  )
}

function Rules({ rules }: { rules: string }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const items = rules
    .split('\n')
    .map((r) => r.trim())
    .filter(Boolean)
  if (items.length === 0) return null
  const shown = open ? items : items.slice(0, 2)
  return (
    <Section title={t('clubs.rules')}>
      <ol className="flex flex-col gap-2">
        {shown.map((r, i) => (
          <li key={i} className="flex gap-2.5 text-[14px] text-text-2">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-surface-2 text-[11px] font-semibold text-text-3">
              {i + 1}
            </span>
            <span>{r}</span>
          </li>
        ))}
      </ol>
      {items.length > 2 && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium text-accent"
        >
          {open ? t('clubs.showLess') : t('clubs.showAllRules', { count: items.length })}
          <Icon name={open ? 'chevronU' : 'chevronD'} size={14} />
        </button>
      )}
    </Section>
  )
}

function MemberRow({ member }: { member: ClubMember }) {
  return (
    <div className="flex items-center gap-2.5 py-1">
      <Avatar name={member.name} avatarUrl={member.avatarUrl} size={32} />
      <span className="min-w-0 flex-1 truncate text-[14px] text-text">{member.name}</span>
      <RoleBadge role={member.role} />
    </div>
  )
}

function LinkedSpotRow({ spot, onOpen }: { spot: ClubLinkedSpot; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex items-center gap-3 rounded-lg border border-transparent p-2 text-left transition-colors hover:border-border hover:bg-surface-2"
    >
      <div
        className={cx(
          'size-11 shrink-0 overflow-hidden rounded-[9px]',
          !spot.thumbnailUrl &&
            'bg-[repeating-linear-gradient(135deg,#e5e7eb_0_8px,#eef0f3_8px_16px)]',
        )}
      >
        {spot.thumbnailUrl && (
          <ImageWithShimmer src={spot.thumbnailUrl} alt="" className="h-full w-full object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-medium text-text">{spot.name}</div>
        {spot.city && (
          <div className="flex items-center gap-1 text-[12px] text-text-3">
            <Icon name="mappin" size={12} />
            {spot.city}
          </div>
        )}
      </div>
      <Icon name="chevronR" size={18} />
    </button>
  )
}
