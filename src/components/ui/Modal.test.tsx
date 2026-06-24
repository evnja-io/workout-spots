import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { Modal } from './Modal'

test('renders nothing when open=false', () => {
  const { container } = render(
    <Modal open={false} onClose={vi.fn()}>
      <p>Content</p>
    </Modal>,
  )
  expect(container.firstChild).toBeNull()
})

test('renders dialog when open=true', () => {
  render(
    <Modal open={true} onClose={vi.fn()}>
      <p>Content</p>
    </Modal>,
  )
  expect(screen.getByRole('dialog')).toBeInTheDocument()
})

test('pressing Escape calls onClose', async () => {
  const onClose = vi.fn()
  render(
    <Modal open={true} onClose={onClose}>
      <p>Content</p>
    </Modal>,
  )
  await userEvent.keyboard('{Escape}')
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('clicking backdrop calls onClose', async () => {
  const onClose = vi.fn()
  const { container } = render(
    <Modal open={true} onClose={onClose}>
      <p>Content</p>
    </Modal>,
  )
  // Click the backdrop (first element in portal, which is modal-backdrop)
  const backdrop = container.ownerDocument.querySelector('.modal-backdrop')
  if (backdrop) {
    await userEvent.click(backdrop)
  }
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('clicking modal body does not call onClose', async () => {
  const onClose = vi.fn()
  render(
    <Modal open={true} onClose={onClose}>
      <p>Inner content</p>
    </Modal>,
  )
  await userEvent.click(screen.getByText('Inner content'))
  expect(onClose).not.toHaveBeenCalled()
})
