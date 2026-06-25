import { createIsomorphicFn } from '@tanstack/react-start'
import { setPrefCookie } from '~/features/settings/prefs'
import { getServerConsent } from './consent.server'

// Analytics cookie-consent state. `pending` means the user hasn't chosen yet
// (show the banner); `granted` loads GA; `denied` keeps it off.
export type Consent = 'granted' | 'denied' | 'pending'

export const CONSENT_COOKIE = 'analytics_consent'
export const VALID_CONSENT: Consent[] = ['granted', 'denied', 'pending']

function readConsentFromDocumentCookie(): Consent {
  const raw = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`))
    ?.split('=')[1]
  return VALID_CONSENT.includes(raw as Consent) ? (raw as Consent) : 'pending'
}

// Reading consent on both sides (server reads the request cookie) avoids a
// banner flash on hydration when the user has already decided.
export const getConsent = createIsomorphicFn()
  .client(readConsentFromDocumentCookie)
  .server((): Consent => getServerConsent())

export function setConsent(value: Consent): void {
  setPrefCookie(CONSENT_COOKIE, value)
}
