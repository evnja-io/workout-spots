import { useState, type ReactNode } from 'react'
import { Rail } from '~/features/spots/Rail'
import { SettingsPanel } from '~/features/settings/SettingsPanel'
import { getPrefs } from '~/features/settings/prefs'
import type { MapStyle } from '~/lib/mapbox/map'
import { SectionBottomNav } from './SectionBottomNav'

/**
 * App chrome for the dedicated, scrollable sections (Clubs, Events): the Rail on
 * desktop, a section bottom nav on mobile, and the global SettingsPanel. The spots
 * route keeps its own map-specific layout; this shell is for everything else.
 *
 * Settings is a global preference surface (theme/accent/language/map style) — we
 * hold the map-style here so the panel works the same as it does on the map.
 */
export function SectionShell({ children }: { children: ReactNode }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [mapStyle, setMapStyle] = useState<MapStyle>(() => getPrefs().mapStyle)

  return (
    <div className="h-screen overflow-hidden bg-bg md:grid md:grid-cols-[64px_1fr]">
      <Rail onOpenSettings={() => setSettingsOpen(true)} />

      <main className="min-h-0 overflow-y-auto pb-[calc(56px+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </main>

      <SectionBottomNav onOpenSettings={() => setSettingsOpen(true)} />

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        mapStyle={mapStyle}
        onMapStyleChange={setMapStyle}
      />
    </div>
  )
}
