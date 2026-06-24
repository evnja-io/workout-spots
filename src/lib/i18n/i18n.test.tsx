import { expect, test } from 'vitest'
import { createI18n } from './config'

test('resolves english and french title', () => {
  expect(createI18n('en').t('discover.title')).toBe('Discover')
  expect(createI18n('fr').t('discover.title')).toBe('Découvrir')
})
