import { getCookie, getRequestHeader } from '@tanstack/react-start/server'
import { LOC_COOKIE, parseCoord, parseLocCookie, resolveCenter, type MapCenter } from './location'

/** Server branch: remembered cookie first, then Vercel IP-geo headers. */
export function getServerInitialCenter(): MapCenter {
  const cookieLoc = parseLocCookie(getCookie(LOC_COOKIE))
  const ipLat = parseCoord(getRequestHeader('x-vercel-ip-latitude'))
  const ipLng = parseCoord(getRequestHeader('x-vercel-ip-longitude'))
  return resolveCenter(cookieLoc, ipLat, ipLng)
}
