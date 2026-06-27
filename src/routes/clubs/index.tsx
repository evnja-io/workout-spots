import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { clubsListQueryOptions } from '~/features/clubs/queries'
import { ClubsBrowse } from '~/features/clubs/components/ClubsBrowse'

export const Route = createFileRoute('/clubs/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(clubsListQueryOptions())
  },
  component: ClubsBrowsePage,
})

function ClubsBrowsePage() {
  const navigate = useNavigate()
  const { data: clubs = [], isPending } = useQuery(clubsListQueryOptions())

  return (
    <ClubsBrowse
      clubs={clubs}
      loading={isPending}
      onOpen={(id) => void navigate({ to: '/clubs/$clubId', params: { clubId: id } })}
      onCreate={() => void navigate({ to: '/clubs/new' })}
    />
  )
}
