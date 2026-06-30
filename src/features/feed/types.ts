// Shared feed media types used by both the clubs and events feeds and by the
// shared presentational components in this module.

export type PostMediaType = 'image' | 'video' | 'poll'

export type PollOption = {
  id: string
  label: string
  position: number
  voteCount: number
}

export type Poll = {
  options: PollOption[]
  totalVotes: number
  /** ISO timestamp after which voting is closed, or null for no deadline. */
  closesAt: string | null
  /** The option the current viewer voted for, or null if they haven't voted. */
  viewerVotedOptionId: string | null
}

/** A media block chosen in the composer when creating a post. */
export type CreateMedia =
  | { kind: 'image'; file: File }
  | { kind: 'video'; url: string }
  | { kind: 'poll'; options: string[]; closesAt: string | null }
  | null
