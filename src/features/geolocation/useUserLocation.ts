import { useCallback, useEffect, useState } from 'react'
import { setLocationCookie, type LngLat } from './location'

export type UserLocationState = {
  userLocation: LngLat | null
  requestLocation: () => void
}

/**
 * Asks the browser for the user's location on mount (the native permission
 * prompt). On success: stores the position and persists it to the `loc` cookie.
 * On denial/error/timeout: no-op — the map keeps its loader-resolved center.
 */
export function useUserLocation(): UserLocationState {
  const [userLocation, setUserLocation] = useState<LngLat | null>(null)

  const requestLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next: LngLat = [pos.coords.longitude, pos.coords.latitude]
        setUserLocation(next)
        setLocationCookie(next[0], next[1])
      },
      () => {
        // denied / unavailable / timeout — keep the existing center.
      },
    )
  }, [])

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  return { userLocation, requestLocation }
}
