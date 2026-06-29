import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import { SessionProvider } from '~/features/auth/session'
import { Analytics } from '~/features/analytics/Analytics'
import { ACCENTS } from '~/features/theme/theme'
import { getPrefs } from '~/features/settings/prefs'
import '~/styles/global.css'

// createIsomorphicFn strips the .server() branch from the client bundle.
// getPrefs() follows the same pattern as the old getLocale(): safe on both
// sides because prefs.server.ts is imported only via the .server() branch.

function accentInlineVars(
  accent: keyof typeof ACCENTS,
  theme: 'light' | 'dark',
): React.CSSProperties {
  const a = ACCENTS[accent][theme]
  return {
    '--accent': a.accent,
    '--accent-2': a.accent2,
    '--accent-soft': a.soft,
    '--accent-softer': a.softer,
    '--accent-fg': a.fg,
  } as React.CSSProperties
}

function RootError({ error }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <head>
        <title>Error – Workout Spots</title>
      </head>
      <body>
        <div style={{ padding: 24 }}>
          <h1>Something went wrong</h1>
          <p>{error.message}</p>
        </div>
      </body>
    </html>
  )
}

// Absolute origin for canonical / Open Graph URLs (see design: spots.evnja.gg).
export const SITE_URL = 'https://spots.evnja.gg'
const SITE_DESCRIPTION =
  'Discover outdoor calisthenics & workout spots near you on an interactive map. Find pull-up bars, parks, and street-workout spots, rate them, and add your own.'
const OG_IMAGE = `${SITE_URL}/og-image.png`

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { title: 'Workout Spots' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { name: 'description', content: SITE_DESCRIPTION },
      { name: 'theme-color', content: '#E11D48' },
      { name: 'apple-mobile-web-app-title', content: 'Spots' },
      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Workout Spots' },
      { property: 'og:title', content: 'Workout Spots — Find outdoor training spots near you' },
      { property: 'og:description', content: SITE_DESCRIPTION },
      { property: 'og:url', content: `${SITE_URL}/spots` },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Workout Spots — Find outdoor training spots near you' },
      { name: 'twitter:description', content: SITE_DESCRIPTION },
      { name: 'twitter:image', content: OG_IMAGE },
    ],
    links: [
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'icon', href: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { rel: 'apple-touch-icon', href: '/favicon-180.png', sizes: '180x180' },
      { rel: 'manifest', href: '/site.webmanifest' },
      // Display fonts for the Clubs/Events poster system (Anton titles, Archivo body).
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600;700;800&display=swap',
      },
    ],
  }),
  errorComponent: RootError,
  component: RootComponent,
})

function RootComponent() {
  const { queryClient } = Route.useRouteContext()
  const prefs = getPrefs()
  const i18n = createI18n(prefs.lang)

  return (
    <html
      lang={prefs.lang}
      data-theme={prefs.theme}
      style={accentInlineVars(prefs.accent, prefs.theme)}
    >
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <SessionProvider>
              <Outlet />
              <Analytics />
            </SessionProvider>
          </I18nextProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
