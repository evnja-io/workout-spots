import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Chip } from './Chip'

test('active sets data-active and aria-pressed', () => {
  render(<Chip active>Filter</Chip>)
  const btn = screen.getByRole('button', { name: 'Filter' })
  expect(btn).toHaveAttribute('data-active', 'true')
  expect(btn).toHaveAttribute('aria-pressed', 'true')
})

test('inactive omits data-active and aria-pressed is false', () => {
  render(<Chip active={false}>Filter</Chip>)
  const btn = screen.getByRole('button', { name: 'Filter' })
  expect(btn).not.toHaveAttribute('data-active')
  expect(btn).toHaveAttribute('aria-pressed', 'false')
})

test('renders as a button', () => {
  render(<Chip>Label</Chip>)
  expect(screen.getByRole('button', { name: 'Label' })).toBeInTheDocument()
})
