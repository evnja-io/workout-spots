import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import '~/styles/global.css'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({ meta: [{ title: 'Workout Spots' }] }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
