import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import { SessionProvider } from '~/features/auth/session'
import { useUpdateSpot, type UpdateArgs } from './mutations'
import { SpotPhotoManager } from './SpotPhotoManager'
import { addSpotSchema } from './schema'
import type { SpotImage } from '~/features/spots/domain'

// ── Supabase mock ─────────────────────────────────────────────────────────────

const mockDiscInsert = vi.fn()
const mockDiscDelete = vi.fn()
const mockEqInsert = vi.fn()
const mockEqDelete = vi.fn()
const mockImgDelete = vi.fn()
const mockStorageRemove = vi.fn()
const mockGetSession = vi.fn()
const mockOnAuthStateChange = vi.fn()
const mockUnsubscribe = vi.fn()

// Chainable mock for locations.update().eq()
const mockUpdateEq = vi.fn(() => ({ error: null }))
const mockUpdate = vi.fn(() => ({ eq: mockUpdateEq }))

// Chainable mock for delete().eq().in()
const mockDeleteIn = vi.fn(() => ({ error: null }))
const mockDeleteEq = vi.fn(() => ({ in: mockDeleteIn, error: null }))
const mockDelete = vi.fn(() => ({ eq: mockDeleteEq, in: mockDeleteIn }))

const mockFrom = vi.fn((_table: string) => {
  if (_table === 'locations') {
    return { update: mockUpdate }
  }
  if (_table === 'location_disciplines') {
    return { insert: mockDiscInsert, delete: mockDelete }
  }
  if (_table === 'location_equipments') {
    return { insert: mockEqInsert, delete: mockDelete }
  }
  if (_table === 'location_images') {
    return { delete: mockImgDelete }
  }
  return {}
})

vi.mock('~/lib/supabase/browser', () => ({
  isSupabaseConfigured: () => true,
  getBrowserSupabase: () => ({
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
    from: mockFrom,
    storage: {
      from: () => ({
        remove: mockStorageRemove,
      }),
    },
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

const validInput = {
  position: { lng: 2.38, lat: 48.87 },
  address: '47 Rue des Couronnes',
  city: 'Paris',
  region: 'Île-de-France',
  country: 'France',
  name: 'Parc de Belleville',
  description: 'Great outdoor calisthenics spot.',
  isOpen24h: true,
  disciplines: ['disc-1'],
  equipment: ['eq-1'],
}

// ── useUpdateSpot ─────────────────────────────────────────────────────────────

function UpdateButton({ spotId, args }: { spotId: string; args: UpdateArgs }) {
  const { save, pending } = useUpdateSpot(spotId)
  return (
    <button
      data-testid="update-btn"
      disabled={pending}
      onClick={() => save(args)}
    >
      Save
    </button>
  )
}

describe('useUpdateSpot', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDiscInsert.mockResolvedValue({ error: null })
    mockEqInsert.mockResolvedValue({ error: null })
    mockDiscDelete.mockResolvedValue({ error: null })
    mockEqDelete.mockResolvedValue({ error: null })
    mockImgDelete.mockReturnValue({ in: vi.fn(() => ({ error: null })) })
    mockStorageRemove.mockResolvedValue({ error: null })
    mockUpdateEq.mockResolvedValue({ error: null })
    mockDeleteIn.mockResolvedValue({ error: null })
    mockDeleteEq.mockReturnValue({ in: mockDeleteIn, error: null })
  })

  it('authed: calls update on locations with correct fields', async () => {
    const userId = 'user-123'
    const spotId = 'spot-456'
    const { Wrapper } = makeWrapper(userId)

    const args: UpdateArgs = {
      values: addSpotSchema.parse(validInput),
      currentDisciplineIds: ['disc-1'],
      currentEquipmentIds: [],
      newFiles: [],
      removedImages: [],
      maxExistingOrder: 0,
    }

    render(
      <Wrapper>
        <UpdateButton spotId={spotId} args={args} />
      </Wrapper>,
    )

    await waitFor(() =>
      expect(screen.getByTestId('update-btn')).toBeInTheDocument(),
    )

    const user = userEvent.setup()
    await user.click(screen.getByTestId('update-btn'))

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: validInput.name,
        description: validInput.description,
        is_open_24h: validInput.isOpen24h,
      }),
    )
  })

  it('anon: opens sign-in modal, does not call update', async () => {
    const { Wrapper } = makeWrapper(null)
    const spotId = 'spot-456'

    const args: UpdateArgs = {
      values: addSpotSchema.parse(validInput),
      currentDisciplineIds: [],
      currentEquipmentIds: [],
      newFiles: [],
      removedImages: [],
      maxExistingOrder: 0,
    }

    render(
      <Wrapper>
        <UpdateButton spotId={spotId} args={args} />
      </Wrapper>,
    )

    await waitFor(() => expect(mockGetSession).toHaveBeenCalled())

    const user = userEvent.setup()
    await user.click(screen.getByTestId('update-btn'))

    // Sign-in modal should appear
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument(),
    )

    expect(mockUpdate).not.toHaveBeenCalled()
  })
})

// ── SpotPhotoManager ──────────────────────────────────────────────────────────

describe('SpotPhotoManager', () => {
  const existingImages: SpotImage[] = [
    { id: 'img-1', url: 'https://example.com/1.jpg', order: 1, path: 'spot-1/1-photo.jpg' },
    { id: 'img-2', url: 'https://example.com/2.jpg', order: 2, path: 'spot-1/2-photo.jpg' },
  ]

  it('renders existing images', () => {
    const onChange = vi.fn()
    const { Wrapper } = makeWrapper(null)

    render(
      <Wrapper>
        <SpotPhotoManager
          existing={existingImages}
          removedIds={[]}
          files={[]}
          onChange={onChange}
        />
      </Wrapper>,
    )

    expect(screen.getByLabelText('Photo 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Photo 2')).toBeInTheDocument()
  })

  it('calls onChange with removedIds when remove button clicked', async () => {
    const onChange = vi.fn()
    const { Wrapper } = makeWrapper(null)
    const user = userEvent.setup()

    render(
      <Wrapper>
        <SpotPhotoManager
          existing={existingImages}
          removedIds={[]}
          files={[]}
          onChange={onChange}
        />
      </Wrapper>,
    )

    const removeButtons = screen.getAllByLabelText('Remove photo')
    await user.click(removeButtons[0]!)

    expect(onChange).toHaveBeenCalledWith({
      removedIds: ['img-1'],
      files: [],
    })
  })

  it('does not render removed images', () => {
    const onChange = vi.fn()
    const { Wrapper } = makeWrapper(null)

    render(
      <Wrapper>
        <SpotPhotoManager
          existing={existingImages}
          removedIds={['img-1']}
          files={[]}
          onChange={onChange}
        />
      </Wrapper>,
    )

    expect(screen.queryByLabelText('Photo 1')).toBeNull()
    expect(screen.getByLabelText('Photo 2')).toBeInTheDocument()
  })
})
