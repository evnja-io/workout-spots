import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '~/features/pages/LegalPage'
import { pageMeta, fontLinks, localizedDict } from '~/features/landing/seo'
import { getPrefs } from '~/features/settings/prefs'
import '~/features/landing/landing.css'

export const Route = createFileRoute('/terms')({
  head: () => {
    const { lang } = getPrefs()
    const dict = localizedDict(lang)
    const m = pageMeta({
      title: dict.pages.terms.meta.title,
      description: dict.pages.terms.meta.description,
      path: '/terms',
      locale: lang,
      type: 'article',
    })
    return {
      meta: [{ name: 'theme-color', content: '#1A0A20' }, ...m.meta],
      links: [...fontLinks, ...m.links],
    }
  },
  component: () => <LegalPage base="pages.terms" />,
})
