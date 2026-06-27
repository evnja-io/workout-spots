import { getBrowserSupabase } from '~/lib/supabase/browser'
import { validateImage } from '~/features/add-spot/photos'

export const CLUB_IMAGES_BUCKET = 'club-images'
export const POST_IMAGES_BUCKET = 'post-images'

function ext(filename: string): string {
  const i = filename.lastIndexOf('.')
  return i >= 0 ? filename.slice(i) : ''
}

/** Upload a club cover to club-images/<clubId>/cover_<ts>.<ext>; returns the public URL. */
export async function uploadClubCover(clubId: string, file: File): Promise<string> {
  const check = validateImage(file)
  if (!check.ok) throw new Error(check.reason)
  const sb = getBrowserSupabase()
  const path = `${clubId}/cover_${Date.now()}${ext(file.name)}`
  const { error } = await sb.storage.from(CLUB_IMAGES_BUCKET).upload(path, file, { upsert: true })
  if (error) throw new Error(`Failed to upload cover: ${error.message}`)
  return sb.storage.from(CLUB_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl
}

/** Upload a post image to post-images/<clubId>/<postId>/<ts>.<ext>; returns the public URL. */
export async function uploadPostImage(clubId: string, postId: string, file: File): Promise<string> {
  const check = validateImage(file)
  if (!check.ok) throw new Error(check.reason)
  const sb = getBrowserSupabase()
  const path = `${clubId}/${postId}/${Date.now()}${ext(file.name)}`
  const { error } = await sb.storage.from(POST_IMAGES_BUCKET).upload(path, file)
  if (error) throw new Error(`Failed to upload image: ${error.message}`)
  return sb.storage.from(POST_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl
}
