import { z } from 'zod'

// ── Schema ────────────────────────────────────────────────────────────────────

export const addSpotSchema = z.object({
  position: z.object({ lng: z.number(), lat: z.number() }),
  address: z.string().min(1),
  city: z.string().default(''),
  region: z.string().default(''),
  country: z.string().default(''),
  name: z.string().min(1),
  description: z.string().min(1),
  isOpen24h: z.boolean().default(false),
  disciplines: z.array(z.string()).min(1),
  equipment: z.array(z.string()).default([]),
})

export type AddSpotInput = z.input<typeof addSpotSchema>
export type AddSpotParsed = z.infer<typeof addSpotSchema>

// ── Partial schemas for per-step validation ───────────────────────────────────

const step0Schema = z.object({
  position: z.object({ lng: z.number(), lat: z.number() }),
  address: z.string().min(1),
})

const step1Schema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
})

const step2Schema = z.object({
  disciplines: z.array(z.string()).min(1),
})

// ── Per-step canAdvance helpers (pure, testable) ───────────────────────────────

export function canAdvanceStep0(values: Partial<AddSpotInput>): boolean {
  return step0Schema.safeParse(values).success
}

export function canAdvanceStep1(values: Partial<AddSpotInput>): boolean {
  return step1Schema.safeParse(values).success
}

export function canAdvanceStep2(values: Partial<AddSpotInput>): boolean {
  return step2Schema.safeParse(values).success
}

export function canAdvanceStep3(values: Partial<AddSpotInput>): boolean {
  return addSpotSchema.safeParse(values).success
}
