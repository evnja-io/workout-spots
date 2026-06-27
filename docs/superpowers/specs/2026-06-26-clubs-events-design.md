# Clubs & Events — Feature Spec

> Status: design spec (pre-implementation). Two companion design prompts live alongside this file:
> [`clubs-design-prompt.md`](./clubs-design-prompt.md) and [`events-design-prompt.md`](./events-design-prompt.md).

## Context

`workout-spots` is a map-first React 19 / TanStack Start / Supabase app for discovering outdoor workout
spots. The DB cleanup migration `20260626145323_drop_fitness_domain.sql` removed the legacy
fitness/workout/program domain **and the entire notification subsystem**, but **deliberately kept** the
clubs and events tables — its header states the app "only uses the spots/locations, **clubs/events**,
users and taxonomy tables."

The result: a fully-modelled but **completely unbuilt** social layer in the schema — 16 tables, a
complete Clubs RPC API, RLS policies, and helper functions, with **zero frontend**. This spec defines the
Clubs and Events features against what the schema actually supports.

### Product decisions
- **Two feature areas**, each gets its own design prompt: Clubs, Events.
- **Full social layer** in scope (core flows + posts/comments/likes feed).
- **Dedicated sections only** — new `/clubs` and `/events` browse + detail routes reached from the left
  icon rail. **No map integration** (events are not map pins; clubs do not surface from spot detail).
- **Depth:** core + social feed, using the full schema.

---

## Verified schema inventory

### Clubs (backend is the most complete part of the app)
| Table | Purpose | Key columns |
|---|---|---|
| `clubs` | club record | name, description, `privacy` (public/private), category, rules, cover_image_url, created_by, `search_vector` (FTS) |
| `club_members` | membership + approval | `role` (owner/moderator/member), `status` (pending/approved/rejected), joined_at, approved_by |
| `club_spots` | club ↔ locations link (**many-to-many**: a club can be attached to several spots, a spot can belong to several clubs; unique on club_id+location_id) | club_id, location_id, added_by |
| `club_tags` | discovery tags | club_id, tag |
| `club_posts` | club feed posts | author_id, content (≤2000), image_url |
| `club_post_comments` | comments | post_id, author_id, content (≤1000) |
| `club_post_likes` | likes | post_id, user_id (unique) |

**Clubs RPC API** (via `supabase.rpc(...)`): `rpc_create_club`, `rpc_update_club`,
`rpc_get_club_with_details` (returns member_count, linked_locations, tags, current_user_role,
current_user_status), `rpc_request_club_membership`, `rpc_approve_member`, `rpc_reject_member`,
`rpc_kick_member`, `rpc_leave_club`, `rpc_change_member_role`, `rpc_transfer_ownership`. Helper
predicates: `is_club_member`, `is_approved_club_member`, `is_club_staff`, `is_club_owner_secure`.
`rpc_create_club`/`rpc_update_club` accept `p_linked_spot_ids[]` and `p_tags[]`.

### Events (tables + RLS, but **no RPC layer** — writes go direct via PostgREST under RLS)
| Table | Purpose | Key columns |
|---|---|---|
| `events` | event record | title, description, `starts_at`/`ends_at`, timezone, min/max_participants, registration_deadline, `is_free` + price_amount/currency, `visibility` (public/private/club_only), requires_approval, `club_id` (optional), organizer_name/contact, `status` (draft/upcoming/ongoing/completed/cancelled), cancellation_reason, featured_image_url |
| `event_participants` | RSVP | `participation_type` (interested/participating), `status` (pending/approved/rejected/waitlisted), approved_by, `payment_status` (not_required/pending/completed/refunded), notes |
| `event_locations` | event ↔ spots (multi) | location_id, is_primary, location_order, notes |
| `event_images` | gallery (≤10) | image_url, image_order, caption |
| `event_tags` + `event_tag_assignments` | typed tags | name, **name_fr**, color, icon |
| `event_posts` / `event_post_comments` / `event_post_likes` | event feed | same shape as club feed |

### Hard constraints
- **Notifications were dropped.** No notification feed/bell. Approval & RSVP outcomes appear in fetched
  state on next load — the UI communicates status inline (badges, banners), never assumes push.
- **Events have no RPC wrappers.** Capacity enforcement, waitlist promotion, and approval are not yet
  encoded server-side. The design treats these as product states; the build adds client logic or new
  RPCs/triggers.
- **Payments are out of scope.** Paid events render price read-only ("pay on site / contact organizer");
  `payment_status` is shown read-only. No checkout flow.
- **Privacy/visibility drives access.** Private clubs and `private`/`club_only` events restrict who sees
  the feed/detail. RLS enforces it; the UI shows locked/empty states gracefully.
- **Mocks-first resilience.** Every queryFn guards `isSupabaseConfigured()` and returns `[]`/`null` so
  SSR renders 200 (see `src/features/spots/queries.ts`).
- **i18n en/fr** via i18next; `event_tags.name_fr` exists for localized tags.

---

## Feature Spec A — Clubs

**Routes (new):** `/clubs` (browse), `/clubs/$clubId` (detail), `/clubs/new` (create); staff manage
surface as a panel/tab inside detail. New **Clubs** icon on the left rail.

1. **Browse `/clubs`** — full-text search (`clubs.search_vector`), filter by category and tags. Grid of
   **club cards**: cover image, name, category chip, tag chips, member count, linked-spots count, privacy
   badge. Empty + loading states. "Create club" CTA.
2. **Detail `/clubs/$clubId`** (`rpc_get_club_with_details`) — cover header, name, category, privacy,
   description, rules (collapsible), tag chips, **members roster** (avatars + roles), viewer-state **join
   control**.
   - **Linked spots (many-to-many, first-class):** a club is attached to **several** spots via
     `club_spots`. Detail lists all linked spots (name, city, thumbnail), each linking to `/spots/$id`.
     Staff can add/remove spots at any time, not only at creation.
3. **Social feed** (in detail; approved members for private clubs, everyone for public) — compose box
   (content ≤2000 + optional image), post list. Each post: author, timestamp, content, image, like
   button + count, comment count. Expandable comments thread (≤1000). Author can delete own post/comment.
4. **Create `/clubs/new`** (`rpc_create_club`, `p_linked_spot_ids[]`) — name, description, category,
   privacy, rules, cover image upload, **multi-spot linker** (attach several spots at once), tags input.
5. **Manage (owner/moderator)** — pending-requests queue (`rpc_approve_member`/`rpc_reject_member`),
   member list with role actions (`rpc_change_member_role`, `rpc_kick_member`, `rpc_transfer_ownership`),
   edit club + manage linked spots via `rpc_update_club`.

**Membership state machine (viewer-facing)**
- Not a member → public: "Join" (instant) · private: "Request to join" (`rpc_request_club_membership` → pending).
- Pending → "Request pending" + cancel/leave (`rpc_leave_club`).
- Approved member → feed + "Leave club".
- Moderator/Owner → member view + Manage surface; owner sees transfer/delete.

Permissions mirror RLS + SECURITY DEFINER helpers (hide compose/manage when not entitled; locked state
for private-club non-members).

---

## Feature Spec B — Events

**Routes (new):** `/events` (browse), `/events/$eventId` (detail), `/events/new` (create); organizer
manage surface inside detail. New **Events** icon on the left rail.

1. **Browse `/events`** — upcoming public events sorted by `starts_at`. Filters: tag (localized via
   `name_fr`), date range, free/paid, club-linked. **Event card**: featured image, title, date/time,
   primary location name, capacity (participating/max), free/paid badge, status badge, tag chips. Empty +
   loading states. "Create event" CTA.
2. **Detail `/events/$eventId`** — featured image + **status badge** (cancelled shows
   `cancellation_reason` banner), title, **date/time with timezone**, description, **location(s)** (primary
   first, ordered, optional note, links to `/spots/$id`), organizer, price (free badge or amount,
   read-only), **capacity meter** + registration deadline, tag chips, **image gallery** (≤10, lightbox).
3. **RSVP / participation** — **Interested** vs **Participating** (`participation_type`). If
   `requires_approval` → pending → approved/rejected/waitlisted. At capacity → waitlist. Paid → price
   read-only + `payment_status` informational; **no checkout**. Cancel participation.
4. **Create `/events/new`** — title, description, date/time range + timezone, **multi-spot location
   picker** (mark primary + order + per-location note), capacity (min/max), registration deadline,
   free/paid + price/currency, **visibility** (public/private/club_only → club picker), requires-approval
   toggle, organizer info, featured image, tag picker, gallery upload.
5. **Organizer manage** — participant list grouped by status with approve/reject/waitlist + capacity
   counter; edit event; **cancel event** (reason → `status='cancelled'`); manage images/tags/locations.
6. **Event social feed** — same post→comment→like model as clubs, gated by event visibility.

**Status & RSVP machine (viewer-facing)**
- Not participating: "I'm interested" / "Participate" (or "Request to join" if approval / "Join waitlist"
  if full / "Registration closed" past deadline).
- Pending → "Awaiting approval" + cancel. Waitlisted → "On waitlist" + leave.
- Approved → roster + feed access + "Cancel RSVP".
- Cancelled event → RSVP disabled, reason banner.

---

## Shared design context
- **Design language:** matches existing app — Tailwind v4, rounded cards, soft shadows, light/dark theme,
  user-selectable accent color, mobile-first bottom sheets, desktop 64px left rail + content column. Calm,
  map-app aesthetic.
- **Navigation:** add Clubs and Events rail icons; each opens a full browse page (not a map).
- **Always cover states:** loading (skeleton), empty, unauthenticated (gated write → sign-in),
  permission-locked, error.
- **Auth-gated writes:** join/post/comment/like/RSVP/create require login; anonymous actions open the
  sign-in modal then replay (existing `useAuthGate` pattern).
- **No notifications, no payments.**

---

## Build hand-off (after design mockups land)
Follow the existing feature pattern: `domain.ts` → `queries.ts` (`map*Row` + `*QueryOptions`) →
`mutations.ts` (`useAuthGate` + optimistic updates) → Zod `schema.ts` → components; new file-based routes;
rail icons. Address the **Events RPC/capacity gap** (add RPCs or client logic + RLS checks), keep
**mocks-first** guards, regenerate types with `npm run db:types` if the schema changes, add MSW handlers +
Vitest coverage. Produce the implementation plan via the writing-plans skill.

### Verification (of the eventual build)
- `npm run typecheck`, `npm run lint`, `npm test` green.
- SSR smoke test: `curl` `/clubs` and `/events` for HTTP 200 with Supabase unconfigured (mocks-first) and configured.
- Manual: create club → join (public instant / private request→approve) → post→comment→like; create event
  → RSVP states → organizer approve/cancel → event feed.
- RLS spot-checks: private club feed hidden from non-members; club_only event hidden from non-club users.
