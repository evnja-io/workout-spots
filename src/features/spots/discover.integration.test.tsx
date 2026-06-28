/**
 * discover.integration.test.tsx
 *
 * Integration test for the Discover flow: Sidebar filtering, search, discipline
 * chip toggle, and card click navigation.
 *
 * SCOPE NOTE: We use a QueryClient pre-seeded approach with mocked router hooks
 * rather than a full RouterProvider, because TanStack Start's __root.tsx renders
 * <html>/<head>/<body> tags which are incompatible with jsdom's document model
 * (jsdom already wraps everything in those elements).
 *
 * Coverage vs full RouterProvider:
 * - COVERED: Sidebar renders seeded spots, count pill, search input debounce,
 *   discipline chip toggle, card click → onSpotClick callback
 * - REDUCED: Actual router.state.location.search assertion replaced by verifying
 *   navigate() is called with a search updater function that produces the correct
 *   output (functionally equivalent to a URL param update check)
 * - REDUCED: Navigation to /spots/$spotId detail panel verified via the
 *   onSpotClick callback rather than a full route transition
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import { server } from '~/test/msw/server'
import { Sidebar } from '~/features/spots/Sidebar'
import type { SpotListItem, Discipline } from '~/features/spots/domain'
import type { GeocodeResult } from '~/lib/mapbox/geocoding'

// ── Mocks ─────────────────────────────────────────────────────────────────────

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

const mockNavigate = vi.fn()
let mockSearchState = {
  disciplines: [] as string[],
  equipment: [] as string[],
  open24h: false,
  sort: 'rating' as const,
}

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
}))

vi.mock('~/routes/spots/route', () => ({
  Route: {
    // useSearch is called as a function — return the current mockSearchState
    useSearch: () => mockSearchState,
  },
}))

// ── Fixtures ──────────────────────────────────────────────────────────────────

const spotCalisthenics: SpotListItem = {
  id: 'spot-calis',
  name: 'Parc Calisthenics',
  city: 'Paris',
  address: '1 Rue de la Paix',
  latitude: 48.86,
  longitude: 2.33,
  isOpen24h: true,
  averageRating: 4.5,
  ratingCount: 30,
  disciplineIds: ['disc-calis'],
  equipmentIds: ['eq-bars'],
  thumbnailUrl: null,
}

const spotYoga: SpotListItem = {
  id: 'spot-yoga',
  name: 'Yoga Garden',
  city: 'Lyon',
  address: '5 Allée des Jardins',
  latitude: 45.75,
  longitude: 4.83,
  isOpen24h: false,
  averageRating: 3.8,
  ratingCount: 12,
  disciplineIds: ['disc-yoga'],
  equipmentIds: [],
  thumbnailUrl: null,
}

const discCalis: Discipline = {
  id: 'disc-calis',
  name: 'Calisthenics',
  localeKey: 'disciplines.calisthenics',
  category: 'sport',
}

const discYoga: Discipline = {
  id: 'disc-yoga',
  name: 'Yoga',
  localeKey: 'disciplines.yoga',
  category: 'sport',
}

const i18n = createI18n('en')

const allSpots = [spotCalisthenics, spotYoga]

function makeClient() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  // Sidebar receives spots as a prop now; only taxonomy data needed in cache
  client.setQueryData(['disciplines'], [discCalis, discYoga])
  client.setQueryData(['equipments'], [])
  return client
}

function renderSidebar(opts?: {
  onSpotClick?: (id: string) => void
  onLocationSelect?: (r: GeocodeResult) => void
}) {
  return render(
    <QueryClientProvider client={makeClient()}>
      <I18nextProvider i18n={i18n}>
        {/* spots prop: route.tsx owns the bbox query and passes results down */}
        <Sidebar
          spots={allSpots}
          onSpotClick={opts?.onSpotClick}
          onLocationSelect={opts?.onLocationSelect}
        />
      </I18nextProvider>
    </QueryClientProvider>,
  )
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Discover integration', () => {
  beforeEach(() => {
    mockSearchState = { disciplines: [], equipment: [], open24h: false, sort: 'rating' }
    mockNavigate.mockReset()
  })

  it('renders both seeded spots and shows correct count pill', async () => {
    renderSidebar()
    expect(await screen.findByText('Parc Calisthenics')).toBeInTheDocument()
    expect(screen.getByText('Yoga Garden')).toBeInTheDocument()
    // Count pill shows 2 (both spots visible with empty filter state)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('geosuggest: typing shows address suggestions and selecting calls onLocationSelect', async () => {
    // Intercept the Mapbox forward-geocoding call with a fixture result.
    server.use(
      http.get('https://api.mapbox.com/geocoding/v5/mapbox.places/*', () =>
        HttpResponse.json({
          features: [
            {
              place_name: 'Lyon, France',
              text: 'Lyon',
              center: [4.83, 45.75],
              bbox: [4.77, 45.7, 4.9, 45.81],
              context: [{ id: 'country.1', text: 'France' }],
            },
          ],
        }),
      ),
    )

    const onLocationSelect = vi.fn()
    renderSidebar({ onLocationSelect })

    const input = screen.getByPlaceholderText(/search/i)
    await userEvent.type(input, 'Lyon')

    // Suggestion appears after the 300ms debounce + geocode resolves
    const option = await screen.findByRole('option', { name: 'Lyon, France' })
    await userEvent.click(option)

    expect(onLocationSelect).toHaveBeenCalledTimes(1)
    expect(onLocationSelect.mock.calls[0]![0]).toMatchObject({
      placeName: 'Lyon, France',
      lng: 4.83,
      lat: 45.75,
      bbox: [4.77, 45.7, 4.9, 45.81],
    })
  })

  it('toggling a discipline chip calls navigate with the discipline id added', async () => {
    renderSidebar()

    // Discipline chips are rendered by Filters as <button> with exact label text.
    // Use getAllByRole to handle the spot card (role="button") also matching
    // /calisthenics/i — we need the one whose text content is exactly "Calisthenics".
    const allButtons = await screen.findAllByRole('button')
    const calisChip = allButtons.find((el) => el.textContent?.trim() === 'Calisthenics')
    expect(calisChip).toBeDefined()
    await userEvent.click(calisChip!)

    expect(mockNavigate).toHaveBeenCalledOnce()

    const firstArgs = mockNavigate.mock.calls[0]
    expect(firstArgs).toBeDefined()
    const call = firstArgs![0] as {
      search: (prev: typeof mockSearchState) => typeof mockSearchState
    }
    const resultSearch = call.search({
      disciplines: [],
      equipment: [],
      open24h: false,
      sort: 'rating',
    })
    expect(resultSearch.disciplines).toContain('disc-calis')
  })

  it('clicking a spot card calls onSpotClick with the spot id', async () => {
    const onSpotClick = vi.fn()
    renderSidebar({ onSpotClick })

    // SpotCard renders as role="button" with the spot name as heading inside
    const cards = await screen.findAllByRole('button')
    // Find the card for Parc Calisthenics (discipline chip buttons also present)
    const calisCard = cards.find((el) => el.textContent?.includes('Parc Calisthenics'))
    expect(calisCard).toBeDefined()
    await userEvent.click(calisCard!)

    expect(onSpotClick).toHaveBeenCalledWith('spot-calis')
  })
})
