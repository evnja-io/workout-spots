import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { Stars } from './Stars'

test('interactive stars report clicked value (index 2 → value 3)', async () => {
  const fn = vi.fn()
  render(<Stars value={0} interactive onChange={fn} />)
  await userEvent.click(screen.getAllByRole('button')[2]!)
  expect(fn).toHaveBeenCalledWith(3)
})

test('non-interactive renders no buttons', () => {
  render(<Stars value={3} />)
  expect(screen.queryAllByRole('button')).toHaveLength(0)
})

test('interactive renders 5 buttons', () => {
  render(<Stars value={0} interactive onChange={vi.fn()} />)
  expect(screen.getAllByRole('button')).toHaveLength(5)
})

test('buttons have correct aria-labels', () => {
  render(<Stars value={0} interactive onChange={vi.fn()} />)
  const buttons = screen.getAllByRole('button')
  expect(buttons[0]).toHaveAttribute('aria-label', 'Rate 1')
  expect(buttons[4]).toHaveAttribute('aria-label', 'Rate 5')
})
