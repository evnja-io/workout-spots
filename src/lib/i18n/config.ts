import i18next, { type i18n } from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import fr from './fr.json'

export type Locale = 'en' | 'fr'
export const LOCALES: Locale[] = ['en', 'fr']

export function createI18n(locale: Locale): i18n {
  const instance = i18next.createInstance()
  void instance.use(initReactI18next).init({
    lng: locale,
    fallbackLng: 'en',
    resources: { en: { translation: en }, fr: { translation: fr } },
    interpolation: { escapeValue: false },
  })
  return instance
}
