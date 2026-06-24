import { z } from 'zod'

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z.string().max(1000).default(''),
})

export type ReviewInput = z.input<typeof reviewSchema>
export type ReviewParsed = z.infer<typeof reviewSchema>
