import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import type { RsvpView } from '../eventState'
import { RSVPControl } from './RSVPControl'

const i18n = createI18n('en')

function renderControl(view: RsvpView, over: Partial<React.ComponentProps<typeof RSVPControl>> = {}) {
  const handlers = {
    onPrimary: vi.fn(),
    onCancel: vi.fn(),
    onInterest: vi.fn(),
  }
  render(
    <I18nextProvider i18n={i18n}>
      <RSVPControl
        view={view}
        interested={false}
        pending={false}
        {...handlers}
        {...over}
      />
    </I18nextProvider>,
  )
  return handlers
}

describe('RSVPControl', () => {
  it('renders the participate action and interest toggle', async () => {
    const h = renderControl('participate')
    const primary = screen.getByRole('button', { name: /participate/i })
    await userEvent.click(primary)
    expect(h.onPrimary).toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: /interested/i }))
    expect(h.onInterest).toHaveBeenCalled()
  })

  it('renders the request action when approval is required', () => {
    renderControl('request')
    expect(screen.getByRole('button', { name: /request to join/i })).toBeInTheDocument()
  })

  it('renders the going status with a cancel action', async () => {
    const h = renderControl('going')
    expect(screen.getByText("You're going")).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /cancel rsvp/i }))
    expect(h.onCancel).toHaveBeenCalled()
  })

  it('renders a closed notice with no actions', () => {
    renderControl('closed')
    expect(screen.getByText('Registration is closed')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders the waitlist status', () => {
    renderControl('on-waitlist')
    expect(screen.getByText("You're on the waitlist")).toBeInTheDocument()
  })
})
