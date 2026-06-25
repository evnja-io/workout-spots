import { http, HttpResponse } from 'msw'
import { describe, expect, test, vi } from 'vitest'
import { server } from '~/test/msw/server'
import { mapSpotRow, mapSpotDetailRow } from './queries'

test('mapSpotRow flattens taxonomy join ids', () => {
  const item = mapSpotRow({
    id: 'sp-1',
    name: 'Bercy',
    city: 'Paris',
    address: 'Quai',
    latitude: 48.83,
    longitude: 2.38,
    is_open_24h: true,
    average_rating: 4.8,
    rating_count: 214,
    location_disciplines: [{ discipline_id: 'di-1' }],
    location_equipments: [{ equipment_id: 'eq-1' }],
    location_images: [{ image_url: 'u', image_order: 1 }],
  })
  expect(item).toMatchObject({
    id: 'sp-1',
    isOpen24h: true,
    averageRating: 4.8,
    disciplineIds: ['di-1'],
    equipmentIds: ['eq-1'],
    thumbnailUrl: 'u',
  })
})

describe('mapSpotDetailRow', () => {
  const detailRow = {
    id: 'sp-2',
    name: 'Charléty',
    city: 'Paris',
    address: '99 Rue',
    latitude: 48.82,
    longitude: 2.35,
    is_open_24h: false,
    average_rating: 4.5,
    rating_count: 100,
    description: 'A great spot',
    region: 'Île-de-France',
    country: 'France',
    contributor: 'alice',
    created_by: null,
    metadata: {
      source: 'calisthenics-parks.com',
      source_url: 'https://calisthenics-parks.com/spots/123',
    },
    creator: null,
    opening_hours: { mon: '09:00-18:00' },
    location_disciplines: [
      {
        discipline_id: 'di-2',
        disciplines: { id: 'di-2', name: 'Pull-ups', discipline_locale_key: 'pullups', category: 'strength' },
      },
    ],
    location_equipments: [
      {
        equipment_id: 'eq-2',
        equipments: { id: 'eq-2', name: 'Bar', equipment_locale_key: 'bar', category: 'upper' },
      },
    ],
    location_images: [
      { id: 'img-b', image_url: 'http://b.jpg', image_order: 2 },
      { id: 'img-a', image_url: 'http://a.jpg', image_order: 1 },
    ],
    location_comments: [
      {
        id: 'cmt-1',
        content: 'Amazing place',
        created_at: '2024-01-15',
        users: { pseudo: 'bob', name: null },
      },
    ],
  }

  test('images sorted by order ascending', () => {
    const detail = mapSpotDetailRow(detailRow)
    expect(detail.images[0]).toMatchObject({ url: 'http://a.jpg', order: 1 })
    expect(detail.images[1]).toMatchObject({ url: 'http://b.jpg', order: 2 })
  })

  test('thumbnailUrl is first image by order', () => {
    const detail = mapSpotDetailRow(detailRow)
    expect(detail.thumbnailUrl).toBe('http://a.jpg')
  })

  test('viewerLiked defaults to false, viewerRating to null', () => {
    const detail = mapSpotDetailRow(detailRow)
    expect(detail.viewerLiked).toBe(false)
    expect(detail.viewerRating).toBeNull()
  })

  test('comments mapped correctly', () => {
    const detail = mapSpotDetailRow(detailRow)
    expect(detail.comments[0]).toMatchObject({
      id: 'cmt-1',
      user: 'bob',
      rating: null,
      date: '2024-01-15',
      text: 'Amazing place',
    })
  })

  test('equipment localeKey mapped from equipment_locale_key', () => {
    const detail = mapSpotDetailRow(detailRow)
    expect(detail.equipment[0]).toMatchObject({
      id: 'eq-2',
      name: 'Bar',
      localeKey: 'bar',
      category: 'upper',
    })
  })

  test('disciplines mapped correctly', () => {
    const detail = mapSpotDetailRow(detailRow)
    expect(detail.disciplines[0]).toMatchObject({
      id: 'di-2',
      name: 'Pull-ups',
      localeKey: 'pullups',
      category: 'strength',
    })
  })

  test('disciplineIds derived from location_disciplines', () => {
    const detail = mapSpotDetailRow(detailRow)
    expect(detail.disciplineIds).toEqual(['di-2'])
  })

  test('description stays string|null', () => {
    const detail = mapSpotDetailRow(detailRow)
    expect(detail.description).toBe('A great spot')
  })

  test('user falls back to name then Anonymous', () => {
    const rowWithName = {
      ...detailRow,
      location_comments: [
        {
          id: 'cmt-2',
          content: 'Nice',
          created_at: '2024-02-01',
          rating: null,
          users: { pseudo: null, name: 'charlie' },
        },
        {
          id: 'cmt-3',
          content: 'Ok',
          created_at: '2024-02-02',
          rating: null,
          users: null,
        },
      ],
    }
    const detail = mapSpotDetailRow(rowWithName)
    expect(detail.comments.at(0)?.user).toBe('charlie')
    expect(detail.comments.at(1)?.user).toBe('Anonymous')
  })

  test('scraped spot (no created_by) exposes source attribution, no contributor', () => {
    const detail = mapSpotDetailRow(detailRow)
    expect(detail.addedByUser).toBe(false)
    expect(detail.source).toBe('calisthenics-parks.com')
    expect(detail.sourceUrl).toBe('https://calisthenics-parks.com/spots/123')
    expect(detail.contributorName).toBeNull()
  })

  test('user-added spot credits the contributor and suppresses source', () => {
    const userRow = {
      ...detailRow,
      created_by: 'user-1',
      creator: { pseudo: 'David', name: 'David Venin' },
    }
    const detail = mapSpotDetailRow(userRow)
    expect(detail.addedByUser).toBe(true)
    expect(detail.contributorName).toBe('David')
    // "if not added by a new contributor" — scraped source must not show.
    expect(detail.source).toBeNull()
    expect(detail.sourceUrl).toBeNull()
  })

  test('user-added spot with no pseudo falls back to name then null', () => {
    const namedRow = {
      ...detailRow,
      created_by: 'user-2',
      creator: { pseudo: null, name: 'Sam' },
    }
    expect(mapSpotDetailRow(namedRow).contributorName).toBe('Sam')

    const anonRow = { ...detailRow, created_by: 'user-3', creator: null }
    const anon = mapSpotDetailRow(anonRow)
    expect(anon.addedByUser).toBe(true)
    expect(anon.contributorName).toBeNull()
  })
})

// ─── spotsInBoundsQueryOptions ────────────────────────────────────────────────

describe('spotsInBoundsQueryOptions', () => {
  const mockSpotRow = {
    id: 'sp-bbox-1',
    name: 'Bbox Spot',
    city: 'Paris',
    address: '1 Rue Test',
    latitude: 48.85,
    longitude: 2.35,
    is_open_24h: true,
    average_rating: 4.5,
    rating_count: 20,
    location_disciplines: [{ discipline_id: 'di-1' }],
    location_equipments: [{ equipment_id: 'eq-1' }],
    location_images: [{ image_url: 'http://img.jpg', image_order: 1 }],
  }

  test('query key includes rounded bounds', async () => {
    const { spotsInBoundsQueryOptions, WORLD_BOUNDS } = await import('./queries')
    const opts = spotsInBoundsQueryOptions(WORLD_BOUNDS)
    // Key shape: ['spots', 'bbox', roundedBounds]
    expect(opts.queryKey[0]).toBe('spots')
    expect(opts.queryKey[1]).toBe('bbox')
    // The rounded object should be present (queryKey[2] is already typed as Bounds)
    const rounded = opts.queryKey[2]
    expect(typeof rounded.west).toBe('number')
    expect(typeof rounded.north).toBe('number')
  })

  test('query key rounds tiny pan differences to same cache key', async () => {
    const { spotsInBoundsQueryOptions } = await import('./queries')
    const b1 = { west: 2.351, south: 48.851, east: 2.361, north: 48.861 }
    const b2 = { west: 2.352, south: 48.852, east: 2.362, north: 48.862 }
    const k1 = spotsInBoundsQueryOptions(b1).queryKey[2]
    const k2 = spotsInBoundsQueryOptions(b2).queryKey[2]
    // Both should round to the same 2-decimal key
    expect(k1).toEqual(k2)
  })

  test('maps rows returned by Supabase bbox query', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://x.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon')

    server.use(
      http.get('https://x.supabase.co/rest/v1/locations', () =>
        HttpResponse.json([mockSpotRow]),
      ),
    )

    const { spotsInBoundsQueryOptions, WORLD_BOUNDS } = await import('./queries')
    const opts = spotsInBoundsQueryOptions(WORLD_BOUNDS)
    const data = await opts.queryFn!({} as never)
    expect(Array.isArray(data)).toBe(true)
    expect((data as { id: string }[])[0]).toMatchObject({
      id: 'sp-bbox-1',
      name: 'Bbox Spot',
      disciplineIds: ['di-1'],
      equipmentIds: ['eq-1'],
      thumbnailUrl: 'http://img.jpg',
    })
  })

  test('returns [] when supabase not configured', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
    const { spotsInBoundsQueryOptions, WORLD_BOUNDS } = await import('./queries')
    const opts = spotsInBoundsQueryOptions(WORLD_BOUNDS)
    const data = await opts.queryFn!({} as never)
    expect(data).toEqual([])
    // Restore
    vi.stubEnv('VITE_SUPABASE_URL', 'https://x.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon')
  })
})
