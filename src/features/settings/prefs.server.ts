import { getCookies } from '@tanstack/react-start/server'
import type { Prefs } from './prefs'
import { VALID_THEMES, VALID_ACCENTS, VALID_MAP_STYLES, VALID_LANGS } from './prefs'

export function getServerPrefs(): Prefs {
  const cookies = getCookies()

  const theme = VALID_THEMES.includes(cookies['theme'] as Prefs['theme'])
    ? (cookies['theme'] as Prefs['theme'])
    : 'light'

  const accent = VALID_ACCENTS.includes(cookies['accent'] as Prefs['accent'])
    ? (cookies['accent'] as Prefs['accent'])
    : 'violet'

  const mapStyle = VALID_MAP_STYLES.includes(cookies['mapStyle'] as Prefs['mapStyle'])
    ? (cookies['mapStyle'] as Prefs['mapStyle'])
    : 'light'

  const lang = VALID_LANGS.includes(cookies['lang'] as Prefs['lang'])
    ? (cookies['lang'] as Prefs['lang'])
    : 'en'

  return { theme, accent, mapStyle, lang }
}
