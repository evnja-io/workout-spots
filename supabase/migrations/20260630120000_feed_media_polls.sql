-- Feed media blocks: relax content, add video/poll columns, poll option + vote tables.
-- A post carries optional text plus AT MOST ONE media block (image | video | poll).
-- Mirrored across club_posts and event_posts.

begin;

-- ── club_posts: relax content + media columns ────────────────────────────────
alter table "public"."club_posts" alter column "content" drop not null;
alter table "public"."club_posts" drop constraint if exists "club_posts_content_check";
alter table "public"."club_posts" add constraint "club_posts_content_check"
  check ("content" is null or "length"("content") <= 2000);

alter table "public"."club_posts" add column if not exists "video_url" "text";
alter table "public"."club_posts" add column if not exists "poll_closes_at" timestamp with time zone;
alter table "public"."club_posts" add column if not exists "media_type" "text"
  check ("media_type" in ('image', 'video', 'poll'));

-- Backfill existing image posts so the consistency check below holds.
update "public"."club_posts" set "media_type" = 'image'
  where "image_url" is not null and "media_type" is null;

alter table "public"."club_posts" add constraint "club_posts_media_consistency" check (
  (("image_url" is not null)::int + ("video_url" is not null)::int
    + (coalesce("media_type", '') = 'poll')::int) <= 1
  and ("media_type" is distinct from 'video' or "video_url" is not null)
  and ("media_type" is distinct from 'poll' or ("image_url" is null and "video_url" is null))
  and ("media_type" is distinct from 'image' or "video_url" is null)
);

-- ── event_posts: relax content + media columns ───────────────────────────────
alter table "public"."event_posts" alter column "content" drop not null;
alter table "public"."event_posts" drop constraint if exists "event_posts_content_check";
alter table "public"."event_posts" add constraint "event_posts_content_check"
  check ("content" is null or "length"("content") <= 2000);

alter table "public"."event_posts" add column if not exists "video_url" "text";
alter table "public"."event_posts" add column if not exists "poll_closes_at" timestamp with time zone;
alter table "public"."event_posts" add column if not exists "media_type" "text"
  check ("media_type" in ('image', 'video', 'poll'));

update "public"."event_posts" set "media_type" = 'image'
  where "image_url" is not null and "media_type" is null;

alter table "public"."event_posts" add constraint "event_posts_media_consistency" check (
  (("image_url" is not null)::int + ("video_url" is not null)::int
    + (coalesce("media_type", '') = 'poll')::int) <= 1
  and ("media_type" is distinct from 'video' or "video_url" is not null)
  and ("media_type" is distinct from 'poll' or ("image_url" is null and "video_url" is null))
  and ("media_type" is distinct from 'image' or "video_url" is null)
);

-- ── club poll option + vote tables ───────────────────────────────────────────
create table if not exists "public"."club_poll_options" (
  "id" "uuid" default "gen_random_uuid"() not null,
  "post_id" "uuid" not null,
  "position" integer not null,
  "label" "text" not null,
  "created_at" timestamp with time zone default "now"(),
  constraint "club_poll_options_pkey" primary key ("id"),
  constraint "club_poll_options_position_check" check ("position" between 0 and 5),
  constraint "club_poll_options_label_check" check ("length"("label") between 1 and 100),
  constraint "club_poll_options_post_id_fkey" foreign key ("post_id")
    references "public"."club_posts"("id") on delete cascade,
  constraint "club_poll_options_post_position_key" unique ("post_id", "position"),
  constraint "club_poll_options_id_post_key" unique ("id", "post_id")
);
create index if not exists "idx_club_poll_options_post_id"
  on "public"."club_poll_options" using "btree" ("post_id");

create table if not exists "public"."club_poll_votes" (
  "id" "uuid" default "gen_random_uuid"() not null,
  "post_id" "uuid" not null,
  "option_id" "uuid" not null,
  "user_id" "uuid" not null,
  "created_at" timestamp with time zone default "now"(),
  constraint "club_poll_votes_pkey" primary key ("id"),
  constraint "club_poll_votes_post_user_key" unique ("post_id", "user_id"),
  constraint "club_poll_votes_user_id_fkey" foreign key ("user_id")
    references "public"."users"("id") on delete cascade,
  constraint "club_poll_votes_option_post_fkey" foreign key ("option_id", "post_id")
    references "public"."club_poll_options"("id", "post_id") on delete cascade
);
create index if not exists "idx_club_poll_votes_option_id"
  on "public"."club_poll_votes" using "btree" ("option_id");
create index if not exists "idx_club_poll_votes_post_id"
  on "public"."club_poll_votes" using "btree" ("post_id");
create index if not exists "idx_club_poll_votes_user_id"
  on "public"."club_poll_votes" using "btree" ("user_id");

-- ── event poll option + vote tables ──────────────────────────────────────────
create table if not exists "public"."event_poll_options" (
  "id" "uuid" default "gen_random_uuid"() not null,
  "post_id" "uuid" not null,
  "position" integer not null,
  "label" "text" not null,
  "created_at" timestamp with time zone default "now"(),
  constraint "event_poll_options_pkey" primary key ("id"),
  constraint "event_poll_options_position_check" check ("position" between 0 and 5),
  constraint "event_poll_options_label_check" check ("length"("label") between 1 and 100),
  constraint "event_poll_options_post_id_fkey" foreign key ("post_id")
    references "public"."event_posts"("id") on delete cascade,
  constraint "event_poll_options_post_position_key" unique ("post_id", "position"),
  constraint "event_poll_options_id_post_key" unique ("id", "post_id")
);
create index if not exists "idx_event_poll_options_post_id"
  on "public"."event_poll_options" using "btree" ("post_id");

create table if not exists "public"."event_poll_votes" (
  "id" "uuid" default "gen_random_uuid"() not null,
  "post_id" "uuid" not null,
  "option_id" "uuid" not null,
  "user_id" "uuid" not null,
  "created_at" timestamp with time zone default "now"(),
  constraint "event_poll_votes_pkey" primary key ("id"),
  constraint "event_poll_votes_post_user_key" unique ("post_id", "user_id"),
  constraint "event_poll_votes_user_id_fkey" foreign key ("user_id")
    references "public"."users"("id") on delete cascade,
  constraint "event_poll_votes_option_post_fkey" foreign key ("option_id", "post_id")
    references "public"."event_poll_options"("id", "post_id") on delete cascade
);
create index if not exists "idx_event_poll_votes_option_id"
  on "public"."event_poll_votes" using "btree" ("option_id");
create index if not exists "idx_event_poll_votes_post_id"
  on "public"."event_poll_votes" using "btree" ("post_id");
create index if not exists "idx_event_poll_votes_user_id"
  on "public"."event_poll_votes" using "btree" ("user_id");

-- ── RLS: poll options + votes inherit parent-post visibility ─────────────────
alter table "public"."club_poll_options" enable row level security;
alter table "public"."club_poll_votes" enable row level security;
alter table "public"."event_poll_options" enable row level security;
alter table "public"."event_poll_votes" enable row level security;

-- Options are readable by anyone who can read the parent post (RLS applies to the
-- subquery), and writable only by the post author.
create policy "club_poll_options_select_visibility" on "public"."club_poll_options"
  for select using (exists (
    select 1 from "public"."club_posts" "p" where "p"."id" = "club_poll_options"."post_id"));
create policy "club_poll_options_insert_author" on "public"."club_poll_options"
  for insert with check (exists (
    select 1 from "public"."club_posts" "p"
    where "p"."id" = "post_id" and "p"."author_id" = "auth"."uid"()));

create policy "event_poll_options_select_visibility" on "public"."event_poll_options"
  for select using (exists (
    select 1 from "public"."event_posts" "p" where "p"."id" = "event_poll_options"."post_id"));
create policy "event_poll_options_insert_author" on "public"."event_poll_options"
  for insert with check (exists (
    select 1 from "public"."event_posts" "p"
    where "p"."id" = "post_id" and "p"."author_id" = "auth"."uid"()));

-- Votes: counts visible to anyone who can see the post. No update/delete policy
-- ⇒ a vote cannot be changed or retracted. Insert mirrors each feed's like policy
-- plus single-vote (unique constraint), ownership, and an open-deadline check.
create policy "club_poll_votes_select_visibility" on "public"."club_poll_votes"
  for select using (exists (
    select 1 from "public"."club_posts" "p" where "p"."id" = "club_poll_votes"."post_id"));
create policy "club_poll_votes_insert_auth" on "public"."club_poll_votes"
  for insert with check (
    "auth"."uid"() is not null
    and "user_id" = "auth"."uid"()
    and exists (
      select 1 from "public"."club_posts" "p"
      where "p"."id" = "post_id"
        and coalesce("p"."poll_closes_at", 'infinity'::timestamptz) > "now"()));

create policy "event_poll_votes_select_visibility" on "public"."event_poll_votes"
  for select using (exists (
    select 1 from "public"."event_posts" "p" where "p"."id" = "event_poll_votes"."post_id"));
create policy "event_poll_votes_insert_participants" on "public"."event_poll_votes"
  for insert with check (
    "auth"."uid"() is not null
    and "user_id" = "auth"."uid"()
    and exists (
      select 1
      from ("public"."event_posts" "p"
        join "public"."event_participants" "ep" on (("ep"."event_id" = "p"."event_id")))
      where "p"."id" = "post_id"
        and "ep"."user_id" = "auth"."uid"()
        and "ep"."status" = 'approved'::"text"
        and coalesce("p"."poll_closes_at", 'infinity'::timestamptz) > "now"()));

commit;
