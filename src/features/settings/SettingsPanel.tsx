import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { applyTheme, applyAccent, ACCENTS, type Theme, type AccentKey } from '~/features/theme/theme'
import type { MapStyle } from '~/lib/mapbox/map'
import type { Locale } from '~/lib/i18n/config'
import { setPrefCookie, VALID_ACCENTS } from './prefs'
import { Icon } from '~/components/ui/Icon'
import { cx } from '~/components/ui/cx'
import { Sheet } from '~/components/ui/Sheet'
import { useIsMobile } from '~/lib/hooks/useMediaQuery'

export interface SettingsPanelProps {
  open: boolean
  onClose: () => void
  mapStyle: MapStyle
  onMapStyleChange: (s: MapStyle) => void
}

function readCurrentTheme(): Theme {
  const val = document.documentElement.dataset.theme
  return val === 'dark' ? 'dark' : 'light'
}

function readCurrentAccent(): AccentKey {
  const val = document.documentElement.style.getPropertyValue('--accent')
  for (const key of VALID_ACCENTS) {
    const palette = ACCENTS[key]
    if (palette.light.accent === val || palette.dark.accent === val) {
      return key
    }
  }
  return 'rose'
}

export function SettingsPanel({ open, onClose, mapStyle, onMapStyleChange }: SettingsPanelProps) {
  const { t, i18n } = useTranslation()

  // Mirror current theme/accent in local state so active classes update immediately
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== 'undefined' ? readCurrentTheme() : 'light',
  )
  const [accent, setAccent] = useState<AccentKey>(() =>
    typeof document !== 'undefined' ? readCurrentAccent() : 'rose',
  )
  const isMobile = useIsMobile()

  function handleThemeSelect(t: Theme) {
    applyTheme(t)
    applyAccent(accent, t)
    setPrefCookie('theme', t)
    setTheme(t)
  }

  function handleAccentSelect(a: AccentKey) {
    applyAccent(a, theme)
    setPrefCookie('accent', a)
    setAccent(a)
  }

  function handleLangSelect(lng: Locale) {
    void i18n.changeLanguage(lng)
    setPrefCookie('lang', lng)
  }

  function handleMapStyleSelect(s: MapStyle) {
    onMapStyleChange(s)
    setPrefCookie('mapStyle', s)
  }

  const segBtn = 'flex-1 rounded-[6px] px-2 py-1.5 text-[12px] text-text-3'
  const segBtnActive = 'bg-surface text-text shadow-[var(--shadow-sm)]'
  const rowLabel = 'text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3'

  const body = (
    <div className="flex flex-col gap-3 px-3.5 py-3">
        {/* Theme */}
        <div className="flex flex-col gap-1.5">
          <label className={rowLabel}>{t('settings.theme')}</label>
          <div className="flex rounded-[8px] bg-surface-2 p-[3px]">
            <button
              type="button"
              className={cx(segBtn, theme === 'light' && segBtnActive)}
              onClick={() => handleThemeSelect('light')}
            >
              {t('settings.light')}
            </button>
            <button
              type="button"
              className={cx(segBtn, theme === 'dark' && segBtnActive)}
              onClick={() => handleThemeSelect('dark')}
              aria-label="Dark"
            >
              {t('settings.dark')}
            </button>
          </div>
        </div>

        {/* Accent */}
        <div className="flex flex-col gap-1.5">
          <label className={rowLabel}>{t('settings.accent')}</label>
          <div className="flex gap-1.5">
            {VALID_ACCENTS.map((key) => (
              <button
                key={key}
                type="button"
                className={cx(
                  'size-[26px] cursor-pointer rounded-full border-2 border-transparent transition-transform duration-100',
                  accent === key && 'border-white shadow-[0_0_0_2px_var(--text)]',
                )}
                style={{ background: ACCENTS[key][theme].accent }}
                onClick={() => handleAccentSelect(key)}
                aria-label={key}
                title={key}
              />
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="flex flex-col gap-1.5">
          <label className={rowLabel}>{t('settings.language')}</label>
          <div className="flex rounded-[8px] bg-surface-2 p-[3px]">
            <button
              type="button"
              className={cx(segBtn, i18n.language === 'en' && segBtnActive)}
              onClick={() => handleLangSelect('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={cx(segBtn, i18n.language === 'fr' && segBtnActive)}
              onClick={() => handleLangSelect('fr')}
              aria-label="FR"
            >
              FR
            </button>
          </div>
        </div>

        {/* Map style */}
        <div className="flex flex-col gap-1.5">
          <label className={rowLabel}>{t('settings.mapStyle')}</label>
          <div className="flex rounded-[8px] bg-surface-2 p-[3px]">
            <button
              type="button"
              className={cx(segBtn, mapStyle === 'minimal' && segBtnActive)}
              onClick={() => handleMapStyleSelect('minimal')}
              aria-label="Minimal"
            >
              {t('settings.minimal')}
            </button>
            <button
              type="button"
              className={cx(segBtn, mapStyle === 'satellite' && segBtnActive)}
              onClick={() => handleMapStyleSelect('satellite')}
            >
              {t('settings.satellite')}
            </button>
          </div>
        </div>
      </div>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onClose={onClose} title={t('settings.title')}>
        {body}
      </Sheet>
    )
  }

  if (!open) return null

  return (
    <div
      className="fixed right-5 bottom-5 z-40 w-[280px] overflow-hidden rounded-[14px] border border-border bg-surface text-[13px] shadow-[var(--shadow-lg)]"
      role="dialog"
      aria-label={t('settings.title')}
    >
      <div className="flex items-center justify-between border-b border-border bg-surface-2 px-3.5 py-2.5">
        <strong className="text-[12px] tracking-[0.01em]">{t('settings.title')}</strong>
        <button type="button" onClick={onClose} aria-label="Close settings">
          <Icon name="close" size={14} />
        </button>
      </div>
      {body}
    </div>
  )
}
