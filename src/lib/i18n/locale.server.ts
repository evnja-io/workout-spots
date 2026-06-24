import { getCookies } from '@tanstack/react-start/server'
import type { Locale } from './config'

export function getServerLocale(): Locale {
  const cookies = getCookies()
  const value = cookies['lang']
  return value === 'fr' ? 'fr' : 'en'
}
