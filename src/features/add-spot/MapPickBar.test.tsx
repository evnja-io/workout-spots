import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { http, HttpResponse, delay } from 'msw'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import { server } from '~/test/msw/server'
import { MapPickBar } from './MapPickBar'

const i18n = createI18n('en')

function renderBar(props: Partial<Parameters<typeof MapPickBar>[0]> = {}) {
  const onConfirm = vi.fn()
  const onCancel = vi.fn()
  const utils = render(
    <I18nextProvider i18n={i18n}>
      <MapPickBar position={null} onConfirm={onConfirm} onCancel={onCancel} {...props} />
    </I18nextProvider>,
  )
  function rerenderBar(next: Partial<Parameters<typeof MapPickBar>[0]>) {
    utils.rerender(
      <I18nextProvider i18n={i18n}>
        <MapPickBar
          position={null}
          onConfirm={onConfirm}
          onCancel={onCancel}
          {...props}
          {...next}
        />
      </I18nextProvider>,
    )
  }
  return { ...utils, rerenderBar, onConfirm, onCancel }
}

function geocodeHandler() {
  return http.get(
    'https://api.mapbox.com/geocoding/v5/mapbox.places/:coords.json',
    async ({ params }) => {
      const coords = String(params.coords)
      // Slow down the first position so a quick reposition can win the race.
      if (coords.startsWith('2.38')) await delay(150)
      return HttpResponse.json({
        features: [
          {
            place_name: `Place at ${coords}`,
            text: `Address ${coords}`,
            center: coords.split(',').map(Number),
            context: [
              { id: 'place.1', text: 'Paris' },
              { id: 'region.1', text: 'Île-de-France' },
              { id: 'country.1', text: 'France' },
            ],
          },
        ],
      })
    },
  )
}

describe('MapPickBar', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_MAPBOX_TOKEN', 'pk.test')
  })

  it('shows the hint and disables confirm when no position is set', () => {
    renderBar()
    expect(screen.getByText('Tap the map to place the pin')).toBeInTheDocument()
    expect(screen.getByTestId('map-pick-confirm')).toBeDisabled()
  })

  it('reverse-geocodes the position and confirms with the geo result', async () => {
    server.use(geocodeHandler())
    const user = userEvent.setup({ delay: null })
    const position = { lng: 3.1, lat: 49.2 }
    const { onConfirm } = renderBar({ position })

    await waitFor(() => expect(screen.getByText('Place at 3.1,49.2')).toBeInTheDocument())
    expect(screen.getByTestId('map-pick-confirm')).toBeEnabled()

    await user.click(screen.getByTestId('map-pick-confirm'))
    expect(onConfirm).toHaveBeenCalledWith({
      position,
      geo: expect.objectContaining({
        placeName: 'Place at 3.1,49.2',
        city: 'Paris',
        region: 'Île-de-France',
        country: 'France',
      }),
    })
  })

  it('degrades to a position-only confirm when geocoding fails', async () => {
    // Empty token → reverseGeocode throws before fetching
    vi.stubEnv('VITE_MAPBOX_TOKEN', '')
    const user = userEvent.setup({ delay: null })
    const position = { lng: 3.1, lat: 49.2 }
    const { onConfirm } = renderBar({ position })

    await waitFor(() =>
      expect(
        screen.getByText('No address found — you can still confirm the position.'),
      ).toBeInTheDocument(),
    )
    expect(screen.getByTestId('map-pick-confirm')).toBeEnabled()

    await user.click(screen.getByTestId('map-pick-confirm'))
    expect(onConfirm).toHaveBeenCalledWith({ position, geo: null })
  })

  it('keeps only the latest position result when repositioning quickly', async () => {
    server.use(geocodeHandler())
    const { rerenderBar } = renderBar({ position: { lng: 2.38, lat: 48.87 } })
    // Reposition before the (delayed) first geocode resolves
    rerenderBar({ position: { lng: 3.1, lat: 49.2 } })

    await waitFor(() => expect(screen.getByText('Place at 3.1,49.2')).toBeInTheDocument())
    // Wait out the delayed first response — it must not overwrite the latest one
    await new Promise((r) => setTimeout(r, 250))
    expect(screen.getByText('Place at 3.1,49.2')).toBeInTheDocument()
    expect(screen.queryByText('Place at 2.38,48.87')).toBeNull()
  })

  it('cancels on Escape and via the cancel button', async () => {
    const user = userEvent.setup({ delay: null })
    const { onCancel } = renderBar()

    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledTimes(1)

    await user.click(screen.getByTestId('map-pick-cancel'))
    expect(onCancel).toHaveBeenCalledTimes(2)
  })
})
