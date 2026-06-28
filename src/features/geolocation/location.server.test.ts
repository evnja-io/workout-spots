import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('@tanstack/react-start/server', () => ({
  getCookie: vi.fn(),
  getRequestHeader: vi.fn(),
}))

import { getCookie, getRequestHeader } from '@tanstack/react-start/server'
import { getServerInitialCenter } from './location.server'
import { PARIS_CENTER, PRECISE_ZOOM, REGION_ZOOM } from './location'

const mockGetCookie = vi.mocked(getCookie)
const mockGetRequestHeader = vi.mocked(getRequestHeader)

describe('getServerInitialCenter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uses the loc cookie when present (precise zoom)', () => {
    mockGetCookie.mockReturnValue('2.35,48.85')
    expect(getServerInitialCenter()).toEqual({
      center: [2.35, 48.85],
      zoom: PRECISE_ZOOM,
      source: 'cookie',
    })
  })

  it('falls back to Vercel IP headers as [lng,lat] at region zoom', () => {
    mockGetCookie.mockReturnValue(undefined)
    mockGetRequestHeader.mockImplementation((name: string) =>
      name === 'x-vercel-ip-latitude'
        ? '51.5'
        : name === 'x-vercel-ip-longitude'
          ? '-0.12'
          : undefined,
    )
    expect(getServerInitialCenter()).toEqual({
      center: [-0.12, 51.5],
      zoom: REGION_ZOOM,
      source: 'ip',
    })
  })

  it('defaults to Paris when neither cookie nor headers are present', () => {
    mockGetCookie.mockReturnValue(undefined)
    mockGetRequestHeader.mockReturnValue(undefined)
    expect(getServerInitialCenter()).toEqual({
      center: PARIS_CENTER,
      zoom: REGION_ZOOM,
      source: 'default',
    })
  })
})
