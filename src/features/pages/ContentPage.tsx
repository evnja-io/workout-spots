import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { LandingHeader } from '~/features/landing/LandingHeader'
import { LandingFooter } from '~/features/landing/LandingFooter'

/** Shared shell for the static footer pages — reuses the landing chrome with the
 * always-dark `.lp` identity, and routes the header/footer section links home. */
export function ContentPage({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  return (
    <div className="lp">
      <a className="lp-skip" href="#main">
        {t('landing.skip')}
      </a>
      <LandingHeader variant="page" />
      <main id="main" className="lp-page">
        <div className="wrap">{children}</div>
      </main>
      <LandingFooter variant="page" />
    </div>
  )
}
