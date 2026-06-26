import { createFileRoute } from '@tanstack/react-router'
import { spotsInBoundsQueryOptions, spotsCountQueryOptions, WORLD_BOUNDS } from '~/features/spots/queries'
import { equipmentsQueryOptions, disciplinesQueryOptions } from '~/features/taxonomy/queries'
import { LandingPage } from '~/features/landing/LandingPage'
import { pageMeta, fontLinks, localizedDict } from '~/features/landing/seo'
import { getPrefs } from '~/features/settings/prefs'
import '~/features/landing/landing.css'

export const Route = createFileRoute('/')({
  // Fetch the real top-rated spots for the "Popular spots" section and RETURN
  // them from the loader: TanStack Start serializes loader data into the SSR
  // payload and rehydrates it on the client, so server and client render the
  // same content (no hydration mismatch). The app has no query-cache SSR
  // dehydration, so reading via useQuery would start empty on the client.
  // Mocks-first: ensureQueryData returns [] when Supabase is unconfigured, so
  // SSR still 200s and the static showcase shows.
  loader: async ({ context }) => {
    const [spots, equipments, disciplines, spotsCount] = await Promise.all([
      context.queryClient.ensureQueryData(spotsInBoundsQueryOptions(WORLD_BOUNDS)),
      context.queryClient.ensureQueryData(equipmentsQueryOptions()),
      context.queryClient.ensureQueryData(disciplinesQueryOptions()),
      context.queryClient.ensureQueryData(spotsCountQueryOptions()),
    ])
    return { spots, equipments, disciplines, spotsCount }
  },
  head: () => {
    const { lang } = getPrefs()
    const dict = localizedDict(lang)
    const m = pageMeta({
      title: dict.landing.meta.title,
      description: dict.landing.meta.description,
      path: '/',
      locale: lang,
    })
    return {
      meta: [{ name: 'theme-color', content: '#1A0A20' }, ...m.meta],
      links: [...fontLinks, ...m.links],
    }
  },
  component: LandingRoute,
})

function LandingRoute() {
  const { spots, equipments, disciplines, spotsCount } = Route.useLoaderData()
  return (
    <LandingPage
      spots={spots}
      equipments={equipments}
      disciplines={disciplines}
      spotsCount={spotsCount}
    />
  )
}
