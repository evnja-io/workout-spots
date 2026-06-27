import type { ClubMemberStatus, ClubPrivacy, ClubRole } from './domain'

export type ClubViewer = {
  role: ClubRole | null
  status: ClubMemberStatus | null
}

/** The primary join-control action a viewer can take, given their membership. */
export type ClubPrimaryAction = 'join' | 'request' | 'cancel' | 'leave' | 'owned'

export type ClubViewerState = {
  /** Approved owner or moderator. */
  isStaff: boolean
  /** Approved member (includes staff). */
  isMember: boolean
  /** A membership request awaiting approval. */
  isPending: boolean
  /** Staff can open the management surface. */
  canManage: boolean
  /** Private club the viewer has no access to — feed and roster are hidden. */
  locked: boolean
  primaryAction: ClubPrimaryAction
}

/**
 * Pure resolution of the join-control state from club privacy + the viewer's
 * membership. Independent of auth: an anonymous viewer is `{ role: null,
 * status: null }`, which resolves to join/request — the component gates the
 * action behind sign-in. Mirrors the design's JoinControl logic.
 */
export function resolveClubViewer(privacy: ClubPrivacy, viewer: ClubViewer): ClubViewerState {
  const approved = viewer.status === 'approved'
  const isStaff = approved && (viewer.role === 'owner' || viewer.role === 'moderator')
  const isMember = approved && viewer.role !== null
  const isPending = viewer.status === 'pending'
  const locked = privacy === 'private' && !isMember

  let primaryAction: ClubPrimaryAction
  if (isMember) {
    primaryAction = viewer.role === 'owner' ? 'owned' : 'leave'
  } else if (isPending) {
    primaryAction = 'cancel'
  } else {
    primaryAction = privacy === 'private' ? 'request' : 'join'
  }

  return { isStaff, isMember, isPending, canManage: isStaff, locked, primaryAction }
}
