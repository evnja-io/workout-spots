export type Equipment = { id: string; name: string; localeKey: string; category: string }
export type Discipline = { id: string; name: string; localeKey: string; category: string }
export type SpotImage = { id: string; url: string; order: number; path?: string }
export type SpotComment = {
  id: string
  user: string
  userId: string | null
  rating: number | null
  date: string
  text: string
}

export type SpotListItem = {
  id: string
  name: string
  city: string
  address: string
  latitude: number
  longitude: number
  isOpen24h: boolean
  averageRating: number
  ratingCount: number
  disciplineIds: string[]
  equipmentIds: string[]
  thumbnailUrl: string | null
}
export type SpotDetail = SpotListItem & {
  description: string | null
  region: string
  country: string
  contributor: string
  /** True when an app user created this spot (locations.created_by is set). */
  addedByUser: boolean
  /** Display name of the app contributor (pseudo ?? name); null when none set or scraped. */
  contributorName: string | null
  /** Scraped source domain (metadata.source); only set when NOT addedByUser. */
  source: string | null
  /** Deep link back to the original scraped listing; only set when NOT addedByUser. */
  sourceUrl: string | null
  openingHours: Record<string, string> | null
  images: SpotImage[]
  equipment: Equipment[]
  disciplines: Discipline[]
  comments: SpotComment[]
  viewerLiked: boolean
  viewerRating: number | null
}
