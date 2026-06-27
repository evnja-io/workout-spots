import { describe, expect, it } from 'vitest'
import {
  formatEventDate,
  formatEventTimeRange,
  isFull,
  resolveRsvpView,
  spotsLeft,
} from './eventState'

const base = {
  status: 'upcoming' as const,
  registrationDeadline: null,
  requiresApproval: false,
  maxParticipants: 10,
  goingCount: 3,
}

describe('capacity', () => {
  it('isFull / spotsLeft with a cap', () => {
    expect(isFull({ maxParticipants: 10, goingCount: 3 })).toBe(false)
    expect(spotsLeft({ maxParticipants: 10, goingCount: 3 })).toBe(7)
    expect(isFull({ maxParticipants: 10, goingCount: 10 })).toBe(true)
    expect(spotsLeft({ maxParticipants: 10, goingCount: 12 })).toBe(0)
  })
  it('uncapped events are never full', () => {
    expect(isFull({ maxParticipants: null, goingCount: 999 })).toBe(false)
    expect(spotsLeft({ maxParticipants: null, goingCount: 999 })).toBeNull()
  })
})

describe('resolveRsvpView', () => {
  const NOW = new Date('2026-06-01T00:00:00Z').getTime()

  it('anonymous viewer on an open event → participate', () => {
    expect(resolveRsvpView(base, { type: null, status: null }, NOW)).toBe('participate')
  })
  it('approval-required event → request', () => {
    expect(
      resolveRsvpView({ ...base, requiresApproval: true }, { type: null, status: null }, NOW),
    ).toBe('request')
  })
  it('full event → waitlist', () => {
    expect(resolveRsvpView({ ...base, goingCount: 10 }, { type: null, status: null }, NOW)).toBe(
      'waitlist',
    )
  })
  it('participating + approved → going', () => {
    expect(resolveRsvpView(base, { type: 'participating', status: 'approved' }, NOW)).toBe('going')
  })
  it('participating + pending → pending', () => {
    expect(resolveRsvpView(base, { type: 'participating', status: 'pending' }, NOW)).toBe('pending')
  })
  it('participating + waitlisted → on-waitlist', () => {
    expect(resolveRsvpView(base, { type: 'participating', status: 'waitlisted' }, NOW)).toBe(
      'on-waitlist',
    )
  })
  it('cancelled / completed → closed', () => {
    expect(
      resolveRsvpView({ ...base, status: 'cancelled' }, { type: null, status: null }, NOW),
    ).toBe('closed')
    expect(
      resolveRsvpView({ ...base, status: 'completed' }, { type: null, status: null }, NOW),
    ).toBe('closed')
  })
  it('past registration deadline → closed', () => {
    expect(
      resolveRsvpView(
        { ...base, registrationDeadline: '2026-05-01T00:00:00Z' },
        { type: null, status: null },
        NOW,
      ),
    ).toBe('closed')
  })
  it('interested-only viewer still sees a join action', () => {
    expect(resolveRsvpView(base, { type: 'interested', status: 'approved' }, NOW)).toBe(
      'participate',
    )
  })
})

describe('date formatting (timezone-aware)', () => {
  it('formats a UTC instant in the given timezone', () => {
    expect(formatTimeUtc('2026-06-28T10:00:00Z')).toBe('10:00 – 12:30')
    // Paris is UTC+2 in summer → 12:00
    expect(
      formatEventTimeRange('2026-06-28T10:00:00Z', '2026-06-28T12:30:00Z', 'Europe/Paris'),
    ).toBe('12:00 – 14:30')
  })
  it('formats the date label', () => {
    expect(formatEventDate('2026-06-28T10:00:00Z', 'UTC')).toBe('Sun, Jun 28')
  })
})

function formatTimeUtc(start: string): string {
  return formatEventTimeRange(start, '2026-06-28T12:30:00Z', 'UTC')
}
