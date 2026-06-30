import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import { Composer } from './Composer'

const i18n = createI18n('en')

function renderComposer(onSubmit = vi.fn()) {
  render(
    <I18nextProvider i18n={i18n}>
      <Composer pending={false} placeholder="Share something" onSubmit={onSubmit} />
    </I18nextProvider>,
  )
  return { onSubmit }
}

describe('Composer', () => {
  it('submits text-only posts with null media', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderComposer()

    await user.type(screen.getByPlaceholderText('Share something'), 'hello world')
    await user.click(screen.getByRole('button', { name: 'Post' }))

    expect(onSubmit).toHaveBeenCalledWith('hello world', null)
  })

  it('selecting Poll shows two option rows, bounded 2–6', async () => {
    const user = userEvent.setup()
    renderComposer()

    await user.click(screen.getByRole('button', { name: 'Poll' }))
    expect(screen.getByPlaceholderText('Option 1')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Option 2')).toBeInTheDocument()
    // No remove buttons at the minimum of 2.
    expect(screen.queryByRole('button', { name: 'Remove option' })).not.toBeInTheDocument()

    // Add up to 6, then the add button disappears.
    const add = screen.getByRole('button', { name: /add option/i })
    await user.click(add)
    await user.click(add)
    await user.click(add)
    await user.click(add)
    expect(screen.getByPlaceholderText('Option 6')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /add option/i })).not.toBeInTheDocument()
  })

  it('submits a poll media block', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderComposer()

    await user.click(screen.getByRole('button', { name: 'Poll' }))
    await user.type(screen.getByPlaceholderText('Option 1'), 'Cats')
    await user.type(screen.getByPlaceholderText('Option 2'), 'Dogs')
    await user.click(screen.getByRole('button', { name: 'Post' }))

    expect(onSubmit).toHaveBeenCalledWith('', {
      kind: 'poll',
      options: ['Cats', 'Dogs'],
      closesAt: null,
    })
  })

  it('media blocks are mutually exclusive (video replaces poll)', async () => {
    const user = userEvent.setup()
    renderComposer()

    await user.click(screen.getByRole('button', { name: 'Poll' }))
    expect(screen.getByPlaceholderText('Option 1')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Video' }))
    expect(screen.queryByPlaceholderText('Option 1')).not.toBeInTheDocument()
    expect(screen.getByPlaceholderText('Paste a YouTube link')).toBeInTheDocument()
  })

  it('validates the YouTube url and submits a video media block', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderComposer()

    await user.click(screen.getByRole('button', { name: 'Video' }))
    const input = screen.getByPlaceholderText('Paste a YouTube link')

    await user.type(input, 'nonsense')
    expect(screen.getByText(/doesn't look like a YouTube link/i)).toBeInTheDocument()
    // Submit stays disabled while the url is invalid and there's no text.
    expect(screen.getByRole('button', { name: 'Post' })).toBeDisabled()

    await user.clear(input)
    await user.type(input, 'https://youtu.be/dQw4w9WgXcQ')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Post' })).toBeEnabled())

    await user.click(screen.getByRole('button', { name: 'Post' }))
    expect(onSubmit).toHaveBeenCalledWith('', {
      kind: 'video',
      url: 'https://youtu.be/dQw4w9WgXcQ',
    })
  })
})
