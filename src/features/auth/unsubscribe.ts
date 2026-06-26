import { getBrowserSupabase, isSupabaseConfigured } from '~/lib/supabase/browser'

/** Which marketing stream(s) the unsubscribe link turns off. */
export type UnsubscribeType = 'marketing_email' | 'partner_offers' | 'all'

// The hand-written Database type keeps `Functions: Record<string, never>` on
// purpose: making it non-empty tips postgrest-js's deep `.select()` inference
// (e.g. the spot-detail embedded joins) over its instantiation limit. So we
// type this one RPC call locally instead of registering it in the schema.
type UnsubscribeRpc = (
  fn: 'unsubscribe_marketing',
  args: { p_token: string; p_type: UnsubscribeType },
) => PromiseLike<{ data: boolean | null; error: { message: string } | null }>

/**
 * Turn off marketing consent for the user owning `token`, via the
 * `unsubscribe_marketing` security-definer RPC (callable with the anon key, no
 * login required). Returns true when a row matched the token. Returns false
 * when Supabase isn't configured (mocks-first: never throw on render).
 */
export async function unsubscribeByToken(
  token: string,
  type: UnsubscribeType,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false
  const client = getBrowserSupabase() as unknown as { rpc: UnsubscribeRpc }
  const { data, error } = await client.rpc('unsubscribe_marketing', {
    p_token: token,
    p_type: type,
  })
  if (error) throw error
  return data ?? false
}
