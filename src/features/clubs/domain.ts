import type { PostMediaType, Poll } from '~/features/feed/types'

export type ClubPrivacy = 'public' | 'private'
export type ClubRole = 'owner' | 'moderator' | 'member'
export type ClubMemberStatus = 'pending' | 'approved' | 'rejected'

/** Lightweight person reference for "social stack" avatar rows. */
export type SampleAvatar = {
  id: string
  name: string
  avatarUrl: string | null
}

export type ClubListItem = {
  id: string
  name: string
  category: string
  privacy: ClubPrivacy
  coverImageUrl: string | null
  memberCount: number
  spotCount: number
  tags: string[]
  /** Up to ~5 sample members (owner/mods first) for the card's social stack. */
  sampleMembers: SampleAvatar[]
}

export type ClubMember = {
  userId: string
  name: string
  avatarUrl: string | null
  role: ClubRole
  joinedAt: string
}

export type ClubLinkedSpot = {
  id: string
  name: string
  city: string
  thumbnailUrl: string | null
}

export type ClubFeedAuthor = {
  id: string
  name: string
  avatarUrl: string | null
}

export type ClubComment = {
  id: string
  author: ClubFeedAuthor
  content: string
  createdAt: string
}

export type ClubPost = {
  id: string
  author: ClubFeedAuthor
  content: string
  imageUrl: string | null
  videoUrl: string | null
  mediaType: PostMediaType | null
  poll: Poll | null
  createdAt: string
  likeCount: number
  viewerLiked: boolean
  comments: ClubComment[]
}

export type ClubPendingRequest = {
  membershipId: string
  user: ClubFeedAuthor
  requestedAt: string
}

export type ClubDetail = {
  id: string
  name: string
  category: string
  privacy: ClubPrivacy
  description: string | null
  /** Free-text rules; rendered as a numbered list split on newlines. */
  rules: string | null
  coverImageUrl: string | null
  createdBy: string
  memberCount: number
  tags: string[]
  linkedSpots: ClubLinkedSpot[]
  members: ClubMember[]
  /** The current viewer's role/status in this club (null when not a member). */
  viewerRole: ClubRole | null
  viewerStatus: ClubMemberStatus | null
}
