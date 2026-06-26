import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '~/features/pages/LegalPage'
import { pageMeta, fontLinks, localizedDict } from '~/features/landing/seo'
import { getPrefs } from '~/features/settings/prefs'
import '~/features/landing/landing.css'

export const Route = createFileRoute('/privacy')({
  head: () => {
    const { lang } = getPrefs()
    const dict = localizedDict(lang)
    const m = pageMeta({
      title: dict.pages.privacy.meta.title,
      description: dict.pages.privacy.meta.description,
      path: '/privacy',
      locale: lang,
      type: 'article',
    })
    return {
      meta: [{ name: 'theme-color', content: '#1A0A20' }, ...m.meta],
      links: [...fontLinks, ...m.links],
    }
  },
  component: () => <LegalPage base="pages.privacy" />,
})
