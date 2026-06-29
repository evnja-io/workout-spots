import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import { CategoryChip, PrivacyBadge, RoleBadge } from './badges'

const i18n = createI18n('en')
const wrap = (ui: React.ReactNode) => render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>)

describe('club badges', () => {
  it('labels public and private clubs', () => {
    const { rerender } = wrap(<PrivacyBadge privacy="public" />)
    expect(screen.getByText('Public')).toBeInTheDocument()
    rerender(
      <I18nextProvider i18n={i18n}>
        <PrivacyBadge privacy="private" />
      </I18nextProvider>,
    )
    expect(screen.getByText('Private')).toBeInTheDocument()
  })

  it('renders the category chip', () => {
    wrap(<CategoryChip category="Calisthenics" />)
    expect(screen.getByText('Calisthenics')).toBeInTheDocument()
  })

  it('renders nothing for an empty category', () => {
    const { container } = wrap(<CategoryChip category="" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('labels each role', () => {
    const { rerender } = wrap(<RoleBadge role="owner" />)
    expect(screen.getByText('Owner')).toBeInTheDocument()
    rerender(
      <I18nextProvider i18n={i18n}>
        <RoleBadge role="moderator" />
      </I18nextProvider>,
    )
    expect(screen.getByText('Moderator')).toBeInTheDocument()
    rerender(
      <I18nextProvider i18n={i18n}>
        <RoleBadge role="member" />
      </I18nextProvider>,
    )
    expect(screen.getByText('Member')).toBeInTheDocument()
  })
})
