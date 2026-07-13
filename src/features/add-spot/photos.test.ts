import { describe, it, expect, vi, beforeEach } from 'vitest'
import { validateImage, uploadSpotImages, ALLOWED_IMAGE_MIMES, MAX_IMAGE_BYTES } from './photos'
import type { SpotImage } from '~/features/spots/domain'

// ── Supabase storage mock ──────────────────────────────────────────────────────

const mockUpload = vi.fn()
const mockGetPublicUrl = vi.fn()
const mockInsert = vi.fn()
const mockSelect = vi.fn()
const mockSingle = vi.fn()

// Build chainable mock
mockSelect.mockReturnValue({ single: mockSingle })
mockInsert.mockReturnValue({ select: mockSelect })

const mockStorageFrom = vi.fn(() => ({
  upload: mockUpload,
  getPublicUrl: mockGetPublicUrl,
}))

const mockDbFrom = vi.fn(() => ({
  insert: mockInsert,
}))

vi.mock('~/lib/supabase/browser', () => ({
  isSupabaseConfigured: () => true,
  getBrowserSupabase: () => ({
    storage: {
      from: mockStorageFrom,
    },
    from: mockDbFrom,
  }),
}))

// ── validateImage ─────────────────────────────────────────────────────────────

describe('validateImage', () => {
  it('rejects a text/plain file', () => {
    const file = new File(['hello'], 'note.txt', { type: 'text/plain' })
    const result = validateImage(file)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason).toBe('unsupported type')
    }
  })

  it('rejects a 0-byte file even with valid mime', () => {
    const file = new File([], 'x.png', { type: 'image/png' })
    expect(file.size).toBe(0)
    const result = validateImage(file)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason).toBe('empty file')
    }
  })

  it('rejects a file that exceeds MAX_IMAGE_BYTES', () => {
    // Create a file slightly over the limit
    const overLimit = new Uint8Array(MAX_IMAGE_BYTES + 1)
    const file = new File([overLimit], 'big.jpg', { type: 'image/jpeg' })
    const result = validateImage(file)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason).toBe('too large')
    }
  })

  it('accepts a large iPhone photo (~40MB)', () => {
    const iphonePhoto = new Uint8Array(40 * 1024 * 1024)
    const file = new File([iphonePhoto], 'IMG_4821.jpg', { type: 'image/jpeg' })
    const result = validateImage(file)
    expect(result.ok).toBe(true)
  })

  it('accepts a small image/webp file', () => {
    const file = new File([new Uint8Array(10)], 'a.webp', { type: 'image/webp' })
    const result = validateImage(file)
    expect(result.ok).toBe(true)
  })

  it('accepts all allowed mimes', () => {
    for (const mime of ALLOWED_IMAGE_MIMES) {
      const file = new File([new Uint8Array(10)], `test.img`, { type: mime })
      const result = validateImage(file)
      expect(result.ok).toBe(true)
    }
  })
})

// ── uploadSpotImages ──────────────────────────────────────────────────────────

describe('uploadSpotImages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Re-wire chains after clearAllMocks
    mockSelect.mockReturnValue({ single: mockSingle })
    mockInsert.mockReturnValue({ select: mockSelect })
    mockStorageFrom.mockReturnValue({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl,
    })
    mockDbFrom.mockReturnValue({ insert: mockInsert })
  })

  it('returns ordered SpotImages for each file', async () => {
    const spotId = 'spot-abc'
    const userId = 'user-xyz'
    const files = [
      new File([new Uint8Array(10)], 'first.webp', { type: 'image/webp' }),
      new File([new Uint8Array(20)], 'second.jpg', { type: 'image/jpeg' }),
    ]

    // Storage upload succeeds
    mockUpload.mockResolvedValue({ data: { path: '' }, error: null })

    // getPublicUrl returns different URLs per call
    mockGetPublicUrl
      .mockReturnValueOnce({ data: { publicUrl: 'https://example.com/spot-abc/1-first.webp' } })
      .mockReturnValueOnce({ data: { publicUrl: 'https://example.com/spot-abc/2-second.jpg' } })

    // DB insert for each file
    mockSingle
      .mockResolvedValueOnce({
        data: { id: 'img-1', image_url: 'https://example.com/spot-abc/1-first.webp', image_order: 1 },
        error: null,
      })
      .mockResolvedValueOnce({
        data: { id: 'img-2', image_url: 'https://example.com/spot-abc/2-second.jpg', image_order: 2 },
        error: null,
      })

    const result: SpotImage[] = await uploadSpotImages(spotId, files, userId)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ id: 'img-1', url: 'https://example.com/spot-abc/1-first.webp', order: 1 })
    expect(result[1]).toEqual({ id: 'img-2', url: 'https://example.com/spot-abc/2-second.jpg', order: 2 })

    // Verify upload was called with correct paths
    expect(mockUpload).toHaveBeenNthCalledWith(1, 'spot-abc/1-first.webp', files[0])
    expect(mockUpload).toHaveBeenNthCalledWith(2, 'spot-abc/2-second.jpg', files[1])
  })

  it('surfaces a per-file upload error by throwing', async () => {
    const spotId = 'spot-abc'
    const userId = 'user-xyz'
    const files = [
      new File([new Uint8Array(10)], 'broken.jpg', { type: 'image/jpeg' }),
    ]

    // Upload fails for this file
    mockUpload.mockResolvedValue({
      data: null,
      error: { message: 'storage error' },
    })

    await expect(uploadSpotImages(spotId, files, userId)).rejects.toThrow('broken.jpg')
  })

  it('surfaces per-file DB insert error by throwing', async () => {
    const spotId = 'spot-abc'
    const userId = 'user-xyz'
    const files = [
      new File([new Uint8Array(10)], 'ok.jpg', { type: 'image/jpeg' }),
    ]

    mockUpload.mockResolvedValue({ data: { path: '' }, error: null })
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://example.com/1-ok.jpg' } })

    // DB insert fails
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: 'insert error' },
    })

    await expect(uploadSpotImages(spotId, files, userId)).rejects.toThrow()
  })
})
