import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import { ErrorState } from './ErrorState'

const i18n = createI18n('en')

function renderErrorState(props: Parameters<typeof ErrorState>[0]) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ErrorState {...props} />
    </I18nextProvider>,
  )
}

describe('ErrorState', () => {
  it('renders title and message', () => {
    renderErrorState({ title: 'Oops', message: 'Something failed' })
    expect(screen.getByText('Oops')).toBeInTheDocument()
    expect(screen.getByText('Something failed')).toBeInTheDocument()
  })

  it('does not render Retry button when onRetry is undefined', () => {
    renderErrorState({ title: 'Oops', message: 'Error' })
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('renders Retry button and calls onRetry when clicked', async () => {
    const onRetry = vi.fn()
    renderErrorState({ title: 'Oops', message: 'Error', onRetry })
    const btn = screen.getByRole('button', { name: /retry/i })
    expect(btn).toBeInTheDocument()
    await userEvent.click(btn)
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
