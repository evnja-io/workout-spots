import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { useUserLocation } from './useUserLocation'

type SuccessCb = (pos: { coords: { longitude: number; latitude: number } }) => void
type ErrorCb = (err: unknown) => void

function stubGeolocation(impl: (success: SuccessCb, error: ErrorCb) => void) {
  const getCurrentPosition = vi.fn(impl)
  vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } })
  return getCurrentPosition
}

describe('useUserLocation', () => {
  beforeEach(() => {
    document.cookie = 'loc=; path=/; max-age=0'
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('auto-asks on mount, stores the position and writes the cookie on success', async () => {
    const getCurrentPosition = stubGeolocation((success) => {
      success({ coords: { longitude: 2.352, latitude: 48.857 } })
    })

    const { result } = renderHook(() => useUserLocation())

    expect(getCurrentPosition).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(result.current.userLocation).toEqual([2.352, 48.857])
    })
    expect(document.cookie).toContain('loc=2.35,48.86')
  })

  it('stays null and writes no cookie when permission is denied', async () => {
    stubGeolocation((_success, error) => {
      error({ code: 1, message: 'denied' })
    })

    const { result } = renderHook(() => useUserLocation())

    await waitFor(() => {
      expect(result.current.userLocation).toBeNull()
    })
    expect(document.cookie).not.toContain('loc=2.')
  })

  it('requestLocation re-triggers a position request', async () => {
    const getCurrentPosition = stubGeolocation((success) => {
      success({ coords: { longitude: 1, latitude: 2 } })
    })

    const { result } = renderHook(() => useUserLocation())
    expect(getCurrentPosition).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.requestLocation()
    })
    expect(getCurrentPosition).toHaveBeenCalledTimes(2)
  })
})
