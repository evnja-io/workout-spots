import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import type { ClubListItem } from '../domain'
import { ClubCard } from './ClubCard'

const i18n = createI18n('en')

function makeClub(over: Partial<ClubListItem> = {}): ClubListItem {
  return {
    id: 'c1',
    name: 'Dawn Patrol',
    category: 'Calisthenics',
    privacy: 'public',
    coverImageUrl: null,
    memberCount: 24,
    spotCount: 3,
    tags: ['outdoor', 'beginner'],
    sampleMembers: [
      { id: 'u1', name: 'Ada Lovelace', avatarUrl: null },
      { id: 'u2', name: 'Grace Hopper', avatarUrl: null },
    ],
    ...over,
  }
}

function renderCard(club: ClubListItem) {
  const onOpen = vi.fn()
  render(
    <I18nextProvider i18n={i18n}>
      <ClubCard club={club} onOpen={onOpen} />
    </I18nextProvider>,
  )
  return { onOpen }
}

describe('ClubCard', () => {
  it('renders name, member count and spot count', () => {
    renderCard(makeClub())
    expect(screen.getByText('Dawn Patrol')).toBeInTheDocument()
    expect(screen.getByText('24 members')).toBeInTheDocument()
    expect(screen.getByText('3 spots')).toBeInTheDocument()
  })

  it('shows a Join CTA and Public badge for public clubs', () => {
    renderCard(makeClub({ privacy: 'public' }))
    expect(screen.getByText('Join')).toBeInTheDocument()
    expect(screen.getByText('Public')).toBeInTheDocument()
  })

  it('shows a Request CTA and Private badge for private clubs', () => {
    renderCard(makeClub({ privacy: 'private' }))
    expect(screen.getByText('Request')).toBeInTheDocument()
    expect(screen.getByText('Private')).toBeInTheDocument()
  })

  it('opens on click', () => {
    const { onOpen } = renderCard(makeClub())
    screen.getByRole('button').click()
    expect(onOpen).toHaveBeenCalledWith('c1')
  })
})
