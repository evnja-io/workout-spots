import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { clubDetailQueryOptions } from '~/features/clubs/queries'
import { ClubManage } from '~/features/clubs/components/ClubManage'

export const Route = createFileRoute('/clubs/$clubId/manage')({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(clubDetailQueryOptions(params.clubId))
    if (!data) throw notFound()
  },
  component: ClubManagePage,
})

function ClubManagePage() {
  const { clubId } = Route.useParams()
  const navigate = useNavigate()
  const { data: club } = useSuspenseQuery(clubDetailQueryOptions(clubId))
  if (!club) return null
  return (
    <ClubManage
      club={club}
      onBack={() => void navigate({ to: '/clubs/$clubId', params: { clubId } })}
    />
  )
}
