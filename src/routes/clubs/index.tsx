import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { clubsListQueryOptions } from '~/features/clubs/queries'
import { ClubsBrowse } from '~/features/clubs/components/ClubsBrowse'

export const Route = createFileRoute('/clubs/')({
  // Return the data from the loader (and seed useQuery with it) so the client's
  // first render matches SSR — the query cache itself isn't dehydrated to the
  // client (see the no-query-ssr-dehydration project note).
  loader: async ({ context }) => ({
    clubs: await context.queryClient.ensureQueryData(clubsListQueryOptions()),
  }),
  component: ClubsBrowsePage,
})

function ClubsBrowsePage() {
  const navigate = useNavigate()
  const { clubs: initialClubs } = Route.useLoaderData()
  const { data: clubs } = useQuery({ ...clubsListQueryOptions(), initialData: initialClubs })

  return (
    <ClubsBrowse
      clubs={clubs}
      loading={false}
      onOpen={(id) => void navigate({ to: '/clubs/$clubId', params: { clubId: id } })}
      onCreate={() => void navigate({ to: '/clubs/new' })}
    />
  )
}
