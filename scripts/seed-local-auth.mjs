#!/usr/bin/env node
/*
 * Seed local auth.users from the seeded public.users so you can magic-link
 * sign in as any seeded user on the LOCAL Supabase stack.
 *
 * Why this is needed: `supabase/seed.sql` is a `db dump --data-only --schema
 * public`, so it loads public.users but NOT auth.users (the auth schema is
 * excluded). The app's sign-in uses signInWithOtp({ shouldCreateUser: false }),
 * which sends no email for an address that has no auth.users row — so sign-in
 * silently does nothing for seeded users until their auth account exists.
 *
 * This creates an email-confirmed auth user per seeded public.users row, reusing
 * the SAME id so the auth user maps onto the existing public.users profile (the
 * handle_new_user trigger inserts `on conflict (id) do nothing`, leaving seeded
 * data intact). Magic-link mails are captured by Mailpit (http://127.0.0.1:54324).
 *
 * Run after `npm run db:reset` (auth.users is wiped on reset):
 *   npm run db:seed-auth
 *
 * Idempotent: users that already exist are skipped.
 */
import { execSync } from 'node:child_process'

const status = JSON.parse(execSync('npx supabase status -o json', { encoding: 'utf8' }))
const API = status.API_URL
const SERVICE = status.SERVICE_ROLE_KEY
if (!API || !SERVICE) {
  console.error('Could not read API_URL / SERVICE_ROLE_KEY — is the local stack up? (npm run db:start)')
  process.exit(1)
}

const svcHeaders = { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, 'Content-Type': 'application/json' }

const usersRes = await fetch(`${API}/rest/v1/users?select=id,email`, { headers: svcHeaders })
if (!usersRes.ok) {
  console.error('Failed to read public.users:', usersRes.status, await usersRes.text())
  process.exit(1)
}
const users = await usersRes.json()

let created = 0
let skipped = 0
for (const u of users) {
  if (!u.email) {
    skipped++
    continue
  }
  const res = await fetch(`${API}/auth/v1/admin/users`, {
    method: 'POST',
    headers: svcHeaders,
    body: JSON.stringify({ id: u.id, email: u.email, email_confirm: true }),
  })
  if (res.ok) created++
  else skipped++ // already exists (duplicate email/id) or other — leave as-is
}

console.log(`Local auth seed complete: created ${created}, skipped ${skipped} of ${users.length} seeded users.`)
console.log('Sign in with any seeded email; the magic link lands in Mailpit → http://127.0.0.1:54324')
