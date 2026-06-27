import { z } from 'zod'

export const createClubSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).default(''),
  category: z.string().min(1).max(50),
  privacy: z.enum(['public', 'private']),
  rules: z.string().max(1000).default(''),
  linkedSpotIds: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
})

export type CreateClubInput = z.input<typeof createClubSchema>
export type CreateClubParsed = z.infer<typeof createClubSchema>
