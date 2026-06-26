import { useTranslation } from 'react-i18next'

export type FaqEntry = { q: string; a: string }

export function Faq({ items }: { items: FaqEntry[] }) {
  const { t } = useTranslation()
  return (
    <section className="section" id="faq" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head reveal">
          <p className="eyebrow">{t('landing.faq.eyebrow')}</p>
          <h2>{t('landing.faq.title')}</h2>
        </div>
        <div className="faq">
          {items.map((item, i) => (
            <details className="reveal" key={item.q} open={i === 0}>
              <summary>
                {item.q}
                <span className="pm" aria-hidden="true" />
              </summary>
              <div className="ans">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
