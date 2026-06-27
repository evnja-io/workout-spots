# Clubs & Events — Implementation Plan

## Context

The clubs/events social layer is fully modelled in Supabase but has **zero frontend**. The feature spec
is committed at [`docs/superpowers/specs/2026-06-26-clubs-events-design.md`](../specs/2026-06-26-clubs-events-design.md),
and a complete Claude-design prototype exists (project `f2a8e04f…`) with full JSX for both features
(browse / detail / feed / create / manage) plus shared components and mock data whose shapes deliberately
mirror the real tables. This plan turns that spec + design into a build, following the app's existing
feature pattern (`spots`, `add-spot`, `reviews`).

**Decisions:** two dedicated sections — `/clubs` and `/events` — reached from the left rail (no map
integration); full social layer (core + posts/comments/likes); both features built.

### Backend readiness (verified against the migrations — better than the spec feared)
- **Clubs:** READY end-to-end. RLS allows anon discovery, member-gated private content, and all writes;
  the full `rpc_*` API exists (`rpc_create_club`, `rpc_update_club`, `rpc_get_club_with_details`,
  `rpc_request_club_membership` (auto-approves public clubs), `rpc_leave_club`, `rpc_approve_member`,
  `rpc_reject_member`, `rpc_kick_member`, `rpc_change_member_role`, `rpc_transfer_ownership`).
- **Events:** READY for reads, self-RSVP, withdraw, organizer approve/waitlist (UPDATE under the creator
  policy), and posts/comments/likes (gated on `participation_type='participating'` + `status='approved'`).
  Event creation/update/delete allowed for the creator.
- **Two real prerequisites** (Phase 0): storage buckets don't exist; the `event_participants` INSERT
  policy doesn't constrain `status` (self-approval hole).
- **No notifications** (dropped) and **no payments** — both out of scope; status is shown inline.
- `updated_at` is not auto-maintained (no trigger); set it explicitly in update mutations where it matters.

---

## Phase 0 — Backend prerequisites (one migration + types regen)

New migration via `npx supabase migration new clubs_events_storage_and_rsvp`, body:

1. **Storage buckets** (mirror the `location-images`/`avatars` policy block in
   `supabase/migrations/20250722120001_local_infra.sql`):
   - `club-images` — club covers. (Matches the existing `get_club_image_url` → `club-images/<club>/…`.)
   - `post-images` — club & event post images. (Matches `get_post_image_url`.)
   - `event-images` — event featured images + galleries.
   - Policies per bucket: public read; authenticated insert/update/delete scoped to the uploader's folder.
2. **RSVP integrity trigger** — `BEFORE INSERT ON event_participants`, `SECURITY DEFINER`, that **ignores
   any client-supplied `status`** and sets it server-side:
   - `participation_type='interested'` → `status='approved'` (does not consume capacity).
   - else if `events.requires_approval` → `'pending'`.
   - else if going-count ≥ `events.max_participants` → `'waitlisted'`.
   - else → `'approved'`.
   This closes the self-approval/self-going exploit and gives correct capacity/waitlist behaviour without
   a full RPC. Organizer approve/reject/waitlist keeps using the existing creator UPDATE policy.
   (Waitlist auto-promotion on cancellation is intentionally deferred — organizers promote manually.)
3. Apply with `npm run db:reset`, then `npm run db:types`; commit the regenerated
   `src/lib/supabase/types.ts`. (`db:push` to prod happens at release, per CLAUDE.md.)

**Verification:** `db:reset` applies clean; typecheck passes with new types; a self-insert of
`status='approved'` on an approval-required event comes back `pending`.

---

## Shared conventions (apply to every phase)

- **Feature layout** mirrors `src/features/spots/`: `domain.ts` (camelCase types) → `queries.ts`
  (`*Row` types + pure `map*Row()` + `*QueryOptions()` guarded by `isSupabaseConfigured()`) →
  `mutations.ts` (`useAuthGate()` + optimistic `onMutate`/`onError`/`onSettled` + `trackEvent`) →
  `schema.ts` (Zod `*Input`/`*Parsed`) → `components/`.
- **Routes** are file-based (auto-gen `routeTree.gen.ts`, never edited): `loader` calls
  `context.queryClient.ensureQueryData(...)` for SSR; detail routes add `head()` meta and `notFound()`.
- **RPC calls** follow the one existing example, `src/features/auth/unsubscribe.ts`
  (`getBrowserSupabase().rpc('name', { p_… })`); types come from generated `types.ts`.
- **Image upload** reuses the shape of `src/features/add-spot/photos.ts` (validate → `storage.upload` →
  `getPublicUrl` → insert row); new per-feature `photos.ts` with the new bucket constants.
- **Pure, testable logic:** port the design's view-resolution helpers into pure functions —
  `JoinControl` state (`src/features/clubs/membership.ts`), `RSVPControl` view + capacity math + date
  formatters (`src/features/events/eventState.ts`). These get the densest unit tests.
- **i18n:** add `clubs` and `events` namespaces to `src/lib/i18n/en.json` + `fr.json`; localized event
  tags use `event_tags.name_fr`.

---

## Phase 1 — Navigation + section scaffolding
- `src/features/spots/Rail.tsx`: add `Clubs` and `Events` rail destinations (`<Link to="/clubs">` /
  `/events`, active via `pathname.startsWith(...)`); add matching tabs to `BottomNav.tsx` for mobile.
- Scaffold routes that render shells: `src/routes/clubs/{route,index,$clubId,new}.tsx` and
  `src/routes/events/{route,index,$eventId,new}.tsx`.
- Seed `clubs`/`events` i18n namespaces.

---

## Phase 2 — Clubs read path
- `features/clubs/domain.ts`: `ClubListItem`, `ClubDetail`, `ClubMember`, `ClubPost`, `ClubComment`,
  `LinkedSpot`, `PendingRequest`; `membership.ts` for join-control state.
- `features/clubs/queries.ts`:
  - `clubsBrowseQueryOptions(filters)` — `from('clubs')` with `club_members(count)`, `club_spots(count)`,
    `club_tags(tag)`; `.textSearch('search_vector', q)`; category/tag filters.
  - `clubDetailQueryOptions(clubId)` — `rpc_get_club_with_details` (role/status/member_count/
    linked_locations/tags; narrow the jsonb), plus a members-roster query and linked-spot resolution to
    spot cards (reuse spot thumbnail fields).
  - `clubFeedQueryOptions(clubId)`, `clubPendingRequestsQueryOptions(clubId)` (staff).
- Components (map design `clubs-shared.jsx` + `clubs-browse.jsx` + `clubs-detail.jsx`): `ClubCard`,
  `ClubCardSkeleton`, `PrivacyBadge`, `CatChip`, `RoleBadge`, `Avatar`, `ClubsBrowse`, `ClubDetail`
  (cover header, collapsible rules, tag chips, `RosterAvatars`/`MemberRow`, linked-spots section),
  `JoinControl`/`JoinButton` driven by `membership.ts`, `StateBlock` (loading/empty/locked).
- Routes: `clubs/index.tsx` (browse loader + search params), `clubs/$clubId.tsx` (detail loader + head).

---

## Phase 3 — Clubs write path
- `features/clubs/schema.ts`: Zod for create/update club, post, comment.
- `features/clubs/photos.ts`: cover → `club-images`, post image → `post-images`.
- `features/clubs/mutations.ts` (all `useAuthGate`-gated, `trackEvent` on success, invalidate):
  - Membership: `useJoinClub` (`rpc_request_club_membership`), `useLeaveClub` (`rpc_leave_club`).
  - Staff: `useApproveMember`/`useRejectMember`/`useKickMember`/`useChangeRole`/`useTransferOwnership`.
  - Club CRUD: `useCreateClub` (`rpc_create_club` + cover upload), `useUpdateClub` (`rpc_update_club`,
    `p_linked_spot_ids[]`/`p_tags[]` — also the manage-linked-spots control).
  - Feed: `useCreatePost`/`useDeletePost` (direct `club_posts` ± image), `useAddComment`/`useDeleteComment`
    (`club_post_comments`), `useToggleLike` (`club_post_likes`, optimistic).
- Components (map `clubs-feed.jsx`, `clubs-create.jsx`, `clubs-manage.jsx`): `ClubFeed` (compose + posts +
  comments), `ClubCreate` (multi-spot linker, tags), `ClubManage` (pending queue, member-role actions,
  edit, linked spots). Route `clubs/new.tsx`.

---

## Phase 4 — Events read path
- `features/events/domain.ts` + `eventState.ts` (RSVP view resolution, capacity/waitlist/`isFull`/
  `regClosed`, and date/time formatters ported from `events-shared.jsx`).
- `features/events/queries.ts`:
  - `eventsBrowseQueryOptions(filters)` — `from('events')` (RLS scopes visibility), `status`-aware,
    ordered by `starts_at`; embed `event_locations(*, locations(...))` (primary first),
    `event_tag_assignments(event_tags(*))`, going-count via `event_participants(count)` filtered to going,
    featured image. Filters: tag, date range, free/paid, club.
  - `eventDetailQueryOptions(eventId)` — event + locations(+spots) + `event_images` + tags + organizer
    (`users`) + participants + viewer participation + going/waitlist/pending counts.
- Components (map `events-shared.jsx` + `events-browse.jsx` + `events-detail.jsx`): `EventCard`,
  `EventCardSkeleton`, `StatusBadge`, `PriceBadge`, `EvTag`, `CapacityMeter`, `EventsBrowse`,
  `EventDetail` (`WhenBlock`, `LocationRow`, `OrganizerRow`, `PriceBlock`, `Gallery` + `Lightbox`,
  cancellation banner), `RSVPControl` driven by `eventState.ts`.
- Routes: `events/index.tsx`, `events/$eventId.tsx` (loader + head).

---

## Phase 5 — Events write path
- `features/events/schema.ts` (Zod for create/update event, post, comment); `features/events/photos.ts`
  (`event-images`).
- `features/events/mutations.ts`:
  - RSVP: `useRsvp` (insert `event_participants`; status decided by the Phase-0 trigger),
    `useCancelRsvp` (delete/withdraw), `useSetInterest`.
  - Organizer: `useApproveParticipant`/`useWaitlistParticipant`/`useRejectParticipant` (UPDATE status),
    `useCancelEvent` (UPDATE `status='cancelled'` + `cancellation_reason`).
  - Event CRUD: `useCreateEvent` (insert `events` + `event_locations` (primary/order/note) +
    `event_tag_assignments` + featured image + gallery), `useUpdateEvent`.
  - Feed: `useCreateEventPost`/comment/like (direct, RLS-gated).
- Components (map `events-create.jsx`, `events-manage.jsx`, `events-feed.jsx`): `EventCreate` (multi-spot
  picker with primary/order/note, visibility + club picker, free/paid, tags, gallery), `EventManage`
  (participants grouped by status with approve/reject/waitlist + cancel), `EventFeed`. Route `events/new.tsx`.

---

## Phase 6 — Tests, i18n, polish, verification
- **MSW** handlers (`src/test/msw/`) for the new PostgREST selects + club RPCs + the RSVP path; unhandled
  requests must still error.
- **Vitest** (co-located): `map*Row` mappers; browse filter builders; `membership.ts` join states;
  `eventState.ts` RSVP-view resolution, capacity math, date formatters.
- Finish `clubs`/`events` i18n (en + fr); wire `trackEvent` (`club_created`, `join_club`, `event_created`,
  `event_rsvp`, `view_club`, `view_event`, …).
- **SSR smoke:** `npm run build` then `curl` `/clubs`, `/events`, a detail route — HTTP 200 both with
  Supabase unconfigured (mocks-first → empty) and configured.
- `npm run typecheck && npm run lint && npm test` green.

---

## Critical files
- New migration: `supabase/migrations/<ts>_clubs_events_storage_and_rsvp.sql`; regenerated
  `src/lib/supabase/types.ts`.
- New features: `src/features/clubs/**`, `src/features/events/**`.
- New routes: `src/routes/clubs/**`, `src/routes/events/**`.
- Edited: `src/features/spots/Rail.tsx`, `src/features/spots/BottomNav.tsx`, `src/lib/i18n/en.json`,
  `src/lib/i18n/fr.json`.
- Reused references: `src/features/add-spot/photos.ts` (upload), `src/features/add-spot/mutations.ts`
  (`useCreateSpot` shape), `src/features/reviews/mutations.ts` (optimistic + `useAuthGate`),
  `src/features/auth/unsubscribe.ts` (`.rpc()`), `src/routes/spots/route.tsx` + `spots/$spotId.tsx`
  (route/loader/head), `src/lib/supabase/browser.ts` (`isSupabaseConfigured`).

## Sequencing & sizing
Phase 0 is the only DDL and gates image + RSVP work — do it first. Clubs (2–3) before Events (4–5) since
clubs' RPC layer is turnkey and establishes the shared component/test patterns Events reuse. Each phase is
independently verifiable. This is a large, multi-session build; recommend a feature branch per phase or a
long-lived `feat/clubs-events` branch with incremental PRs. After approval, save this plan to
`docs/superpowers/plans/2026-06-26-clubs-events-implementation.md` and begin Phase 0.
