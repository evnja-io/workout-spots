import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { Switch } from './Switch'

test('clicking toggles calls onChange with true when off', async () => {
  const fn = vi.fn()
  render(<Switch on={false} onChange={fn} />)
  await userEvent.click(screen.getByRole('switch'))
  expect(fn).toHaveBeenCalledWith(true)
})

test('clicking toggles calls onChange with false when on', async () => {
  const fn = vi.fn()
  render(<Switch on={true} onChange={fn} />)
  await userEvent.click(screen.getByRole('switch'))
  expect(fn).toHaveBeenCalledWith(false)
})

test('has aria-checked reflecting on prop', () => {
  render(<Switch on={true} onChange={vi.fn()} />)
  expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
})

test('aria-label is set when label provided', () => {
  render(<Switch on={false} onChange={vi.fn()} label="Dark mode" />)
  expect(screen.getByRole('switch')).toHaveAttribute('aria-label', 'Dark mode')
})
