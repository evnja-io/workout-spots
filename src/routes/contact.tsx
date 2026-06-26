import { createFileRoute } from '@tanstack/react-router'
import { ContactPage } from '~/features/pages/ContactPage'
import { pageMeta, fontLinks, localizedDict } from '~/features/landing/seo'
import { getPrefs } from '~/features/settings/prefs'
import '~/features/landing/landing.css'

export const Route = createFileRoute('/contact')({
  head: () => {
    const { lang } = getPrefs()
    const dict = localizedDict(lang)
    const m = pageMeta({
      title: dict.pages.contact.meta.title,
      description: dict.pages.contact.meta.description,
      path: '/contact',
      locale: lang,
      type: 'article',
    })
    return {
      meta: [{ name: 'theme-color', content: '#1A0A20' }, ...m.meta],
      links: [...fontLinks, ...m.links],
    }
  },
  component: () => <ContactPage />,
})
