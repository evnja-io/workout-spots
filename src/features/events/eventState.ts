import type { EventStatus, ParticipationStatus, ParticipationType } from './domain'

// ── Date / time formatting (in the event's timezone) ─────────────────────────
export function formatEventDate(iso: string, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: tz,
  }).format(new Date(iso))
}

export function formatTime(iso: string, tz: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: tz,
  }).format(new Date(iso))
}

export function formatEventTimeRange(startIso: string, endIso: string, tz: string): string {
  return `${formatTime(startIso, tz)} – ${formatTime(endIso, tz)}`
}

/** Day-of-month + short month, for the calendar chip. */
export function dayParts(iso: string, tz: string): { day: string; month: string } {
  const day = new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: tz }).format(
    new Date(iso),
  )
  const month = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: tz }).format(
    new Date(iso),
  )
  return { day, month }
}

// ── Capacity ─────────────────────────────────────────────────────────────────
type CapacityInput = { maxParticipants: number | null; goingCount: number }

export function isFull(e: CapacityInput): boolean {
  return e.maxParticipants != null && e.goingCount >= e.maxParticipants
}

export function spotsLeft(e: CapacityInput): number | null {
  if (e.maxParticipants == null) return null
  return Math.max(0, e.maxParticipants - e.goingCount)
}

// ── RSVP view resolution ─────────────────────────────────────────────────────
export type RsvpView =
  | 'participate'
  | 'request'
  | 'waitlist'
  | 'pending'
  | 'on-waitlist'
  | 'going'
  | 'closed'

type RsvpEvent = {
  status: EventStatus
  registrationDeadline: string | null
  requiresApproval: boolean
  maxParticipants: number | null
  goingCount: number
}
type RsvpViewer = {
  type: ParticipationType | null
  status: ParticipationStatus | null
}

/**
 * Resolve which RSVP control a viewer should see. Pure and independent of auth —
 * an anonymous viewer is `{ type: null, status: null }`, resolving to a join-type
 * action that the component gates behind sign-in. Mirrors the design's RSVPControl.
 */
export function resolveRsvpView(
  event: RsvpEvent,
  viewer: RsvpViewer,
  now: number = Date.now(),
): RsvpView {
  if (event.status === 'cancelled' || event.status === 'completed') return 'closed'
  if (event.registrationDeadline && now > new Date(event.registrationDeadline).getTime()) {
    return 'closed'
  }

  if (viewer.type === 'participating') {
    if (viewer.status === 'approved') return 'going'
    if (viewer.status === 'pending') return 'pending'
    if (viewer.status === 'waitlisted') return 'on-waitlist'
  }

  if (event.requiresApproval) return 'request'
  if (isFull(event)) return 'waitlist'
  return 'participate'
}
