import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { useEffect } from 'react'
import { createIsomorphicFn } from '@tanstack/react-start'
import { createI18n, type Locale } from '~/lib/i18n/config'
import { getServerLocale } from '~/lib/i18n/locale.server'
import { SessionProvider } from '~/features/auth/session'
import { applyTheme, applyAccent, type Theme, type AccentKey } from '~/features/theme/theme'
import '~/styles/global.css'

// createIsomorphicFn strips the .server() branch (and imports used only by it,
// i.e. getServerLocale → @tanstack/react-start/server) from the client bundle.
const getLocale = createIsomorphicFn()
  .client((): Locale => {
    const match = document.cookie.split('; ').find((c) => c.startsWith('lang='))
    const value = match?.split('=')[1]
    return value === 'fr' ? 'fr' : 'en'
  })
  .server((): Locale => getServerLocale())

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({ meta: [{ title: 'Workout Spots' }] }),
  component: RootComponent,
})

/** Read a cookie value by name; returns undefined when not found. */
function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  return document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${name}=`))
    ?.split('=')[1]
}

function ThemeApplier() {
  useEffect(() => {
    const theme = (readCookie('theme') ?? 'light') as Theme
    const accent = (readCookie('accent') ?? 'violet') as AccentKey
    applyTheme(theme)
    applyAccent(accent, theme)
  }, [])
  return null
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext()
  const locale = getLocale()
  const i18n = createI18n(locale)
  return (
    <html lang={locale}>
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <SessionProvider>
              <ThemeApplier />
              <Outlet />
            </SessionProvider>
          </I18nextProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
