import { z } from 'zod'
import type { SpotListItem } from './domain'

export const spotSearchSchema = z.object({
  q: z.string().catch('').default(''),
  disciplines: z.array(z.string()).catch([]).default([]),
  equipment: z.array(z.string()).catch([]).default([]),
  open24h: z.boolean().catch(false).default(false),
  sort: z.enum(['rating', 'popular', 'name']).catch('rating').default('rating'),
})
export type SpotSearch = z.infer<typeof spotSearchSchema>

/**
 * URL-compatible search schema for use with TanStack Router `validateSearch`.
 * Fields are optional with no defaults so the router never redirects to
 * normalise the URL.  Invalid values are passed through as-is (unknown())
 * so a request to /spots?sort=bogus is served 200 (not 500, not redirect).
 * Components call `spotSearchSchema.parse(Route.useSearch())` to apply defaults.
 */
export const spotRouteSearchSchema = z.object({
  q: z.string().optional(),
  disciplines: z.array(z.string()).optional(),
  equipment: z.array(z.string()).optional(),
  open24h: z.boolean().optional(),
  sort: z.string().optional(),
})

function matches(s: SpotListItem, search: SpotSearch): boolean {
  if (search.q) {
    const q = search.q.toLowerCase()
    if (![s.name, s.address, s.city].some((f) => f.toLowerCase().includes(q))) return false
  }
  if (search.disciplines.length && !search.disciplines.some((d) => s.disciplineIds.includes(d)))
    return false
  if (search.equipment.length && !search.equipment.some((e) => s.equipmentIds.includes(e)))
    return false
  if (search.open24h && !s.isOpen24h) return false
  return true
}
export function applyFilters(spots: SpotListItem[], search: SpotSearch): SpotListItem[] {
  const filtered = spots.filter((s) => matches(s, search))
  const sorted = [...filtered]
  if (search.sort === 'rating') sorted.sort((a, b) => b.averageRating - a.averageRating)
  else if (search.sort === 'popular') sorted.sort((a, b) => b.ratingCount - a.ratingCount)
  else sorted.sort((a, b) => a.name.localeCompare(b.name))
  return sorted
}
