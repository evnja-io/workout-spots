import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '~/lib/i18n/config'
import type { EventListItem } from '../domain'
import { EventCard } from './EventCard'

const i18n = createI18n('en')

function makeEvent(over: Partial<EventListItem> = {}): EventListItem {
  return {
    id: 'e1',
    title: 'Sunrise Calisthenics',
    startsAt: '2026-07-01T07:00:00Z',
    endsAt: '2026-07-01T08:30:00Z',
    timezone: 'Europe/Paris',
    isFree: true,
    priceAmount: null,
    priceCurrency: 'EUR',
    status: 'upcoming',
    maxParticipants: 20,
    goingCount: 8,
    primaryLocationName: 'Parc Montsouris',
    clubId: null,
    featuredImageUrl: null,
    tags: [],
    sampleAttendees: [
      { id: 'u1', name: 'Ada Lovelace', avatarUrl: null },
      { id: 'u2', name: 'Grace Hopper', avatarUrl: null },
    ],
    ...over,
  }
}

function renderCard(event: EventListItem, variant?: 'feed' | 'rail' | 'spot') {
  const onOpen = vi.fn()
  render(
    <I18nextProvider i18n={i18n}>
      <EventCard event={event} onOpen={onOpen} variant={variant} />
    </I18nextProvider>,
  )
  return { onOpen }
}

describe('EventCard', () => {
  it('renders the title, location and going label', () => {
    renderCard(makeEvent())
    expect(screen.getByText('Sunrise Calisthenics')).toBeInTheDocument()
    expect(screen.getByText('Parc Montsouris')).toBeInTheDocument()
    expect(screen.getByText('8 going')).toBeInTheDocument()
  })

  it('shows "Be the first to go" when nobody is going', () => {
    renderCard(makeEvent({ goingCount: 0, sampleAttendees: [] }))
    expect(screen.getByText('Be the first to go')).toBeInTheDocument()
  })

  it('opens on click', () => {
    const event = makeEvent()
    const { onOpen } = renderCard(event)
    screen.getByRole('button').click()
    expect(onOpen).toHaveBeenCalledWith('e1')
  })

  it('shows an RSVP CTA for upcoming events', () => {
    renderCard(makeEvent({ status: 'upcoming', goingCount: 1, maxParticipants: 20 }))
    expect(screen.getByText('RSVP')).toBeInTheDocument()
  })

  it('shows "Join now" for ongoing events', () => {
    renderCard(makeEvent({ status: 'ongoing' }))
    expect(screen.getByText('Join now')).toBeInTheDocument()
  })

  it('shows "Waitlist" when full', () => {
    renderCard(makeEvent({ status: 'upcoming', goingCount: 20, maxParticipants: 20 }))
    expect(screen.getByText('Waitlist')).toBeInTheDocument()
  })

  it('shows no CTA for a cancelled event', () => {
    renderCard(makeEvent({ status: 'cancelled' }))
    expect(screen.queryByText('RSVP')).not.toBeInTheDocument()
    expect(screen.queryByText('Recap')).not.toBeInTheDocument()
  })
})
