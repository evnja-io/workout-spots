import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar } from '~/components/ui/Avatar'
import { AvatarStack } from '~/components/ui/AvatarStack'
import { Icon } from '~/components/ui/Icon'
import { ImageWithShimmer } from '~/components/ui/ImageWithShimmer'
import { cx } from '~/components/ui/cx'
import type { ClubDetail as ClubDetailType, ClubLinkedSpot, ClubMember } from '../domain'
import { resolveClubViewer } from '../membership'
import { useJoinClub, useLeaveClub } from '../mutations'
import { coverGradient } from './visuals'
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

  const stackPeople = club.members.map((m) => ({
    id: m.userId,
    name: m.name,
    avatarUrl: m.avatarUrl,
  }))

  return (
    <div className="md:pb-8">
      {/* Immersive hero */}
      <div className="relative flex min-h-[300px] flex-col text-white md:min-h-[360px]">
        {club.coverImageUrl ? (
          <ImageWithShimmer src={club.coverImageUrl} alt="" className="absolute inset-0 z-0" />
        ) : (
          <div
            className="absolute inset-0 z-0"
            style={{ backgroundImage: coverGradient(club.id) }}
          />
        )}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(178deg,rgba(8,3,12,0.4)_0%,rgba(8,3,12,0.05)_30%,rgba(8,3,12,0.55)_72%,rgba(8,3,12,0.9)_100%)]" />

        <div className="relative z-[2] p-4 md:px-7 md:py-[18px]">
          <button
            type="button"
            onClick={onBack}
            aria-label={t('clubs.backToClubs')}
            className="grid size-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <Icon name="chevronL" size={18} />
          </button>
        </div>

        <div className="relative z-[2] mx-auto mt-auto w-full max-w-6xl px-4 pb-6 pt-6 md:px-7">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryChip category={club.category} onCover />
            <PrivacyBadge privacy={club.privacy} onCover />
          </div>
          <h1 className="mt-2.5 max-w-[18ch] font-display text-[clamp(34px,5vw,64px)] leading-[0.92] [text-shadow:0_3px_22px_rgba(0,0,0,0.5)]">
            {club.name}
          </h1>
          <div className="mt-3.5 flex flex-wrap items-center gap-3">
            {stackPeople.length > 0 ? (
              <AvatarStack
                people={stackPeople}
                total={club.memberCount}
                max={5}
                size={30}
                onPoster
                label={
                  <span className="text-white">
                    {t('clubs.members', { count: club.memberCount })}
                  </span>
                }
              />
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold">
                <Icon name="users" size={15} />
                {t('clubs.members', { count: club.memberCount })}
              </span>
            )}
            <span className="opacity-50">·</span>
            <span className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold">
              <Icon name="mappin" size={15} />
              {t('clubs.spots', { count: club.linkedSpots.length })}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto grid max-w-6xl gap-7 px-5 py-6 md:grid-cols-[minmax(0,1fr)_320px] md:px-7">
        <div className="flex min-w-0 flex-col gap-6">
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
                <p className="text-[15.5px] leading-relaxed text-text-2">{club.description}</p>
              )}

              {club.rules && <Rules rules={club.rules} />}

              {club.tags.length > 0 && (
                <Section title={t('clubs.tags')}>
                  <div className="flex flex-wrap gap-1.5">
                    {club.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface-2 px-2.5 py-1 text-[12.5px] font-medium text-text-2"
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
                  <div className="flex flex-col gap-0.5">
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
                  <div className="grid gap-2.5 md:grid-cols-2">
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
          <div className="sticky top-4 flex flex-col gap-4 rounded-[22px] border border-border bg-surface p-5 shadow-[var(--shadow-md)]">
            <div className="flex gap-5">
              <Stat value={club.memberCount} label={t('clubs.membersTitle')} />
              <Stat value={club.linkedSpots.length} label={t('clubs.spotsLabel')} />
            </div>
            {joinControl}
          </div>
        </aside>
      </div>

      {/* Mobile sticky join bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex flex-col gap-2 border-t border-border bg-surface/95 p-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
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
        '-mb-px border-b-2 px-3 py-2.5 text-[14px] font-bold transition-colors',
        active ? 'border-accent text-accent' : 'border-transparent text-text-3 hover:text-text',
      )}
    >
      {label}
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3.5 font-display text-[16px] uppercase tracking-[0.03em] text-text">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="text-[19px] font-extrabold tracking-[-0.01em] text-text">
        {value.toLocaleString()}
      </div>
      <div className="text-[11.5px] text-text-3">{label}</div>
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
      <ol className="flex flex-col gap-2.5">
        {shown.map((r, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[14px] leading-snug text-text-2">
            <span className="mt-0.5 grid size-[22px] shrink-0 place-items-center rounded-[7px] bg-accent-soft text-[11px] font-bold text-accent">
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
          className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent"
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
    <div className="flex items-center gap-3 rounded-[10px] px-2 py-2 transition-colors hover:bg-surface-2">
      <Avatar name={member.name} avatarUrl={member.avatarUrl} size={36} />
      <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-text">
        {member.name}
      </span>
      <RoleBadge role={member.role} />
    </div>
  )
}

function LinkedSpotRow({ spot, onOpen }: { spot: ClubLinkedSpot; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex items-center gap-3 rounded-[12px] border border-border bg-surface p-2.5 text-left transition-colors hover:border-accent hover:bg-surface-2"
    >
      <div
        className={cx(
          'size-[52px] shrink-0 overflow-hidden rounded-[9px]',
          !spot.thumbnailUrl &&
            'bg-[repeating-linear-gradient(135deg,#e5e7eb_0_8px,#eef0f3_8px_16px)]',
        )}
      >
        {spot.thumbnailUrl && (
          <ImageWithShimmer src={spot.thumbnailUrl} alt="" className="h-full w-full object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13.5px] font-semibold text-text">{spot.name}</div>
        {spot.city && (
          <div className="mt-0.5 flex items-center gap-1 text-[12px] text-text-3">
            <Icon name="mappin" size={12} />
            {spot.city}
          </div>
        )}
      </div>
      <Icon name="chevronR" size={18} />
    </button>
  )
}
