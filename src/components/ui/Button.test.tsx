import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Button } from './Button'

test('has btn and btn-primary classes', () => {
  render(<Button variant="primary">Go</Button>)
  const btn = screen.getByRole('button', { name: 'Go' })
  expect(btn).toHaveClass('btn')
  expect(btn).toHaveClass('btn-primary')
})

test('has btn-secondary class when variant is secondary', () => {
  render(<Button variant="secondary">Cancel</Button>)
  const btn = screen.getByRole('button', { name: 'Cancel' })
  expect(btn).toHaveClass('btn')
  expect(btn).toHaveClass('btn-secondary')
})

test('defaults to primary variant', () => {
  render(<Button>Default</Button>)
  const btn = screen.getByRole('button', { name: 'Default' })
  expect(btn).toHaveClass('btn-primary')
})

test('merges extra className', () => {
  render(<Button className="extra">Merge</Button>)
  const btn = screen.getByRole('button', { name: 'Merge' })
  expect(btn).toHaveClass('extra')
  expect(btn).toHaveClass('btn')
})
