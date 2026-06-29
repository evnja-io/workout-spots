import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import { CapacityMeter } from './CapacityMeter'

const i18n = createI18n('en')
const renderMeter = (props: React.ComponentProps<typeof CapacityMeter>) =>
  render(
    <I18nextProvider i18n={i18n}>
      <CapacityMeter {...props} />
    </I18nextProvider>,
  )

describe('CapacityMeter', () => {
  it('shows the going / max count and spots left', () => {
    renderMeter({ goingCount: 8, maxParticipants: 20, minParticipants: 1 })
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('/ 20')).toBeInTheDocument()
    expect(screen.getByText('12 spots left')).toBeInTheDocument()
  })

  it('reports a full event', () => {
    renderMeter({ goingCount: 20, maxParticipants: 20, minParticipants: 1 })
    expect(screen.getByText('Event full')).toBeInTheDocument()
  })

  it('shows the minimum-reached hint once the floor is met', () => {
    renderMeter({ goingCount: 6, maxParticipants: 20, minParticipants: 5 })
    expect(screen.getByText('Minimum reached')).toBeInTheDocument()
  })

  it('falls back to a plain count when capacity is unbounded', () => {
    renderMeter({ goingCount: 3, maxParticipants: null, minParticipants: 1 })
    expect(screen.getByText('3 going')).toBeInTheDocument()
  })
})
