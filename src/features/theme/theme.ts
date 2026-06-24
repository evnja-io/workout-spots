export type Theme = 'light' | 'dark'
export type AccentKey = 'violet' | 'slate' | 'emerald' | 'rose'
type Palette = { accent: string; accent2: string; soft: string; softer: string; fg: string }

export const ACCENTS: Record<AccentKey, Record<Theme, Palette>> = {
  violet: {
    light: {
      accent: '#4C1D95',
      accent2: '#6D28D9',
      soft: '#EDE9FE',
      softer: '#F5F3FF',
      fg: '#FFFFFF',
    },
    dark: {
      accent: '#A78BFA',
      accent2: '#8B5CF6',
      soft: '#2A1F4A',
      softer: '#1B1633',
      fg: '#0B0D10',
    },
  },
  slate: {
    light: {
      accent: '#1E293B',
      accent2: '#334155',
      soft: '#E2E8F0',
      softer: '#F1F5F9',
      fg: '#FFFFFF',
    },
    dark: {
      accent: '#E2E8F0',
      accent2: '#CBD5E1',
      soft: '#1E293B',
      softer: '#0F172A',
      fg: '#0B0D10',
    },
  },
  emerald: {
    light: {
      accent: '#065F46',
      accent2: '#047857',
      soft: '#D1FAE5',
      softer: '#ECFDF5',
      fg: '#FFFFFF',
    },
    dark: {
      accent: '#34D399',
      accent2: '#10B981',
      soft: '#0F2E22',
      softer: '#09201A',
      fg: '#0B0D10',
    },
  },
  rose: {
    light: {
      accent: '#9F1239',
      accent2: '#BE123C',
      soft: '#FFE4E6',
      softer: '#FFF1F2',
      fg: '#FFFFFF',
    },
    dark: {
      accent: '#FB7185',
      accent2: '#F43F5E',
      soft: '#3B1522',
      softer: '#260E18',
      fg: '#0B0D10',
    },
  },
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}
export function applyAccent(key: AccentKey, theme: Theme): void {
  const a = ACCENTS[key][theme]
  const r = document.documentElement.style
  r.setProperty('--accent', a.accent)
  r.setProperty('--accent-2', a.accent2)
  r.setProperty('--accent-soft', a.soft)
  r.setProperty('--accent-softer', a.softer)
  r.setProperty('--accent-fg', a.fg)
}
