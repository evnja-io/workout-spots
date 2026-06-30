import type { Poll, PollOption } from './types'

/** PostgREST shape for an embedded poll option with its nested vote count. */
export type PollOptionRow = {
  id: string
  label: string
  position: number
  votes: { count: number }[]
}

/** Build a Poll domain object from embedded option rows + the viewer's vote. */
export function mapPoll(
  options: PollOptionRow[] | null | undefined,
  closesAt: string | null,
  viewerVotedOptionId: string | null,
): Poll {
  const opts: PollOption[] = [...(options ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((o) => ({
      id: o.id,
      label: o.label,
      position: o.position,
      voteCount: o.votes?.[0]?.count ?? 0,
    }))
  const totalVotes = opts.reduce((sum, o) => sum + o.voteCount, 0)
  return { options: opts, totalVotes, closesAt, viewerVotedOptionId }
}
