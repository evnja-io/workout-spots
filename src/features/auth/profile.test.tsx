import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

// ── Supabase browser mock ─────────────────────────────────────────────────────

const mockMaybeSingle = vi.fn()
const mockEqSelect = vi.fn(() => ({ maybeSingle: mockMaybeSingle }))
const mockSelect = vi.fn(() => ({ eq: mockEqSelect }))

const mockEqUpdate = vi.fn()
const mockUpdate = vi.fn(() => ({ eq: mockEqUpdate }))

const mockFrom = vi.fn(() => ({ select: mockSelect, update: mockUpdate }))

const mockUpload = vi.fn()
const mockGetPublicUrl = vi.fn()
const mockStorageFrom = vi.fn(() => ({ upload: mockUpload, getPublicUrl: mockGetPublicUrl }))

vi.mock('~/lib/supabase/browser', () => ({
  isSupabaseConfigured: () => true,
  getBrowserSupabase: () => ({
    from: mockFrom,
    storage: { from: mockStorageFrom },
  }),
}))

// useSession is mocked so the hooks see a signed-in user without a provider.
vi.mock('./session', () => ({
  useSession: () => ({ userId: 'user-1', status: 'authed' }),
}))

import {
  currentUserProfileQueryOptions,
  useUpdateProfile,
  uploadAvatar,
} from './profile'

beforeEach(() => {
  vi.clearAllMocks()
  mockEqSelect.mockReturnValue({ maybeSingle: mockMaybeSingle })
  mockSelect.mockReturnValue({ eq: mockEqSelect })
  mockUpdate.mockReturnValue({ eq: mockEqUpdate })
  mockFrom.mockReturnValue({ select: mockSelect, update: mockUpdate })
  mockStorageFrom.mockReturnValue({ upload: mockUpload, getPublicUrl: mockGetPublicUrl })
})

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

// ── currentUserProfileQueryOptions ─────────────────────────────────────────────

describe('currentUserProfileQueryOptions', () => {
  it('selects profile_picture_url and maps it to camelCase profilePictureUrl', async () => {
    mockMaybeSingle.mockResolvedValue({
      data: {
        id: 'user-1',
        pseudo: 'street_athlete',
        name: null,
        profile_picture_url: 'https://cdn/avatar.png',
      },
      error: null,
    })

    const result = await currentUserProfileQueryOptions('user-1').queryFn!({} as never)

    expect(mockSelect).toHaveBeenCalledWith('id,pseudo,name,profile_picture_url')
    expect(result).toEqual({
      id: 'user-1',
      pseudo: 'street_athlete',
      name: null,
      profilePictureUrl: 'https://cdn/avatar.png',
    })
  })

  it('returns null when there is no userId (does not query)', async () => {
    const result = await currentUserProfileQueryOptions(null).queryFn!({} as never)
    expect(result).toBeNull()
    expect(mockFrom).not.toHaveBeenCalled()
  })
})

// ── useUpdateProfile ────────────────────────────────────────────────────────────

describe('useUpdateProfile', () => {
  it('updates only the pseudo column when given a pseudo', async () => {
    mockEqUpdate.mockResolvedValue({ error: null })
    const { result } = renderHook(() => useUpdateProfile(), { wrapper })

    await result.current.updateProfile({ pseudo: 'newname' })

    expect(mockFrom).toHaveBeenCalledWith('users')
    expect(mockUpdate).toHaveBeenCalledWith({ pseudo: 'newname' })
    expect(mockEqUpdate).toHaveBeenCalledWith('id', 'user-1')
  })

  it('updates the profile_picture_url column when given an avatar URL', async () => {
    mockEqUpdate.mockResolvedValue({ error: null })
    const { result } = renderHook(() => useUpdateProfile(), { wrapper })

    await result.current.updateProfile({ profilePictureUrl: 'https://cdn/new.png' })

    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith({ profile_picture_url: 'https://cdn/new.png' }),
    )
  })

  it('updates both columns together', async () => {
    mockEqUpdate.mockResolvedValue({ error: null })
    const { result } = renderHook(() => useUpdateProfile(), { wrapper })

    await result.current.updateProfile({ pseudo: 'a', profilePictureUrl: 'https://cdn/x.png' })

    expect(mockUpdate).toHaveBeenCalledWith({
      pseudo: 'a',
      profile_picture_url: 'https://cdn/x.png',
    })
  })
})

// ── uploadAvatar ────────────────────────────────────────────────────────────────

describe('uploadAvatar', () => {
  it('uploads to avatars/{userId}/avatar.<ext> with upsert and returns a public URL', async () => {
    mockUpload.mockResolvedValue({ data: { path: '' }, error: null })
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://cdn/avatars/user-1/avatar.png' } })

    const file = new File([new Uint8Array(10)], 'me.png', { type: 'image/png' })
    const url = await uploadAvatar(file, 'user-1')

    expect(mockStorageFrom).toHaveBeenCalledWith('avatars')
    const [path, uploadedFile, opts] = mockUpload.mock.calls[0] as [string, File, { upsert: boolean }]
    expect(path).toBe('user-1/avatar.png')
    expect(uploadedFile).toBe(file)
    expect(opts.upsert).toBe(true)
    expect(url).toContain('https://cdn/avatars/user-1/avatar.png')
  })

  it('throws when the storage upload fails', async () => {
    mockUpload.mockResolvedValue({ data: null, error: { message: 'denied' } })
    const file = new File([new Uint8Array(10)], 'me.jpg', { type: 'image/jpeg' })
    await expect(uploadAvatar(file, 'user-1')).rejects.toThrow('denied')
  })
})
