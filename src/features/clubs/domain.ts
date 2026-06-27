export type ClubPrivacy = 'public' | 'private'
export type ClubRole = 'owner' | 'moderator' | 'member'
export type ClubMemberStatus = 'pending' | 'approved' | 'rejected'

export type ClubListItem = {
  id: string
  name: string
  category: string
  privacy: ClubPrivacy
  coverImageUrl: string | null
  memberCount: number
  spotCount: number
  tags: string[]
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
