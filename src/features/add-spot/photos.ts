import { getBrowserSupabase } from '~/lib/supabase/browser'
import type { SpotImage } from '~/features/spots/domain'

// TODO(db-access): confirm bucket name + policy (§13)
export const SPOT_IMAGES_BUCKET = 'location-images'

export const ALLOWED_IMAGE_MIMES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/tiff',
] as const

// 50MB: matches the Supabase project-wide upload cap (no per-bucket limit is set).
// Raising beyond this requires bumping the cap in the Supabase dashboard first.
export const MAX_IMAGE_BYTES = 50 * 1024 * 1024
export const MAX_IMAGES = 10

// ── validateImage ─────────────────────────────────────────────────────────────

type ValidateResult = { ok: true } | { ok: false; reason: string }

export function validateImage(file: File): ValidateResult {
  if (!(ALLOWED_IMAGE_MIMES as readonly string[]).includes(file.type)) {
    return { ok: false, reason: 'unsupported type' }
  }
  if (file.size <= 0) {
    return { ok: false, reason: 'empty file' }
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, reason: 'too large' }
  }
  return { ok: true }
}

// ── uploadSpotImages ──────────────────────────────────────────────────────────

export async function uploadSpotImages(
  spotId: string,
  files: File[],
  userId: string,
  startOrder = 1,
): Promise<SpotImage[]> {
  const supabase = getBrowserSupabase()
  const clamped = files.slice(0, MAX_IMAGES)
  const results: SpotImage[] = []
  let order = startOrder - 1

  for (const file of clamped) {
    order += 1
    const path = `${spotId}/${order}-${file.name}`

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from(SPOT_IMAGES_BUCKET)
      .upload(path, file)

    if (uploadError) {
      throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`)
    }

    // Get public URL (sync, no error variant)
    const {
      data: { publicUrl },
    } = supabase.storage.from(SPOT_IMAGES_BUCKET).getPublicUrl(path)

    // Insert location_images row
    const { data, error: insertError } = await supabase
      .from('location_images')
      .insert({
        location_id: spotId,
        image_url: publicUrl,
        image_path: path,
        image_order: order,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: userId,
      })
      .select()
      .single()

    if (insertError) {
      throw new Error(`Failed to save image record for ${file.name}: ${insertError.message}`)
    }

    results.push({
      id: data.id,
      url: publicUrl,
      order,
    })
  }

  return results
}

// ── deleteSpotImages ──────────────────────────────────────────────────────────

export async function deleteSpotImages(images: { id: string; path?: string }[]): Promise<void> {
  if (images.length === 0) return
  const supabase = getBrowserSupabase()
  const paths = images.map((i) => i.path).filter((p): p is string => Boolean(p))
  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage.from(SPOT_IMAGES_BUCKET).remove(paths)
    if (storageError) throw new Error(`Failed to delete image files: ${storageError.message}`)
  }
  const { error: dbError } = await supabase
    .from('location_images')
    .delete()
    .in('id', images.map((i) => i.id))
  if (dbError) throw new Error(`Failed to delete image records: ${dbError.message}`)
}
