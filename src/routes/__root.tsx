import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { createIsomorphicFn } from '@tanstack/react-start'
import { createI18n, type Locale } from '~/lib/i18n/config'
import { getServerLocale } from '~/lib/i18n/locale.server'
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

function RootComponent() {
  const locale = getLocale()
  const i18n = createI18n(locale)
  return (
    <html lang={locale}>
      <head>
        <HeadContent />
      </head>
      <body>
        <I18nextProvider i18n={i18n}>
          <Outlet />
        </I18nextProvider>
        <Scripts />
      </body>
    </html>
  )
}
