import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import { SessionProvider } from '~/features/auth/session'
import { server } from '~/test/msw/server'
import {
  addSpotSchema,
  canAdvanceStep0,
  canAdvanceStep1,
  canAdvanceStep2,
  canAdvanceStep3,
  type AddSpotInput,
} from './schema'
import { AddressAutocomplete } from './AddressAutocomplete'
import { useCreateSpot } from './mutations'

// ── Supabase mock ─────────────────────────────────────────────────────────────

const mockLocationsInsert = vi.fn()
const mockDiscInsert = vi.fn()
const mockEqInsert = vi.fn()
const mockGetSession = vi.fn()
const mockOnAuthStateChange = vi.fn()
const mockUnsubscribe = vi.fn()

// Chainable mock for locations insert: .insert().select().single()
const mockSingle = vi.fn()
const mockSelect = vi.fn(() => ({ single: mockSingle }))
const mockInsertLocations = vi.fn(() => ({ select: mockSelect }))

const mockFrom = vi.fn((_table: string) => {
  if (_table === 'locations') {
    return { insert: mockInsertLocations }
  }
  if (_table === 'location_disciplines') {
    return { insert: mockDiscInsert }
  }
  if (_table === 'location_equipments') {
    return { insert: mockEqInsert }
  }
  return {
    insert: mockLocationsInsert,
    select: mockSelect,
  }
})

vi.mock('~/lib/supabase/browser', () => ({
  isSupabaseConfigured: () => true,
  getBrowserSupabase: () => ({
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
    from: mockFrom,
  }),
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

const i18n = createI18n('en')

function makeWrapper(userId: string | null) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  })

  if (userId) {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: userId } } },
    })
    mockOnAuthStateChange.mockImplementation(
      (cb: (event: string, session: { user: { id: string } }) => void) => {
        setTimeout(() => cb('SIGNED_IN', { user: { id: userId } }), 0)
        return { data: { subscription: { unsubscribe: mockUnsubscribe } } }
      },
    )
  } else {
    mockGetSession.mockResolvedValue({ data: { session: null } })
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    })
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={qc}>
        <I18nextProvider i18n={i18n}>
          <SessionProvider>{children}</SessionProvider>
        </I18nextProvider>
      </QueryClientProvider>
    )
  }

  return { Wrapper, qc }
}

// ── Complete valid input ───────────────────────────────────────────────────────

const validInput: AddSpotInput = {
  position: { lng: 2.38, lat: 48.87 },
  address: '47 Rue des Couronnes',
  city: 'Paris',
  region: 'Île-de-France',
  country: 'France',
  name: 'Parc de Belleville',
  description: 'Great outdoor calisthenics spot with pull-up bars.',
  isOpen24h: true,
  disciplines: ['disc-1'],
  equipment: [],
}

// ── addSpotSchema / canAdvance ─────────────────────────────────────────────────

describe('addSpotSchema', () => {
  it('accepts a complete valid object', () => {
    expect(addSpotSchema.safeParse(validInput).success).toBe(true)
  })

  it('rejects missing position', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { position: _p, ...rest } = validInput
    expect(addSpotSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects empty address', () => {
    expect(addSpotSchema.safeParse({ ...validInput, address: '' }).success).toBe(false)
  })

  it('rejects empty name', () => {
    expect(addSpotSchema.safeParse({ ...validInput, name: '' }).success).toBe(false)
  })

  it('rejects empty description', () => {
    expect(addSpotSchema.safeParse({ ...validInput, description: '' }).success).toBe(false)
  })

  it('rejects empty disciplines array', () => {
    expect(addSpotSchema.safeParse({ ...validInput, disciplines: [] }).success).toBe(false)
  })
})

describe('canAdvanceStep0', () => {
  it('returns true when position and address are set', () => {
    expect(
      canAdvanceStep0({ position: { lng: 2, lat: 48 }, address: '1 Rue de Paris' }),
    ).toBe(true)
  })

  it('returns false when position is missing', () => {
    expect(canAdvanceStep0({ address: '1 Rue de Paris' })).toBe(false)
  })

  it('returns false when address is empty', () => {
    expect(canAdvanceStep0({ position: { lng: 2, lat: 48 }, address: '' })).toBe(false)
  })
})

describe('canAdvanceStep1', () => {
  it('returns true when name and description are set', () => {
    expect(canAdvanceStep1({ name: 'My Spot', description: 'A great place' })).toBe(true)
  })

  it('returns false when name is empty', () => {
    expect(canAdvanceStep1({ name: '', description: 'A great place' })).toBe(false)
  })

  it('returns false when description is empty', () => {
    expect(canAdvanceStep1({ name: 'My Spot', description: '' })).toBe(false)
  })
})

describe('canAdvanceStep2', () => {
  it('returns true with at least one discipline', () => {
    expect(canAdvanceStep2({ disciplines: ['disc-1'] })).toBe(true)
  })

  it('returns false with empty disciplines', () => {
    expect(canAdvanceStep2({ disciplines: [] })).toBe(false)
  })
})

describe('canAdvanceStep3', () => {
  it('returns true for complete valid input', () => {
    expect(canAdvanceStep3(validInput)).toBe(true)
  })

  it('returns false for incomplete input', () => {
    expect(canAdvanceStep3({ ...validInput, disciplines: [] })).toBe(false)
  })
})

// ── AddressAutocomplete ───────────────────────────────────────────────────────

const GEOCODE_HANDLER = http.get(
  'https://api.mapbox.com/geocoding/v5/mapbox.places/:q.json',
  () =>
    HttpResponse.json({
      features: [
        {
          place_name: '47 Rue des Couronnes, Paris, France',
          text: '47 Rue des Couronnes',
          center: [2.38, 48.87],
          context: [
            { id: 'place.1', text: 'Paris' },
            { id: 'region.1', text: 'Île-de-France' },
            { id: 'country.1', text: 'France' },
          ],
        },
      ],
    }),
)

describe('AddressAutocomplete', () => {
  it('calls onSelect with GeocodeResult including city/region after clicking a suggestion', async () => {
    vi.stubEnv('VITE_MAPBOX_TOKEN', 'pk.test')
    server.use(GEOCODE_HANDLER)

    const onSelect = vi.fn()
    const { Wrapper } = makeWrapper(null)
    const user = userEvent.setup({ delay: null })

    render(
      <Wrapper>
        <AddressAutocomplete value="" onSelect={onSelect} />
      </Wrapper>,
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'couronnes')

    // Wait for debounce + MSW response
    await waitFor(() => screen.getByRole('listbox'), { timeout: 2000 })

    const suggestion = screen.getByRole('option')
    await user.click(suggestion)

    expect(onSelect).toHaveBeenCalledTimes(1)
    const result: unknown = onSelect.mock.lastCall?.[0]
    expect(result).toMatchObject({
      city: 'Paris',
      region: 'Île-de-France',
      country: 'France',
      lng: 2.38,
      lat: 48.87,
    })

    vi.unstubAllEnvs()
  })

  it('shows no suggestions and does not crash when no token', async () => {
    // No VITE_MAPBOX_TOKEN → forwardGeocode throws → component catches and shows nothing
    // Ensure no stub is set
    vi.unstubAllEnvs()

    const onSelect = vi.fn()
    const { Wrapper } = makeWrapper(null)
    const user = userEvent.setup({ delay: null })

    render(
      <Wrapper>
        <AddressAutocomplete value="" onSelect={onSelect} />
      </Wrapper>,
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'couronnes')

    // Wait for debounce (300ms) + try/catch
    await act(async () => {
      await new Promise((r) => setTimeout(r, 400))
    })

    expect(screen.queryByRole('listbox')).toBeNull()
    expect(onSelect).not.toHaveBeenCalled()
  })
})

// ── Reverse geocode on pin drop (LocationStep handler logic) ──────────────────

describe('reverseGeocode integration', () => {
  it('fills address from reverse geocode on map click', async () => {
    vi.stubEnv('VITE_MAPBOX_TOKEN', 'pk.test')
    server.use(
      http.get('https://api.mapbox.com/geocoding/v5/mapbox.places/:coords.json', () =>
        HttpResponse.json({
          features: [
            {
              place_name: '47 Rue des Couronnes, Paris',
              text: '47 Rue des Couronnes',
              center: [2.38, 48.87],
              context: [
                { id: 'place.1', text: 'Paris' },
                { id: 'region.1', text: 'Île-de-France' },
                { id: 'country.1', text: 'France' },
              ],
            },
          ],
        }),
      ),
    )

    // Test the reverseGeocode function directly (logic extracted from LocationStep handler)
    const { reverseGeocode } = await import('~/lib/mapbox/geocoding')
    const result = await reverseGeocode(2.38, 48.87)

    expect(result).not.toBeNull()
    expect(result?.address).toBe('47 Rue des Couronnes')
    expect(result?.city).toBe('Paris')
    expect(result?.region).toBe('Île-de-France')
    expect(result?.country).toBe('France')
  })
})

// ── useCreateSpot ─────────────────────────────────────────────────────────────

// Test component
import { useSession } from '~/features/auth/session'

function CreateButton() {
  const { create, pending } = useCreateSpot()
  const { status } = useSession()
  return (
    <button
      data-testid="create-btn"
      data-session-status={status}
      disabled={pending}
      onClick={() => create(addSpotSchema.parse(validInput), [])}
    >
      Create
    </button>
  )
}

describe('useCreateSpot', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDiscInsert.mockResolvedValue({ data: null, error: null })
    mockEqInsert.mockResolvedValue({ data: null, error: null })
  })

  it('authed: inserts locations then discipline join rows', async () => {
    const userId = 'user-123'
    const { Wrapper } = makeWrapper(userId)

    mockSingle.mockResolvedValue({ data: { id: 'new-spot-id' }, error: null })
    mockDiscInsert.mockResolvedValue({ data: null, error: null })

    render(
      <Wrapper>
        <CreateButton />
      </Wrapper>,
    )

    // Wait for session to be authed
    await waitFor(() =>
      expect(screen.getByTestId('create-btn').getAttribute('data-session-status')).toBe('authed'),
    )

    const user = userEvent.setup()
    await user.click(screen.getByTestId('create-btn'))

    await waitFor(() => expect(mockInsertLocations).toHaveBeenCalledTimes(1))

    expect(mockInsertLocations).toHaveBeenCalledWith(
      expect.objectContaining({
        name: validInput.name,
        description: validInput.description,
        latitude: validInput.position.lat,
        longitude: validInput.position.lng,
        address: validInput.address,
        created_by: userId,
      }),
    )

    await waitFor(() => expect(mockDiscInsert).toHaveBeenCalledTimes(1))
    expect(mockDiscInsert).toHaveBeenCalledWith([{ location_id: 'new-spot-id', discipline_id: 'disc-1' }])
  })

  it('anon: opens sign-in modal, does not call insert', async () => {
    const { Wrapper } = makeWrapper(null)

    render(
      <Wrapper>
        <CreateButton />
      </Wrapper>,
    )

    await waitFor(() => expect(mockGetSession).toHaveBeenCalled())

    const user = userEvent.setup()
    await user.click(screen.getByTestId('create-btn'))

    // Sign-in modal should appear
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument(),
    )

    expect(mockInsertLocations).not.toHaveBeenCalled()
  })
})
