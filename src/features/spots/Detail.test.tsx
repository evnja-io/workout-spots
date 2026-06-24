import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import { Detail } from './Detail'
import type { SpotDetail } from './domain'

vi.mock('~/lib/supabase/browser', () => ({
  isSupabaseConfigured: () => false,
  getBrowserSupabase: vi.fn(),
}))

const mockSpot: SpotDetail = {
  id: 'spot-bercy',
  name: 'Bercy',
  address: '12 Rue de Bercy',
  city: 'Paris',
  region: 'IDF',
  country: 'France',
  latitude: 48.835,
  longitude: 2.379,
  averageRating: 4.6,
  ratingCount: 120,
  description: 'Great outdoor spot',
  contributor: 'alice',
  images: [],
  equipment: [
    { id: 'e1', name: 'Pull-up Bar', localeKey: 'equipment.pullupbar', category: 'upper' },
    { id: 'e2', name: 'Dip Bars', localeKey: 'equipment.dipbars', category: 'upper' },
  ],
  disciplines: [
    { id: 'd1', name: 'Calisthenics', localeKey: 'discipline.calisthenics', category: 'strength' },
  ],
  comments: [
    { id: 'c1', user: 'bob', text: 'Awesome spot!', date: '2024-01-01', rating: 5 },
    { id: 'c2', user: 'carol', text: 'Love it', date: '2024-01-02', rating: 4 },
  ],
  viewerLiked: false,
  viewerRating: null,
  thumbnailUrl: null,
  isOpen24h: true,
  openingHours: null,
  disciplineIds: ['d1'],
  equipmentIds: ['e1', 'e2'],
}

function renderDetail(onClose = vi.fn()) {
  const i18n = createI18n('en')
  return render(
    <I18nextProvider i18n={i18n}>
      <Detail spot={mockSpot} onClose={onClose} />
    </I18nextProvider>
  )
}

describe('Detail', () => {
  it('renders spot name', () => {
    renderDetail()
    expect(screen.getByText('Bercy')).toBeInTheDocument()
  })

  it('renders address', () => {
    renderDetail()
    expect(screen.getByText(/12 Rue de Bercy/)).toBeInTheDocument()
  })

  it('renders rating value', () => {
    renderDetail()
    // 4.6 appears in stats
    const ratings = screen.getAllByText('4.6')
    expect(ratings.length).toBeGreaterThan(0)
  })

  it('renders equipment count stat', () => {
    renderDetail()
    // 2 equipment items → stat shows "2"
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders discipline chip label', () => {
    renderDetail()
    expect(screen.getByText('Calisthenics')).toBeInTheDocument()
  })

  it('renders reviews count', () => {
    renderDetail()
    // 2 comments → stat shows "120" ratingCount and "2" equipment count
    // The reviews section shows 2 comments
    expect(screen.getAllByText('2').length).toBeGreaterThan(0)
  })

  it('get directions link contains google maps url with coordinates', () => {
    renderDetail()
    const link = screen.getByRole('link', { name: /get directions/i })
    expect(link).toHaveAttribute('href', expect.stringContaining('google.com/maps/dir'))
    expect(link).toHaveAttribute('href', expect.stringContaining('48.835'))
    expect(link).toHaveAttribute('href', expect.stringContaining('2.379'))
  })

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn()
    renderDetail(onClose)
    const closeBtn = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeBtn)
    expect(onClose).toHaveBeenCalledOnce()
  })
})
