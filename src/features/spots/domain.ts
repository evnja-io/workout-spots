export type Equipment = { id: string; name: string; localeKey: string; category: string }
export type Discipline = { id: string; name: string; localeKey: string; category: string }
export type SpotImage = { id: string; url: string; order: number; path?: string }
export type SpotComment = {
  id: string
  user: string
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
  openingHours: Record<string, string> | null
  images: SpotImage[]
  equipment: Equipment[]
  disciplines: Discipline[]
  comments: SpotComment[]
  viewerLiked: boolean
  viewerRating: number | null
}
