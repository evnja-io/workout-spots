import { describe, expect, it } from 'vitest'
import { mapClubListRow } from './queries'

const baseRow = {
  id: 'c1',
  name: 'Dawn Patrol',
  category: 'calisthenics',
  privacy: 'public',
  cover_image_url: null,
  member_count: 12,
  spot_count: 3,
  tags: ['outdoor', 'beginner'],
}

describe('mapClubListRow — sample members', () => {
  it('maps sample_avatars to sampleMembers', () => {
    const item = mapClubListRow({
      ...baseRow,
      sample_avatars: [
        { id: 'u1', name: 'Grace', avatar_url: null },
        { id: 'u2', name: null, avatar_url: 'https://x/b.png' },
      ],
    })
    expect(item.sampleMembers).toEqual([
      { id: 'u1', name: 'Grace', avatarUrl: null },
      { id: 'u2', name: '', avatarUrl: 'https://x/b.png' },
    ])
  })

  it('defaults to an empty array when sample_avatars is null', () => {
    const item = mapClubListRow({ ...baseRow, sample_avatars: null })
    expect(item.sampleMembers).toEqual([])
  })
})
