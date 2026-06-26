import { useTranslation } from 'react-i18next'
import { ContentPage } from './ContentPage'

type Section = { heading: string; body?: string[]; bullets?: string[] }

/**
 * Renders a long-form content page (privacy / terms / about) from a translation
 * base key, e.g. "pages.privacy". `updated` and `note` are optional.
 */
export function LegalPage({ base }: { base: string }) {
  const { t } = useTranslation()
  const eyebrow = t(`${base}.eyebrow`)
  const title = t(`${base}.title`)
  const lead = t(`${base}.lead`)
  const updated = t(`${base}.updated`, { defaultValue: '' })
  const note = t(`${base}.note`, { defaultValue: '' })
  const sections = t(`${base}.sections`, { returnObjects: true }) as Section[]

  return (
    <ContentPage>
      <article className="lp-prose">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
        {updated && <p className="updated">{updated}</p>}
        {Array.isArray(sections) &&
          sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.body?.map((p, i) => <p key={i}>{p}</p>)}
              {s.bullets && s.bullets.length > 0 && (
                <ul>
                  {s.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        {note && <div className="note">{note}</div>}
      </article>
    </ContentPage>
  )
}
