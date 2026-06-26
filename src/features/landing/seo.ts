import { SITE_URL } from '~/routes/__root'
import en from '~/lib/i18n/en.json'
import fr from '~/lib/i18n/fr.json'

export const OG_COVER = `${SITE_URL}/og-image.png`

/** The raw translation dictionary for a locale — used in `head()` where the
 * i18next React hook isn't available, so meta stays in sync with page copy. */
export function localizedDict(lang: 'en' | 'fr') {
  return lang === 'fr' ? fr : en
}

export type PageMetaInput = {
  title: string
  description: string
  /** Absolute path beginning with "/", e.g. "/privacy". */
  path: string
  locale?: 'en' | 'fr'
  image?: string
  type?: 'website' | 'article'
}

/**
 * Builds the per-page `meta` + `links` arrays for a TanStack Router `head()`.
 * Sets a self-referencing canonical and the full Open Graph / Twitter set so
 * each route is independently shareable and indexable.
 */
export function pageMeta({
  title,
  description,
  path,
  locale = 'en',
  image = OG_COVER,
  type = 'website',
}: PageMetaInput) {
  const url = `${SITE_URL}${path === '/' ? '/' : path}`
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:locale', content: locale === 'fr' ? 'fr_FR' : 'en_US' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}

/** Poppins + Inter for the marketing pages — loaded only on landing/content routes. */
export const fontLinks = [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap',
  },
]

type FaqItem = { q: string; a: string }

/** schema.org @graph for the landing page (WebSite, Organization, App, FAQ). */
export function landingJsonLd(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'Workout Spots',
        description: 'Find outdoor calisthenics, street workout and parkour spots near you.',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/spots?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#org`,
        name: 'Workout Spots',
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/favicon-512.png`,
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Workout Spots',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web, iOS, Android',
        url: `${SITE_URL}/`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}

/** Inline <script type="application/ld+json"> props (SSR-safe, crawler-friendly). */
export function jsonLdScriptProps(data: unknown) {
  return {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  }
}
