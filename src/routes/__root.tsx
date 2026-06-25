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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { title: 'Workout Spots' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
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
