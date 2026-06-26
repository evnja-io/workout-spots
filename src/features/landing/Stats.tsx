import { useTranslation } from 'react-i18next'
import { useCountUp } from './hooks'

function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const { ref, display } = useCountUp(value)
  return (
    <div className="stat reveal">
      <b className="gradtext" ref={ref}>
        {display}
        {suffix}
      </b>
      <span>{label}</span>
    </div>
  )
}

type Props = {
  spotsCount: number
  equipmentCount: number
  disciplineCount: number
}

export function Stats({ spotsCount, equipmentCount, disciplineCount }: Props) {
  const { t } = useTranslation()
  // Real counts from the loader; fall back to the design figures when Supabase
  // is unconfigured (counts come back as 0) so the strip never shows zeros.
  const stats = [
    { value: spotsCount || 133, label: t('landing.stats.spots') },
    { value: equipmentCount || 12, label: t('landing.stats.equipment') },
    { value: disciplineCount || 8, label: t('landing.stats.disciplines') },
    { value: 100, suffix: '%', label: t('landing.stats.free') },
  ]
  return (
    <section className="stats" aria-label={t('landing.stats.aria')}>
      <div className="wrap">
        {stats.map((s) => (
          <Stat key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
        ))}
      </div>
    </section>
  )
}
