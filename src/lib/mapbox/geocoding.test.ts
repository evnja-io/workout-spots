import { afterEach, expect, test, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '~/test/msw/server'
import { forwardGeocode } from './geocoding'

afterEach(() => vi.unstubAllEnvs())

test('forwardGeocode maps features to results', async () => {
  vi.stubEnv('VITE_MAPBOX_TOKEN', 'pk.test')
  server.use(
    http.get('https://api.mapbox.com/geocoding/v5/mapbox.places/:q.json', () =>
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
  const [r] = await forwardGeocode('couronnes')
  expect(r).toMatchObject({
    city: 'Paris',
    region: 'Île-de-France',
    country: 'France',
    lng: 2.38,
    lat: 48.87,
  })
})
