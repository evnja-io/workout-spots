import { describe, expect, test } from 'vitest'
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
        rating: 5,
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
      rating: 5,
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
})
