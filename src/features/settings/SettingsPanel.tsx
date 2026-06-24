import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { applyTheme, applyAccent, ACCENTS, type Theme, type AccentKey } from '~/features/theme/theme'
import type { MapStyle } from '~/lib/mapbox/map'
import type { Locale } from '~/lib/i18n/config'
import { setPrefCookie, VALID_ACCENTS } from './prefs'
import { Icon } from '~/components/ui/Icon'

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
  return 'violet'
}

export function SettingsPanel({ open, onClose, mapStyle, onMapStyleChange }: SettingsPanelProps) {
  const { t, i18n } = useTranslation()

  // Mirror current theme/accent in local state so active classes update immediately
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== 'undefined' ? readCurrentTheme() : 'light',
  )
  const [accent, setAccent] = useState<AccentKey>(() =>
    typeof document !== 'undefined' ? readCurrentAccent() : 'violet',
  )

  if (!open) return null

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

  return (
    <div className="tweaks-panel" role="dialog" aria-label={t('settings.title')}>
      <div className="tweaks-head">
        <strong>{t('settings.title')}</strong>
        <button type="button" onClick={onClose} aria-label="Close settings">
          <Icon name="close" size={14} />
        </button>
      </div>

      <div className="tweaks-body">
        {/* Theme */}
        <div className="tweak-row">
          <label>{t('settings.theme')}</label>
          <div className="tweak-seg">
            <button
              type="button"
              className={theme === 'light' ? 'active' : ''}
              onClick={() => handleThemeSelect('light')}
            >
              {t('settings.light')}
            </button>
            <button
              type="button"
              className={theme === 'dark' ? 'active' : ''}
              onClick={() => handleThemeSelect('dark')}
              aria-label="Dark"
            >
              {t('settings.dark')}
            </button>
          </div>
        </div>

        {/* Accent */}
        <div className="tweak-row">
          <label>{t('settings.accent')}</label>
          <div className="swatch-row">
            {VALID_ACCENTS.map((key) => (
              <button
                key={key}
                type="button"
                className={`color-swatch${accent === key ? ' active' : ''}`}
                style={{ background: ACCENTS[key][theme].accent }}
                onClick={() => handleAccentSelect(key)}
                aria-label={key}
                title={key}
              />
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="tweak-row">
          <label>{t('settings.language')}</label>
          <div className="tweak-seg">
            <button
              type="button"
              className={i18n.language === 'en' ? 'active' : ''}
              onClick={() => handleLangSelect('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={i18n.language === 'fr' ? 'active' : ''}
              onClick={() => handleLangSelect('fr')}
              aria-label="FR"
            >
              FR
            </button>
          </div>
        </div>

        {/* Map style */}
        <div className="tweak-row">
          <label>{t('settings.mapStyle')}</label>
          <div className="tweak-seg">
            <button
              type="button"
              className={mapStyle === 'light' ? 'active' : ''}
              onClick={() => handleMapStyleSelect('light')}
            >
              {t('settings.light')}
            </button>
            <button
              type="button"
              className={mapStyle === 'minimal' ? 'active' : ''}
              onClick={() => handleMapStyleSelect('minimal')}
              aria-label="Minimal"
            >
              {t('settings.minimal')}
            </button>
            <button
              type="button"
              className={mapStyle === 'satellite' ? 'active' : ''}
              onClick={() => handleMapStyleSelect('satellite')}
            >
              {t('settings.satellite')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
