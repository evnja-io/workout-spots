import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Button } from './Button'

test('renders primary variant', () => {
  render(<Button variant="primary">Go</Button>)
  const btn = screen.getByRole('button', { name: 'Go' })
  expect(btn).toHaveAttribute('data-variant', 'primary')
})

test('renders secondary variant', () => {
  render(<Button variant="secondary">Cancel</Button>)
  const btn = screen.getByRole('button', { name: 'Cancel' })
  expect(btn).toHaveAttribute('data-variant', 'secondary')
})

test('defaults to primary variant', () => {
  render(<Button>Default</Button>)
  const btn = screen.getByRole('button', { name: 'Default' })
  expect(btn).toHaveAttribute('data-variant', 'primary')
})

test('merges extra className', () => {
  render(<Button className="extra">Merge</Button>)
  const btn = screen.getByRole('button', { name: 'Merge' })
  expect(btn).toHaveClass('extra')
})

// Regression: the primary variant must not bake in `flex-1`. Growth/sizing is a
// parent-layout decision — hardcoding it stretched buttons in vertical forms and
// caused uneven sizing in mobile sheet button rows (horizontal overflow).
test('primary variant does not force flex-1 growth', () => {
  render(<Button variant="primary">Go</Button>)
  const btn = screen.getByRole('button', { name: 'Go' })
  expect(btn).not.toHaveClass('flex-1')
})
