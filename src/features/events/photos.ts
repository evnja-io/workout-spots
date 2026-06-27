import { getBrowserSupabase } from '~/lib/supabase/browser'
import { validateImage } from '~/features/add-spot/photos'

export const EVENT_IMAGES_BUCKET = 'event-images'

function ext(filename: string): string {
  const i = filename.lastIndexOf('.')
  return i >= 0 ? filename.slice(i) : ''
}

/** Upload an event featured image; returns { url, path }. */
export async function uploadEventFeatured(
  eventId: string,
  file: File,
): Promise<{ url: string; path: string }> {
  const check = validateImage(file)
  if (!check.ok) throw new Error(check.reason)
  const sb = getBrowserSupabase()
  const path = `${eventId}/featured_${Date.now()}${ext(file.name)}`
  const { error } = await sb.storage.from(EVENT_IMAGES_BUCKET).upload(path, file, { upsert: true })
  if (error) throw new Error(`Failed to upload image: ${error.message}`)
  return { url: sb.storage.from(EVENT_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl, path }
}

/** Upload one gallery image; returns the public URL + storage path. */
export async function uploadEventGalleryImage(
  eventId: string,
  file: File,
  order: number,
): Promise<{ url: string; path: string }> {
  const check = validateImage(file)
  if (!check.ok) throw new Error(check.reason)
  const sb = getBrowserSupabase()
  const path = `${eventId}/gallery/${order}_${Date.now()}${ext(file.name)}`
  const { error } = await sb.storage.from(EVENT_IMAGES_BUCKET).upload(path, file)
  if (error) throw new Error(`Failed to upload image: ${error.message}`)
  return { url: sb.storage.from(EVENT_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl, path }
}
