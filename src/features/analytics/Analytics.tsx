import { useEffect, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { getConsent, setConsent, type Consent } from './consent'
import { loadGtag, trackPageview } from './gtag'
import { CookieBanner } from './CookieBanner'

// Mounted once inside the root provider tree. Owns the consent banner, lazily
// loads GA once consent is granted, and emits a page_view on every navigation.
export function Analytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [consent, setConsentState] = useState<Consent>(() => getConsent())

  // Load GA as soon as consent is (or becomes) granted. loadGtag is idempotent.
  useEffect(() => {
    if (consent === 'granted') loadGtag()
  }, [consent])

  // Track the initial view and each subsequent SPA navigation.
  useEffect(() => {
    if (consent === 'granted') trackPageview(pathname)
  }, [pathname, consent])

  function accept() {
    setConsent('granted')
    setConsentState('granted')
  }

  function decline() {
    setConsent('denied')
    setConsentState('denied')
  }

  if (consent !== 'pending') return null
  return <CookieBanner onAccept={accept} onDecline={decline} />
}
