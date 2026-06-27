export type EventStatus = 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
export type EventVisibility = 'public' | 'private' | 'club_only'
export type ParticipationType = 'interested' | 'participating'
export type ParticipationStatus = 'pending' | 'approved' | 'rejected' | 'waitlisted'

export type EventTag = {
  id: string
  name: string
  nameFr: string
  color: string
  icon: string | null
}

export type EventListItem = {
  id: string
  title: string
  startsAt: string
  endsAt: string
  timezone: string
  isFree: boolean
  priceAmount: number | null
  priceCurrency: string
  status: EventStatus
  maxParticipants: number | null
  goingCount: number
  primaryLocationName: string | null
  clubId: string | null
  featuredImageUrl: string | null
  tags: EventTag[]
}

export type EventLocation = {
  id: string
  name: string
  city: string
  address: string
  isPrimary: boolean
  order: number
  notes: string | null
}

export type EventImage = {
  imageUrl: string
  order: number
  caption: string | null
}

export type EventFeedAuthor = {
  id: string
  name: string
  avatarUrl: string | null
}

export type EventComment = {
  id: string
  author: EventFeedAuthor
  content: string
  createdAt: string
}

export type EventPost = {
  id: string
  author: EventFeedAuthor
  content: string
  imageUrl: string | null
  createdAt: string
  likeCount: number
  viewerLiked: boolean
  comments: EventComment[]
}

export type EventParticipant = {
  id: string
  user: { id: string; name: string; avatarUrl: string | null }
  type: ParticipationType
  status: ParticipationStatus
  note: string | null
  createdAt: string
}

export type EventDetail = {
  id: string
  title: string
  description: string | null
  startsAt: string
  endsAt: string
  timezone: string
  minParticipants: number
  maxParticipants: number | null
  registrationDeadline: string | null
  isFree: boolean
  priceAmount: number | null
  priceCurrency: string
  visibility: EventVisibility
  requiresApproval: boolean
  clubId: string | null
  clubName: string | null
  createdBy: string
  organizerName: string | null
  organizerContact: string | null
  status: EventStatus
  cancellationReason: string | null
  featuredImageUrl: string | null
  goingCount: number
  waitlistCount: number
  pendingCount: number
  viewerType: ParticipationType | null
  viewerStatus: ParticipationStatus | null
  locations: EventLocation[]
  images: EventImage[]
  tags: EventTag[]
}
