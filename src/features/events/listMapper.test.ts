import { describe, expect, it } from 'vitest'
import { mapEventListRow } from './queries'

const baseRow = {
  id: 'e1',
  title: 'Sunrise Calisthenics',
  starts_at: '2026-07-01T07:00:00Z',
  ends_at: '2026-07-01T08:30:00Z',
  timezone: 'Europe/Paris',
  is_free: true,
  price_amount: null,
  price_currency: null,
  visibility: 'public',
  status: 'upcoming',
  max_participants: 20,
  club_id: null,
  featured_image_url: null,
  going_count: 7,
  primary_location_name: 'Parc Montsouris',
  primary_location_city: 'Paris',
  tags: null,
}

describe('mapEventListRow — sample attendees', () => {
  it('maps sample_avatars to sampleAttendees', () => {
    const item = mapEventListRow({
      ...baseRow,
      sample_avatars: [
        { id: 'u1', name: 'Ada', avatar_url: 'https://x/a.png' },
        { id: 'u2', name: null, avatar_url: null },
      ],
    })
    expect(item.sampleAttendees).toEqual([
      { id: 'u1', name: 'Ada', avatarUrl: 'https://x/a.png' },
      { id: 'u2', name: '', avatarUrl: null },
    ])
  })

  it('defaults to an empty array when sample_avatars is null', () => {
    const item = mapEventListRow({ ...baseRow, sample_avatars: null })
    expect(item.sampleAttendees).toEqual([])
  })
})
