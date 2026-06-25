import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import { Filters } from './Filters'
import type { Discipline, Equipment } from './domain'
import type { SpotSearch } from './filters'

const i18n = createI18n('en')

const defaultSearch: SpotSearch = {
  q: '',
  disciplines: [],
  equipment: [],
  open24h: false,
  sort: 'rating',
}

const discipline: Discipline = {
  id: 'di-1',
  name: 'Calisthenics',
  localeKey: 'discipline.calisthenics',
  category: 'x',
}

const equipment: Equipment[] = []

function renderFilters(
  search: SpotSearch = defaultSearch,
  overrides: Partial<{
    onToggleDiscipline: (id: string) => void
    onToggleEquipment: (id: string) => void
    onToggle24h: () => void
    onSortChange: (s: SpotSearch['sort']) => void
  }> = {},
) {
  const props = {
    search,
    disciplines: [discipline],
    equipment,
    onToggleDiscipline: vi.fn(),
    onToggleEquipment: vi.fn(),
    onToggle24h: vi.fn(),
    onSortChange: vi.fn(),
    ...overrides,
  }
  return { ...render(<I18nextProvider i18n={i18n}><Filters {...props} /></I18nextProvider>), props }
}

describe('Filters', () => {
  it('renders the discipline chip', () => {
    renderFilters()
    expect(screen.getByRole('button', { name: /calisthenics/i })).toBeInTheDocument()
  })

  it('calls onToggleDiscipline with the discipline id when chip is clicked', async () => {
    const onToggleDiscipline = vi.fn()
    renderFilters(defaultSearch, { onToggleDiscipline })
    await userEvent.click(screen.getByRole('button', { name: /calisthenics/i }))
    expect(onToggleDiscipline).toHaveBeenCalledWith('di-1')
  })

  it('marks the chip as active when discipline is in search.disciplines', () => {
    renderFilters({ ...defaultSearch, disciplines: ['di-1'] })
    const chip = screen.getByRole('button', { name: /calisthenics/i })
    expect(chip).toHaveAttribute('aria-pressed', 'true')
  })

  it('collapses long lists to a preview and expands on "show more"', async () => {
    const many: Discipline[] = Array.from({ length: 10 }, (_, i) => ({
      id: `d-${i}`,
      name: `Discipline ${i}`,
      localeKey: `discipline.d${i}`,
      category: 'x',
    }))
    render(
      <I18nextProvider i18n={i18n}>
        <Filters
          search={defaultSearch}
          disciplines={many}
          equipment={[]}
          onToggleDiscipline={vi.fn()}
          onToggleEquipment={vi.fn()}
          onToggle24h={vi.fn()}
          onSortChange={vi.fn()}
        />
      </I18nextProvider>,
    )
    // Collapsed: only the first 6 chips render, the rest are hidden behind "+4 more".
    expect(screen.getByRole('button', { name: 'Discipline 0' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Discipline 9' })).not.toBeInTheDocument()
    const toggle = screen.getByRole('button', { name: /\+4 more/i })

    await userEvent.click(toggle)
    expect(screen.getByRole('button', { name: 'Discipline 9' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /show less/i })).toBeInTheDocument()
  })
})
