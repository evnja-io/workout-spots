-- Drop the legacy fitness/workout/program/notification domain.
--
-- The app (workout-spots) only uses the spots/locations, clubs/events, users and
-- taxonomy tables. This migration removes the unused fitness domain plus the entire
-- notification subsystem.
--
-- Order matters:
--   1. Drop notification triggers attached to KEPT tables (otherwise inserts/updates on
--      users/events/club_members/club_posts/club_post_comments would fail once the
--      notifications table is gone).
--   2. Drop the two notification columns on the KEPT users table.
--   3. Drop the tables (CASCADE handles inter-table FKs, RLS policies, indexes and the
--      triggers attached to these tables).
--   4. Drop the now-orphaned functions.
--   5. Drop the now-orphaned enum types.

-- 1. Notification triggers on KEPT tables --------------------------------------------
DROP TRIGGER IF EXISTS ensure_user_notification_preferences ON public.users;
DROP TRIGGER IF EXISTS event_created_notification_trigger ON public.events;
DROP TRIGGER IF EXISTS event_updated_notification_trigger ON public.events;
DROP TRIGGER IF EXISTS event_participant_notification_trigger ON public.event_participants;
DROP TRIGGER IF EXISTS membership_request_notification_trigger ON public.club_members;
DROP TRIGGER IF EXISTS membership_status_notification_trigger ON public.club_members;
DROP TRIGGER IF EXISTS role_change_notification_trigger ON public.club_members;
DROP TRIGGER IF EXISTS new_comment_notification_trigger ON public.club_post_comments;
DROP TRIGGER IF EXISTS new_post_notification_trigger ON public.club_posts;

-- 2. Notification columns on the KEPT users table ------------------------------------
ALTER TABLE public.users DROP COLUMN IF EXISTS unread_notifications_count;
ALTER TABLE public.users DROP COLUMN IF EXISTS last_notification_read_at;

-- 3. Tables (CASCADE) ----------------------------------------------------------------
DROP TABLE IF EXISTS public.user_push_tokens CASCADE;
DROP TABLE IF EXISTS public.user_subscriptions CASCADE;
DROP TABLE IF EXISTS public.user_workout_preferences CASCADE;
DROP TABLE IF EXISTS public.user_disciplines CASCADE;
DROP TABLE IF EXISTS public.user_program_enrollments CASCADE;
DROP TABLE IF EXISTS public.workout_likes CASCADE;
DROP TABLE IF EXISTS public.workout_shares CASCADE;
DROP TABLE IF EXISTS public.workout_sets CASCADE;
DROP TABLE IF EXISTS public.workout_sessions CASCADE;
DROP TABLE IF EXISTS public.workout_template_exercises CASCADE;
DROP TABLE IF EXISTS public.workout_templates CASCADE;
DROP TABLE IF EXISTS public.workouts CASCADE;
DROP TABLE IF EXISTS public.workouts_backup CASCADE;
DROP TABLE IF EXISTS public.program_reviews CASCADE;
DROP TABLE IF EXISTS public.program_session_completions CASCADE;
DROP TABLE IF EXISTS public.program_workouts CASCADE;
DROP TABLE IF EXISTS public.program_weeks CASCADE;
DROP TABLE IF EXISTS public.program_phases CASCADE;
DROP TABLE IF EXISTS public.programs CASCADE;
DROP TABLE IF EXISTS public.session_exercises CASCADE;
DROP TABLE IF EXISTS public.set_exercises CASCADE;
DROP TABLE IF EXISTS public.sets CASCADE;
DROP TABLE IF EXISTS public.exercise_progressions CASCADE;
DROP TABLE IF EXISTS public.exercise_muscles CASCADE;
DROP TABLE IF EXISTS public.exercise_equipment CASCADE;
DROP TABLE IF EXISTS public.exercises CASCADE;
DROP TABLE IF EXISTS public.muscles CASCADE;
DROP TABLE IF EXISTS public.push_queue CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.notification_preferences CASCADE;

-- 4. Orphaned functions --------------------------------------------------------------
-- Notification subsystem
DROP FUNCTION IF EXISTS public.backfill_push_queue;
DROP FUNCTION IF EXISTS public.enqueue_push_on_notification;
DROP FUNCTION IF EXISTS public.ensure_notification_preferences;
DROP FUNCTION IF EXISTS public.trigger_event_created_notification;
DROP FUNCTION IF EXISTS public.trigger_event_updated_notification;
DROP FUNCTION IF EXISTS public.trigger_event_participant_notification;
DROP FUNCTION IF EXISTS public.trigger_membership_request_notification;
DROP FUNCTION IF EXISTS public.trigger_membership_status_notification;
DROP FUNCTION IF EXISTS public.trigger_role_change_notification;
DROP FUNCTION IF EXISTS public.trigger_new_comment_notification;
DROP FUNCTION IF EXISTS public.trigger_new_post_notification;
DROP FUNCTION IF EXISTS public.create_event_approval_request_notification;
DROP FUNCTION IF EXISTS public.create_event_cancelled_notification;
DROP FUNCTION IF EXISTS public.create_event_created_notification;
DROP FUNCTION IF EXISTS public.create_event_participant_joined_notification;
DROP FUNCTION IF EXISTS public.create_event_updated_notification;
DROP FUNCTION IF EXISTS public.create_membership_request_notification;
DROP FUNCTION IF EXISTS public.create_membership_status_notification;
DROP FUNCTION IF EXISTS public.create_new_comment_notification;
DROP FUNCTION IF EXISTS public.create_new_post_notification;
DROP FUNCTION IF EXISTS public.create_role_change_notification;
-- Workout / program / exercise
DROP FUNCTION IF EXISTS public.calculate_workout_stats;
DROP FUNCTION IF EXISTS public.create_superset;
DROP FUNCTION IF EXISTS public.find_exercises_by_criteria;
DROP FUNCTION IF EXISTS public.get_exercise_progressions;
DROP FUNCTION IF EXISTS public.get_recommended_exercises_for_level;
DROP FUNCTION IF EXISTS public.get_workout_with_sets;
DROP FUNCTION IF EXISTS public.migrate_existing_workouts;
DROP FUNCTION IF EXISTS public.populate_session_exercises;
DROP FUNCTION IF EXISTS public.update_enrollment_progress_manual;
DROP FUNCTION IF EXISTS public.update_enrollment_progress_on_completion;
DROP FUNCTION IF EXISTS public.validate_enrollment_progress;
DROP FUNCTION IF EXISTS public.validate_set_structure;
-- Push tokens, set builders, unread counters (triggers lived on dropped tables;
-- bodies reference dropped tables/columns)
DROP FUNCTION IF EXISTS public.cleanup_old_push_tokens;
DROP FUNCTION IF EXISTS public.update_push_token_last_used;
DROP FUNCTION IF EXISTS public.create_straight_set;
DROP FUNCTION IF EXISTS public.increment_unread_notifications;
DROP FUNCTION IF EXISTS public.update_unread_notification_count;
DROP FUNCTION IF EXISTS public.update_workout_completion_stats;

-- 5. Orphaned enum types -------------------------------------------------------------
DROP TYPE IF EXISTS public.adaptation_type;
DROP TYPE IF EXISTS public.contraindication;
DROP TYPE IF EXISTS public.energy_system;
DROP TYPE IF EXISTS public.equipment_requirement_type;
DROP TYPE IF EXISTS public.exercise_category;
DROP TYPE IF EXISTS public.focus_area;
DROP TYPE IF EXISTS public.force_vector;
DROP TYPE IF EXISTS public.injury_risk;
DROP TYPE IF EXISTS public.joint_action;
DROP TYPE IF EXISTS public.movement_pattern;
DROP TYPE IF EXISTS public.muscle_group;
DROP TYPE IF EXISTS public.muscle_involvement_type;
DROP TYPE IF EXISTS public.parameter_type;
DROP TYPE IF EXISTS public.periodization_model;
DROP TYPE IF EXISTS public.plane_of_motion;
DROP TYPE IF EXISTS public.program_phase;
DROP TYPE IF EXISTS public.program_status;
DROP TYPE IF EXISTS public.progression_type;
DROP TYPE IF EXISTS public.rom_specification;
DROP TYPE IF EXISTS public.safety_level;
DROP TYPE IF EXISTS public.score_method;
DROP TYPE IF EXISTS public.set_type;
DROP TYPE IF EXISTS public.space_requirement;
DROP TYPE IF EXISTS public.surface_type;
DROP TYPE IF EXISTS public.training_style;
DROP TYPE IF EXISTS public.workout_phase;
DROP TYPE IF EXISTS public.workout_type;
