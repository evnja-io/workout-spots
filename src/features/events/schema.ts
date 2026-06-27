import { z } from 'zod'

export const eventLocationInput = z.object({
  locationId: z.string(),
  name: z.string(),
  city: z.string().default(''),
  isPrimary: z.boolean(),
  note: z.string().default(''),
})

export const createEventSchema = z
  .object({
    title: z.string().min(3).max(100),
    description: z.string().max(2000).default(''),
    // ISO instants (already converted from the form's datetime-local inputs).
    startsAt: z.string().min(1),
    endsAt: z.string().min(1),
    timezone: z.string().default('UTC'),
    locations: z.array(eventLocationInput).min(1),
    minParticipants: z.number().int().min(1).default(1),
    maxParticipants: z.number().int().min(1).nullable().default(null),
    registrationDeadline: z.string().nullable().default(null),
    isFree: z.boolean(),
    priceAmount: z.number().nullable().default(null),
    priceCurrency: z.string().default('EUR'),
    visibility: z.enum(['public', 'private', 'club_only']),
    clubId: z.string().nullable().default(null),
    requiresApproval: z.boolean().default(false),
    organizerName: z.string().default(''),
    organizerContact: z.string().default(''),
    tagIds: z.array(z.string()).default([]),
  })
  .refine((d) => new Date(d.endsAt) > new Date(d.startsAt), {
    path: ['endsAt'],
    message: 'End must be after start',
  })
  .refine((d) => (d.isFree ? d.priceAmount == null : d.priceAmount != null && d.priceAmount > 0), {
    path: ['priceAmount'],
    message: 'Paid events need a price',
  })
  .refine((d) => d.visibility !== 'club_only' || d.clubId != null, {
    path: ['clubId'],
    message: 'Club-only events need a club',
  })
  .refine((d) => d.locations.some((l) => l.isPrimary), {
    path: ['locations'],
    message: 'Pick a primary location',
  })

export type CreateEventInput = z.input<typeof createEventSchema>
export type CreateEventParsed = z.infer<typeof createEventSchema>
export type EventLocationInput = z.infer<typeof eventLocationInput>
