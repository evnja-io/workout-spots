import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AvatarStack, type StackPerson } from './AvatarStack'

const people: StackPerson[] = [
  { id: '1', name: 'Ada Lovelace', avatarUrl: null },
  { id: '2', name: 'Grace Hopper', avatarUrl: null },
  { id: '3', name: 'Alan Turing', avatarUrl: null },
  { id: '4', name: 'Edsger Dijkstra', avatarUrl: null },
  { id: '5', name: 'Barbara Liskov', avatarUrl: null },
]

describe('AvatarStack', () => {
  it('renders up to `max` avatars and a +N overflow bubble', () => {
    render(<AvatarStack people={people} max={3} />)
    // Initials fallback for the first three.
    expect(screen.getByTitle('Ada Lovelace')).toHaveTextContent('AL')
    expect(screen.getByTitle('Grace Hopper')).toBeInTheDocument()
    expect(screen.getByTitle('Alan Turing')).toBeInTheDocument()
    // Fourth/fifth collapse into "+2".
    expect(screen.queryByTitle('Edsger Dijkstra')).not.toBeInTheDocument()
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('uses `total` for the overflow count when given', () => {
    render(<AvatarStack people={people.slice(0, 2)} total={42} max={3} />)
    // 2 shown, total 42 → +40
    expect(screen.getByText('+40')).toBeInTheDocument()
  })

  it('omits the overflow bubble when everything fits', () => {
    render(<AvatarStack people={people.slice(0, 2)} max={3} />)
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument()
  })

  it('renders a trailing label', () => {
    render(<AvatarStack people={people.slice(0, 1)} label={<span>12 going</span>} />)
    expect(screen.getByText('12 going')).toBeInTheDocument()
  })

  it('applies a white ring over posters and a surface ring otherwise', () => {
    const { rerender } = render(<AvatarStack people={people.slice(0, 1)} onPoster />)
    expect(screen.getByTitle('Ada Lovelace')).toHaveClass('ring-white/90')
    rerender(<AvatarStack people={people.slice(0, 1)} />)
    expect(screen.getByTitle('Ada Lovelace')).toHaveClass('ring-surface')
  })
})
