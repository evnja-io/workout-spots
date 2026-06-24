import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000 } },
  })
  return createTanStackRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
    scrollRestoration: true,
  })
}

// TanStack Start server-core requires a named `getRouter` export from the router entry module
export function getRouter() {
  return createRouter()
}

declare module '@tanstack/react-router' {
  interface Register { router: ReturnType<typeof createRouter> }
}
