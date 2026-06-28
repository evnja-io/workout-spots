import { describe, expect, it } from 'vitest'
import { applyFilters, spotSearchSchema } from './filters'
import type { SpotListItem } from './domain'

const base: Omit<SpotListItem, 'id' | 'name'> = {
  city: 'Paris',
  address: 'x',
  latitude: 0,
  longitude: 0,
  isOpen24h: false,
  averageRating: 0,
  ratingCount: 0,
  disciplineIds: [],
  equipmentIds: [],
  thumbnailUrl: null,
}
const spots: SpotListItem[] = [
  {
    ...base,
    id: 'a',
    name: 'Bercy Bars',
    averageRating: 4.8,
    ratingCount: 200,
    disciplineIds: ['di-1'],
    isOpen24h: true,
  },
  {
    ...base,
    id: 'b',
    name: 'Charléty',
    averageRating: 4.7,
    ratingCount: 400,
    disciplineIds: ['di-4'],
  },
]

describe('filters', () => {
  it('search schema defaults', () => {
    expect(spotSearchSchema.parse({})).toEqual({
      disciplines: [],
      equipment: [],
      open24h: false,
      sort: 'rating',
    })
  })
  it('filters by discipline', () => {
    const out = applyFilters(spots, spotSearchSchema.parse({ disciplines: ['di-4'] }))
    expect(out.map((s) => s.id)).toEqual(['b'])
  })
  it('filters by open24h', () => {
    expect(applyFilters(spots, spotSearchSchema.parse({ open24h: true })).map((s) => s.id)).toEqual(
      ['a'],
    )
  })
  it('sorts by popular then name', () => {
    expect(
      applyFilters(spots, spotSearchSchema.parse({ sort: 'popular' })).map((s) => s.id),
    ).toEqual(['b', 'a'])
    expect(applyFilters(spots, spotSearchSchema.parse({ sort: 'name' })).map((s) => s.id)).toEqual([
      'a',
      'b',
    ])
  })
})
