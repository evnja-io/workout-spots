import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { clubDetailQueryOptions } from '~/features/clubs/queries'
import { ClubManage } from '~/features/clubs/components/ClubManage'

export const Route = createFileRoute('/clubs/$clubId_/manage')({
  loader: async ({ context, params }) => {
    const club = await context.queryClient.ensureQueryData(clubDetailQueryOptions(params.clubId))
    if (!club) throw notFound()
    return { club }
  },
  component: ClubManagePage,
})

function ClubManagePage() {
  const { clubId } = Route.useParams()
  const navigate = useNavigate()
  const { club: initialClub } = Route.useLoaderData()
  const { data: club } = useSuspenseQuery({
    ...clubDetailQueryOptions(clubId),
    initialData: initialClub,
  })
  if (!club) return null
  return (
    <ClubManage
      club={club}
      onBack={() => void navigate({ to: '/clubs/$clubId', params: { clubId } })}
    />
  )
}
