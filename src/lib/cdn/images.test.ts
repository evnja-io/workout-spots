import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cdnImageUrl } from './images'

const SB = 'https://puewbgczxvlcckspbfzv.supabase.co/storage/v1/object/public'
const CDN = 'https://img.evnja.gg'

afterEach(() => vi.unstubAllEnvs())

describe('cdnImageUrl', () => {
  describe('when VITE_IMAGE_CDN_URL is unset', () => {
    // Stub empty so the assertion holds regardless of the ambient .env value
    // (Vitest loads .env, where VITE_IMAGE_CDN_URL is set for prod).
    beforeEach(() => vi.stubEnv('VITE_IMAGE_CDN_URL', ''))

    it('returns Supabase URLs unchanged (no-op for local dev / tests)', () => {
      const url = `${SB}/location-images/abc/1-photo.jpg`
      expect(cdnImageUrl(url)).toBe(url)
    })

    it('leaves the test-fixture placeholder host untouched', () => {
      expect(cdnImageUrl('https://cdn/avatar.png')).toBe('https://cdn/avatar.png')
    })
  })

  describe('when VITE_IMAGE_CDN_URL is set', () => {
    beforeEach(() => vi.stubEnv('VITE_IMAGE_CDN_URL', CDN))

    it('rewrites a Supabase public object to /sb/<bucket>/<path>', () => {
      expect(cdnImageUrl(`${SB}/location-images/abc/1-photo.jpg`)).toBe(
        `${CDN}/sb/location-images/abc/1-photo.jpg`,
      )
    })

    it('preserves the query string (avatar cache-buster)', () => {
      expect(cdnImageUrl(`${SB}/avatars/user-1/avatar.png?v=1700000000000`)).toBe(
        `${CDN}/sb/avatars/user-1/avatar.png?v=1700000000000`,
      )
    })

    it('rewrites an allowlisted scraped host to /ext/<host>/<path>', () => {
      expect(cdnImageUrl('https://calisthenics-parks.com/media/spots/42.jpg')).toBe(
        `${CDN}/ext/calisthenics-parks.com/media/spots/42.jpg`,
      )
    })

    it('preserves the query string on scraped hosts', () => {
      expect(cdnImageUrl('https://www.lvbarstarzz.com/img.jpg?w=400')).toBe(
        `${CDN}/ext/www.lvbarstarzz.com/img.jpg?w=400`,
      )
    })

    it('leaves a trailing slash off the configured base', () => {
      vi.stubEnv('VITE_IMAGE_CDN_URL', `${CDN}/`)
      expect(cdnImageUrl(`${SB}/avatars/u/a.png`)).toBe(`${CDN}/sb/avatars/u/a.png`)
    })

    it('does NOT rewrite a non-allowlisted host (no open proxy)', () => {
      const url = 'https://example.com/evil.jpg'
      expect(cdnImageUrl(url)).toBe(url)
    })

    it('leaves data URIs unchanged', () => {
      const dataUri = 'data:image/svg+xml,<svg/>'
      expect(cdnImageUrl(dataUri)).toBe(dataUri)
    })

    it('leaves blob/object URLs unchanged (local upload previews)', () => {
      const blob = 'blob:https://spots.evnja.gg/9f1c-2a'
      expect(cdnImageUrl(blob)).toBe(blob)
    })

    it('leaves relative paths unchanged', () => {
      expect(cdnImageUrl('/og-image.png')).toBe('/og-image.png')
    })

    it('returns undefined for null/undefined', () => {
      expect(cdnImageUrl(null)).toBeUndefined()
      expect(cdnImageUrl(undefined)).toBeUndefined()
    })
  })
})
