# Supabase migrations

## `migrations/20260625120000_discover_write_prerequisites.sql`

Everything the **contribute/write** flows (likes, reviews, add-spot, photo upload) need before they work against the live database. Public **reads** already work and are deliberately left untouched.

### How to apply

The app's anon key cannot run DDL, so run this as the project owner:

- **Easiest:** Supabase dashboard → **SQL Editor** → paste the file → **Run**. It executes as `postgres`, which is required for the `auth.users` trigger and storage changes.
- **Or** with the Supabase CLI: `supabase db push` (if you adopt the CLI and link the project), or `psql "$SUPABASE_DB_URL" -f supabase/migrations/20260625120000_discover_write_prerequisites.sql` using the service-role / direct connection string.

It is **idempotent** — safe to run more than once.

### What it does

1. **Unique constraints** on `location_ratings` and `location_likes` `(location_id, user_id)` — de-duplicates existing rows first, then adds the constraint. Without these, review upserts duplicate instead of update, and double-clicking save creates duplicate likes.
2. **`public.users` mirror trigger** — copies new `auth.users` (id + email) into `public.users`, and backfills existing users. Required because `created_by`/`user_id` FKs point at `public.users.id`, but the session id comes from `auth.users`. Without it, every write FK-violates.
3. **Rating aggregation trigger** — keeps `locations.average_rating` / `rating_count` in sync with user-submitted `location_ratings` (the scraped `external_*` columns are untouched).
4. **Additive write RLS policies** (INSERT/UPDATE/DELETE scoped to `auth.uid()`) for the contribute tables. These do **not** enable RLS or change any SELECT policy, so they cannot break existing reads.
5. **Storage** — creates the public `location-images` bucket and its read/upload policies.

### Important caveat — SELECT policies / RLS state

This script intentionally does **not** enable RLS or add SELECT policies, because the public reads already return 200 (so your read policies — or RLS-off — are already in place) and I didn't want to risk breaking them blind.

If you later **enable** RLS on any of these tables, you must also add the public `SELECT` policies yourself, e.g.:

```sql
alter table public.locations enable row level security;
create policy "locations public read" on public.locations for select using (true);
-- ...repeat for location_images, location_comments, location_ratings,
--    location_likes, equipments, disciplines, location_equipments,
--    location_disciplines (and a privacy-conscious one for public.users —
--    avoid exposing email; the app only needs pseudo/name).
```

### Verify

The bottom of the SQL file has commented `SELECT`s to confirm the constraints, triggers, and bucket exist after running.
