import { describe, expect, it } from 'vitest'
import { resolveClubViewer } from './membership'

describe('resolveClubViewer', () => {
  it('anonymous viewer on a public club → join', () => {
    const s = resolveClubViewer('public', { role: null, status: null })
    expect(s.primaryAction).toBe('join')
    expect(s.isMember).toBe(false)
    expect(s.locked).toBe(false)
  })

  it('anonymous viewer on a private club → request, and locked', () => {
    const s = resolveClubViewer('private', { role: null, status: null })
    expect(s.primaryAction).toBe('request')
    expect(s.locked).toBe(true)
  })

  it('pending request → cancel', () => {
    const s = resolveClubViewer('private', { role: 'member', status: 'pending' })
    expect(s.primaryAction).toBe('cancel')
    expect(s.isMember).toBe(false)
    expect(s.locked).toBe(true)
  })

  it('approved member → leave, not locked, cannot manage', () => {
    const s = resolveClubViewer('private', { role: 'member', status: 'approved' })
    expect(s.primaryAction).toBe('leave')
    expect(s.isMember).toBe(true)
    expect(s.locked).toBe(false)
    expect(s.canManage).toBe(false)
  })

  it('approved moderator → staff, can manage, still leave', () => {
    const s = resolveClubViewer('public', { role: 'moderator', status: 'approved' })
    expect(s.isStaff).toBe(true)
    expect(s.canManage).toBe(true)
    expect(s.primaryAction).toBe('leave')
  })

  it('owner → owned (cannot leave without transferring)', () => {
    const s = resolveClubViewer('public', { role: 'owner', status: 'approved' })
    expect(s.primaryAction).toBe('owned')
    expect(s.canManage).toBe(true)
  })

  it('rejected request is treated as a non-member', () => {
    const s = resolveClubViewer('public', { role: 'member', status: 'rejected' })
    expect(s.isMember).toBe(false)
    expect(s.isPending).toBe(false)
    expect(s.primaryAction).toBe('join')
  })
})
