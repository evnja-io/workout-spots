import { getBrowserSupabase } from '~/lib/supabase/browser'
import { uploadEventGalleryImage } from './photos'

// event_images.mime_type is constrained to these three.
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])

/**
 * Upload gallery files to the event-images bucket and insert event_images rows
 * starting at `startOrder` (image_order is unique per event and capped at 10).
 */
export async function uploadAndInsertGallery(
  eventId: string,
  files: File[],
  startOrder: number,
): Promise<void> {
  const sb = getBrowserSupabase()
  let order = startOrder
  for (const file of files) {
    if (order > 10) break
    const { url, path } = await uploadEventGalleryImage(eventId, file, order)
    const { error } = await sb.from('event_images').insert({
      event_id: eventId,
      image_url: url,
      image_path: path,
      image_order: order,
      file_size: file.size,
      mime_type: ALLOWED_MIME.has(file.type) ? file.type : null,
    })
    if (error) throw error
    order += 1
  }
}

/** The next free image_order for an event (1-based), for appending in edit mode. */
export async function nextGalleryOrder(eventId: string): Promise<number> {
  const { data, error } = await getBrowserSupabase()
    .from('event_images')
    .select('image_order')
    .eq('event_id', eventId)
    .order('image_order', { ascending: false })
    .limit(1)
  if (error) throw error
  const max = data?.[0]?.image_order ?? 0
  return max + 1
}
