import { useQuery } from '@tanstack/react-query'
import { useSession } from '~/features/auth/session'
import { useAuthGate } from '~/features/auth/useAuthGate'
import { spotLikeQueryOptions } from './queries'
import { useSaveSpotMutation } from './mutations'

export function useSaveSpot(spotId: string): {
  liked: boolean
  toggle: () => void
  pending: boolean
} {
  const { userId } = useSession()
  const gate = useAuthGate()

  const { data: liked = false } = useQuery(spotLikeQueryOptions(spotId, userId))
  const mutation = useSaveSpotMutation(spotId, userId)

  const toggle = () => {
    gate(() => mutation.mutate(liked))
  }

  return { liked, toggle, pending: mutation.isPending }
}
