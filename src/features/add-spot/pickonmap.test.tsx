import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import { SessionProvider } from '~/features/auth/session'
import { AddSpotWizard } from './AddSpotWizard'
import type { AddSpotInput } from './schema'

// ── Supabase mock (auth only — these tests never submit) ─────────────────────

const mockGetSession = vi.fn().mockResolvedValue({ data: { session: null } })
const mockOnAuthStateChange = vi.fn().mockReturnValue({
  data: { subscription: { unsubscribe: vi.fn() } },
})

vi.mock('~/lib/supabase/browser', () => ({
  isSupabaseConfigured: () => true,
  getBrowserSupabase: () => ({
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
    from: vi.fn(),
  }),
}))

// getPrefs is isomorphic and takes the server branch under vitest — stub it out.
vi.mock('~/features/settings/prefs', () => ({
  getPrefs: () => ({ theme: 'dark', accent: 'default', mapStyle: 'minimal', lang: 'en' }),
}))

// Empty token → the LocationStep mini-map renders its token notice instead of
// initializing mapbox-gl, keeping these wizard-level tests mapbox-free.
vi.stubEnv('VITE_MAPBOX_TOKEN', '')

const i18n = createI18n('en')

function Wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  })
  return (
    <QueryClientProvider client={qc}>
      <I18nextProvider i18n={i18n}>
        <SessionProvider>{children}</SessionProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

const editValues: AddSpotInput = {
  position: { lng: 2.38, lat: 48.87 },
  address: '47 Rue des Couronnes',
  city: 'Paris',
  region: 'Île-de-France',
  country: 'France',
  name: 'Parc de Belleville',
  description: 'Great outdoor calisthenics spot.',
  isOpen24h: true,
  disciplines: ['disc-1'],
  equipment: [],
}

const pick = {
  position: { lng: 3.1, lat: 49.2 },
  address: 'Rue de la Paix',
  city: 'Compiègne',
  region: 'Hauts-de-France',
  country: 'France',
} satisfies Partial<AddSpotInput>

describe('AddSpotWizard pick-on-map', () => {
  it('shows the pick button in create mode and reports null position for a fresh draft', async () => {
    const onPickOnMap = vi.fn()
    const user = userEvent.setup({ delay: null })
    render(<AddSpotWizard open onClose={vi.fn()} onPickOnMap={onPickOnMap} />, {
      wrapper: Wrapper,
    })

    await user.click(screen.getByTestId('pick-on-map-btn'))
    expect(onPickOnMap).toHaveBeenCalledWith(null)
  })

  it('hides the pick button without an onPickOnMap handler and in edit mode', () => {
    const { unmount } = render(<AddSpotWizard open onClose={vi.fn()} />, { wrapper: Wrapper })
    expect(screen.queryByTestId('pick-on-map-btn')).toBeNull()
    unmount()

    render(
      <AddSpotWizard
        open
        onClose={vi.fn()}
        mode="edit"
        spotId="spot-1"
        initialValues={editValues}
        onPickOnMap={vi.fn()}
      />,
      { wrapper: Wrapper },
    )
    expect(screen.queryByTestId('pick-on-map-btn')).toBeNull()
  })

  it('applies pendingPick to the draft and reports the position on the next pick', async () => {
    const onPickOnMap = vi.fn()
    const onPendingPickApplied = vi.fn()
    const user = userEvent.setup({ delay: null })
    render(
      <AddSpotWizard
        open
        onClose={vi.fn()}
        onPickOnMap={onPickOnMap}
        pendingPick={pick}
        onPendingPickApplied={onPendingPickApplied}
      />,
      { wrapper: Wrapper },
    )

    await waitFor(() => expect(onPendingPickApplied).toHaveBeenCalledTimes(1))
    expect(screen.getByLabelText('Address')).toHaveValue('Rue de la Paix')

    await user.click(screen.getByTestId('pick-on-map-btn'))
    expect(onPickOnMap).toHaveBeenCalledWith(pick.position)
  })

  it('preserves the draft across a hidden round-trip (map-pick mode)', async () => {
    const onPendingPickApplied = vi.fn()
    const { rerender } = render(
      <AddSpotWizard
        open
        onClose={vi.fn()}
        onPickOnMap={vi.fn()}
        pendingPick={pick}
        onPendingPickApplied={onPendingPickApplied}
      />,
      { wrapper: Wrapper },
    )
    await waitFor(() => expect(onPendingPickApplied).toHaveBeenCalled())
    expect(screen.getByLabelText('Address')).toHaveValue('Rue de la Paix')

    // Enter map-pick mode: the overlay unmounts but the wizard keeps its state
    rerender(
      <AddSpotWizard open hidden onClose={vi.fn()} onPickOnMap={vi.fn()} pendingPick={null} />,
    )
    expect(screen.queryByLabelText('Address')).toBeNull()

    // Return from picking: the draft is intact
    rerender(
      <AddSpotWizard open onClose={vi.fn()} onPickOnMap={vi.fn()} pendingPick={null} />,
    )
    expect(screen.getByLabelText('Address')).toHaveValue('Rue de la Paix')
  })
})
