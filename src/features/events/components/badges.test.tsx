import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import type { EventTag } from '../domain'
import { EvTag, PriceBadge, StatusBadge } from './badges'

const i18n = createI18n('en')
const wrap = (ui: React.ReactNode) => render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>)

describe('event badges', () => {
  it('renders the live badge for ongoing events on a cover', () => {
    wrap(<StatusBadge status="ongoing" onCover />)
    expect(screen.getByText('Live now')).toBeInTheDocument()
  })

  it('renders nothing for an upcoming event on a cover (date stub carries it)', () => {
    const { container } = wrap(<StatusBadge status="upcoming" onCover />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders a free price badge', () => {
    wrap(<PriceBadge isFree amount={null} currency="EUR" onCover />)
    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('renders a paid price with the currency symbol', () => {
    wrap(<PriceBadge isFree={false} amount={12} currency="EUR" onCover />)
    expect(screen.getByText('€12')).toBeInTheDocument()
  })

  it('renders a tag label', () => {
    const tag: EventTag = { id: 't1', name: 'Outdoor', nameFr: 'Plein air', color: '#22c55e', icon: null }
    wrap(<EvTag tag={tag} />)
    expect(screen.getByText('Outdoor')).toBeInTheDocument()
  })
})
