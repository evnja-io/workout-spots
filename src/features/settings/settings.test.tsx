import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import { SettingsPanel } from './SettingsPanel'
import type { MapStyle } from '~/lib/mapbox/map'

// ── Test helpers ──────────────────────────────────────────────────────────────
function makeI18n(locale: 'en' | 'fr' = 'en') {
  return createI18n(locale)
}

function renderPanel(
  i18n = makeI18n(),
  props: Partial<{ mapStyle: MapStyle; onMapStyleChange: (s: MapStyle) => void }> = {},
) {
  const onClose = () => undefined
  const onMapStyleChange = props.onMapStyleChange ?? (() => undefined)
  const mapStyle: MapStyle = props.mapStyle ?? 'minimal'

  return render(
    <I18nextProvider i18n={i18n}>
      <SettingsPanel
        open={true}
        onClose={onClose}
        mapStyle={mapStyle}
        onMapStyleChange={onMapStyleChange}
      />
    </I18nextProvider>,
  )
}

// ── Setup / teardown ─────────────────────────────────────────────────────────
beforeEach(() => {
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.removeAttribute('style')
  // Clear cookies
  document.cookie = 'theme=; max-age=0; path=/'
  document.cookie = 'accent=; max-age=0; path=/'
  document.cookie = 'lang=; max-age=0; path=/'
  document.cookie = 'mapStyle=; max-age=0; path=/'
})

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('SettingsPanel', () => {
  it('does not render when open=false', () => {
    const i18n = makeI18n()
    render(
      <I18nextProvider i18n={i18n}>
        <SettingsPanel open={false} onClose={() => undefined} mapStyle="minimal" onMapStyleChange={() => undefined} />
      </I18nextProvider>,
    )
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('clicking Dark sets data-theme=dark and cookie theme=dark', () => {
    renderPanel()

    const darkBtn = screen.getByRole('button', { name: /dark/i })
    fireEvent.click(darkBtn)

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.cookie).toContain('theme=dark')
  })

  it('clicking FR sets i18n language to fr', () => {
    const i18n = makeI18n('en')
    renderPanel(i18n)

    const frBtn = screen.getByRole('button', { name: /fr/i })
    fireEvent.click(frBtn)

    expect(i18n.language).toBe('fr')
  })

  it('clicking an accent swatch sets cookie accent=slate', () => {
    renderPanel()

    const slateBtn = screen.getByRole('button', { name: /slate/i })
    fireEvent.click(slateBtn)

    expect(document.cookie).toContain('accent=slate')
  })

  it('clicking Minimal map style calls onMapStyleChange and sets cookie', () => {
    const onMapStyleChange = vi.fn()
    renderPanel(makeI18n(), { onMapStyleChange })

    const minimalBtn = screen.getByRole('button', { name: /minimal/i })
    fireEvent.click(minimalBtn)

    expect(onMapStyleChange).toHaveBeenCalledWith('minimal')
    expect(document.cookie).toContain('mapStyle=minimal')
  })
})
