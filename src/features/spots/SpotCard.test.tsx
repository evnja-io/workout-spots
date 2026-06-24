import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SpotCard } from './SpotCard'
import type { SpotListItem } from './domain'

const bercy: SpotListItem = {
  id: 'spot-1',
  name: 'Bercy Bars',
  city: 'Paris',
  address: '2 Rue de Bercy',
  latitude: 48.84,
  longitude: 2.38,
  isOpen24h: true,
  averageRating: 4.8,
  ratingCount: 42,
  disciplineIds: ['di-1'],
  equipmentIds: ['eq-1', 'eq-2'],
  thumbnailUrl: null,
}

describe('SpotCard', () => {
  it('renders name, rating, city, and 24/7 tag', () => {
    render(<SpotCard spot={bercy} active={false} onClick={vi.fn()} />)
    expect(screen.getByText('Bercy Bars')).toBeInTheDocument()
    expect(screen.getByText('4.8')).toBeInTheDocument()
    expect(screen.getByText('Paris')).toBeInTheDocument()
    expect(screen.getByText('24/7')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<SpotCard spot={bercy} active={false} onClick={onClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('adds active class when active=true', () => {
    render(<SpotCard spot={bercy} active={true} onClick={vi.fn()} />)
    expect(screen.getByRole('button')).toHaveClass('active')
  })

  it('does NOT have active class when active=false', () => {
    render(<SpotCard spot={bercy} active={false} onClick={vi.fn()} />)
    expect(screen.getByRole('button')).not.toHaveClass('active')
  })
})
