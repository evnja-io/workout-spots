import { render, screen } from '@testing-library/react'
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

// ── TanStack Router mock ──────────────────────────────────────────────────────
// Sidebar imports Route from ~/routes/spots/index which uses createFileRoute.
// We mock both @tanstack/react-router and the Route object used in Sidebar.
const mockNavigate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
}))

// Mock the Route import used inside Sidebar.tsx
vi.mock('~/routes/spots/index', () => ({
  Route: {
    useSearch: () => ({ q: 'bercy', disciplines: [], equipment: [], open24h: false, sort: 'rating' }),
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
  client.setQueryData(['spots'], twoSpots)
  client.setQueryData(['disciplines'], [])
  client.setQueryData(['equipments'], [])
  return client
}

describe('Sidebar', () => {
  it('shows count of 1 and the Bercy card when q=bercy filters', () => {
    const client = makeClient()
    render(
      <QueryClientProvider client={client}>
        <I18nextProvider i18n={i18n}>
          <Sidebar />
        </I18nextProvider>
      </QueryClientProvider>,
    )

    // The results count pill should show 1 (only Bercy matches "bercy")
    expect(screen.getByText('1')).toBeInTheDocument()

    // Bercy card name is present
    expect(screen.getByText('Bercy Bars')).toBeInTheDocument()

    // The other spot is NOT present
    expect(screen.queryByText('Fontaine du Trocadéro')).toBeNull()
  })
})
