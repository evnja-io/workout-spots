import { getCookies } from '@tanstack/react-start/server'
import type { Consent } from './consent'
import { CONSENT_COOKIE, VALID_CONSENT } from './consent'

export function getServerConsent(): Consent {
  const cookies = getCookies()
  const raw = cookies[CONSENT_COOKIE]
  return VALID_CONSENT.includes(raw as Consent) ? (raw as Consent) : 'pending'
}
