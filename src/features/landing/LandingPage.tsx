import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { SpotListItem, Equipment, Discipline } from '~/features/spots/domain'
import { LandingHeader } from './LandingHeader'
import { LandingFooter } from './LandingFooter'
import { Hero } from './Hero'
import { Stats } from './Stats'
import { Features } from './Features'
import { HowItWorks } from './HowItWorks'
import { PopularSpots } from './PopularSpots'
import { Disciplines } from './Disciplines'
import { CtaBand } from './CtaBand'
import { Faq, type FaqEntry } from './Faq'
import { useReveal } from './hooks'
import { landingJsonLd, jsonLdScriptProps } from './seo'

type Props = {
  spots: SpotListItem[]
  equipments: Equipment[]
  disciplines: Discipline[]
  spotsCount: number
}

export function LandingPage({ spots, equipments, disciplines, spotsCount }: Props) {
  const { t } = useTranslation()
  const rootRef = useRef<HTMLDivElement>(null)
  useReveal(rootRef)

  const faqItems = t('landing.faq.items', { returnObjects: true }) as FaqEntry[]

  return (
    <div className="lp" ref={rootRef}>
      <a className="lp-skip" href="#main">
        {t('landing.skip')}
      </a>
      <script {...jsonLdScriptProps(landingJsonLd(faqItems))} />
      <LandingHeader />
      <main id="main">
        <Hero />
        <Stats
          spotsCount={spotsCount}
          equipmentCount={equipments.length}
          disciplineCount={disciplines.length}
        />
        <Features />
        <HowItWorks />
        <PopularSpots spots={spots} equipments={equipments} disciplines={disciplines} />
        <Disciplines />
        <CtaBand />
        <Faq items={faqItems} />
      </main>
      <LandingFooter />
    </div>
  )
}
