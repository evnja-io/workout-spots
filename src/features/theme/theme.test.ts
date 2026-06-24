import { describe, expect, it, beforeEach } from 'vitest'
import { ACCENTS, applyAccent, applyTheme } from './theme'

describe('theme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.removeAttribute('style')
  })
  it('sets data-theme', () => {
    applyTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
  it('sets accent css vars', () => {
    applyAccent('violet', 'dark')
    expect(document.documentElement.style.getPropertyValue('--accent')).toBe(
      ACCENTS.violet.dark.accent,
    )
  })
})
