import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import { Sidebar } from './Sidebar'
import type { SpotListItem } from './domain'

// ── Supabase mock (isSupabaseConfigured + getBrowserSupabase) ─────────────────
vi.mock('~/lib/supabase/browser', () => ({
  isSupabaseConfigured: () => false,
  getBrowserSupabase: vi.fn(),
}))

// Sidebar reads the session + auth gate for the All/Saved toggle.
vi.mock('~/features/auth/session', () => ({
  useSession: () => ({ userId: null, status: 'anon' }),
}))
vi.mock('~/features/auth/useAuthGate', () => ({
  useAuthGate: () => (action: () => void) => action(),
}))

// ── TanStack Router mock ──────────────────────────────────────────────────────
// Sidebar imports Route from ~/routes/spots/index which uses createFileRoute.
// We mock both @tanstack/react-router and the Route object used in Sidebar.
const mockNavigate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
}))

// Mock the Route import used inside Sidebar.tsx
vi.mock('~/routes/spots/route', () => ({
  Route: {
    useSearch: () => ({
      disciplines: [],
      equipment: [],
      open24h: false,
      sort: 'rating',
    }),
  },
}))

// ── Fixtures ──────────────────────────────────────────────────────────────────
const bercySpot: SpotListItem = {
  id: 'spot-1',
  name: 'Bercy Bars',
  city: 'Paris',
  address: '2 Rue de Bercy',
  latitude: 48.84,
  longitude: 2.38,
  isOpen24h: true,
  averageRating: 4.8,
  ratingCount: 42,
  disciplineIds: [],
  equipmentIds: [],
  thumbnailUrl: null,
}

const otherSpot: SpotListItem = {
  id: 'spot-2',
  name: 'Fontaine du Trocadéro',
  city: 'Paris',
  address: '1 Trocadéro',
  latitude: 48.86,
  longitude: 2.29,
  isOpen24h: false,
  averageRating: 3.5,
  ratingCount: 10,
  disciplineIds: [],
  equipmentIds: [],
  thumbnailUrl: null,
}

const twoSpots = [bercySpot, otherSpot]

const i18n = createI18n('en')

function makeClient() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  // Sidebar no longer self-fetches spots; taxonomy data still needed
  client.setQueryData(['disciplines'], [])
  client.setQueryData(['equipments'], [])
  return client
}

describe('Sidebar', () => {
  it('renders all in-viewport spots (no text filtering — search is an address picker)', () => {
    const client = makeClient()
    render(
      <QueryClientProvider client={client}>
        <I18nextProvider i18n={i18n}>
          {/* spots passed as prop — Sidebar no longer self-fetches */}
          <Sidebar spots={twoSpots} />
        </I18nextProvider>
      </QueryClientProvider>,
    )

    // Count pill shows both spots — the search box no longer filters the list
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Bercy Bars')).toBeInTheDocument()
    expect(screen.getByText('Fontaine du Trocadéro')).toBeInTheDocument()
  })

  it('switching to the Saved toggle swaps the list source', async () => {
    const user = userEvent.setup()
    const client = makeClient()
    render(
      <QueryClientProvider client={client}>
        <I18nextProvider i18n={i18n}>
          <Sidebar spots={twoSpots} />
        </I18nextProvider>
      </QueryClientProvider>,
    )

    expect(screen.getByText('Bercy Bars')).toBeInTheDocument()

    // Switch to Saved (mocked gate runs immediately; anon → no saved spots)
    await user.click(screen.getByRole('button', { name: /saved/i }))

    expect(screen.queryByText('Bercy Bars')).toBeNull()
    expect(screen.getByText(/haven't saved any spots/i)).toBeInTheDocument()
  })
})
