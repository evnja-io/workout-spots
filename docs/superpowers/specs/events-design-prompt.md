# Claude-design prompt — Events

> Paste the block below into Claude design to generate the Events UI mockups. See
> [`2026-06-26-clubs-events-design.md`](./2026-06-26-clubs-events-design.md) for the full spec.

---

Design the Events experience for "Workout Spots," a mobile-first map app for discovering outdoor
workout/calisthenics spots. Same visual language as the rest of the app: clean and calm, Tailwind-like
rounded cards, soft shadows, light + dark themes, one user-selectable accent color for primary actions, a
64px left icon rail + content column on desktop, full-width pages + bottom sheets on mobile. Use realistic
placeholder content (e.g. "Sunday Calisthenics Meetup," "Beginner Pull-up Workshop").

Events are scheduled meetups held at one or more workout spots. An event has a featured image, title,
start/end date-time (with timezone), description, one or more linked spots (a primary + ordered extras,
each with a note), an organizer, a free/paid flag with price, participant capacity (min/max) and
registration deadline, visibility (public / private / club-only), localized tags (colored, with icons), an
image gallery, a lifecycle status (upcoming / ongoing / completed / cancelled), and a social feed.

Screens to produce:

1. Events browse page — filters for tag, date range, free/paid, and club-linked; a responsive grid of
   event cards (featured image, title, date/time, primary location, capacity "X / max," free/paid badge,
   status badge, colored tag chips). Prominent "Create event" button; empty and loading (skeleton) states.

2. Event detail page — featured image header with a status badge (and a cancellation banner when
   cancelled); title; date/time with timezone; description; a locations block (primary first, ordered, each
   with a note, linking to the spot); organizer info; price (free badge or amount, read-only); a capacity
   meter + registration deadline; colored tag chips; and an image gallery with a lightbox.

3. RSVP control — render every participant state: "I'm interested," "Participate," "Request to join" (when
   approval required), "Join waitlist" (when full), "Awaiting approval," "On waitlist," "You're going" +
   "Cancel RSVP," and "Registration closed." For paid events, show the price read-only with a "pay on site /
   contact organizer" note — no checkout flow.

4. Create-event form — title, description, start/end date-time + timezone, a multi-spot location picker
   (mark primary, order, per-location note), capacity (min/max), registration deadline, free/paid +
   price/currency, visibility selector (with a club picker when "club-only"), a requires-approval toggle,
   organizer fields, featured-image upload, tag picker, and gallery upload.

5. Organizer manage panel — a participant list grouped by status (going / pending / waitlisted / rejected)
   with approve/reject/waitlist actions and a capacity counter; an edit-event form; and a cancel-event
   action that captures a reason.

6. Event social feed — a compose box and posts with author/time/content/image, likes with count, and
   expandable comments threads.

Cover all UI states: loading, empty, signed-out (write actions prompt sign-in), permission-locked (private
/ club-only), full/waitlist, and cancelled. Show light and dark variants for browse and detail. No
notifications UI and no real payments. Deliver responsive screens (mobile + desktop) with a component
breakdown (event card, capacity meter, RSVP button states, location row, participant row, post/comment).
