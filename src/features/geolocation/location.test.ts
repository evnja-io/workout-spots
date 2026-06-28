import { describe, expect, it, beforeEach } from 'vitest'
import {
  roundCoord,
  parseCoord,
  parseLocCookie,
  resolveCenter,
  setLocationCookie,
  PARIS_CENTER,
  REGION_ZOOM,
  PRECISE_ZOOM,
} from './location'

describe('roundCoord', () => {
  it('rounds to 2 decimals', () => {
    expect(roundCoord(48.8566123)).toBe(48.86)
    expect(roundCoord(2.3522)).toBe(2.35)
    expect(roundCoord(-0.126)).toBe(-0.13)
  })
})

describe('parseCoord', () => {
  it('parses finite decimals', () => {
    expect(parseCoord('48.85')).toBe(48.85)
    expect(parseCoord('-2.3')).toBe(-2.3)
  })
  it('returns null for missing/invalid', () => {
    expect(parseCoord(undefined)).toBeNull()
    expect(parseCoord(null)).toBeNull()
    expect(parseCoord('')).toBeNull()
    expect(parseCoord('abc')).toBeNull()
  })
})

describe('parseLocCookie', () => {
  it('parses "lng,lat" into a tuple', () => {
    expect(parseLocCookie('2.35,48.85')).toEqual([2.35, 48.85])
  })
  it('returns null for malformed values', () => {
    expect(parseLocCookie(undefined)).toBeNull()
    expect(parseLocCookie('2.35')).toBeNull()
    expect(parseLocCookie('a,b')).toBeNull()
    expect(parseLocCookie('2.35,48.85,9')).toBeNull()
  })
})

describe('resolveCenter', () => {
  it('prefers the cookie location at precise zoom', () => {
    expect(resolveCenter([2.35, 48.85], 51, 0)).toEqual({
      center: [2.35, 48.85],
      zoom: PRECISE_ZOOM,
      source: 'cookie',
    })
  })
  it('falls back to IP coords (lng,lat order) at region zoom', () => {
    expect(resolveCenter(null, 51.5, -0.12)).toEqual({
      center: [-0.12, 51.5],
      zoom: REGION_ZOOM,
      source: 'ip',
    })
  })
  it('falls back to Paris default when nothing is known', () => {
    expect(resolveCenter(null, null, null)).toEqual({
      center: PARIS_CENTER,
      zoom: REGION_ZOOM,
      source: 'default',
    })
  })
  it('treats a partial IP pair as unknown', () => {
    expect(resolveCenter(null, 51.5, null).source).toBe('default')
  })
})

describe('setLocationCookie', () => {
  beforeEach(() => {
    document.cookie = 'loc=; path=/; max-age=0'
  })
  it('writes rounded coords as "lng,lat"', () => {
    setLocationCookie(2.352211, 48.856612)
    expect(document.cookie).toContain('loc=2.35,48.86')
  })
})
