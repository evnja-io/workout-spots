import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBrowserSupabase, isSupabaseConfigured } from '~/lib/supabase/browser'
import { useSession } from './session'

export type UserProfile = {
  id: string
  pseudo: string | null
  name: string | null
  profilePictureUrl: string | null
}

/** Storage bucket holding user profile pictures (see avatars_bucket migration). */
export const AVATARS_BUCKET = 'avatars'

/**
 * Current user's public.users profile (pseudo/name/avatar). Returns null when
 * Supabase isn't configured or there's no signed-in user. Pass `enabled` at the
 * call site to avoid firing while the session is still resolving.
 */
export function currentUserProfileQueryOptions(userId: string | null) {
  return queryOptions({
    queryKey: ['profile', userId] as const,
    queryFn: async (): Promise<UserProfile | null> => {
      if (!isSupabaseConfigured() || !userId) return null
      const { data, error } = await getBrowserSupabase()
        .from('users')
        .select('id,pseudo,name,profile_picture_url')
        .eq('id', userId)
        .maybeSingle()
      if (error) throw error
      if (!data) return null
      return {
        id: data.id,
        pseudo: data.pseudo,
        name: data.name,
        profilePictureUrl: data.profile_picture_url,
      }
    },
  })
}

/** Fields a user can change on their own public.users row. */
export type ProfileUpdate = {
  pseudo?: string
  profilePictureUrl?: string
}

/**
 * Update the signed-in user's profile (pseudo and/or avatar URL), then
 * invalidate their cached profile.
 */
export function useUpdateProfile() {
  const { userId } = useSession()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (update: ProfileUpdate) => {
      if (!userId) throw new Error('Not authenticated')
      const patch: { pseudo?: string; profile_picture_url?: string } = {}
      if (update.pseudo !== undefined) patch.pseudo = update.pseudo
      if (update.profilePictureUrl !== undefined)
        patch.profile_picture_url = update.profilePictureUrl
      const { error } = await getBrowserSupabase().from('users').update(patch).eq('id', userId)
      if (error) throw error
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile', userId] })
    },
  })

  return {
    updateProfile: (update: ProfileUpdate) => mutation.mutateAsync(update),
    pending: mutation.isPending,
    error: mutation.error,
  }
}

/** Update the signed-in user's nickname (public.users.pseudo). */
export function useUpdatePseudo() {
  const { updateProfile, pending, error } = useUpdateProfile()
  return {
    updatePseudo: (pseudo: string) => updateProfile({ pseudo }),
    pending,
    error,
  }
}

/**
 * Upload an avatar image to `avatars/{userId}/avatar.<ext>` and return its
 * public URL. Re-uploads replace the previous file (stable filename + upsert).
 * The caller persists the returned URL via `useUpdateProfile`. Returns null
 * when Supabase isn't configured.
 */
export async function uploadAvatar(file: File, userId: string): Promise<string | null> {
  if (!isSupabaseConfigured()) return null
  const supabase = getBrowserSupabase()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${userId}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage.from(AVATARS_BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  })
  if (uploadError) throw new Error(`Failed to upload avatar: ${uploadError.message}`)

  const {
    data: { publicUrl },
  } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(path)
  // Bust caches when the same path is overwritten.
  return `${publicUrl}?v=${Date.now()}`
}
