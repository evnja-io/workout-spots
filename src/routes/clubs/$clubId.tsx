import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { trackEvent } from '~/features/analytics/gtag'
import { clubDetailQueryOptions } from '~/features/clubs/queries'
import type { ClubDetail as ClubDetailType } from '~/features/clubs/domain'
import { ClubDetail } from '~/features/clubs/components/ClubDetail'
import { ErrorState } from '~/components/ErrorState'
import { SITE_URL } from '~/routes/__root'

export const Route = createFileRoute('/clubs/$clubId')({
  loader: async ({ context, params }) => {
    let club
    try {
      club = await context.queryClient.ensureQueryData(clubDetailQueryOptions(params.clubId))
    } catch {
      throw notFound()
    }
    if (!club) throw notFound()
    return { club }
  },
  head: ({ params, match }) => {
    const club = match.context.queryClient.getQueryData<ClubDetailType | null>(
      clubDetailQueryOptions(params.clubId).queryKey,
    )
    const title = club?.name ? `${club.name} · Clubs · Workout Spots` : 'Club · Workout Spots'
    const description =
      club?.description ||
      `${club?.name ?? 'A club'} — a Workout Spots community. See members, linked spots and posts.`
    const url = `${SITE_URL}/clubs/${params.clubId}`
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url },
      ],
      links: [{ rel: 'canonical', href: url }],
    }
  },
  pendingComponent: ClubDetailPending,
  notFoundComponent: ClubNotFound,
  errorComponent: ClubError,
  component: ClubDetailPage,
})

function ClubDetailPage() {
  const { clubId } = Route.useParams()
  const navigate = useNavigate()
  const { club: initialClub } = Route.useLoaderData()
  const { data: club } = useSuspenseQuery({
    ...clubDetailQueryOptions(clubId),
    initialData: initialClub,
  })

  useEffect(() => {
    trackEvent('view_club', { club_id: clubId })
  }, [clubId])

  if (!club) return null

  return (
    <ClubDetail
      club={club}
      onBack={() => void navigate({ to: '/clubs' })}
      onOpenSpot={(spotId) => void navigate({ to: '/spots/$spotId', params: { spotId } })}
      onManage={() => void navigate({ to: '/clubs/$clubId/manage', params: { clubId } })}
    />
  )
}

function ClubDetailPending() {
  return (
    <div>
      <div className="h-52 w-full animate-pulse bg-surface-2 md:h-64" />
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 md:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-3">
          <div className="h-5 w-2/3 animate-pulse rounded bg-surface-2" />
          <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-surface-2" />
        </div>
        <div className="hidden h-48 animate-pulse rounded-xl bg-surface-2 md:block" />
      </div>
    </div>
  )
}

function ClubNotFound() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 text-center text-[14px] text-text-3">
      {t('clubs.notFound')}
    </div>
  )
}

function ClubError({ reset }: { reset: () => void }) {
  const { t } = useTranslation()
  return (
    <ErrorState title={t('common.errorTitle')} message={t('common.errorMessage')} onRetry={reset} />
  )
}
