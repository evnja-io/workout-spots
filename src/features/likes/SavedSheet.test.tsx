import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import type { SpotListItem } from '~/features/spots/domain'
import { SavedSheet } from './SavedSheet'

// Render the desktop Modal path (stable in jsdom) by forcing isMobile = false.
vi.mock('~/lib/hooks/useMediaQuery', () => ({
  useIsMobile: () => false,
  useMediaQuery: () => false,
}))

// Drive the authed user directly instead of standing up the full provider.
vi.mock('~/features/auth/session', () => ({
  useSession: () => ({ userId: 'user-1', status: 'authed' }),
}))

const i18n = createI18n('en')

function makeSpot(id: string, name: string): SpotListItem {
  return {
    id,
    name,
    city: 'Paris',
    address: '1 rue de Test',
    latitude: 48.85,
    longitude: 2.35,
    isOpen24h: false,
    averageRating: 4.2,
    ratingCount: 3,
    disciplineIds: [],
    equipmentIds: [],
    thumbnailUrl: null,
  }
}

function renderSheet({
  spots,
  onClose = vi.fn(),
  onSelectSpot = vi.fn(),
}: {
  spots: SpotListItem[]
  onClose?: () => void
  onSelectSpot?: (id: string) => void
}) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  qc.setQueryData(['saved', 'user-1'], spots)
  render(
    <QueryClientProvider client={qc}>
      <I18nextProvider i18n={i18n}>
        <SavedSheet open onClose={onClose} onSelectSpot={onSelectSpot} />
      </I18nextProvider>
    </QueryClientProvider>,
  )
  return { onClose, onSelectSpot }
}

describe('SavedSheet', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the saved spots list', () => {
    renderSheet({ spots: [makeSpot('sp-1', 'Parc Workout'), makeSpot('sp-2', 'Calisthenics Park')] })
    expect(screen.getByRole('heading', { name: /saved spots/i })).toBeInTheDocument()
    expect(screen.getByText('Parc Workout')).toBeInTheDocument()
    expect(screen.getByText('Calisthenics Park')).toBeInTheDocument()
  })

  it('shows the empty state when there are no saved spots', () => {
    renderSheet({ spots: [] })
    expect(screen.getByText(/haven't saved any spots yet/i)).toBeInTheDocument()
  })

  it('closes and navigates when a spot is clicked', async () => {
    const user = userEvent.setup()
    const { onClose, onSelectSpot } = renderSheet({ spots: [makeSpot('sp-1', 'Parc Workout')] })
    await user.click(screen.getByText('Parc Workout'))
    expect(onClose).toHaveBeenCalledOnce()
    expect(onSelectSpot).toHaveBeenCalledWith('sp-1')
  })

  it('closes when the close button is clicked', async () => {
    const user = userEvent.setup()
    const { onClose } = renderSheet({ spots: [] })
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
