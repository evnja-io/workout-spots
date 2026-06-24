import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Chip } from './Chip'

test('active adds active class and sets aria-pressed', () => {
  render(<Chip active>Filter</Chip>)
  const btn = screen.getByRole('button', { name: 'Filter' })
  expect(btn).toHaveClass('active')
  expect(btn).toHaveAttribute('aria-pressed', 'true')
})

test('inactive does not have active class and aria-pressed is false', () => {
  render(<Chip active={false}>Filter</Chip>)
  const btn = screen.getByRole('button', { name: 'Filter' })
  expect(btn).not.toHaveClass('active')
  expect(btn).toHaveAttribute('aria-pressed', 'false')
})

test('has chip class', () => {
  render(<Chip>Label</Chip>)
  const btn = screen.getByRole('button', { name: 'Label' })
  expect(btn).toHaveClass('chip')
})
