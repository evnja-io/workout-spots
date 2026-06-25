import { createIsomorphicFn } from '@tanstack/react-start'
import type { Theme, AccentKey } from '~/features/theme/theme'
import type { MapStyle } from '~/lib/mapbox/map'
import type { Locale } from '~/lib/i18n/config'
import { getServerPrefs } from './prefs.server'

export type { Theme, AccentKey, MapStyle, Locale }

export type Prefs = {
  theme: Theme
  accent: AccentKey
  mapStyle: MapStyle
  lang: Locale
}

export const VALID_THEMES: Theme[] = ['light', 'dark']
export const VALID_ACCENTS: AccentKey[] = ['violet', 'slate', 'emerald', 'rose']
export const VALID_MAP_STYLES: MapStyle[] = ['light', 'minimal', 'satellite']
export const VALID_LANGS: Locale[] = ['en', 'fr']

const DEFAULT_PREFS: Prefs = {
  theme: 'light',
  accent: 'rose',
  mapStyle: 'light',
  lang: 'en',
}

function readPrefsFromDocumentCookie(): Prefs {
  function read(name: string): string | undefined {
    return document.cookie
      .split('; ')
      .find((c) => c.startsWith(`${name}=`))
      ?.split('=')[1]
  }

  const rawTheme = read('theme')
  const rawAccent = read('accent')
  const rawMapStyle = read('mapStyle')
  const rawLang = read('lang')

  const theme = VALID_THEMES.includes(rawTheme as Theme)
    ? (rawTheme as Theme)
    : DEFAULT_PREFS.theme

  const accent = VALID_ACCENTS.includes(rawAccent as AccentKey)
    ? (rawAccent as AccentKey)
    : DEFAULT_PREFS.accent

  const mapStyle = VALID_MAP_STYLES.includes(rawMapStyle as MapStyle)
    ? (rawMapStyle as MapStyle)
    : DEFAULT_PREFS.mapStyle

  const lang = VALID_LANGS.includes(rawLang as Locale)
    ? (rawLang as Locale)
    : DEFAULT_PREFS.lang

  return { theme, accent, mapStyle, lang }
}

export const getPrefs = createIsomorphicFn()
  .client(readPrefsFromDocumentCookie)
  .server((): Prefs => getServerPrefs())

export function setPrefCookie(name: string, value: string): void {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; samesite=lax`
}
