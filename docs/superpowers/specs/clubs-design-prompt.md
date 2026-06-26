# Claude-design prompt — Clubs

> Paste the block below into Claude design to generate the Clubs UI mockups. See
> [`2026-06-26-clubs-events-design.md`](./2026-06-26-clubs-events-design.md) for the full spec.

---

Design the Clubs experience for "Workout Spots," a mobile-first map app for discovering outdoor
workout/calisthenics spots. I want a clean, modern, calm UI consistent with a Mapbox-style map app:
Tailwind-like rounded cards, soft shadows, light + dark themes, and a single user-selectable accent color
used for primary actions. Desktop has a 64px left icon rail + a content column; mobile uses full-width
pages and bottom sheets. Design these screens as a cohesive set with realistic placeholder content
(fitness clubs like "Paris Street Workout," "Calisthenics Lyon").

Clubs are communities users join. A club has a cover image, name, category, public/private privacy,
description, rules, tags, a member roster with roles (owner, moderator, member), a social feed, and is
attached to several workout spots (a many-to-many link — one club spans multiple spots, and a spot can
belong to multiple clubs). The linked-spots list is a first-class part of the club, shown on detail and
editable by staff.

Screens to produce:

1. Clubs browse page — a search bar (full-text), category + tag filters, and a responsive grid of club
   cards (cover image, name, category chip, tag chips, member count, linked-spots count, public/private
   badge). Include a prominent "Create club" button, plus empty and loading (skeleton) states.

2. Club detail page — cover header with name/category/privacy; description and collapsible rules; tag
   chips; a members roster (avatars with role badges); a linked-spots section that lists the several spots
   attached to the club (each as a small card: thumbnail, name, city — tapping opens the spot); and a
   context-aware join control that renders all states: "Join" (public), "Request to join" (private),
   "Request pending," "Leave club," and a staff "Manage" entry.

3. Club social feed (within detail) — a compose box (text + optional image) and a list of posts; each post
   shows author, time, content, optional image, a like button with count, and an expandable comments thread
   with its own compose box. Show a locked/empty state for private clubs the viewer hasn't joined.

4. Create-club form — name, description, category, privacy toggle, rules, cover-image upload, a multi-spot
   linker (search existing spots and attach several — show selected spots as removable chips/cards), and a
   tags input.

5. Manage panel (owner/moderator) — a pending join-requests queue with approve/reject; a member list with
   role actions (promote/demote moderator, remove member, transfer ownership); an edit-club form; and a
   manage-linked-spots control to add/remove multiple attached spots after creation.

Cover all UI states: loading, empty, signed-out (a write action should prompt sign-in), and
permission-locked (private club, non-member). Show light and dark variants of at least the browse and
detail screens. No notifications UI and no payments. Provide the design as responsive screens (mobile +
desktop) with a small component breakdown (card, post, comment, member row, join button states).
