import { parse, serialize, type SerializeOptions } from 'cookie'

/**
 * Parse a Cookie header string into a name→value map.
 */
export function parseCookies(header: string): Record<string, string> {
  const raw = parse(header)
  const result: Record<string, string> = {}
  for (const [k, v] of Object.entries(raw)) {
    if (v !== undefined) result[k] = v
  }
  return result
}

/**
 * Serialize a cookie name/value pair (with optional options) into a Set-Cookie header value.
 */
export function serializeCookie(
  name: string,
  value: string,
  options?: SerializeOptions,
): string {
  return serialize(name, value, options)
}
