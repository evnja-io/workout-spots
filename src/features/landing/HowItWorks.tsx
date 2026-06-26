import { useTranslation } from 'react-i18next'

function Arrow() {
  return (
    <svg
      className="arrow"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function HowItWorks() {
  const { t } = useTranslation()
  const steps = t('landing.how.steps', { returnObjects: true }) as { title: string; desc: string }[]

  return (
    <section
      className="section"
      id="how"
      style={{
        background: 'rgba(255,255,255,.015)',
        borderTop: '1px solid var(--line-soft)',
        borderBottom: '1px solid var(--line-soft)',
      }}
    >
      <div className="wrap">
        <div className="section-head reveal">
          <p className="eyebrow">{t('landing.how.eyebrow')}</p>
          <h2>{t('landing.how.title')}</h2>
          <p>{t('landing.how.sub')}</p>
        </div>
        <div className="steps">
          {steps.map((step, i) => (
            <article className="step reveal" key={step.title} style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="n">{i + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {i < steps.length - 1 && <Arrow />}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
