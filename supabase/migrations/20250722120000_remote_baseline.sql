

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."adaptation_type" AS ENUM (
    'strength',
    'hypertrophy',
    'power',
    'endurance',
    'flexibility',
    'skill',
    'coordination'
);


ALTER TYPE "public"."adaptation_type" OWNER TO "postgres";


CREATE TYPE "public"."contraindication" AS ENUM (
    'shoulder_injury',
    'back_injury',
    'knee_injury',
    'wrist_injury',
    'pregnancy',
    'hypertension',
    'heart_condition'
);


ALTER TYPE "public"."contraindication" OWNER TO "postgres";


CREATE TYPE "public"."energy_system" AS ENUM (
    'phosphocreatine',
    'glycolytic',
    'oxidative',
    'mixed'
);


ALTER TYPE "public"."energy_system" OWNER TO "postgres";


CREATE TYPE "public"."equipment_requirement_type" AS ENUM (
    'required',
    'recommended',
    'optional',
    'alternative'
);


ALTER TYPE "public"."equipment_requirement_type" OWNER TO "postgres";


CREATE TYPE "public"."exercise_category" AS ENUM (
    'upper_pulling',
    'upper_pushing',
    'core_statics',
    'lower_body',
    'dynamics',
    'cardio',
    'flexibility'
);


ALTER TYPE "public"."exercise_category" OWNER TO "postgres";


CREATE TYPE "public"."focus_area" AS ENUM (
    'upper_push',
    'upper_pull',
    'lower_body',
    'core',
    'cardio',
    'skill',
    'full_body',
    'flexibility'
);


ALTER TYPE "public"."focus_area" OWNER TO "postgres";


CREATE TYPE "public"."force_vector" AS ENUM (
    'vertical_up',
    'vertical_down',
    'horizontal_push',
    'horizontal_pull',
    'diagonal',
    'rotational'
);


ALTER TYPE "public"."force_vector" OWNER TO "postgres";


CREATE TYPE "public"."injury_risk" AS ENUM (
    'shoulder_impingement',
    'lower_back_strain',
    'knee_stress',
    'wrist_strain',
    'neck_strain',
    'ankle_sprain'
);


ALTER TYPE "public"."injury_risk" OWNER TO "postgres";


CREATE TYPE "public"."joint_action" AS ENUM (
    'flexion',
    'extension',
    'abduction',
    'adduction',
    'rotation',
    'circumduction',
    'stabilization'
);


ALTER TYPE "public"."joint_action" OWNER TO "postgres";


CREATE TYPE "public"."movement_pattern" AS ENUM (
    'push',
    'pull',
    'squat',
    'hinge',
    'lunge',
    'carry',
    'twist',
    'locomotion',
    'isometric'
);


ALTER TYPE "public"."movement_pattern" OWNER TO "postgres";


CREATE TYPE "public"."muscle_group" AS ENUM (
    'chest',
    'back',
    'shoulders',
    'biceps',
    'triceps',
    'forearms',
    'quadriceps',
    'hamstrings',
    'glutes',
    'calves',
    'abs',
    'obliques',
    'lower_back',
    'upper_back'
);


ALTER TYPE "public"."muscle_group" OWNER TO "postgres";


CREATE TYPE "public"."muscle_involvement_type" AS ENUM (
    'primary',
    'secondary',
    'stabilizer'
);


ALTER TYPE "public"."muscle_involvement_type" OWNER TO "postgres";


CREATE TYPE "public"."parameter_type" AS ENUM (
    'reps',
    'time',
    'distance',
    'max_effort',
    'heart_rate'
);


ALTER TYPE "public"."parameter_type" OWNER TO "postgres";


CREATE TYPE "public"."periodization_model" AS ENUM (
    'linear',
    'undulating',
    'block',
    'conjugate',
    'reverse',
    'custom'
);


ALTER TYPE "public"."periodization_model" OWNER TO "postgres";


CREATE TYPE "public"."plane_of_motion" AS ENUM (
    'sagittal',
    'frontal',
    'transverse'
);


ALTER TYPE "public"."plane_of_motion" OWNER TO "postgres";


CREATE TYPE "public"."program_phase" AS ENUM (
    'preparation',
    'build',
    'intensification',
    'peak',
    'recovery',
    'transition',
    'custom'
);


ALTER TYPE "public"."program_phase" OWNER TO "postgres";


CREATE TYPE "public"."program_status" AS ENUM (
    'draft',
    'active',
    'completed',
    'paused',
    'cancelled',
    'template'
);


ALTER TYPE "public"."program_status" OWNER TO "postgres";


CREATE TYPE "public"."progression_type" AS ENUM (
    'regression',
    'progression',
    'variation'
);


ALTER TYPE "public"."progression_type" OWNER TO "postgres";


CREATE TYPE "public"."rom_specification" AS ENUM (
    'full',
    'partial',
    'bottom_half',
    'top_half',
    'pulse'
);


ALTER TYPE "public"."rom_specification" OWNER TO "postgres";


CREATE TYPE "public"."safety_level" AS ENUM (
    'low',
    'moderate',
    'high',
    'expert_only'
);


ALTER TYPE "public"."safety_level" OWNER TO "postgres";


CREATE TYPE "public"."score_method" AS ENUM (
    'total_rounds',
    'total_reps',
    'total_time',
    'average_time',
    'max_weight',
    'distance'
);


ALTER TYPE "public"."score_method" OWNER TO "postgres";


CREATE TYPE "public"."set_type" AS ENUM (
    'straight',
    'superset',
    'circuit',
    'cluster',
    'rest_pause',
    'emom',
    'tabata',
    'density',
    'custom'
);


ALTER TYPE "public"."set_type" OWNER TO "postgres";


CREATE TYPE "public"."space_requirement" AS ENUM (
    'minimal',
    'standard',
    'large'
);


ALTER TYPE "public"."space_requirement" OWNER TO "postgres";


CREATE TYPE "public"."surface_type" AS ENUM (
    'concrete',
    'grass',
    'sand',
    'indoor',
    'any'
);


ALTER TYPE "public"."surface_type" OWNER TO "postgres";


CREATE TYPE "public"."training_style" AS ENUM (
    'strength',
    'hypertrophy',
    'endurance',
    'power',
    'skill',
    'conditioning',
    'mobility'
);


ALTER TYPE "public"."training_style" OWNER TO "postgres";


CREATE TYPE "public"."workout_phase" AS ENUM (
    'warm_up',
    'main',
    'cool_down'
);


ALTER TYPE "public"."workout_phase" OWNER TO "postgres";


CREATE TYPE "public"."workout_type" AS ENUM (
    'strength',
    'cardio',
    'flexibility',
    'skill',
    'mixed',
    'recovery'
);


ALTER TYPE "public"."workout_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."backfill_push_queue"() RETURNS TABLE("notifications_processed" integer, "queue_items_created" integer)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
    v_processed INT := 0;
    v_created INT := 0;
    v_notification RECORD;
    v_should_send_push BOOLEAN;
BEGIN
    -- Process all notifications that aren't already in the queue
    FOR v_notification IN 
        SELECT n.id, n.user_id, n.type, n.created_at
        FROM public.notifications n
        WHERE NOT EXISTS (
            SELECT 1 FROM public.push_queue pq 
            WHERE pq.notification_id = n.id
        )
        -- Only process recent notifications (last 7 days)
        AND n.created_at > NOW() - INTERVAL '7 days'
        -- Only for users with active push tokens
        AND EXISTS (
            SELECT 1 FROM public.user_push_tokens pt
            WHERE pt.user_id = n.user_id
            AND pt.last_used_at > NOW() - INTERVAL '30 days'
        )
        ORDER BY n.created_at DESC
    LOOP
        v_processed := v_processed + 1;
        
        -- Check notification preferences
        SELECT CASE v_notification.type
            -- Club notifications
            WHEN 'membership_request' THEN COALESCE(np.push_membership_requests, true)
            WHEN 'membership_approved' THEN COALESCE(np.push_membership_updates, true)
            WHEN 'membership_rejected' THEN COALESCE(np.push_membership_updates, true)
            WHEN 'role_changed' THEN COALESCE(np.push_role_changes, true)
            WHEN 'new_post' THEN COALESCE(np.push_new_posts, false)
            WHEN 'new_comment' THEN COALESCE(np.push_new_comments, true)
            WHEN 'post_liked' THEN COALESCE(np.push_post_likes, false)
            WHEN 'comment_liked' THEN COALESCE(np.push_comment_likes, false)
            -- Event notifications
            WHEN 'event_created' THEN COALESCE(np.push_event_created, true)
            WHEN 'event_updated' THEN COALESCE(np.push_event_updates, true)
            WHEN 'event_cancelled' THEN COALESCE(np.push_event_updates, true)
            WHEN 'event_participant_joined' THEN COALESCE(np.push_event_participants, true)
            WHEN 'event_participant_left' THEN COALESCE(np.push_event_participants, true)
            WHEN 'event_approval_request' THEN COALESCE(np.push_event_approvals, true)
            WHEN 'event_participation_approved' THEN COALESCE(np.push_event_approvals, true)
            WHEN 'event_participation_rejected' THEN COALESCE(np.push_event_approvals, true)
            WHEN 'event_reminder' THEN COALESCE(np.push_event_reminders, true)
            WHEN 'event_starting_soon' THEN COALESCE(np.push_event_reminders, true)
            ELSE true
        END INTO v_should_send_push
        FROM public.notification_preferences np
        WHERE np.user_id = v_notification.user_id;
        
        -- If no preferences, use defaults
        IF NOT FOUND THEN
            v_should_send_push := CASE v_notification.type
                -- Default off for like notifications
                WHEN 'new_post' THEN false
                WHEN 'post_liked' THEN false
                WHEN 'comment_liked' THEN false
                -- Default on for everything else including event notifications
                ELSE true
            END;
        END IF;
        
        -- Insert into queue if should send
        IF v_should_send_push THEN
            INSERT INTO public.push_queue (notification_id, user_id)
            VALUES (v_notification.id, v_notification.user_id)
            ON CONFLICT DO NOTHING;
            
            IF FOUND THEN
                v_created := v_created + 1;
            END IF;
        END IF;
    END LOOP;
    
    RETURN QUERY SELECT v_processed, v_created;
END;
$$;


ALTER FUNCTION "public"."backfill_push_queue"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_workout_stats"("workout_id_param" "uuid") RETURNS TABLE("total_exercises" integer, "estimated_volume" numeric, "muscle_groups_targeted" "text"[])
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(we.id)::INTEGER as total_exercises,
        SUM(COALESCE(we.sets, 0) * COALESCE(we.reps, 0) * COALESCE(we.weight_kg, 0))::DECIMAL as estimated_volume,
        array_agg(DISTINCT unnest(e.muscle_groups)) as muscle_groups_targeted
    FROM workout_exercises we
    JOIN exercises e ON e.id = we.exercise_id
    WHERE we.workout_id = workout_id_param;
END;
$$;


ALTER FUNCTION "public"."calculate_workout_stats"("workout_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_old_push_tokens"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    DELETE FROM public.user_push_tokens
    WHERE last_used_at < NOW() - INTERVAL '60 days';
    
    -- Also clean up expired push queue items older than 7 days
    UPDATE public.push_queue
    SET status = 'expired'
    WHERE status = 'pending'
    AND created_at < NOW() - INTERVAL '7 days';
END;
$$;


ALTER FUNCTION "public"."cleanup_old_push_tokens"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_event_approval_request_notification"("p_event_id" "uuid", "p_event_participant_id" "uuid", "p_requester_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_event_title VARCHAR(255);
    v_club_id UUID;
    v_event_owner_id UUID;
    v_requester_pseudo VARCHAR(255);
    v_should_notify BOOLEAN;
BEGIN
    -- Get event info
    SELECT title, club_id, created_by INTO v_event_title, v_club_id, v_event_owner_id
    FROM events WHERE id = p_event_id;
    
    SELECT pseudo INTO v_requester_pseudo FROM users WHERE id = p_requester_id;
    
    -- Check if event owner wants approval notifications
    SELECT event_approvals INTO v_should_notify
    FROM notification_preferences 
    WHERE user_id = v_event_owner_id;
    
    -- Create notification for event owner
    IF v_should_notify = true THEN
        INSERT INTO notifications (user_id, type, title, message, club_id, event_id, event_participant_id, actor_user_id)
        VALUES (
            v_event_owner_id,
            'event_approval_request',
            'Event Participation Request',
            COALESCE(v_requester_pseudo, 'Someone') || ' wants to join your event: ' || v_event_title,
            v_club_id,
            p_event_id,
            p_event_participant_id,
            p_requester_id
        );
    END IF;
END;
$$;


ALTER FUNCTION "public"."create_event_approval_request_notification"("p_event_id" "uuid", "p_event_participant_id" "uuid", "p_requester_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."create_event_approval_request_notification"("p_event_id" "uuid", "p_event_participant_id" "uuid", "p_requester_id" "uuid") IS 'Creates notification for event owner when someone requests to join an approval-required event';



CREATE OR REPLACE FUNCTION "public"."create_event_cancelled_notification"("p_event_id" "uuid", "p_canceller_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_event_title VARCHAR(255);
    v_club_id UUID;
    v_participant_ids UUID[];
BEGIN
    -- Get event info
    SELECT title, club_id INTO v_event_title, v_club_id 
    FROM events WHERE id = p_event_id;
    
    -- Get all approved participants
    SELECT ARRAY_AGG(user_id) INTO v_participant_ids
    FROM event_participants
    WHERE event_id = p_event_id 
      AND status = 'approved';
    
    -- Create notifications for all participants
    IF v_participant_ids IS NOT NULL AND array_length(v_participant_ids, 1) > 0 THEN
        INSERT INTO notifications (user_id, type, title, message, club_id, event_id, actor_user_id)
        SELECT 
            unnest(v_participant_ids),
            'event_cancelled',
            'Event Cancelled',
            v_event_title || ' has been cancelled',
            v_club_id,  -- Can be NULL for public events
            p_event_id,
            p_canceller_id;
    END IF;
END;
$$;


ALTER FUNCTION "public"."create_event_cancelled_notification"("p_event_id" "uuid", "p_canceller_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."create_event_cancelled_notification"("p_event_id" "uuid", "p_canceller_id" "uuid") IS 'Creates notifications when an event is cancelled. Works for both club and public events, notifying all participants.';



CREATE OR REPLACE FUNCTION "public"."create_event_created_notification"("p_event_id" "uuid", "p_creator_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_event_title VARCHAR(255);
    v_club_id UUID;
    v_club_name VARCHAR(255);
    v_creator_pseudo VARCHAR(255);
    v_member_ids UUID[];
    v_follower_ids UUID[];
BEGIN
    -- Get event and club info
    SELECT title, club_id INTO v_event_title, v_club_id 
    FROM events WHERE id = p_event_id;
    
    SELECT pseudo INTO v_creator_pseudo FROM users WHERE id = p_creator_id;
    
    -- Handle club events
    IF v_club_id IS NOT NULL THEN
        SELECT name INTO v_club_name FROM clubs WHERE id = v_club_id;
        
        -- Get all approved club members except the creator who want event notifications
        SELECT ARRAY_AGG(cm.user_id) INTO v_member_ids
        FROM club_members cm
        JOIN notification_preferences np ON cm.user_id = np.user_id
        WHERE cm.club_id = v_club_id 
          AND cm.status = 'approved'
          AND cm.user_id != p_creator_id
          AND np.event_created = true;
        
        -- Create notifications for club members
        IF v_member_ids IS NOT NULL AND array_length(v_member_ids, 1) > 0 THEN
            INSERT INTO notifications (user_id, type, title, message, club_id, event_id, actor_user_id)
            SELECT 
                unnest(v_member_ids),
                'event_created',
                'New Event in ' || v_club_name,
                COALESCE(v_creator_pseudo, 'Someone') || ' created a new event: ' || v_event_title,
                v_club_id,
                p_event_id,
                p_creator_id;
        END IF;
    ELSE
        -- Handle public events (no club)
        -- For now, we'll notify users who have previously participated in events by this creator
        -- This is a simple heuristic - you can expand this logic based on your needs
        SELECT ARRAY_AGG(DISTINCT ep.user_id) INTO v_follower_ids
        FROM event_participants ep
        JOIN events e ON ep.event_id = e.id
        JOIN notification_preferences np ON ep.user_id = np.user_id
        WHERE e.created_by = p_creator_id
          AND ep.user_id != p_creator_id
          AND ep.status = 'approved'
          AND np.event_created = true;
        
        -- Create notifications for followers
        IF v_follower_ids IS NOT NULL AND array_length(v_follower_ids, 1) > 0 THEN
            INSERT INTO notifications (user_id, type, title, message, event_id, actor_user_id)
            SELECT 
                unnest(v_follower_ids),
                'event_created',
                'New Public Event',
                COALESCE(v_creator_pseudo, 'Someone') || ' created a new event: ' || v_event_title,
                p_event_id,
                p_creator_id;
        END IF;
    END IF;
END;
$$;


ALTER FUNCTION "public"."create_event_created_notification"("p_event_id" "uuid", "p_creator_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."create_event_created_notification"("p_event_id" "uuid", "p_creator_id" "uuid") IS 'Creates notifications for new events. For club events, notifies all club members. For public events, notifies users who have participated in the creator''s previous events.';



CREATE OR REPLACE FUNCTION "public"."create_event_participant_joined_notification"("p_event_id" "uuid", "p_participant_id" "uuid", "p_event_participant_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_event_title VARCHAR(255);
    v_club_id UUID;
    v_event_owner_id UUID;
    v_participant_pseudo VARCHAR(255);
    v_should_notify BOOLEAN;
BEGIN
    -- Get event info
    SELECT title, club_id, created_by INTO v_event_title, v_club_id, v_event_owner_id
    FROM events WHERE id = p_event_id;
    
    SELECT pseudo INTO v_participant_pseudo FROM users WHERE id = p_participant_id;
    
    -- Check if event owner wants participant notifications
    SELECT event_participants INTO v_should_notify
    FROM notification_preferences 
    WHERE user_id = v_event_owner_id;
    
    -- Create notification for event owner if they want it and aren't the participant
    IF v_should_notify = true AND v_event_owner_id != p_participant_id THEN
        INSERT INTO notifications (user_id, type, title, message, club_id, event_id, event_participant_id, actor_user_id)
        VALUES (
            v_event_owner_id,
            'event_participant_joined',
            'New Participant',
            COALESCE(v_participant_pseudo, 'Someone') || ' joined your event: ' || v_event_title,
            v_club_id,
            p_event_id,
            p_event_participant_id,
            p_participant_id
        );
    END IF;
END;
$$;


ALTER FUNCTION "public"."create_event_participant_joined_notification"("p_event_id" "uuid", "p_participant_id" "uuid", "p_event_participant_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."create_event_participant_joined_notification"("p_event_id" "uuid", "p_participant_id" "uuid", "p_event_participant_id" "uuid") IS 'Creates notification for event owner when someone joins their event';



CREATE OR REPLACE FUNCTION "public"."create_event_updated_notification"("p_event_id" "uuid", "p_updater_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_event_title VARCHAR(255);
    v_club_id UUID;
    v_updater_pseudo VARCHAR(255);
    v_participant_ids UUID[];
BEGIN
    -- Get event info
    SELECT title, club_id INTO v_event_title, v_club_id 
    FROM events WHERE id = p_event_id;
    
    SELECT pseudo INTO v_updater_pseudo FROM users WHERE id = p_updater_id;
    
    -- Get all approved participants except the updater who want event update notifications
    SELECT ARRAY_AGG(ep.user_id) INTO v_participant_ids
    FROM event_participants ep
    JOIN notification_preferences np ON ep.user_id = np.user_id
    WHERE ep.event_id = p_event_id 
      AND ep.status = 'approved'
      AND ep.user_id != p_updater_id
      AND np.event_updates = true;
    
    -- Create notifications for all participants
    IF v_participant_ids IS NOT NULL AND array_length(v_participant_ids, 1) > 0 THEN
        INSERT INTO notifications (user_id, type, title, message, club_id, event_id, actor_user_id)
        SELECT 
            unnest(v_participant_ids),
            'event_updated',
            'Event Updated',
            v_event_title || ' has been updated',
            v_club_id,  -- Can be NULL for public events
            p_event_id,
            p_updater_id;
    END IF;
END;
$$;


ALTER FUNCTION "public"."create_event_updated_notification"("p_event_id" "uuid", "p_updater_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."create_event_updated_notification"("p_event_id" "uuid", "p_updater_id" "uuid") IS 'Creates notifications when an event is updated. Works for both club and public events, notifying all participants.';



CREATE OR REPLACE FUNCTION "public"."create_membership_request_notification"("p_club_id" "uuid", "p_requester_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_club_name VARCHAR(255);
    v_requester_pseudo VARCHAR(255);
    v_owner_id UUID;
    v_moderator_ids UUID[];
BEGIN
    -- Get club info
    SELECT name INTO v_club_name
    FROM clubs WHERE id = p_club_id;
    
    -- Get club owner from club_members table (not from clubs.owner_id which doesn't exist)
    SELECT cm.user_id INTO v_owner_id
    FROM club_members cm
    WHERE cm.club_id = p_club_id 
      AND cm.role = 'owner' 
      AND cm.status = 'approved';
    
    -- Get requester pseudo (club display name)
    SELECT pseudo INTO v_requester_pseudo
    FROM users WHERE id = p_requester_id;
    
    -- Get moderator IDs
    SELECT ARRAY_AGG(user_id) INTO v_moderator_ids
    FROM club_members 
    WHERE club_id = p_club_id 
      AND role = 'moderator' 
      AND status = 'approved';
    
    -- Create notifications for owner if found
    IF v_owner_id IS NOT NULL THEN
        INSERT INTO notifications (
            user_id, type, title, message, club_id, actor_user_id
        ) VALUES (
            v_owner_id,
            'membership_request',
            'New Membership Request',
            COALESCE(v_requester_pseudo, 'Someone') || ' wants to join ' || v_club_name,
            p_club_id,
            p_requester_id
        );
    END IF;
    
    -- Create notifications for moderators
    IF v_moderator_ids IS NOT NULL THEN
        INSERT INTO notifications (user_id, type, title, message, club_id, actor_user_id)
        SELECT 
            unnest(v_moderator_ids),
            'membership_request',
            'New Membership Request',
            COALESCE(v_requester_pseudo, 'Someone') || ' wants to join ' || v_club_name,
            p_club_id,
            p_requester_id;
    END IF;
END;
$$;


ALTER FUNCTION "public"."create_membership_request_notification"("p_club_id" "uuid", "p_requester_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."create_membership_request_notification"("p_club_id" "uuid", "p_requester_id" "uuid") IS 'FIXED: Get club owner from club_members table instead of non-existent clubs.owner_id column';



CREATE OR REPLACE FUNCTION "public"."create_membership_status_notification"("p_club_id" "uuid", "p_member_id" "uuid", "p_status" character varying, "p_actor_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_club_name VARCHAR(255);
    v_title VARCHAR(255);
    v_message TEXT;
BEGIN
    -- Get club name
    SELECT name INTO v_club_name FROM clubs WHERE id = p_club_id;
    
    -- Set notification content based on status
    CASE p_status
        WHEN 'approved' THEN
            v_title := 'Membership Approved';
            v_message := 'Welcome to ' || v_club_name || '! Your membership has been approved.';
        WHEN 'rejected' THEN
            v_title := 'Membership Request Declined';
            v_message := 'Your request to join ' || v_club_name || ' was not approved.';
        ELSE
            RETURN; -- Unknown status
    END CASE;
    
    -- Create notification
    INSERT INTO notifications (
        user_id, type, title, message, club_id, actor_user_id
    ) VALUES (
        p_member_id,
        'membership_' || p_status,
        v_title,
        v_message,
        p_club_id,
        p_actor_id
    );
END;
$$;


ALTER FUNCTION "public"."create_membership_status_notification"("p_club_id" "uuid", "p_member_id" "uuid", "p_status" character varying, "p_actor_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_new_comment_notification"("p_post_id" "uuid", "p_comment_id" "uuid", "p_commenter_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_post_author_id UUID;
    v_club_id UUID;
    v_club_name VARCHAR(255);
    v_commenter_pseudo VARCHAR(255);
    v_should_notify BOOLEAN;
BEGIN
    -- Get post info
    SELECT author_id, club_id INTO v_post_author_id, v_club_id
    FROM club_posts WHERE id = p_post_id;
    
    -- Don't notify if commenter is the post author
    IF v_post_author_id = p_commenter_id THEN
        RETURN;
    END IF;
    
    -- Check if post author wants comment notifications
    SELECT np.new_comments INTO v_should_notify
    FROM notification_preferences np
    WHERE np.user_id = v_post_author_id;
    
    IF NOT COALESCE(v_should_notify, true) THEN
        RETURN;
    END IF;
    
    -- Get club and commenter info
    SELECT name INTO v_club_name FROM clubs WHERE id = v_club_id;
    SELECT pseudo INTO v_commenter_pseudo FROM users WHERE id = p_commenter_id;
    
    -- Create notification for post author
    INSERT INTO notifications (
        user_id, type, title, message, club_id, post_id, comment_id, actor_user_id
    ) VALUES (
        v_post_author_id,
        'new_comment',
        'New Comment',
        COALESCE(v_commenter_pseudo, 'Someone') || ' commented on your post in ' || v_club_name,
        v_club_id,
        p_post_id,
        p_comment_id,
        p_commenter_id
    );
END;
$$;


ALTER FUNCTION "public"."create_new_comment_notification"("p_post_id" "uuid", "p_comment_id" "uuid", "p_commenter_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_new_post_notification"("p_club_id" "uuid", "p_post_id" "uuid", "p_author_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_club_name VARCHAR(255);
    v_author_pseudo VARCHAR(255);
    v_member_ids UUID[];
BEGIN
    -- Get club and author info
    SELECT name INTO v_club_name FROM clubs WHERE id = p_club_id;
    SELECT pseudo INTO v_author_pseudo FROM users WHERE id = p_author_id;
    
    -- Get all approved club members except the author
    -- Fixed: Qualify user_id references with table aliases
    SELECT ARRAY_AGG(cm.user_id) INTO v_member_ids
    FROM club_members cm
    JOIN notification_preferences np ON cm.user_id = np.user_id
    WHERE cm.club_id = p_club_id 
      AND cm.status = 'approved'
      AND cm.user_id != p_author_id
      AND np.new_posts = true;
    
    -- Create notifications for all members
    IF v_member_ids IS NOT NULL AND array_length(v_member_ids, 1) > 0 THEN
        INSERT INTO notifications (user_id, type, title, message, club_id, post_id, actor_user_id)
        SELECT 
            unnest(v_member_ids),
            'new_post',
            'New Post in ' || v_club_name,
            COALESCE(v_author_pseudo, 'Someone') || ' shared a new post',
            p_club_id,
            p_post_id,
            p_author_id;
    END IF;
END;
$$;


ALTER FUNCTION "public"."create_new_post_notification"("p_club_id" "uuid", "p_post_id" "uuid", "p_author_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."create_new_post_notification"("p_club_id" "uuid", "p_post_id" "uuid", "p_author_id" "uuid") IS 'FIXED: Create notifications for new posts with qualified user_id references to prevent ambiguity';



CREATE OR REPLACE FUNCTION "public"."create_role_change_notification"("p_club_id" "uuid", "p_member_id" "uuid", "p_old_role" character varying, "p_new_role" character varying, "p_actor_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_club_name VARCHAR(255);
    v_message TEXT;
BEGIN
    -- Get club name
    SELECT name INTO v_club_name FROM clubs WHERE id = p_club_id;
    
    -- Create role change message
    IF p_new_role = 'owner' THEN
        v_message := 'You are now the owner of ' || v_club_name || '. Congratulations!';
    ELSIF p_new_role = 'moderator' THEN
        v_message := 'You have been promoted to moderator in ' || v_club_name || '.';
    ELSIF p_old_role = 'moderator' AND p_new_role = 'member' THEN
        v_message := 'Your moderator role in ' || v_club_name || ' has been changed to member.';
    ELSE
        RETURN; -- No notification needed for regular member changes
    END IF;
    
    -- Create notification
    INSERT INTO notifications (
        user_id, type, title, message, club_id, actor_user_id
    ) VALUES (
        p_member_id,
        'role_changed',
        'Role Updated',
        v_message,
        p_club_id,
        p_actor_id
    );
END;
$$;


ALTER FUNCTION "public"."create_role_change_notification"("p_club_id" "uuid", "p_member_id" "uuid", "p_old_role" character varying, "p_new_role" character varying, "p_actor_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_straight_set"("set_name" character varying, "exercise_id_param" "uuid", "sets_count" integer, "reps_target" integer, "rest_seconds" integer, "user_id" "uuid") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    new_set_id UUID;
BEGIN
    -- Create the set
    INSERT INTO public.sets (name, type, rounds, rest_between_rounds, created_by, is_template)
    VALUES (set_name, 'straight', sets_count, rest_seconds, user_id, false)
    RETURNING id INTO new_set_id;
    
    -- Add the exercise to the set
    INSERT INTO public.set_exercises (set_id, exercise_id, order_in_set, parameter_type, target_value)
    VALUES (new_set_id, exercise_id_param, 1, 'reps', reps_target);
    
    RETURN new_set_id;
END;
$$;


ALTER FUNCTION "public"."create_straight_set"("set_name" character varying, "exercise_id_param" "uuid", "sets_count" integer, "reps_target" integer, "rest_seconds" integer, "user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_superset"("set_name" character varying, "exercise_ids" "uuid"[], "exercise_targets" integer[], "sets_count" integer, "rest_between_exercises" integer, "rest_between_rounds" integer, "user_id" "uuid") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    new_set_id UUID;
    i INTEGER;
BEGIN
    -- Validate input arrays have same length
    IF array_length(exercise_ids, 1) != array_length(exercise_targets, 1) THEN
        RAISE EXCEPTION 'Exercise IDs and targets arrays must have same length';
    END IF;
    
    -- Create the set
    INSERT INTO public.sets (name, type, rounds, rest_between_exercises, rest_between_rounds, created_by, is_template)
    VALUES (set_name, 'superset', sets_count, rest_between_exercises, rest_between_rounds, user_id, false)
    RETURNING id INTO new_set_id;
    
    -- Add exercises to the set
    FOR i IN 1..array_length(exercise_ids, 1) LOOP
        INSERT INTO public.set_exercises (set_id, exercise_id, order_in_set, parameter_type, target_value)
        VALUES (new_set_id, exercise_ids[i], i, 'reps', exercise_targets[i]);
    END LOOP;
    
    RETURN new_set_id;
END;
$$;


ALTER FUNCTION "public"."create_superset"("set_name" character varying, "exercise_ids" "uuid"[], "exercise_targets" integer[], "sets_count" integer, "rest_between_exercises" integer, "rest_between_rounds" integer, "user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_user_profile"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Only create profile if email exists
  IF NEW.email IS NOT NULL THEN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (id) DO NOTHING; -- Prevent duplicate key errors
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth process
    RAISE LOG 'Error creating user profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_user_profile"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."enqueue_push_on_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
    v_has_token BOOLEAN := false;
    v_should_send_push BOOLEAN := true;
    v_pref_exists BOOLEAN := false;
BEGIN
    -- Debug: Log the incoming notification
    RAISE LOG 'Push trigger fired for notification_id: %, user_id: %, type: %', 
        NEW.id, NEW.user_id, NEW.type;
    
    -- Check if user has any active push tokens (used within last 30 days)
    SELECT EXISTS (
        SELECT 1 FROM public.user_push_tokens 
        WHERE user_id = NEW.user_id
        AND last_used_at > NOW() - INTERVAL '30 days'
    ) INTO v_has_token;
    
    RAISE LOG 'User % has active tokens: %', NEW.user_id, v_has_token;
    
    IF v_has_token THEN
        -- Check notification preferences based on notification type
        SELECT 
            EXISTS(SELECT 1 FROM public.notification_preferences WHERE user_id = NEW.user_id),
            CASE NEW.type
                -- Club notifications
                WHEN 'membership_request' THEN COALESCE(np.push_membership_requests, true)
                WHEN 'membership_approved' THEN COALESCE(np.push_membership_updates, true)
                WHEN 'membership_rejected' THEN COALESCE(np.push_membership_updates, true)
                WHEN 'role_changed' THEN COALESCE(np.push_role_changes, true)
                WHEN 'new_post' THEN COALESCE(np.push_new_posts, false)
                WHEN 'new_comment' THEN COALESCE(np.push_new_comments, true)
                WHEN 'post_liked' THEN COALESCE(np.push_post_likes, false)
                WHEN 'comment_liked' THEN COALESCE(np.push_comment_likes, false)
                -- Event notifications
                WHEN 'event_created' THEN COALESCE(np.push_event_created, true)
                WHEN 'event_updated' THEN COALESCE(np.push_event_updates, true)
                WHEN 'event_cancelled' THEN COALESCE(np.push_event_updates, true)
                WHEN 'event_participant_joined' THEN COALESCE(np.push_event_participants, true)
                WHEN 'event_participant_left' THEN COALESCE(np.push_event_participants, true)
                WHEN 'event_approval_request' THEN COALESCE(np.push_event_approvals, true)
                WHEN 'event_participation_approved' THEN COALESCE(np.push_event_approvals, true)
                WHEN 'event_participation_rejected' THEN COALESCE(np.push_event_approvals, true)
                WHEN 'event_reminder' THEN COALESCE(np.push_event_reminders, true)
                WHEN 'event_starting_soon' THEN COALESCE(np.push_event_reminders, true)
                ELSE true
            END 
        INTO v_pref_exists, v_should_send_push
        FROM public.notification_preferences np
        WHERE np.user_id = NEW.user_id;

        -- If no preferences exist, use defaults
        IF NOT v_pref_exists THEN
            RAISE LOG 'No preferences found for user %, using defaults', NEW.user_id;
            v_should_send_push := CASE NEW.type
                -- Default off for like notifications
                WHEN 'new_post' THEN false
                WHEN 'post_liked' THEN false
                WHEN 'comment_liked' THEN false
                -- Default on for everything else including event notifications
                ELSE true
            END;
        END IF;

        RAISE LOG 'Should send push for user % and type %: %', 
            NEW.user_id, NEW.type, v_should_send_push;

        -- Enqueue if push should be sent
        IF v_should_send_push THEN
            BEGIN
                INSERT INTO public.push_queue (notification_id, user_id)
                VALUES (NEW.id, NEW.user_id)
                ON CONFLICT DO NOTHING;
                
                RAISE LOG 'Successfully queued push for notification_id: %', NEW.id;
            EXCEPTION WHEN OTHERS THEN
                RAISE LOG 'Failed to queue push: %', SQLERRM;
            END;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."enqueue_push_on_notification"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."enqueue_push_on_notification"() IS 'Automatically enqueues push notifications based on user preferences. Supports both club and event notification types.';



CREATE OR REPLACE FUNCTION "public"."ensure_notification_preferences"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Create default notification preferences for new users
    INSERT INTO notification_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."ensure_notification_preferences"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."extract_club_id_from_path"("path" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
DECLARE
  path_parts TEXT[];
  club_id_str TEXT;
BEGIN
  -- Split path by '/' and get the first part (club_id)
  path_parts := string_to_array(path, '/');
  
  IF array_length(path_parts, 1) >= 1 THEN
    club_id_str := path_parts[1];
    
    -- Validate UUID format and return
    IF club_id_str ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
      RETURN club_id_str::UUID;
    END IF;
  END IF;
  
  RETURN NULL;
END;
$_$;


ALTER FUNCTION "public"."extract_club_id_from_path"("path" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."extract_event_id_from_path"("path" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
DECLARE
  path_parts TEXT[];
  event_id_str TEXT;
BEGIN
  -- Split path by '/' and get the first part (event_id)
  -- Expected format: {event_id}/posts/{filename}
  path_parts := string_to_array(path, '/');
  
  IF array_length(path_parts, 1) >= 1 THEN
    event_id_str := path_parts[1];
    
    -- Validate UUID format and return
    IF event_id_str ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
      RETURN event_id_str::UUID;
    END IF;
  END IF;
  
  RETURN NULL;
END;
$_$;


ALTER FUNCTION "public"."extract_event_id_from_path"("path" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."extract_event_id_from_path"("path" "text") IS 'Extracts event UUID from storage path format: {event_id}/posts/{filename}';



CREATE OR REPLACE FUNCTION "public"."extract_user_id_from_path"("path" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
DECLARE
  path_parts TEXT[];
  user_id_str TEXT;
BEGIN
  -- Split path by '/' and get the first part (user_id)
  path_parts := string_to_array(path, '/');
  
  IF array_length(path_parts, 1) >= 1 THEN
    user_id_str := path_parts[1];
    
    -- Validate UUID format and return
    IF user_id_str ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
      RETURN user_id_str::UUID;
    END IF;
  END IF;
  
  RETURN NULL;
END;
$_$;


ALTER FUNCTION "public"."extract_user_id_from_path"("path" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."find_exercises_by_criteria"("category_param" "public"."exercise_category" DEFAULT NULL::"public"."exercise_category", "difficulty_min" integer DEFAULT 1, "difficulty_max" integer DEFAULT 10, "muscle_groups_param" "public"."muscle_group"[] DEFAULT NULL::"public"."muscle_group"[], "movement_pattern_param" "public"."movement_pattern" DEFAULT NULL::"public"."movement_pattern") RETURNS TABLE("exercise_id" "uuid", "name" character varying, "category" "public"."exercise_category", "difficulty_level" integer, "primary_muscles" "public"."muscle_group"[], "movement_pattern" "public"."movement_pattern")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.name,
        e.category,
        e.difficulty_level,
        e.primary_muscles,
        e.movement_pattern
    FROM exercises e
    WHERE e.is_active = true
    AND (category_param IS NULL OR e.category = category_param)
    AND e.difficulty_level BETWEEN difficulty_min AND difficulty_max
    AND (muscle_groups_param IS NULL OR e.primary_muscles && muscle_groups_param)
    AND (movement_pattern_param IS NULL OR e.movement_pattern = movement_pattern_param)
    ORDER BY e.difficulty_level, e.popularity_score DESC;
END;
$$;


ALTER FUNCTION "public"."find_exercises_by_criteria"("category_param" "public"."exercise_category", "difficulty_min" integer, "difficulty_max" integer, "muscle_groups_param" "public"."muscle_group"[], "movement_pattern_param" "public"."movement_pattern") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_club_image_url"("club_id" "uuid", "filename" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN format('club-images/%s/%s', club_id, filename);
END;
$$;


ALTER FUNCTION "public"."get_club_image_url"("club_id" "uuid", "filename" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_discipline_name"("disc_name" "text", "disc_name_fr" "text", "locale" "text" DEFAULT 'en'::"text") RETURNS "text"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
BEGIN
  IF locale = 'fr' AND disc_name_fr IS NOT NULL AND trim(disc_name_fr) != '' THEN
    RETURN disc_name_fr;
  ELSE
    RETURN disc_name;
  END IF;
END;
$$;


ALTER FUNCTION "public"."get_discipline_name"("disc_name" "text", "disc_name_fr" "text", "locale" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_equipment_name"("eq_name" "text", "eq_name_fr" "text", "locale" "text" DEFAULT 'en'::"text") RETURNS "text"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
BEGIN
  IF locale = 'fr' AND eq_name_fr IS NOT NULL AND trim(eq_name_fr) != '' THEN
    RETURN eq_name_fr;
  ELSE
    RETURN eq_name;
  END IF;
END;
$$;


ALTER FUNCTION "public"."get_equipment_name"("eq_name" "text", "eq_name_fr" "text", "locale" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_exercise_progressions"("exercise_id_param" "uuid", "progression_type_param" "public"."progression_type" DEFAULT NULL::"public"."progression_type") RETURNS TABLE("progression_id" "uuid", "target_exercise_id" "uuid", "target_exercise_name" character varying, "progression_type" "public"."progression_type", "difficulty_gap" integer, "transition_requirements" "text", "mastery_criteria" "text", "estimated_transition_time" integer)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ep.id,
        ep.target_exercise_id,
        e.name,
        ep.progression_type,
        ep.difficulty_gap,
        ep.transition_requirements,
        ep.mastery_criteria,
        ep.estimated_transition_time
    FROM exercise_progressions ep
    JOIN exercises e ON e.id = ep.target_exercise_id
    WHERE ep.exercise_id = exercise_id_param
    AND (progression_type_param IS NULL OR ep.progression_type = progression_type_param)
    ORDER BY ep.difficulty_gap;
END;
$$;


ALTER FUNCTION "public"."get_exercise_progressions"("exercise_id_param" "uuid", "progression_type_param" "public"."progression_type") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_locations_count"() RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  total_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_count FROM locations;
  RETURN total_count;
END;
$$;


ALTER FUNCTION "public"."get_locations_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_nearby_locations"("user_lat" double precision, "user_lng" double precision, "limit_count" integer DEFAULT 50) RETURNS TABLE("id" "uuid", "name" "text", "description" "text", "latitude" numeric, "longitude" numeric, "opening_hours" "jsonb", "is_open_24h" boolean, "address" "text", "created_by" "uuid", "created_at" timestamp with time zone, "updated_at" timestamp with time zone, "distance_km" double precision, "metadata" "jsonb", "average_rating" numeric, "rating_count" integer)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
  BEGIN
    RETURN QUERY
    SELECT
      l.id,
      l.name,
      l.description,
      l.latitude,
      l.longitude,
      l.opening_hours,
      l.is_open_24h,
      l.address,
      l.created_by,
      l.created_at,
      l.updated_at,
      ST_Distance(
        ST_MakePoint(l.longitude::DOUBLE PRECISION, l.latitude::DOUBLE PRECISION)::geography,
        ST_MakePoint(user_lng, user_lat)::geography
      ) / 1000 AS distance_km,
      l.metadata,
      l.average_rating,
      l.rating_count
    FROM locations l
    ORDER BY distance_km
    LIMIT limit_count;
  END;
  $$;


ALTER FUNCTION "public"."get_nearby_locations"("user_lat" double precision, "user_lng" double precision, "limit_count" integer) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_nearby_locations"("user_lat" double precision, "user_lng" double precision, "limit_count" integer) IS 'Returns nearby locations with distance calculation, metadata, and 
  rating information for display in spot content';



CREATE OR REPLACE FUNCTION "public"."get_or_create_discipline"("discipline_name" "text") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  discipline_id UUID;
  normalized_name TEXT;
  category TEXT;
BEGIN
  normalized_name := LOWER(TRIM(discipline_name));
  
  -- Try to find existing discipline
  SELECT id INTO discipline_id
  FROM disciplines
  WHERE LOWER(name) = normalized_name
     OR LOWER(REPLACE(name, ' ', '')) = LOWER(REPLACE(discipline_name, ' ', ''))
     OR LOWER(REPLACE(name, '-', ' ')) = normalized_name
  LIMIT 1;
  
  -- If not found, create new discipline
  IF discipline_id IS NULL THEN
    -- Determine category based on name
    category := CASE
      WHEN normalized_name LIKE '%calisthenics%' OR normalized_name LIKE '%street%workout%' OR normalized_name LIKE '%bodyweight%' THEN 'bodyweight'
      WHEN normalized_name LIKE '%lifting%' OR normalized_name LIKE '%crossfit%' OR normalized_name LIKE '%functional%' OR normalized_name LIKE '%strength%' THEN 'strength'
      WHEN normalized_name LIKE '%outdoor%' OR normalized_name LIKE '%bootcamp%' OR normalized_name LIKE '%cardio%' THEN 'cardio'
      WHEN normalized_name LIKE '%yoga%' OR normalized_name LIKE '%hand%balanc%' OR normalized_name LIKE '%flexibility%' THEN 'flexibility'
      WHEN normalized_name LIKE '%martial%' OR normalized_name LIKE '%combat%' OR normalized_name LIKE '%boxing%' THEN 'martial_arts'
      WHEN normalized_name LIKE '%gymnastic%' THEN 'gymnastics'
      WHEN normalized_name LIKE '%obstacle%' OR normalized_name LIKE '%ninja%' OR normalized_name LIKE '%parkour%' THEN 'obstacle'
      WHEN normalized_name LIKE '%pole%' OR normalized_name LIKE '%aerial%' OR normalized_name LIKE '%acro%' THEN 'dance'
      WHEN normalized_name LIKE '%tennis%' OR normalized_name LIKE '%climb%' OR normalized_name LIKE '%sport%' THEN 'sport'
      WHEN normalized_name LIKE '%personal%' OR normalized_name LIKE '%training%' THEN 'training'
      ELSE 'other'
    END;
    
    INSERT INTO disciplines (name, category, description, is_active)
    VALUES (discipline_name, category, 'Imported from calisthenics-parks.com', true)
    RETURNING id INTO discipline_id;
    
    RAISE NOTICE 'Created new discipline: %', discipline_name;
  END IF;
  
  RETURN discipline_id;
END;
$$;


ALTER FUNCTION "public"."get_or_create_discipline"("discipline_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_or_create_equipment"("equipment_name" "text") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  equipment_id UUID;
  normalized_name TEXT;
  category TEXT;
BEGIN
  normalized_name := normalize_equipment_name(equipment_name);
  
  -- Try to find existing equipment
  SELECT id INTO equipment_id
  FROM equipments
  WHERE LOWER(name) = normalized_name
     OR LOWER(REPLACE(name, ' ', '')) = LOWER(REPLACE(equipment_name, ' ', ''))
  LIMIT 1;
  
  -- If not found, create new equipment
  IF equipment_id IS NULL THEN
    -- Determine category based on name
    category := CASE
      WHEN normalized_name LIKE '%pull%up%' OR normalized_name LIKE '%chin%up%' OR normalized_name LIKE '%monkey%' OR normalized_name LIKE '%ring%' THEN 'pull_up'
      WHEN normalized_name LIKE '%parallel%' OR normalized_name LIKE '%dip%' THEN 'dips'
      WHEN normalized_name LIKE '%push%up%' THEN 'push_up'
      WHEN normalized_name LIKE '%ab%' OR normalized_name LIKE '%core%' OR normalized_name LIKE '%captain%' OR normalized_name LIKE '%roman%' THEN 'core'
      WHEN normalized_name LIKE '%bike%' OR normalized_name LIKE '%elliptical%' OR normalized_name LIKE '%row%' OR normalized_name LIKE '%cardio%' THEN 'cardio'
      WHEN normalized_name LIKE '%stretch%' OR normalized_name LIKE '%flexibility%' THEN 'flexibility'
      WHEN normalized_name LIKE '%balance%' OR normalized_name LIKE '%wobble%' THEN 'balance'
      WHEN normalized_name LIKE '%weight%' OR normalized_name LIKE '%strength%' OR normalized_name LIKE '%resistance%' THEN 'strength'
      WHEN normalized_name LIKE '%plyo%' OR normalized_name LIKE '%jump%' OR normalized_name LIKE '%agility%' OR normalized_name LIKE '%hurdle%' THEN 'plyometric'
      ELSE 'other'
    END;
    
    INSERT INTO equipments (name, category, description, is_active)
    VALUES (equipment_name, category, 'Imported from calisthenics-parks.com', true)
    RETURNING id INTO equipment_id;
    
    RAISE NOTICE 'Created new equipment: %', equipment_name;
  END IF;
  
  RETURN equipment_id;
END;
$$;


ALTER FUNCTION "public"."get_or_create_equipment"("equipment_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_post_image_url"("club_id" "uuid", "post_id" "uuid", "filename" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN format('post-images/%s/%s/%s', club_id, post_id, filename);
END;
$$;


ALTER FUNCTION "public"."get_post_image_url"("club_id" "uuid", "post_id" "uuid", "filename" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_recommended_exercises_for_level"("user_fitness_level" integer, "category_filter" "public"."exercise_category" DEFAULT NULL::"public"."exercise_category", "limit_count" integer DEFAULT 20) RETURNS TABLE("exercise_id" "uuid", "name" character varying, "category" "public"."exercise_category", "difficulty_level" integer, "description" "text", "primary_muscles" "public"."muscle_group"[], "parameter_type" "public"."parameter_type", "popularity_score" numeric)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.name,
        e.category,
        e.difficulty_level,
        e.description,
        e.primary_muscles,
        e.parameter_type,
        e.popularity_score
    FROM exercises e
    WHERE e.is_active = true
    AND e.difficulty_level BETWEEN (user_fitness_level - 1) AND (user_fitness_level + 2)
    AND (category_filter IS NULL OR e.category = category_filter)
    ORDER BY 
        -- Prefer exercises at or slightly above user level
        CASE 
            WHEN e.difficulty_level = user_fitness_level THEN 1
            WHEN e.difficulty_level = user_fitness_level + 1 THEN 2
            WHEN e.difficulty_level = user_fitness_level - 1 THEN 3
            ELSE 4
        END,
        e.popularity_score DESC,
        e.name
    LIMIT limit_count;
END;
$$;


ALTER FUNCTION "public"."get_recommended_exercises_for_level"("user_fitness_level" integer, "category_filter" "public"."exercise_category", "limit_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_avatar_url"("user_id" "uuid", "filename" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN format('user-avatars/%s/%s', user_id, filename);
END;
$$;


ALTER FUNCTION "public"."get_user_avatar_url"("user_id" "uuid", "filename" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_workout_with_sets"("workout_id_param" "uuid") RETURNS json
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'workout', row_to_json(w),
        'phases', (
            SELECT json_agg(
                json_build_object(
                    'phase', ws.phase,
                    'order', ws.order_in_phase,
                    'set', (
                        SELECT row_to_json(s) FROM sets s WHERE s.id = ws.set_id
                    ),
                    'exercises', (
                        SELECT json_agg(
                            json_build_object(
                                'order_in_set', se.order_in_set,
                                'exercise', (SELECT row_to_json(e) FROM exercises e WHERE e.id = se.exercise_id),
                                'parameters', json_build_object(
                                    'parameter_type', se.parameter_type,
                                    'target_value', se.target_value,
                                    'target_range_min', se.target_range_min,
                                    'target_range_max', se.target_range_max,
                                    'tempo', se.tempo,
                                    'rest_before', se.rest_before
                                )
                            ) ORDER BY se.order_in_set
                        ) FROM set_exercises se WHERE se.set_id = ws.set_id
                    )
                ) ORDER BY ws.phase, ws.order_in_phase
            ) FROM workout_sets ws WHERE ws.workout_id = workout_id_param
        )
    ) INTO result
    FROM workouts w WHERE w.id = workout_id_param;
    
    RETURN result;
END;
$$;


ALTER FUNCTION "public"."get_workout_with_sets"("workout_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  marketing boolean := coalesce((meta->>'marketing_email_opt_in')::boolean, false);
  partners boolean := coalesce((meta->>'partner_offers_opt_in')::boolean, false);
begin
  -- public.users.email is NOT NULL; skip auth users without an email
  -- (e.g. phone/anonymous sign-ins) so signup is never blocked.
  if new.email is not null then
    insert into public.users (
      id, email,
      terms_accepted_at, terms_version,
      marketing_email_opt_in, marketing_email_opt_in_at,
      partner_offers_opt_in, partner_offers_opt_in_at
    )
    values (
      new.id, new.email,
      case when meta ? 'terms_version' then now() else null end,
      meta->>'terms_version',
      marketing, case when marketing then now() else null end,
      partners, case when partners then now() else null end
    )
    on conflict (id) do nothing;
  end if;
  return new;
end $$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."import_spot"("spot_data" "jsonb") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  new_location_id UUID;
  found_equipment_id UUID;
  found_discipline_id UUID;
  spot_lat DECIMAL;
  spot_lng DECIMAL;
  spot_source_id TEXT;
  equipment_item TEXT;
  discipline_item TEXT;
  image_url TEXT;
  current_image_order INT := 1;
BEGIN
  -- Extract basic data
  spot_source_id := spot_data->>'spot_id';
  
  -- Extract coordinates if they exist
  IF spot_data->'coordinates' IS NOT NULL AND spot_data->'coordinates' != 'null'::jsonb THEN
    spot_lat := (spot_data->'coordinates'->>'lat')::DECIMAL;
    spot_lng := (spot_data->'coordinates'->>'lng')::DECIMAL;
  ELSE
    spot_lat := NULL;
    spot_lng := NULL;
  END IF;
  
  -- Check for duplicates
  IF is_duplicate_location(spot_lat, spot_lng, spot_source_id) THEN
    RAISE NOTICE 'Skipping duplicate spot: %', spot_source_id;
    RETURN FALSE;
  END IF;
  
  -- Insert location
  INSERT INTO locations (
    name,
    description,
    latitude,
    longitude,
    address,
    metadata,
    created_at,
    updated_at
  ) VALUES (
    COALESCE(spot_data->>'title', 'Workout Spot ' || spot_source_id),
    'Rating: ' || COALESCE(spot_data->>'rating', 'N/A') || '/5',
    spot_lat,
    spot_lng,
    spot_data->>'address',
    jsonb_build_object(
      'source', 'calisthenics-parks.com',
      'source_id', spot_source_id,
      'source_url', spot_data->>'url',
      'scraped_at', spot_data->>'scraped_at',
      'imported_at', NOW(),
      'country', spot_data->>'country',
      'region', spot_data->>'region',
      'city', spot_data->>'city',
      'rating', spot_data->>'rating',
      'has_coordinates', (spot_lat IS NOT NULL AND spot_lng IS NOT NULL),
      'original_data', jsonb_build_object(
        'equipment', spot_data->'equipment',
        'disciplines', spot_data->'disciplines'
      )
    ),
    NOW(),
    NOW()
  ) RETURNING id INTO new_location_id;
  
  -- Add equipment (Fixed: using unique variable name)
  IF spot_data->'equipment' IS NOT NULL AND jsonb_array_length(spot_data->'equipment') > 0 THEN
    FOR equipment_item IN SELECT jsonb_array_elements_text(spot_data->'equipment')
    LOOP
      found_equipment_id := get_or_create_equipment(equipment_item);
      
      -- Fix: Remove table prefixes from column names in ON CONFLICT clause
      INSERT INTO location_equipments (location_id, equipment_id, quantity, condition, verified)
      VALUES (new_location_id, found_equipment_id, 1, 'good', false)
      ON CONFLICT (location_id, equipment_id) DO NOTHING;
    END LOOP;
  END IF;
  
  -- Add disciplines (Fixed: using unique variable name)
  IF spot_data->'disciplines' IS NOT NULL AND jsonb_array_length(spot_data->'disciplines') > 0 THEN
    FOR discipline_item IN SELECT jsonb_array_elements_text(spot_data->'disciplines')
    LOOP
      found_discipline_id := get_or_create_discipline(discipline_item);
      
      -- Fix: Remove table prefixes from column names in ON CONFLICT clause
      INSERT INTO location_disciplines (location_id, discipline_id, popularity_score, verified)
      VALUES (new_location_id, found_discipline_id, 3, false)
      ON CONFLICT (location_id, discipline_id) DO NOTHING;
    END LOOP;
  END IF;
  
  -- Add images (Already fixed in previous migration)
  IF spot_data->'images' IS NOT NULL AND jsonb_array_length(spot_data->'images') > 0 THEN
    current_image_order := 1;
    FOR image_url IN SELECT jsonb_array_elements_text(spot_data->'images')
    LOOP
      -- Fix image URL (add https: if missing)
      IF image_url LIKE '//%' THEN
        image_url := 'https:' || image_url;
      END IF;
      
      -- Insert image with conflict resolution using exception handling
      BEGIN
        INSERT INTO location_images (location_id, image_url, image_path, image_order)
        VALUES (new_location_id, image_url, image_url, current_image_order);
      EXCEPTION WHEN unique_violation THEN
        -- Skip if this location/order combination already exists
        NULL;
      END;
      
      current_image_order := current_image_order + 1;
      EXIT WHEN current_image_order > 5; -- Limit to 5 images
    END LOOP;
  END IF;
  
  RETURN TRUE;
END;
$$;


ALTER FUNCTION "public"."import_spot"("spot_data" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_unread_notifications"("user_ids" "uuid"[]) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE users 
  SET unread_notifications_count = COALESCE(unread_notifications_count, 0) + 1
  WHERE id = ANY(user_ids);
END;
$$;


ALTER FUNCTION "public"."increment_unread_notifications"("user_ids" "uuid"[]) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."increment_unread_notifications"("user_ids" "uuid"[]) IS 'Increment unread notification count for multiple users at once';



CREATE OR REPLACE FUNCTION "public"."is_approved_club_member"("p_club_id" "uuid", "p_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_id = p_club_id 
      AND user_id = p_user_id 
      AND status = 'approved'
  );
END;
$$;


ALTER FUNCTION "public"."is_approved_club_member"("p_club_id" "uuid", "p_user_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."is_approved_club_member"("p_club_id" "uuid", "p_user_id" "uuid") IS 'Check if a user is an approved member of a club. Uses SECURITY DEFINER to avoid RLS recursion.';



CREATE OR REPLACE FUNCTION "public"."is_club_member"("user_id" "uuid", "club_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.club_members 
    WHERE club_members.user_id = is_club_member.user_id 
      AND club_members.club_id = is_club_member.club_id
      AND club_members.status = 'approved'
  );
END;
$$;


ALTER FUNCTION "public"."is_club_member"("user_id" "uuid", "club_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."is_club_member"("user_id" "uuid", "club_id" "uuid") IS 'Checks if user is approved club member (fixed table reference)';



CREATE OR REPLACE FUNCTION "public"."is_club_member_secure"("p_club_id" "uuid", "p_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_id = p_club_id 
      AND user_id = p_user_id 
      AND status = 'approved'
  );
END;
$$;


ALTER FUNCTION "public"."is_club_member_secure"("p_club_id" "uuid", "p_user_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."is_club_member_secure"("p_club_id" "uuid", "p_user_id" "uuid") IS 'Checks if user is member of club (bypasses RLS to prevent recursion)';



CREATE OR REPLACE FUNCTION "public"."is_club_owner_secure"("p_club_id" "uuid", "p_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_id = p_club_id 
      AND user_id = p_user_id 
      AND role = 'owner'
      AND status = 'approved'
  );
END;
$$;


ALTER FUNCTION "public"."is_club_owner_secure"("p_club_id" "uuid", "p_user_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."is_club_owner_secure"("p_club_id" "uuid", "p_user_id" "uuid") IS 'Checks if user is owner of club (bypasses RLS to prevent recursion)';



CREATE OR REPLACE FUNCTION "public"."is_club_staff"("user_id" "uuid", "club_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.club_members 
    WHERE club_members.user_id = is_club_staff.user_id 
      AND club_members.club_id = is_club_staff.club_id
      AND club_members.status = 'approved'
      AND club_members.role IN ('owner', 'moderator')
  );
END;
$$;


ALTER FUNCTION "public"."is_club_staff"("user_id" "uuid", "club_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."is_club_staff"("user_id" "uuid", "club_id" "uuid") IS 'Checks if user is club owner or moderator (fixed table reference)';



CREATE OR REPLACE FUNCTION "public"."is_club_staff_member"("p_club_id" "uuid", "p_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_id = p_club_id 
      AND user_id = p_user_id 
      AND role IN ('owner', 'moderator')
      AND status = 'approved'
  );
END;
$$;


ALTER FUNCTION "public"."is_club_staff_member"("p_club_id" "uuid", "p_user_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."is_club_staff_member"("p_club_id" "uuid", "p_user_id" "uuid") IS 'Checks if user is staff member of club (bypasses RLS)';



CREATE OR REPLACE FUNCTION "public"."is_duplicate_location"("p_lat" numeric, "p_lng" numeric, "p_source_id" "text") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  threshold DECIMAL := 0.0005; -- ~50 meters
BEGIN
  -- Check if coordinates are null
  IF p_lat IS NULL OR p_lng IS NULL THEN
    RETURN FALSE; -- Can't be duplicate without coordinates
  END IF;
  
  -- Check for exact source_id match in metadata
  IF EXISTS (
    SELECT 1 FROM locations 
    WHERE metadata->>'source_id' = p_source_id
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- Check for nearby locations (within threshold)
  IF EXISTS (
    SELECT 1 FROM locations 
    WHERE latitude IS NOT NULL 
      AND longitude IS NOT NULL
      AND ABS(latitude - p_lat) < threshold 
      AND ABS(longitude - p_lng) < threshold
  ) THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;


ALTER FUNCTION "public"."is_duplicate_location"("p_lat" numeric, "p_lng" numeric, "p_source_id" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_event_participant"("user_id" "uuid", "event_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM event_participants 
    WHERE event_participants.user_id = is_event_participant.user_id 
      AND event_participants.event_id = is_event_participant.event_id
      AND event_participants.status = 'approved'
  );
END;
$$;


ALTER FUNCTION "public"."is_event_participant"("user_id" "uuid", "event_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."is_event_participant"("user_id" "uuid", "event_id" "uuid") IS 'Checks if user is approved participant of an event';



CREATE OR REPLACE FUNCTION "public"."migrate_existing_workouts"() RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    workout_record RECORD;
    exercise_record RECORD;
    new_set_id UUID;
    migrated_count INTEGER := 0;
BEGIN
    -- Iterate through backed up workouts
    FOR workout_record IN SELECT * FROM workouts_backup LOOP
        -- Insert workout into new structure
        INSERT INTO public.workouts (
            id, user_id, name, description, type, difficulty_level, 
            estimated_duration, is_ai_generated, ai_provider, ai_model,
            is_public, is_template, times_completed, average_rating, likes_count,
            created_at, updated_at
        ) VALUES (
            workout_record.id, 
            workout_record.user_id,
            workout_record.name,
            workout_record.description,
            workout_record.type::workout_type,
            workout_record.difficulty_level,
            workout_record.estimated_duration,
            workout_record.is_ai_generated,
            workout_record.ai_provider,
            workout_record.ai_model,
            workout_record.is_public,
            workout_record.is_template,
            workout_record.times_completed,
            workout_record.average_rating,
            workout_record.likes_count,
            workout_record.created_at,
            workout_record.updated_at
        );
        
        -- Create a main phase set for this workout's exercises
        -- This creates a simple straight set structure for existing workouts
        INSERT INTO public.sets (name, type, rounds, created_by)
        VALUES (workout_record.name || ' - Main Exercises', 'straight', 1, workout_record.user_id)
        RETURNING id INTO new_set_id;
        
        -- Add the set to the workout in main phase
        INSERT INTO public.workout_sets (workout_id, set_id, phase, order_in_phase)
        VALUES (workout_record.id, new_set_id, 'main', 1);
        
        migrated_count := migrated_count + 1;
    END LOOP;
    
    RETURN migrated_count;
END;
$$;


ALTER FUNCTION "public"."migrate_existing_workouts"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."migrate_legacy_ratings"() RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    location_record RECORD;
    legacy_rating numeric;
    migrated_count integer := 0;
BEGIN
    -- Loop through locations with legacy ratings in metadata
    FOR location_record IN 
        SELECT id, metadata 
        FROM locations 
        WHERE metadata IS NOT NULL 
        AND metadata ? 'rating'
        AND (metadata->>'rating') IS NOT NULL
        AND (metadata->>'rating') != ''
    LOOP
        BEGIN
            -- Extract and validate legacy rating
            legacy_rating := (location_record.metadata->>'rating')::numeric;
            
            -- Only migrate valid ratings (1-5 range)
            IF legacy_rating >= 1 AND legacy_rating <= 5 THEN
                -- Update the legacy rating column and clear from metadata
                UPDATE locations 
                SET 
                    rating = legacy_rating::integer,
                    average_rating = legacy_rating,
                    rating_count = 1, -- Assume one legacy rating
                    metadata = metadata - 'rating', -- Remove rating from metadata
                    updated_at = now()
                WHERE id = location_record.id;
                
                migrated_count := migrated_count + 1;
            END IF;
        EXCEPTION 
            WHEN OTHERS THEN
                -- Skip invalid ratings and continue
                CONTINUE;
        END;
    END LOOP;
    
    RETURN migrated_count;
END;
$$;


ALTER FUNCTION "public"."migrate_legacy_ratings"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."normalize_equipment_name"("name" "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Convert to lowercase and handle common variations
  RETURN LOWER(TRIM(REPLACE(REPLACE(REPLACE(name, '-', ' '), '_', ' '), '  ', ' ')));
END;
$$;


ALTER FUNCTION "public"."normalize_equipment_name"("name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."populate_session_exercises"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    set_exercise_record RECORD;
    exercise_count INTEGER := 0;
    skip_count INTEGER := 0;
BEGIN
    -- Only populate if this is a new session with a workout_id (INSERT operation)
    IF TG_OP = 'INSERT' AND NEW.workout_id IS NOT NULL THEN
        RAISE NOTICE 'Auto-populating session exercises for session: % with workout: %', NEW.id, NEW.workout_id;
        
        -- Find all set_exercises for this workout via workout_sets
        FOR set_exercise_record IN
            SELECT 
                se.id as set_exercise_id,
                se.order_in_set,
                se.target_value,
                se.parameter_type,
                se.rest_before,
                e.name as exercise_name,
                s.rounds,
                ws_link.order_in_phase
            FROM set_exercises se
            JOIN sets s ON se.set_id = s.id
            JOIN workout_sets ws_link ON s.id = ws_link.set_id
            JOIN exercises e ON se.exercise_id = e.id
            WHERE ws_link.workout_id = NEW.workout_id
            ORDER BY ws_link.order_in_phase, se.order_in_set
        LOOP
            -- Insert session_exercise with proper exception handling (NO ON CONFLICT!)
            BEGIN
                INSERT INTO session_exercises (
                    session_id,
                    workout_exercise_id,
                    sets_completed,
                    reps_completed,
                    weight_used_kg,
                    duration_seconds,
                    completed,
                    skipped,
                    modified,
                    created_at
                ) VALUES (
                    NEW.id,
                    set_exercise_record.set_exercise_id,
                    0, -- sets_completed
                    ARRAY[]::integer[], -- reps_completed
                    ARRAY[]::numeric[], -- weight_used_kg  
                    NULL, -- duration_seconds
                    false, -- completed
                    false, -- skipped
                    false, -- modified
                    NOW()
                );
                
                exercise_count := exercise_count + 1;
                RAISE NOTICE 'Created session exercise: % -> %', set_exercise_record.exercise_name, set_exercise_record.set_exercise_id;
                
            EXCEPTION 
                WHEN unique_violation THEN
                    -- Handle duplicates gracefully without using ON CONFLICT
                    skip_count := skip_count + 1;
                    RAISE NOTICE 'Skipped duplicate session exercise for %: already exists', set_exercise_record.exercise_name;
                WHEN OTHERS THEN
                    -- Log any other errors but don't fail the trigger
                    RAISE NOTICE 'Error creating session exercise for %: %', set_exercise_record.exercise_name, SQLERRM;
            END;
            
        END LOOP;
        
        RAISE NOTICE 'Auto-populated % session exercises (skipped % duplicates) for session: %', exercise_count, skip_count, NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."populate_session_exercises"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."process_staged_imports"() RETURNS TABLE("total_processed" integer, "successful_imports" integer, "skipped_duplicates" integer, "errors" integer)
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  spot RECORD;
  success_count INT := 0;
  skip_count INT := 0;
  error_count INT := 0;
  total_count INT := 0;
  import_result BOOLEAN;
BEGIN
  -- Process each unprocessed spot
  FOR spot IN 
    SELECT id, data 
    FROM import_staging 
    WHERE processed = FALSE 
    ORDER BY id
  LOOP
    total_count := total_count + 1;
    
    BEGIN
      import_result := import_spot(spot.data);
      
      IF import_result THEN
        success_count := success_count + 1;
      ELSE
        skip_count := skip_count + 1;
      END IF;
      
      -- Mark as processed
      UPDATE import_staging 
      SET processed = TRUE 
      WHERE id = spot.id;
      
    EXCEPTION WHEN OTHERS THEN
      error_count := error_count + 1;
      
      -- Log error
      UPDATE import_staging 
      SET processed = TRUE,
          error_message = SQLERRM
      WHERE id = spot.id;
      
      RAISE NOTICE 'Error importing spot: %', SQLERRM;
    END;
    
    -- Progress update every 100 spots
    IF total_count % 100 = 0 THEN
      RAISE NOTICE 'Processed % spots...', total_count;
    END IF;
  END LOOP;
  
  RETURN QUERY SELECT total_count, success_count, skip_count, error_count;
END;
$$;


ALTER FUNCTION "public"."process_staged_imports"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refresh_location_rating"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  loc uuid := coalesce(new.location_id, old.location_id);
begin
  update public.locations l
  set rating_count   = sub.cnt,
      average_rating = sub.avg
  from (
    select count(*)::int as cnt,
           avg(rating)::numeric as avg
    from public.location_ratings
    where location_id = loc
  ) sub
  where l.id = loc;
  return null;
end $$;


ALTER FUNCTION "public"."refresh_location_rating"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reset_failed_imports"() RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  reset_count INT;
BEGIN
  -- Reset all failed imports to unprocessed
  UPDATE import_staging 
  SET processed = FALSE, 
      error_message = NULL 
  WHERE error_message IS NOT NULL;
  
  GET DIAGNOSTICS reset_count = ROW_COUNT;
  
  RAISE NOTICE 'Reset % failed imports for re-processing', reset_count;
  RETURN reset_count;
END;
$$;


ALTER FUNCTION "public"."reset_failed_imports"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rpc_approve_member"("p_membership_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_user_id UUID;
  v_club_id UUID;
  v_member_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Get membership details
  SELECT club_id, user_id INTO v_club_id, v_member_user_id
  FROM club_members 
  WHERE id = p_membership_id AND status = 'pending';
  
  IF v_club_id IS NULL THEN
    RAISE EXCEPTION 'Pending membership request not found';
  END IF;

  -- Verify user has permission to approve (owner or moderator)
  IF NOT EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_id = v_club_id 
      AND user_id = v_user_id 
      AND role IN ('owner', 'moderator')
      AND status = 'approved'
  ) THEN
    RAISE EXCEPTION 'Only owners and moderators can approve membership requests';
  END IF;

  -- Approve the membership
  UPDATE club_members 
  SET 
    status = 'approved',
    approved_at = NOW(),
    approved_by = v_user_id
  WHERE id = p_membership_id;
END;
$$;


ALTER FUNCTION "public"."rpc_approve_member"("p_membership_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."rpc_approve_member"("p_membership_id" "uuid") IS 'Approve a pending membership request (staff only)';



CREATE OR REPLACE FUNCTION "public"."rpc_change_member_role"("p_club_id" "uuid", "p_member_user_id" "uuid", "p_new_role" character varying) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_user_id UUID;
  v_user_role VARCHAR(20);
  v_current_role VARCHAR(20);
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Validate role
  IF p_new_role NOT IN ('owner', 'moderator', 'member') THEN
    RAISE EXCEPTION 'Invalid role. Must be owner, moderator, or member';
  END IF;

  -- Get current user's role
  SELECT role INTO v_user_role
  FROM club_members 
  WHERE club_id = p_club_id 
    AND user_id = v_user_id 
    AND status = 'approved';
  
  IF v_user_role != 'owner' THEN
    RAISE EXCEPTION 'Only club owners can change member roles';
  END IF;

  -- Get target user's current role
  SELECT role INTO v_current_role
  FROM club_members 
  WHERE club_id = p_club_id 
    AND user_id = p_member_user_id 
    AND status = 'approved';
  
  IF v_current_role IS NULL THEN
    RAISE EXCEPTION 'Target user is not a member of this club';
  END IF;

  -- Cannot change your own role (prevents owner from demoting themselves)
  IF v_user_id = p_member_user_id THEN
    RAISE EXCEPTION 'Cannot change your own role. Use ownership transfer instead';
  END IF;

  -- Update the role
  UPDATE club_members 
  SET role = p_new_role
  WHERE club_id = p_club_id AND user_id = p_member_user_id;
END;
$$;


ALTER FUNCTION "public"."rpc_change_member_role"("p_club_id" "uuid", "p_member_user_id" "uuid", "p_new_role" character varying) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."rpc_change_member_role"("p_club_id" "uuid", "p_member_user_id" "uuid", "p_new_role" character varying) IS 'Change member role (owners only)';



CREATE OR REPLACE FUNCTION "public"."rpc_create_club"("p_name" character varying, "p_description" "text", "p_privacy" character varying, "p_category" character varying, "p_rules" "text" DEFAULT NULL::"text", "p_cover_image_url" "text" DEFAULT NULL::"text", "p_tags" "text"[] DEFAULT ARRAY[]::"text"[], "p_linked_spot_ids" "uuid"[] DEFAULT ARRAY[]::"uuid"[]) RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_club_id UUID;
  v_user_id UUID;
  v_tag TEXT;
  v_spot_id UUID;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Input validation
  IF LENGTH(TRIM(p_name)) = 0 OR LENGTH(p_name) > 100 THEN
    RAISE EXCEPTION 'Club name must be between 1 and 100 characters';
  END IF;
  
  IF p_description IS NOT NULL AND LENGTH(p_description) > 500 THEN
    RAISE EXCEPTION 'Description cannot exceed 500 characters';
  END IF;
  
  IF p_privacy NOT IN ('public', 'private') THEN
    RAISE EXCEPTION 'Privacy must be either public or private';
  END IF;

  IF LENGTH(TRIM(p_category)) = 0 OR LENGTH(p_category) > 50 THEN
    RAISE EXCEPTION 'Category is required and cannot exceed 50 characters';
  END IF;

  IF p_rules IS NOT NULL AND LENGTH(p_rules) > 1000 THEN
    RAISE EXCEPTION 'Rules cannot exceed 1000 characters';
  END IF;

  -- Validate linked spots exist
  IF array_length(p_linked_spot_ids, 1) > 0 THEN
    IF (SELECT COUNT(*) FROM locations WHERE id = ANY(p_linked_spot_ids)) != array_length(p_linked_spot_ids, 1) THEN
      RAISE EXCEPTION 'One or more linked spots do not exist';
    END IF;
  END IF;

  -- Create club
  INSERT INTO clubs (name, description, privacy, category, rules, cover_image_url, created_by)
  VALUES (p_name, p_description, p_privacy, p_category, p_rules, p_cover_image_url, v_user_id)
  RETURNING id INTO v_club_id;

  -- Create owner membership (automatically approved)
  INSERT INTO club_members (club_id, user_id, role, status, approved_at, approved_by)
  VALUES (v_club_id, v_user_id, 'owner', 'approved', NOW(), v_user_id);

  -- Add tags
  IF array_length(p_tags, 1) > 0 THEN
    FOREACH v_tag IN ARRAY p_tags
    LOOP
      IF LENGTH(TRIM(v_tag)) > 0 AND LENGTH(v_tag) <= 50 THEN
        INSERT INTO club_tags (club_id, tag) 
        VALUES (v_club_id, TRIM(v_tag))
        ON CONFLICT (club_id, tag) DO NOTHING;
      END IF;
    END LOOP;
  END IF;

  -- Link spots
  IF array_length(p_linked_spot_ids, 1) > 0 THEN
    FOREACH v_spot_id IN ARRAY p_linked_spot_ids
    LOOP
      INSERT INTO club_spots (club_id, location_id, added_by)
      VALUES (v_club_id, v_spot_id, v_user_id)
      ON CONFLICT (club_id, location_id) DO NOTHING;
    END LOOP;
  END IF;

  RETURN v_club_id;
END;
$$;


ALTER FUNCTION "public"."rpc_create_club"("p_name" character varying, "p_description" "text", "p_privacy" character varying, "p_category" character varying, "p_rules" "text", "p_cover_image_url" "text", "p_tags" "text"[], "p_linked_spot_ids" "uuid"[]) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."rpc_create_club"("p_name" character varying, "p_description" "text", "p_privacy" character varying, "p_category" character varying, "p_rules" "text", "p_cover_image_url" "text", "p_tags" "text"[], "p_linked_spot_ids" "uuid"[]) IS 'Atomically creates a club with tags, spot links, and owner membership';



CREATE OR REPLACE FUNCTION "public"."rpc_get_club_with_details"("p_club_id" "uuid") RETURNS TABLE("id" "uuid", "name" character varying, "description" "text", "privacy" character varying, "category" character varying, "rules" "text", "cover_image_url" "text", "created_by" "uuid", "created_at" timestamp with time zone, "updated_at" timestamp with time zone, "member_count" bigint, "current_user_role" character varying, "current_user_status" character varying, "tags" "text"[], "linked_locations" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.description,
    c.privacy,
    c.category,
    c.rules,
    c.cover_image_url,
    c.created_by,
    c.created_at,
    c.updated_at,
    COALESCE(mc.member_count, 0) as member_count,
    cm.role as current_user_role,
    cm.status as current_user_status,
    COALESCE(ct.tags, ARRAY[]::TEXT[]) as tags,
    COALESCE(cs.linked_locations, '[]'::JSONB) as linked_locations
  FROM clubs c
  
  -- Member count with explicit table qualification
  LEFT JOIN (
    SELECT mc.club_id, COUNT(*) as member_count
    FROM club_members mc
    WHERE mc.status = 'approved'
    GROUP BY mc.club_id
  ) mc ON mc.club_id = c.id
  
  -- Current user membership with explicit qualification
  LEFT JOIN club_members cm ON cm.club_id = c.id AND cm.user_id = auth.uid()
  
  -- Tags aggregation with proper type casting
  LEFT JOIN (
    SELECT ct.club_id, ARRAY_AGG(ct.tag::TEXT ORDER BY ct.tag) as tags
    FROM club_tags ct
    GROUP BY ct.club_id
  ) ct ON ct.club_id = c.id
  
  -- Linked locations aggregation
  LEFT JOIN (
    SELECT 
      cs.club_id,
      JSONB_AGG(
        JSONB_BUILD_OBJECT(
          'id', l.id,
          'name', l.name,
          'latitude', l.latitude,
          'longitude', l.longitude,
          'address', l.address
        ) ORDER BY l.name
      ) as linked_locations
    FROM club_spots cs
    JOIN locations l ON l.id = cs.location_id
    GROUP BY cs.club_id
  ) cs ON cs.club_id = c.id
  
  WHERE c.id = p_club_id;
END;
$$;


ALTER FUNCTION "public"."rpc_get_club_with_details"("p_club_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."rpc_get_club_with_details"("p_club_id" "uuid") IS 'FIXED: Get club details with proper type casting for tags array';



CREATE OR REPLACE FUNCTION "public"."rpc_kick_member"("p_club_id" "uuid", "p_member_user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_user_id UUID;
  v_user_role VARCHAR(20);
  v_target_role VARCHAR(20);
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Cannot kick yourself
  IF v_user_id = p_member_user_id THEN
    RAISE EXCEPTION 'Cannot kick yourself. Use leave function instead';
  END IF;

  -- Get current user's role
  SELECT role INTO v_user_role
  FROM club_members 
  WHERE club_id = p_club_id 
    AND user_id = v_user_id 
    AND status = 'approved';
  
  IF v_user_role IS NULL THEN
    RAISE EXCEPTION 'User is not a member of this club';
  END IF;

  -- Get target user's role
  SELECT role INTO v_target_role
  FROM club_members 
  WHERE club_id = p_club_id 
    AND user_id = p_member_user_id 
    AND status = 'approved';
  
  IF v_target_role IS NULL THEN
    RAISE EXCEPTION 'Target user is not a member of this club';
  END IF;

  -- Permission checks
  -- Only owners and moderators can kick members
  IF v_user_role NOT IN ('owner', 'moderator') THEN
    RAISE EXCEPTION 'Only owners and moderators can remove members';
  END IF;

  -- Cannot kick owners
  IF v_target_role = 'owner' THEN
    RAISE EXCEPTION 'Cannot remove club owners';
  END IF;

  -- Moderators can only kick regular members, not other moderators
  IF v_user_role = 'moderator' AND v_target_role = 'moderator' THEN
    RAISE EXCEPTION 'Moderators cannot remove other moderators';
  END IF;

  -- Remove the membership
  DELETE FROM club_members 
  WHERE club_id = p_club_id AND user_id = p_member_user_id;
END;
$$;


ALTER FUNCTION "public"."rpc_kick_member"("p_club_id" "uuid", "p_member_user_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."rpc_kick_member"("p_club_id" "uuid", "p_member_user_id" "uuid") IS 'Remove a member from the club (staff only)';



CREATE OR REPLACE FUNCTION "public"."rpc_leave_club"("p_club_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_user_id UUID;
  v_user_role VARCHAR(20);
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Get user's role in the club
  SELECT role INTO v_user_role
  FROM club_members 
  WHERE club_id = p_club_id 
    AND user_id = v_user_id 
    AND status = 'approved';
  
  IF v_user_role IS NULL THEN
    RAISE EXCEPTION 'User is not a member of this club';
  END IF;

  -- Prevent owner from leaving without transferring ownership
  IF v_user_role = 'owner' THEN
    RAISE EXCEPTION 'CLUB_OWNERSHIP_TRANSFER_REQUIRED' USING 
      DETAIL = 'Club owners cannot leave without first transferring ownership to another member';
  END IF;

  -- Remove the membership
  DELETE FROM club_members 
  WHERE club_id = p_club_id AND user_id = v_user_id;
END;
$$;


ALTER FUNCTION "public"."rpc_leave_club"("p_club_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."rpc_leave_club"("p_club_id" "uuid") IS 'Leave a club (owners must transfer ownership first)';



CREATE OR REPLACE FUNCTION "public"."rpc_reject_member"("p_membership_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_user_id UUID;
  v_club_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Get club ID from membership
  SELECT club_id INTO v_club_id
  FROM club_members 
  WHERE id = p_membership_id AND status = 'pending';
  
  IF v_club_id IS NULL THEN
    RAISE EXCEPTION 'Pending membership request not found';
  END IF;

  -- Verify user has permission to reject (owner or moderator)
  IF NOT EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_id = v_club_id 
      AND user_id = v_user_id 
      AND role IN ('owner', 'moderator')
      AND status = 'approved'
  ) THEN
    RAISE EXCEPTION 'Only owners and moderators can reject membership requests';
  END IF;

  -- Reject the membership (delete the request)
  DELETE FROM club_members WHERE id = p_membership_id;
END;
$$;


ALTER FUNCTION "public"."rpc_reject_member"("p_membership_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."rpc_reject_member"("p_membership_id" "uuid") IS 'Reject a pending membership request (staff only)';



CREATE OR REPLACE FUNCTION "public"."rpc_request_club_membership"("p_club_id" "uuid") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_user_id UUID;
  v_club_privacy VARCHAR(20);
  v_membership_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Get club privacy setting
  SELECT privacy INTO v_club_privacy 
  FROM clubs WHERE id = p_club_id;
  
  IF v_club_privacy IS NULL THEN
    RAISE EXCEPTION 'Club not found';
  END IF;

  -- Check if user is already a member or has pending request with qualified reference
  IF EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_members.club_id = p_club_id 
      AND club_members.user_id = v_user_id
      AND club_members.status IN ('approved', 'pending')
  ) THEN
    RAISE EXCEPTION 'User already member or has pending request';
  END IF;

  -- Insert membership request
  INSERT INTO club_members (club_id, user_id, status, role)
  VALUES (
    p_club_id, 
    v_user_id, 
    CASE WHEN v_club_privacy = 'public' THEN 'approved' ELSE 'pending' END,
    'member'
  ) RETURNING id INTO v_membership_id;

  -- Auto-approve for public clubs
  IF v_club_privacy = 'public' THEN
    UPDATE club_members 
    SET approved_at = NOW(), approved_by = v_user_id
    WHERE id = v_membership_id;
  END IF;

  RETURN v_membership_id;
END;
$$;


ALTER FUNCTION "public"."rpc_request_club_membership"("p_club_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."rpc_request_club_membership"("p_club_id" "uuid") IS 'FIXED: Request membership with qualified column references';



CREATE OR REPLACE FUNCTION "public"."rpc_transfer_ownership"("p_club_id" "uuid", "p_new_owner_user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_user_id UUID;
  v_user_role VARCHAR(20);
  v_target_role VARCHAR(20);
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Cannot transfer to yourself
  IF v_user_id = p_new_owner_user_id THEN
    RAISE EXCEPTION 'Cannot transfer ownership to yourself';
  END IF;

  -- Verify current user is owner
  SELECT role INTO v_user_role
  FROM club_members 
  WHERE club_id = p_club_id 
    AND user_id = v_user_id 
    AND status = 'approved';
  
  IF v_user_role != 'owner' THEN
    RAISE EXCEPTION 'Only club owners can transfer ownership';
  END IF;

  -- Verify target user is a member
  SELECT role INTO v_target_role
  FROM club_members 
  WHERE club_id = p_club_id 
    AND user_id = p_new_owner_user_id 
    AND status = 'approved';
  
  IF v_target_role IS NULL THEN
    RAISE EXCEPTION 'Target user must be an approved member of the club';
  END IF;

  -- Perform atomic ownership transfer
  BEGIN
    -- Demote current owner to moderator
    UPDATE club_members 
    SET role = 'moderator'
    WHERE club_id = p_club_id AND user_id = v_user_id;

    -- Promote new owner
    UPDATE club_members 
    SET role = 'owner'
    WHERE club_id = p_club_id AND user_id = p_new_owner_user_id;
  END;
END;
$$;


ALTER FUNCTION "public"."rpc_transfer_ownership"("p_club_id" "uuid", "p_new_owner_user_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."rpc_transfer_ownership"("p_club_id" "uuid", "p_new_owner_user_id" "uuid") IS 'Transfer club ownership to another member (owners only)';



CREATE OR REPLACE FUNCTION "public"."rpc_update_club"("p_club_id" "uuid", "p_name" character varying DEFAULT NULL::character varying, "p_description" "text" DEFAULT NULL::"text", "p_privacy" character varying DEFAULT NULL::character varying, "p_category" character varying DEFAULT NULL::character varying, "p_rules" "text" DEFAULT NULL::"text", "p_cover_image_url" "text" DEFAULT NULL::"text", "p_tags" "text"[] DEFAULT NULL::"text"[], "p_linked_spot_ids" "uuid"[] DEFAULT NULL::"uuid"[]) RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_user_id UUID;
  v_tag TEXT;
  v_spot_id UUID;
  v_current_tags TEXT[];
  v_current_spots UUID[];
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Verify user is owner with qualified column reference
  IF NOT EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_members.club_id = p_club_id 
      AND club_members.user_id = v_user_id 
      AND club_members.role = 'owner' 
      AND club_members.status = 'approved'
  ) THEN
    RAISE EXCEPTION 'Only club owners can update club information';
  END IF;

  -- Input validation for provided fields
  IF p_name IS NOT NULL AND (LENGTH(TRIM(p_name)) = 0 OR LENGTH(p_name) > 100) THEN
    RAISE EXCEPTION 'Club name must be between 1 and 100 characters';
  END IF;
  
  IF p_description IS NOT NULL AND LENGTH(p_description) > 500 THEN
    RAISE EXCEPTION 'Description cannot exceed 500 characters';
  END IF;
  
  IF p_privacy IS NOT NULL AND p_privacy NOT IN ('public', 'private') THEN
    RAISE EXCEPTION 'Privacy must be either public or private';
  END IF;

  IF p_category IS NOT NULL AND (LENGTH(TRIM(p_category)) = 0 OR LENGTH(p_category) > 50) THEN
    RAISE EXCEPTION 'Category is required and cannot exceed 50 characters';
  END IF;

  IF p_rules IS NOT NULL AND LENGTH(p_rules) > 1000 THEN
    RAISE EXCEPTION 'Rules cannot exceed 1000 characters';
  END IF;

  -- Validate linked spots exist if provided
  IF p_linked_spot_ids IS NOT NULL AND array_length(p_linked_spot_ids, 1) > 0 THEN
    IF (SELECT COUNT(*) FROM locations WHERE id = ANY(p_linked_spot_ids)) != array_length(p_linked_spot_ids, 1) THEN
      RAISE EXCEPTION 'One or more linked spots do not exist';
    END IF;
  END IF;

  -- Update club basic information
  UPDATE clubs 
  SET 
    name = COALESCE(p_name, name),
    description = COALESCE(p_description, description),
    privacy = COALESCE(p_privacy, privacy),
    category = COALESCE(p_category, category),
    rules = COALESCE(p_rules, rules),
    cover_image_url = COALESCE(p_cover_image_url, cover_image_url)
  WHERE id = p_club_id;

  -- Update tags if provided
  IF p_tags IS NOT NULL THEN
    -- Get current tags
    SELECT ARRAY_AGG(tag) INTO v_current_tags
    FROM club_tags WHERE club_id = p_club_id;
    
    -- Remove tags not in new list
    IF v_current_tags IS NOT NULL THEN
      DELETE FROM club_tags 
      WHERE club_id = p_club_id 
        AND NOT (tag = ANY(p_tags));
    END IF;
    
    -- Add new tags
    FOREACH v_tag IN ARRAY p_tags
    LOOP
      IF LENGTH(TRIM(v_tag)) > 0 AND LENGTH(v_tag) <= 50 THEN
        INSERT INTO club_tags (club_id, tag) 
        VALUES (p_club_id, TRIM(v_tag))
        ON CONFLICT (club_id, tag) DO NOTHING;
      END IF;
    END LOOP;
  END IF;

  -- Update linked spots if provided
  IF p_linked_spot_ids IS NOT NULL THEN
    -- Get current spots
    SELECT ARRAY_AGG(location_id) INTO v_current_spots
    FROM club_spots WHERE club_id = p_club_id;
    
    -- Remove spots not in new list
    IF v_current_spots IS NOT NULL THEN
      DELETE FROM club_spots 
      WHERE club_id = p_club_id 
        AND NOT (location_id = ANY(p_linked_spot_ids));
    END IF;
    
    -- Add new spots
    IF array_length(p_linked_spot_ids, 1) > 0 THEN
      FOREACH v_spot_id IN ARRAY p_linked_spot_ids
      LOOP
        INSERT INTO club_spots (club_id, location_id, added_by)
        VALUES (p_club_id, v_spot_id, v_user_id)
        ON CONFLICT (club_id, location_id) DO NOTHING;
      END LOOP;
    END IF;
  END IF;

  RETURN p_club_id;
END;
$$;


ALTER FUNCTION "public"."rpc_update_club"("p_club_id" "uuid", "p_name" character varying, "p_description" "text", "p_privacy" character varying, "p_category" character varying, "p_rules" "text", "p_cover_image_url" "text", "p_tags" "text"[], "p_linked_spot_ids" "uuid"[]) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."rpc_update_club"("p_club_id" "uuid", "p_name" character varying, "p_description" "text", "p_privacy" character varying, "p_category" character varying, "p_rules" "text", "p_cover_image_url" "text", "p_tags" "text"[], "p_linked_spot_ids" "uuid"[]) IS 'FIXED: Updates club information with qualified column references';



CREATE OR REPLACE FUNCTION "public"."touch_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."touch_updated_at"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."touch_updated_at"() IS 'Universal function for updating updated_at timestamps on table updates';



CREATE OR REPLACE FUNCTION "public"."trigger_event_created_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Create notifications for new events
    PERFORM create_event_created_notification(NEW.id, NEW.created_by);
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trigger_event_created_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trigger_event_participant_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- For new participants with pending status
    IF NEW.status = 'pending' AND (OLD IS NULL OR OLD.status != 'pending') THEN
        -- For events requiring approval, notify owner
        IF EXISTS (SELECT 1 FROM events WHERE id = NEW.event_id AND requires_approval = true) THEN
            PERFORM create_event_approval_request_notification(NEW.event_id, NEW.id, NEW.user_id);
        END IF;
    END IF;
    
    -- For status changes from pending to approved
    IF OLD IS NOT NULL AND OLD.status = 'pending' AND NEW.status = 'approved' THEN
        PERFORM create_event_participant_joined_notification(NEW.event_id, NEW.user_id, NEW.id);
    END IF;
    
    -- For direct approved status (auto-approved events)
    IF OLD IS NULL AND NEW.status = 'approved' THEN
        PERFORM create_event_participant_joined_notification(NEW.event_id, NEW.user_id, NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trigger_event_participant_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trigger_event_updated_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Only notify if significant fields changed
    -- Removed location_id since it doesn't exist in the events table
    IF OLD.title != NEW.title OR 
       OLD.starts_at != NEW.starts_at OR 
       OLD.ends_at != NEW.ends_at OR
       OLD.max_participants != NEW.max_participants OR
       OLD.status != NEW.status OR
       OLD.registration_deadline != NEW.registration_deadline OR
       OLD.price_amount != NEW.price_amount OR
       OLD.description != NEW.description THEN
        PERFORM create_event_updated_notification(NEW.id, NEW.created_by);
    END IF;
    
    -- Handle cancellation
    IF OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
        PERFORM create_event_cancelled_notification(NEW.id, NEW.created_by);
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trigger_event_updated_notification"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."trigger_event_updated_notification"() IS 'Triggers notifications when events are updated. Fixed to remove non-existent location_id field check.';



CREATE OR REPLACE FUNCTION "public"."trigger_membership_request_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Only create notification for new pending memberships
    IF NEW.status = 'pending' AND (OLD IS NULL OR OLD.status != 'pending') THEN
        -- Only for private clubs (public clubs auto-approve)
        IF EXISTS (SELECT 1 FROM clubs WHERE id = NEW.club_id AND privacy = 'private') THEN
            PERFORM create_membership_request_notification(NEW.club_id, NEW.user_id);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trigger_membership_request_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trigger_membership_status_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Only notify on status changes from pending
    IF OLD.status = 'pending' AND NEW.status IN ('approved', 'rejected') THEN
        PERFORM create_membership_status_notification(
            NEW.club_id, 
            NEW.user_id, 
            NEW.status,
            auth.uid() -- Actor is the user who approved/rejected
        );
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trigger_membership_status_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trigger_new_comment_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Create notifications for new comments
    PERFORM create_new_comment_notification(NEW.post_id, NEW.id, NEW.author_id);
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trigger_new_comment_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trigger_new_post_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Create notifications for new posts
    PERFORM create_new_post_notification(NEW.club_id, NEW.id, NEW.author_id);
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trigger_new_post_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trigger_role_change_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Only notify on role changes for approved members
    IF OLD.role != NEW.role AND NEW.status = 'approved' THEN
        PERFORM create_role_change_notification(
            NEW.club_id,
            NEW.user_id,
            OLD.role,
            NEW.role,
            auth.uid() -- Actor is the user who changed the role
        );
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trigger_role_change_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trigger_update_location_rating"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        PERFORM update_location_rating(NEW.location_id);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM update_location_rating(OLD.location_id);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."trigger_update_location_rating"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."unsubscribe_marketing"("p_token" "uuid", "p_type" "text" DEFAULT 'all'::"text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  affected integer := 0;
begin
  if p_type = 'marketing_email' then
    update public.users
      set marketing_email_opt_in = false, marketing_email_opt_in_at = now()
      where unsubscribe_token = p_token;
  elsif p_type = 'partner_offers' then
    update public.users
      set partner_offers_opt_in = false, partner_offers_opt_in_at = now()
      where unsubscribe_token = p_token;
  else
    update public.users
      set marketing_email_opt_in = false, marketing_email_opt_in_at = now(),
          partner_offers_opt_in = false, partner_offers_opt_in_at = now()
      where unsubscribe_token = p_token;
  end if;
  get diagnostics affected = row_count;
  return affected > 0;
end $$;


ALTER FUNCTION "public"."unsubscribe_marketing"("p_token" "uuid", "p_type" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_enrollment_progress_manual"("p_enrollment_id" "uuid") RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    enrollment_record RECORD;
    total_planned_sessions INTEGER;
    total_completed_sessions INTEGER;
    current_adherence_rate NUMERIC;
    current_week_from_sessions INTEGER;
    result JSON;
BEGIN
    -- Get the enrollment record with program information
    SELECT e.*, p.sessions_per_week, p.duration_weeks
    INTO enrollment_record
    FROM user_program_enrollments e
    JOIN programs p ON p.id = e.program_id
    WHERE e.id = p_enrollment_id;

    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Enrollment not found',
            'enrollment_id', p_enrollment_id
        );
    END IF;

    -- Calculate total completed sessions for this enrollment
    SELECT COUNT(*)
    INTO total_completed_sessions
    FROM program_session_completions psc
    WHERE psc.enrollment_id = p_enrollment_id
    AND psc.status = 'completed';

    -- Calculate total planned sessions up to current week
    total_planned_sessions := enrollment_record.sessions_per_week * enrollment_record.current_week;

    -- Calculate adherence rate (avoid division by zero)
    IF total_planned_sessions > 0 THEN
        current_adherence_rate := (total_completed_sessions::NUMERIC / total_planned_sessions::NUMERIC) * 100;
    ELSE
        current_adherence_rate := 0;
    END IF;

    -- Calculate what week we should be in based on completed sessions
    current_week_from_sessions := LEAST(
        CEIL(total_completed_sessions::NUMERIC / enrollment_record.sessions_per_week::NUMERIC),
        enrollment_record.duration_weeks
    );

    -- Update the enrollment progress
    UPDATE user_program_enrollments
    SET 
        sessions_completed = total_completed_sessions,
        adherence_rate = current_adherence_rate,
        -- Optionally auto-advance week if user has completed all sessions for current week
        current_week = CASE 
            WHEN total_completed_sessions >= (current_week * enrollment_record.sessions_per_week) 
            THEN LEAST(current_week + 1, enrollment_record.duration_weeks)
            ELSE current_week
        END,
        weeks_completed = CASE
            WHEN total_completed_sessions >= (current_week * enrollment_record.sessions_per_week)
            THEN LEAST(current_week, enrollment_record.duration_weeks)
            ELSE GREATEST(current_week - 1, 0)
        END,
        updated_at = NOW()
    WHERE id = p_enrollment_id;

    -- Return success result with updated values
    result := json_build_object(
        'success', true,
        'enrollment_id', p_enrollment_id,
        'sessions_completed', total_completed_sessions,
        'adherence_rate', current_adherence_rate,
        'current_week', (SELECT current_week FROM user_program_enrollments WHERE id = p_enrollment_id),
        'weeks_completed', (SELECT weeks_completed FROM user_program_enrollments WHERE id = p_enrollment_id)
    );

    RETURN result;
END;
$$;


ALTER FUNCTION "public"."update_enrollment_progress_manual"("p_enrollment_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."update_enrollment_progress_manual"("p_enrollment_id" "uuid") IS 'Manual function to update user_program_enrollments progress counters. Used as fallback for trigger-based updates.';



CREATE OR REPLACE FUNCTION "public"."update_enrollment_progress_on_completion"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    enrollment_record RECORD;
    total_planned_sessions INTEGER;
    total_completed_sessions INTEGER;
    current_adherence_rate NUMERIC;
    current_week_from_sessions INTEGER;
BEGIN
    -- Get the enrollment record with program information
    SELECT e.*, p.sessions_per_week, p.duration_weeks
    INTO enrollment_record
    FROM user_program_enrollments e
    JOIN programs p ON p.id = e.program_id
    WHERE e.id = NEW.enrollment_id;

    IF NOT FOUND THEN
        RAISE WARNING 'Enrollment not found for ID: %', NEW.enrollment_id;
        RETURN NEW;
    END IF;

    -- Calculate total completed sessions for this enrollment
    SELECT COUNT(*)
    INTO total_completed_sessions
    FROM program_session_completions psc
    WHERE psc.enrollment_id = NEW.enrollment_id
    AND psc.status = 'completed';

    -- Calculate total planned sessions up to current week
    -- This is based on sessions_per_week * current_week
    total_planned_sessions := enrollment_record.sessions_per_week * enrollment_record.current_week;

    -- Calculate adherence rate (avoid division by zero)
    IF total_planned_sessions > 0 THEN
        current_adherence_rate := (total_completed_sessions::NUMERIC / total_planned_sessions::NUMERIC) * 100;
    ELSE
        current_adherence_rate := 0;
    END IF;

    -- Calculate what week we should be in based on completed sessions
    -- Assume users should progress to next week after completing all sessions for current week
    current_week_from_sessions := LEAST(
        CEIL(total_completed_sessions::NUMERIC / enrollment_record.sessions_per_week::NUMERIC),
        enrollment_record.duration_weeks
    );

    -- Update the enrollment progress
    UPDATE user_program_enrollments
    SET 
        sessions_completed = total_completed_sessions,
        adherence_rate = current_adherence_rate,
        -- Optionally auto-advance week if user has completed all sessions for current week
        current_week = CASE 
            WHEN total_completed_sessions >= (current_week * enrollment_record.sessions_per_week) 
            THEN LEAST(current_week + 1, enrollment_record.duration_weeks)
            ELSE current_week
        END,
        weeks_completed = CASE
            WHEN total_completed_sessions >= (current_week * enrollment_record.sessions_per_week)
            THEN LEAST(current_week, enrollment_record.duration_weeks)
            ELSE GREATEST(current_week - 1, 0)
        END,
        updated_at = NOW()
    WHERE id = NEW.enrollment_id;

    -- Log the update for debugging
    RAISE NOTICE 'Updated enrollment % progress: % sessions completed, % adherence rate, week %', 
        NEW.enrollment_id, total_completed_sessions, current_adherence_rate, 
        (SELECT current_week FROM user_program_enrollments WHERE id = NEW.enrollment_id);

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_enrollment_progress_on_completion"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."update_enrollment_progress_on_completion"() IS 'Automatically updates user_program_enrollments progress counters when program sessions are completed';



CREATE OR REPLACE FUNCTION "public"."update_location_rating"("location_id_param" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    user_rating_count integer;
    user_rating_sum numeric;
    user_rating_avg numeric;
    external_count integer;
    external_avg numeric;
    combined_count integer;
    combined_avg numeric;
BEGIN
    -- Get user ratings statistics
    SELECT 
        COUNT(*),
        COALESCE(SUM(rating), 0),
        AVG(rating)
    INTO 
        user_rating_count,
        user_rating_sum,
        user_rating_avg
    FROM location_ratings 
    WHERE location_id = location_id_param;

    -- Get external ratings for this location
    SELECT 
        COALESCE(external_rating_count, 0),
        external_average_rating
    INTO 
        external_count,
        external_avg
    FROM locations 
    WHERE id = location_id_param;

    -- Calculate combined statistics
    combined_count := user_rating_count + external_count;
    
    IF combined_count > 0 THEN
        -- Calculate weighted average
        IF external_count > 0 AND external_avg IS NOT NULL THEN
            -- Combine external and user ratings
            combined_avg := ROUND(
                ((external_avg * external_count) + user_rating_sum) / combined_count::numeric,
                2
            );
        ELSIF user_rating_count > 0 THEN
            -- Only user ratings exist
            combined_avg := ROUND(user_rating_avg, 2);
        ELSE
            -- This shouldn't happen, but handle it gracefully
            combined_avg := NULL;
        END IF;
    ELSE
        combined_avg := NULL;
    END IF;

    -- Update the location with combined statistics
    UPDATE locations 
    SET 
        average_rating = combined_avg,
        rating_count = combined_count,
        updated_at = now()
    WHERE id = location_id_param;
END;
$$;


ALTER FUNCTION "public"."update_location_rating"("location_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_push_token_last_used"("p_token" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    UPDATE public.user_push_tokens
    SET last_used_at = NOW()
    WHERE expo_push_token = p_token;
END;
$$;


ALTER FUNCTION "public"."update_push_token_last_used"("p_token" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_unread_notification_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Update count when notification is inserted
    IF TG_OP = 'INSERT' THEN
        UPDATE public.users 
        SET unread_notifications_count = unread_notifications_count + 1
        WHERE id = NEW.user_id;
        RETURN NEW;
    END IF;
    
    -- Update count when notification is read/unread
    IF TG_OP = 'UPDATE' THEN
        -- If notification was marked as read
        IF OLD.read_at IS NULL AND NEW.read_at IS NOT NULL THEN
            UPDATE public.users 
            SET unread_notifications_count = GREATEST(0, unread_notifications_count - 1)
            WHERE id = NEW.user_id;
        -- If notification was marked as unread
        ELSIF OLD.read_at IS NOT NULL AND NEW.read_at IS NULL THEN
            UPDATE public.users 
            SET unread_notifications_count = unread_notifications_count + 1
            WHERE id = NEW.user_id;
        END IF;
        RETURN NEW;
    END IF;
    
    -- Update count when notification is deleted
    IF TG_OP = 'DELETE' THEN
        IF OLD.read_at IS NULL THEN
            UPDATE public.users 
            SET unread_notifications_count = GREATEST(0, unread_notifications_count - 1)
            WHERE id = OLD.user_id;
        END IF;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_unread_notification_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_workout_completion_stats"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Update workout completion count when session is completed
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        UPDATE public.workouts 
        SET times_completed = times_completed + 1
        WHERE id = NEW.workout_id;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_workout_completion_stats"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_enrollment_progress"() RETURNS TABLE("enrollment_id" "uuid", "program_name" "text", "user_name" "text", "sessions_completed" integer, "sessions_expected" integer, "adherence_rate" numeric, "current_week" integer, "weeks_completed" integer, "is_valid" boolean, "issues" "text"[])
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id as enrollment_id,
        p.name as program_name,
        u.name as user_name,
        e.sessions_completed,
        (e.current_week * p.sessions_per_week) as sessions_expected,
        e.adherence_rate,
        e.current_week,
        e.weeks_completed,
        -- Validation checks
        (
            e.sessions_completed >= 0 AND
            e.adherence_rate >= 0 AND e.adherence_rate <= 100 AND
            e.current_week >= 1 AND e.current_week <= p.duration_weeks AND
            e.weeks_completed >= 0 AND e.weeks_completed < e.current_week
        ) as is_valid,
        -- Collect issues
        ARRAY(
            SELECT issue FROM (VALUES
                (CASE WHEN e.sessions_completed < 0 THEN 'Negative sessions_completed' ELSE NULL END),
                (CASE WHEN e.adherence_rate < 0 OR e.adherence_rate > 100 THEN 'Invalid adherence_rate' ELSE NULL END),
                (CASE WHEN e.current_week < 1 OR e.current_week > p.duration_weeks THEN 'Invalid current_week' ELSE NULL END),
                (CASE WHEN e.weeks_completed < 0 OR e.weeks_completed >= e.current_week THEN 'Invalid weeks_completed' ELSE NULL END)
            ) AS issues(issue)
            WHERE issue IS NOT NULL
        ) as issues
    FROM user_program_enrollments e
    JOIN programs p ON p.id = e.program_id
    LEFT JOIN users u ON u.id = e.user_id
    WHERE e.status IN ('active', 'completed', 'paused')
    ORDER BY e.created_at DESC;
END;
$$;


ALTER FUNCTION "public"."validate_enrollment_progress"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."validate_enrollment_progress"() IS 'Validates enrollment progress data and reports any inconsistencies for debugging';



CREATE OR REPLACE FUNCTION "public"."validate_set_structure"("set_id_param" "uuid") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    set_record RECORD;
    exercise_count INTEGER;
BEGIN
    SELECT * INTO set_record FROM sets WHERE id = set_id_param;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    SELECT COUNT(*) INTO exercise_count FROM set_exercises WHERE set_id = set_id_param;
    
    -- Validate based on set type
    CASE set_record.type
        WHEN 'straight' THEN
            RETURN exercise_count = 1;
        WHEN 'superset' THEN
            RETURN exercise_count BETWEEN 2 AND 4;
        WHEN 'circuit' THEN
            RETURN exercise_count >= 3;
        WHEN 'emom' THEN
            RETURN exercise_count >= 1;
        ELSE
            RETURN exercise_count >= 1;
    END CASE;
END;
$$;


ALTER FUNCTION "public"."validate_set_structure"("set_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_workout_user_assignment"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Allow system templates and AI-generated templates to have NULL user_id
    IF NEW.user_id IS NULL AND NOT (NEW.is_template = TRUE OR NEW.is_ai_generated = TRUE) THEN
        RAISE NOTICE 'Workout created without user_id assignment: % (ID: %)', NEW.name, NEW.id;
        -- Don't block it, but log for monitoring
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."validate_workout_user_assignment"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."verify_club_storage_setup"() RETURNS TABLE("club_members_table_exists" boolean, "is_club_member_function_exists" boolean, "is_club_staff_function_exists" boolean, "storage_policies_count" integer)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXISTS(SELECT 1 FROM information_schema.tables 
           WHERE table_schema = 'public' AND table_name = 'club_members') as club_members_table_exists,
    EXISTS(SELECT 1 FROM information_schema.routines 
           WHERE routine_schema = 'public' AND routine_name = 'is_club_member') as is_club_member_function_exists,
    EXISTS(SELECT 1 FROM information_schema.routines 
           WHERE routine_schema = 'public' AND routine_name = 'is_club_staff') as is_club_staff_function_exists,
    (SELECT COUNT(*)::INTEGER FROM pg_policies 
     WHERE schemaname = 'storage' AND tablename = 'objects' 
     AND policyname LIKE '%club%') as storage_policies_count;
END;
$$;


ALTER FUNCTION "public"."verify_club_storage_setup"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."verify_club_storage_setup"() IS 'Verify club storage setup is correct';


SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."club_members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "club_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" character varying(20) DEFAULT 'member'::character varying NOT NULL,
    "status" character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    "joined_at" timestamp with time zone DEFAULT "now"(),
    "approved_at" timestamp with time zone,
    "approved_by" "uuid",
    CONSTRAINT "club_members_role_check" CHECK ((("role")::"text" = ANY ((ARRAY['owner'::character varying, 'moderator'::character varying, 'member'::character varying])::"text"[]))),
    CONSTRAINT "club_members_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::"text"[])))
);


ALTER TABLE "public"."club_members" OWNER TO "postgres";


COMMENT ON TABLE "public"."club_members" IS 'Club membership records. RLS policies use SECURITY DEFINER functions to avoid recursion when checking membership status.';



CREATE TABLE IF NOT EXISTS "public"."club_post_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "post_id" "uuid" NOT NULL,
    "author_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "club_post_comments_content_check" CHECK ((("length"("content") >= 1) AND ("length"("content") <= 1000)))
);


ALTER TABLE "public"."club_post_comments" OWNER TO "postgres";


COMMENT ON TABLE "public"."club_post_comments" IS 'Comments on club posts';



CREATE TABLE IF NOT EXISTS "public"."club_post_likes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "post_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."club_post_likes" OWNER TO "postgres";


COMMENT ON TABLE "public"."club_post_likes" IS 'Stores likes for club posts with RLS policies for proper access control';



CREATE TABLE IF NOT EXISTS "public"."club_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "club_id" "uuid" NOT NULL,
    "author_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "image_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "club_posts_content_check" CHECK ((("length"("content") >= 1) AND ("length"("content") <= 2000)))
);


ALTER TABLE "public"."club_posts" OWNER TO "postgres";


COMMENT ON TABLE "public"."club_posts" IS 'Social posts within clubs';



CREATE TABLE IF NOT EXISTS "public"."club_spots" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "club_id" "uuid" NOT NULL,
    "location_id" "uuid" NOT NULL,
    "added_by" "uuid" NOT NULL,
    "added_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."club_spots" OWNER TO "postgres";


COMMENT ON TABLE "public"."club_spots" IS 'Links between clubs and workout locations';



CREATE TABLE IF NOT EXISTS "public"."club_tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "club_id" "uuid" NOT NULL,
    "tag" character varying(50) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "club_tags_tag_check" CHECK (("length"(TRIM(BOTH FROM "tag")) >= 1))
);


ALTER TABLE "public"."club_tags" OWNER TO "postgres";


COMMENT ON TABLE "public"."club_tags" IS 'Tags for club categorization and discovery';



CREATE TABLE IF NOT EXISTS "public"."clubs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text",
    "privacy" character varying(20) NOT NULL,
    "category" character varying(50) NOT NULL,
    "rules" "text",
    "cover_image_url" "text",
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "search_vector" "tsvector" GENERATED ALWAYS AS ("to_tsvector"('"english"'::"regconfig", ((((("name")::"text" || ' '::"text") || COALESCE("description", ''::"text")) || ' '::"text") || ("category")::"text"))) STORED,
    CONSTRAINT "clubs_description_check" CHECK ((("description" IS NULL) OR ("length"("description") <= 500))),
    CONSTRAINT "clubs_name_check" CHECK (("length"(TRIM(BOTH FROM "name")) >= 1)),
    CONSTRAINT "clubs_privacy_check" CHECK ((("privacy")::"text" = ANY ((ARRAY['public'::character varying, 'private'::character varying])::"text"[]))),
    CONSTRAINT "clubs_rules_check" CHECK ((("rules" IS NULL) OR ("length"("rules") <= 1000)))
);


ALTER TABLE "public"."clubs" OWNER TO "postgres";


COMMENT ON TABLE "public"."clubs" IS 'Core clubs table with full-text search support';



CREATE TABLE IF NOT EXISTS "public"."disciplines" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "category" "text" NOT NULL,
    "description" "text",
    "icon_name" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "discipline_locale_key" "text" NOT NULL,
    "description_locale_key" "text",
    CONSTRAINT "disciplines_category_check" CHECK (("category" = ANY (ARRAY['bodyweight'::"text", 'strength'::"text", 'cardio'::"text", 'flexibility'::"text", 'martial_arts'::"text", 'gymnastics'::"text", 'obstacle'::"text", 'dance'::"text", 'sport'::"text", 'training'::"text", 'other'::"text"]))),
    CONSTRAINT "disciplines_description_check" CHECK (("length"("description") <= 500)),
    CONSTRAINT "disciplines_name_check" CHECK ((("length"("name") > 0) AND ("length"("name") <= 100)))
);


ALTER TABLE "public"."disciplines" OWNER TO "postgres";


COMMENT ON TABLE "public"."disciplines" IS 'Master table of workout disciplines and activities available at locations';



COMMENT ON COLUMN "public"."disciplines"."category" IS 'Discipline category for filtering and organization';



COMMENT ON COLUMN "public"."disciplines"."icon_name" IS 'Icon identifier for UI display';



COMMENT ON COLUMN "public"."disciplines"."discipline_locale_key" IS 'Standardized locale key for internationalization (e.g., calisthenics, parkour)';



COMMENT ON COLUMN "public"."disciplines"."description_locale_key" IS 'Locale key for discipline description translations';



CREATE TABLE IF NOT EXISTS "public"."equipments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "category" "text" NOT NULL,
    "description" "text",
    "icon_name" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "equipment_locale_key" "text" NOT NULL,
    "description_locale_key" "text",
    CONSTRAINT "equipments_category_check" CHECK (("category" = ANY (ARRAY['pull_up'::"text", 'dips'::"text", 'push_up'::"text", 'core'::"text", 'cardio'::"text", 'flexibility'::"text", 'balance'::"text", 'strength'::"text", 'plyometric'::"text", 'other'::"text"]))),
    CONSTRAINT "equipments_description_check" CHECK (("length"("description") <= 500)),
    CONSTRAINT "equipments_name_check" CHECK ((("length"("name") > 0) AND ("length"("name") <= 100)))
);


ALTER TABLE "public"."equipments" OWNER TO "postgres";


COMMENT ON TABLE "public"."equipments" IS 'Master table of exercise equipment types available at workout locations';



COMMENT ON COLUMN "public"."equipments"."category" IS 'Equipment category for filtering and organization';



COMMENT ON COLUMN "public"."equipments"."icon_name" IS 'Icon identifier for UI display';



COMMENT ON COLUMN "public"."equipments"."equipment_locale_key" IS 'Standardized locale key for internationalization (e.g., pull_up_bar, parallel_bars)';



COMMENT ON COLUMN "public"."equipments"."description_locale_key" IS 'Locale key for equipment description translations';



CREATE TABLE IF NOT EXISTS "public"."event_images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "image_url" "text" NOT NULL,
    "image_path" "text" NOT NULL,
    "image_order" integer NOT NULL,
    "caption" "text",
    "file_size" integer,
    "mime_type" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "event_images_caption_check" CHECK (("length"("caption") <= 200)),
    CONSTRAINT "event_images_file_size_check" CHECK (("file_size" > 0)),
    CONSTRAINT "event_images_image_order_check" CHECK ((("image_order" >= 1) AND ("image_order" <= 10))),
    CONSTRAINT "event_images_mime_type_check" CHECK (("mime_type" = ANY (ARRAY['image/jpeg'::"text", 'image/png'::"text", 'image/webp'::"text"])))
);


ALTER TABLE "public"."event_images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_locations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "location_id" "uuid" NOT NULL,
    "is_primary" boolean DEFAULT false NOT NULL,
    "location_order" integer DEFAULT 1 NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."event_locations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_participants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "participation_type" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "approved_by" "uuid",
    "approved_at" timestamp with time zone,
    "payment_status" "text" DEFAULT 'not_required'::"text",
    "payment_reference" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "event_participants_participation_type_check" CHECK (("participation_type" = ANY (ARRAY['interested'::"text", 'participating'::"text"]))),
    CONSTRAINT "event_participants_payment_status_check" CHECK (("payment_status" = ANY (ARRAY['not_required'::"text", 'pending'::"text", 'completed'::"text", 'refunded'::"text"]))),
    CONSTRAINT "event_participants_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text", 'waitlisted'::"text"])))
);


ALTER TABLE "public"."event_participants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_post_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "post_id" "uuid" NOT NULL,
    "author_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "event_post_comments_content_check" CHECK ((("length"("content") >= 1) AND ("length"("content") <= 1000)))
);


ALTER TABLE "public"."event_post_comments" OWNER TO "postgres";


COMMENT ON TABLE "public"."event_post_comments" IS 'Comments on event posts';



CREATE TABLE IF NOT EXISTS "public"."event_post_likes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "post_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."event_post_likes" OWNER TO "postgres";


COMMENT ON TABLE "public"."event_post_likes" IS 'Likes on event posts';



CREATE TABLE IF NOT EXISTS "public"."event_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "author_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "image_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "event_posts_content_check" CHECK ((("length"("content") >= 1) AND ("length"("content") <= 2000)))
);


ALTER TABLE "public"."event_posts" OWNER TO "postgres";


COMMENT ON TABLE "public"."event_posts" IS 'Social posts within events feed';



CREATE TABLE IF NOT EXISTS "public"."event_tag_assignments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "tag_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."event_tag_assignments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "name_fr" "text" NOT NULL,
    "color" "text" DEFAULT '#3B82F6'::"text" NOT NULL,
    "icon" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."event_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "starts_at" timestamp with time zone NOT NULL,
    "ends_at" timestamp with time zone NOT NULL,
    "timezone" "text" DEFAULT 'UTC'::"text" NOT NULL,
    "max_participants" integer,
    "min_participants" integer DEFAULT 1,
    "registration_deadline" timestamp with time zone,
    "is_free" boolean DEFAULT true NOT NULL,
    "price_amount" numeric(10,2),
    "price_currency" "text" DEFAULT 'EUR'::"text",
    "visibility" "text" DEFAULT 'public'::"text" NOT NULL,
    "requires_approval" boolean DEFAULT false NOT NULL,
    "club_id" "uuid",
    "created_by" "uuid" NOT NULL,
    "organizer_name" "text",
    "organizer_contact" "text",
    "status" "text" DEFAULT 'upcoming'::"text" NOT NULL,
    "cancellation_reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "featured_image_url" "text",
    "featured_image_path" "text",
    CONSTRAINT "check_club_only_has_club" CHECK (((("visibility" = 'club_only'::"text") AND ("club_id" IS NOT NULL)) OR ("visibility" <> 'club_only'::"text"))),
    CONSTRAINT "check_price_consistency" CHECK (((("is_free" = true) AND ("price_amount" IS NULL)) OR (("is_free" = false) AND ("price_amount" IS NOT NULL) AND ("price_amount" > (0)::numeric)))),
    CONSTRAINT "events_check" CHECK (("ends_at" > "starts_at")),
    CONSTRAINT "events_description_check" CHECK (("length"("description") <= 2000)),
    CONSTRAINT "events_max_participants_check" CHECK (("max_participants" > 0)),
    CONSTRAINT "events_min_participants_check" CHECK (("min_participants" > 0)),
    CONSTRAINT "events_price_amount_check" CHECK (("price_amount" >= (0)::numeric)),
    CONSTRAINT "events_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'upcoming'::"text", 'ongoing'::"text", 'completed'::"text", 'cancelled'::"text"]))),
    CONSTRAINT "events_title_check" CHECK ((("length"("title") >= 3) AND ("length"("title") <= 100))),
    CONSTRAINT "events_visibility_check" CHECK (("visibility" = ANY (ARRAY['public'::"text", 'private'::"text", 'club_only'::"text"])))
);


ALTER TABLE "public"."events" OWNER TO "postgres";


COMMENT ON COLUMN "public"."events"."featured_image_url" IS 'URL of the event featured image';



COMMENT ON COLUMN "public"."events"."featured_image_path" IS 'Storage path of the event featured image';



CREATE TABLE IF NOT EXISTS "public"."exercise_equipment" (
    "exercise_id" "uuid" NOT NULL,
    "equipment_id" "uuid" NOT NULL,
    "requirement_type" "public"."equipment_requirement_type" NOT NULL,
    "quantity" integer DEFAULT 1,
    "usage_notes" "text"
);


ALTER TABLE "public"."exercise_equipment" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."exercise_muscles" (
    "exercise_id" "uuid" NOT NULL,
    "muscle_id" "uuid" NOT NULL,
    "involvement_type" "public"."muscle_involvement_type" NOT NULL,
    "activation_percentage" integer,
    CONSTRAINT "exercise_muscles_activation_percentage_check" CHECK ((("activation_percentage" >= 1) AND ("activation_percentage" <= 100)))
);


ALTER TABLE "public"."exercise_muscles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."exercise_progressions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "exercise_id" "uuid" NOT NULL,
    "progression_type" "public"."progression_type" NOT NULL,
    "target_exercise_id" "uuid" NOT NULL,
    "difficulty_gap" integer NOT NULL,
    "transition_requirements" "text",
    "mastery_criteria" "text",
    "estimated_transition_time" integer,
    "confidence_score" numeric(3,2) DEFAULT 1.0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "exercise_progressions_check" CHECK (("exercise_id" <> "target_exercise_id")),
    CONSTRAINT "exercise_progressions_difficulty_gap_check" CHECK ((("difficulty_gap" >= 1) AND ("difficulty_gap" <= 5)))
);


ALTER TABLE "public"."exercise_progressions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."exercises" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "name_locale_key" character varying(255) NOT NULL,
    "aliases" "text"[],
    "description" "text",
    "description_locale_key" character varying(255),
    "category" "public"."exercise_category" NOT NULL,
    "subcategory" character varying(100) NOT NULL,
    "exercise_family" character varying(100) NOT NULL,
    "difficulty_level" integer,
    "progression_tier" integer,
    "prerequisites" "uuid"[],
    "movement_pattern" "public"."movement_pattern" NOT NULL,
    "primary_muscles" "public"."muscle_group"[],
    "secondary_muscles" "public"."muscle_group"[],
    "joint_actions" "public"."joint_action"[],
    "plane_of_motion" "public"."plane_of_motion"[],
    "force_vector" "public"."force_vector" DEFAULT 'diagonal'::"public"."force_vector" NOT NULL,
    "parameter_type" "public"."parameter_type" DEFAULT 'reps'::"public"."parameter_type" NOT NULL,
    "supports_reps" boolean DEFAULT true,
    "supports_time" boolean DEFAULT false,
    "supports_distance" boolean DEFAULT false,
    "beginner_sets" integer[] DEFAULT '{2,3}'::integer[],
    "intermediate_sets" integer[] DEFAULT '{3,4}'::integer[],
    "advanced_sets" integer[] DEFAULT '{3,5}'::integer[],
    "beginner_reps" integer[] DEFAULT '{5,12}'::integer[],
    "intermediate_reps" integer[] DEFAULT '{8,15}'::integer[],
    "advanced_reps" integer[] DEFAULT '{10,20}'::integer[],
    "beginner_time" integer[] DEFAULT '{15,45}'::integer[],
    "intermediate_time" integer[] DEFAULT '{30,90}'::integer[],
    "advanced_time" integer[] DEFAULT '{45,120}'::integer[],
    "space_requirement" "public"."space_requirement" DEFAULT 'minimal'::"public"."space_requirement",
    "surface_types" "public"."surface_type"[] DEFAULT '{concrete,grass}'::"public"."surface_type"[],
    "safety_level" "public"."safety_level" DEFAULT 'moderate'::"public"."safety_level",
    "injury_risks" "public"."injury_risk"[],
    "contraindications" "public"."contraindication"[],
    "coaching_cues" "text"[],
    "common_mistakes" "text"[],
    "setup_instructions" "text",
    "execution_instructions" "text",
    "breathing_pattern" "text",
    "image_url" "text",
    "video_url" "text",
    "animation_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "is_verified" boolean DEFAULT false,
    "popularity_score" numeric(3,2) DEFAULT 0.0,
    "is_active" boolean DEFAULT true,
    CONSTRAINT "exercises_difficulty_level_check" CHECK ((("difficulty_level" >= 1) AND ("difficulty_level" <= 10)))
);


ALTER TABLE "public"."exercises" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."location_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "location_id" "uuid",
    "user_id" "uuid",
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "location_comments_content_check" CHECK ((("length"("content") > 0) AND ("length"("content") <= 1000)))
);


ALTER TABLE "public"."location_comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."location_disciplines" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "location_id" "uuid" NOT NULL,
    "discipline_id" "uuid" NOT NULL,
    "popularity_score" integer DEFAULT 1,
    "notes" "text",
    "added_by" "uuid",
    "verified" boolean DEFAULT false,
    "verified_by" "uuid",
    "verified_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "location_disciplines_notes_check" CHECK (("length"("notes") <= 200)),
    CONSTRAINT "location_disciplines_popularity_score_check" CHECK ((("popularity_score" >= 1) AND ("popularity_score" <= 5)))
);


ALTER TABLE "public"."location_disciplines" OWNER TO "postgres";


COMMENT ON TABLE "public"."location_disciplines" IS 'Junction table linking locations with their practiced disciplines';



COMMENT ON COLUMN "public"."location_disciplines"."popularity_score" IS 'How popular this discipline is at this location (1-5 scale)';



COMMENT ON COLUMN "public"."location_disciplines"."notes" IS 'Additional notes about practicing this discipline at this location';



COMMENT ON COLUMN "public"."location_disciplines"."verified" IS 'Whether discipline practice has been verified by community';



COMMENT ON COLUMN "public"."location_disciplines"."verified_by" IS 'User who verified the discipline';



CREATE TABLE IF NOT EXISTS "public"."location_equipments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "location_id" "uuid" NOT NULL,
    "equipment_id" "uuid" NOT NULL,
    "quantity" integer DEFAULT 1,
    "condition" "text" DEFAULT 'good'::"text",
    "notes" "text",
    "added_by" "uuid",
    "verified" boolean DEFAULT false,
    "verified_by" "uuid",
    "verified_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "location_equipments_condition_check" CHECK (("condition" = ANY (ARRAY['excellent'::"text", 'good'::"text", 'fair'::"text", 'poor'::"text"]))),
    CONSTRAINT "location_equipments_notes_check" CHECK (("length"("notes") <= 200)),
    CONSTRAINT "location_equipments_quantity_check" CHECK ((("quantity" > 0) AND ("quantity" <= 50)))
);


ALTER TABLE "public"."location_equipments" OWNER TO "postgres";


COMMENT ON TABLE "public"."location_equipments" IS 'Junction table linking locations with their available equipment';



COMMENT ON COLUMN "public"."location_equipments"."condition" IS 'User-reported condition of the equipment';



COMMENT ON COLUMN "public"."location_equipments"."notes" IS 'Additional notes about the equipment at this location';



COMMENT ON COLUMN "public"."location_equipments"."verified" IS 'Whether equipment presence has been verified by community';



COMMENT ON COLUMN "public"."location_equipments"."verified_by" IS 'User who verified the equipment';



CREATE TABLE IF NOT EXISTS "public"."location_images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "location_id" "uuid",
    "image_url" "text" NOT NULL,
    "image_path" "text" NOT NULL,
    "image_order" integer NOT NULL,
    "file_size" integer,
    "mime_type" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "uploaded_by" "uuid",
    CONSTRAINT "location_images_file_size_check" CHECK (("file_size" > 0)),
    CONSTRAINT "location_images_image_order_check" CHECK ((("image_order" >= 1) AND ("image_order" <= 10))),
    CONSTRAINT "location_images_mime_type_check" CHECK (("mime_type" = ANY (ARRAY['image/jpeg'::"text", 'image/jpg'::"text", 'image/png'::"text", 'image/webp'::"text", 'image/gif'::"text", 'image/bmp'::"text", 'image/tiff'::"text"])))
);


ALTER TABLE "public"."location_images" OWNER TO "postgres";


COMMENT ON COLUMN "public"."location_images"."uploaded_by" IS 'User who uploaded this image to the location';



COMMENT ON CONSTRAINT "location_images_image_order_check" ON "public"."location_images" IS 'Allows image ordering from 1 to 10 to support up to 10 images per location';



COMMENT ON CONSTRAINT "location_images_mime_type_check" ON "public"."location_images" IS 'Allows common image MIME types including jpg, jpeg, png, webp, gif, bmp, tiff';



CREATE TABLE IF NOT EXISTS "public"."location_likes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "location_id" "uuid",
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."location_likes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."location_ratings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "location_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "rating" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "location_ratings_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."location_ratings" OWNER TO "postgres";


COMMENT ON TABLE "public"."location_ratings" IS 'Individual user ratings for locations (1-5 stars)';



COMMENT ON COLUMN "public"."location_ratings"."location_id" IS 'Reference to the rated location';



COMMENT ON COLUMN "public"."location_ratings"."user_id" IS 'User who submitted the rating';



COMMENT ON COLUMN "public"."location_ratings"."rating" IS 'Rating value from 1 to 5 stars';



CREATE TABLE IF NOT EXISTS "public"."locations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "latitude" numeric(10,8),
    "longitude" numeric(11,8),
    "opening_hours" "jsonb",
    "is_open_24h" boolean DEFAULT false,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "address" "text",
    "contributor" "text",
    "rating" integer,
    "city" "text",
    "region" "text",
    "country" "text",
    "metadata" "jsonb",
    "average_rating" numeric(3,2) DEFAULT NULL::numeric,
    "rating_count" integer DEFAULT 0,
    "external_rating_count" integer DEFAULT 0,
    "external_average_rating" numeric(3,2) DEFAULT NULL::numeric,
    CONSTRAINT "locations_city_check" CHECK (("length"("city") <= 100)),
    CONSTRAINT "locations_contributor_check" CHECK (("length"("contributor") <= 100)),
    CONSTRAINT "locations_country_check" CHECK (("length"("country") <= 100)),
    CONSTRAINT "locations_latitude_check" CHECK ((("latitude" IS NULL) OR (("latitude" >= ('-90'::integer)::numeric) AND ("latitude" <= (90)::numeric)))),
    CONSTRAINT "locations_longitude_check" CHECK ((("longitude" IS NULL) OR (("longitude" >= ('-180'::integer)::numeric) AND ("longitude" <= (180)::numeric)))),
    CONSTRAINT "locations_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5))),
    CONSTRAINT "locations_region_check" CHECK (("length"("region") <= 100))
);


ALTER TABLE "public"."locations" OWNER TO "postgres";


COMMENT ON COLUMN "public"."locations"."address" IS 'Mapbox formatted address string for display and search purposes';



COMMENT ON COLUMN "public"."locations"."contributor" IS 'Username or identifier of the person who contributed this location data';



COMMENT ON COLUMN "public"."locations"."rating" IS 'Community rating of the location quality (1-5 scale)';



COMMENT ON COLUMN "public"."locations"."city" IS 'City where the location is situated';



COMMENT ON COLUMN "public"."locations"."region" IS 'Region/state/province where the location is situated';



COMMENT ON COLUMN "public"."locations"."country" IS 'Country where the location is situated';



COMMENT ON COLUMN "public"."locations"."metadata" IS 'JSON metadata for tracking data source, import details, and additional properties';



COMMENT ON COLUMN "public"."locations"."average_rating" IS 'Calculated average rating from user reviews (1.00-5.00)';



COMMENT ON COLUMN "public"."locations"."rating_count" IS 'Total number of user ratings';



COMMENT ON COLUMN "public"."locations"."external_rating_count" IS 'Number of ratings from external sources (import/scraping)';



COMMENT ON COLUMN "public"."locations"."external_average_rating" IS 'Average rating from external sources (import/scraping)';



CREATE TABLE IF NOT EXISTS "public"."muscles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "name_locale_key" character varying(255) NOT NULL,
    "muscle_group" character varying(100) NOT NULL,
    "description" "text",
    "anatomy_image_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."muscles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notification_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "membership_requests" boolean DEFAULT true,
    "membership_updates" boolean DEFAULT true,
    "role_changes" boolean DEFAULT true,
    "new_posts" boolean DEFAULT true,
    "new_comments" boolean DEFAULT true,
    "post_likes" boolean DEFAULT false,
    "comment_likes" boolean DEFAULT false,
    "push_notifications" boolean DEFAULT true,
    "email_notifications" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "push_membership_requests" boolean DEFAULT true,
    "push_membership_updates" boolean DEFAULT true,
    "push_role_changes" boolean DEFAULT true,
    "push_new_posts" boolean DEFAULT false,
    "push_new_comments" boolean DEFAULT true,
    "push_post_likes" boolean DEFAULT false,
    "push_comment_likes" boolean DEFAULT false,
    "push_mentions" boolean DEFAULT true,
    "event_created" boolean DEFAULT true,
    "event_updates" boolean DEFAULT true,
    "event_participants" boolean DEFAULT true,
    "event_approvals" boolean DEFAULT true,
    "event_reminders" boolean DEFAULT true,
    "push_event_created" boolean DEFAULT true,
    "push_event_updates" boolean DEFAULT true,
    "push_event_participants" boolean DEFAULT true,
    "push_event_approvals" boolean DEFAULT true,
    "push_event_reminders" boolean DEFAULT true
);


ALTER TABLE "public"."notification_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" character varying(50) NOT NULL,
    "title" character varying(255) NOT NULL,
    "message" "text" NOT NULL,
    "club_id" "uuid",
    "post_id" "uuid",
    "comment_id" "uuid",
    "actor_user_id" "uuid",
    "read_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "event_id" "uuid",
    "event_participant_id" "uuid",
    "app_version" character varying(50),
    "update_id" character varying(100),
    "metadata" "jsonb",
    CONSTRAINT "notifications_type_check" CHECK ((("type" IS NOT NULL) AND (("type")::"text" <> ''::"text")))
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


COMMENT ON COLUMN "public"."notifications"."type" IS 'Notification type (flexible string: membership_request, app_update, etc.)';



COMMENT ON COLUMN "public"."notifications"."app_version" IS 'App version for app_update notifications (e.g., 1.0.1, 1.0.0-beta.1+build.123) - up to 50 characters';



COMMENT ON COLUMN "public"."notifications"."update_id" IS 'Unique identifier for app updates to prevent duplicate notifications';



COMMENT ON COLUMN "public"."notifications"."metadata" IS 'Additional metadata for notifications (changelog, update size, etc.)';



COMMENT ON CONSTRAINT "notifications_type_check" ON "public"."notifications" IS 'Ensures notification type is present - allows flexible type strings including app_update';



CREATE TABLE IF NOT EXISTS "public"."program_phases" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "program_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "phase_type" "public"."program_phase" DEFAULT 'build'::"public"."program_phase" NOT NULL,
    "order_index" integer NOT NULL,
    "duration_weeks" integer NOT NULL,
    "start_week" integer NOT NULL,
    "intensity_range" integer[] DEFAULT '{5,7}'::integer[],
    "volume_emphasis" "text" DEFAULT 'moderate'::"text",
    "focus_areas" "text"[] DEFAULT '{}'::"text"[],
    "training_emphasis" "jsonb" DEFAULT '{}'::"jsonb",
    "recovery_emphasis" "jsonb" DEFAULT '{}'::"jsonb",
    "deload_protocol" "jsonb" DEFAULT '{}'::"jsonb",
    "assessments" "jsonb" DEFAULT '{}'::"jsonb",
    "milestones" "jsonb" DEFAULT '{}'::"jsonb",
    "progression_rules" "jsonb" DEFAULT '{}'::"jsonb",
    "adaptation_triggers" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "program_phases_duration_weeks_check" CHECK (("duration_weeks" >= 1)),
    CONSTRAINT "program_phases_start_week_check" CHECK (("start_week" >= 1))
);


ALTER TABLE "public"."program_phases" OWNER TO "postgres";


COMMENT ON TABLE "public"."program_phases" IS 'Training phases within programs (preparation, build, peak, etc.)';



COMMENT ON COLUMN "public"."program_phases"."intensity_range" IS 'Training intensity range for this phase [min, max]';



CREATE TABLE IF NOT EXISTS "public"."program_reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "program_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "enrollment_id" "uuid",
    "rating" integer NOT NULL,
    "title" "text",
    "review_text" "text",
    "effectiveness_rating" integer,
    "difficulty_rating" integer,
    "enjoyment_rating" integer,
    "weeks_completed" integer,
    "user_fitness_level" "text",
    "user_goals" "text"[],
    "would_recommend" boolean,
    "recommended_for" "text"[],
    "not_recommended_for" "text"[],
    "is_verified" boolean DEFAULT false NOT NULL,
    "is_featured" boolean DEFAULT false NOT NULL,
    "is_hidden" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "program_reviews_difficulty_rating_check" CHECK ((("difficulty_rating" >= 1) AND ("difficulty_rating" <= 5))),
    CONSTRAINT "program_reviews_effectiveness_rating_check" CHECK ((("effectiveness_rating" >= 1) AND ("effectiveness_rating" <= 5))),
    CONSTRAINT "program_reviews_enjoyment_rating_check" CHECK ((("enjoyment_rating" >= 1) AND ("enjoyment_rating" <= 5))),
    CONSTRAINT "program_reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."program_reviews" OWNER TO "postgres";


COMMENT ON TABLE "public"."program_reviews" IS 'User reviews and ratings for completed programs';



CREATE TABLE IF NOT EXISTS "public"."program_session_completions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "enrollment_id" "uuid" NOT NULL,
    "program_workout_id" "uuid" NOT NULL,
    "workout_session_id" "uuid",
    "status" "text" DEFAULT 'completed'::"text" NOT NULL,
    "completion_date" timestamp with time zone DEFAULT "now"() NOT NULL,
    "scheduled_date" "date",
    "actual_duration" integer,
    "perceived_exertion" integer,
    "session_rating" integer,
    "modifications_made" "jsonb" DEFAULT '{}'::"jsonb",
    "equipment_substitutions" "jsonb" DEFAULT '{}'::"jsonb",
    "exercise_substitutions" "jsonb" DEFAULT '{}'::"jsonb",
    "user_notes" "text",
    "difficulty_feedback" "text",
    "energy_level" "text",
    "motivation_level" "text",
    "pre_session_readiness" integer,
    "post_session_fatigue" integer,
    "recovery_rating" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "program_session_completions_perceived_exertion_check" CHECK ((("perceived_exertion" >= 1) AND ("perceived_exertion" <= 10))),
    CONSTRAINT "program_session_completions_post_session_fatigue_check" CHECK ((("post_session_fatigue" >= 1) AND ("post_session_fatigue" <= 10))),
    CONSTRAINT "program_session_completions_pre_session_readiness_check" CHECK ((("pre_session_readiness" >= 1) AND ("pre_session_readiness" <= 10))),
    CONSTRAINT "program_session_completions_recovery_rating_check" CHECK ((("recovery_rating" >= 1) AND ("recovery_rating" <= 10))),
    CONSTRAINT "program_session_completions_session_rating_check" CHECK ((("session_rating" >= 1) AND ("session_rating" <= 5)))
);


ALTER TABLE "public"."program_session_completions" OWNER TO "postgres";


COMMENT ON TABLE "public"."program_session_completions" IS 'Individual workout session completion tracking';



COMMENT ON COLUMN "public"."program_session_completions"."perceived_exertion" IS 'User-reported exertion level (1-10 RPE scale)';



CREATE TABLE IF NOT EXISTS "public"."program_weeks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "program_id" "uuid" NOT NULL,
    "phase_id" "uuid",
    "week_number" integer NOT NULL,
    "name" "text",
    "description" "text",
    "intensity_target" integer,
    "volume_target" "text",
    "is_deload_week" boolean DEFAULT false NOT NULL,
    "is_test_week" boolean DEFAULT false NOT NULL,
    "planned_sessions" integer NOT NULL,
    "rest_days" integer DEFAULT 1,
    "coaching_notes" "text",
    "user_instructions" "text",
    "preparation_notes" "text",
    "alternative_options" "jsonb" DEFAULT '{}'::"jsonb",
    "scaling_options" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "program_weeks_intensity_target_check" CHECK ((("intensity_target" >= 1) AND ("intensity_target" <= 10))),
    CONSTRAINT "program_weeks_planned_sessions_check" CHECK (("planned_sessions" >= 1)),
    CONSTRAINT "program_weeks_week_number_check" CHECK (("week_number" >= 1))
);


ALTER TABLE "public"."program_weeks" OWNER TO "postgres";


COMMENT ON TABLE "public"."program_weeks" IS 'Week-by-week program structure and planning';



CREATE TABLE IF NOT EXISTS "public"."program_workouts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "program_id" "uuid" NOT NULL,
    "week_id" "uuid" NOT NULL,
    "workout_id" "uuid",
    "day_of_week" integer NOT NULL,
    "session_order" integer DEFAULT 1 NOT NULL,
    "session_type" "text" DEFAULT 'main'::"text" NOT NULL,
    "session_priority" "text" DEFAULT 'required'::"text" NOT NULL,
    "workout_modifications" "jsonb" DEFAULT '{}'::"jsonb",
    "scaling_instructions" "text",
    "substitution_options" "jsonb" DEFAULT '{}'::"jsonb",
    "pre_session_notes" "text",
    "post_session_notes" "text",
    "recovery_protocols" "text",
    "estimated_duration" integer,
    "difficulty_override" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "program_workouts_day_of_week_check" CHECK ((("day_of_week" >= 1) AND ("day_of_week" <= 7))),
    CONSTRAINT "program_workouts_difficulty_override_check" CHECK ((("difficulty_override" >= 1) AND ("difficulty_override" <= 10)))
);


ALTER TABLE "public"."program_workouts" OWNER TO "postgres";


COMMENT ON TABLE "public"."program_workouts" IS 'Individual workouts scheduled within program weeks';



CREATE TABLE IF NOT EXISTS "public"."programs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "summary" "text",
    "duration_weeks" integer NOT NULL,
    "sessions_per_week" integer NOT NULL,
    "estimated_session_duration" integer,
    "program_type" "text" DEFAULT 'strength'::"text" NOT NULL,
    "difficulty_level" integer DEFAULT 5 NOT NULL,
    "target_population" "text"[],
    "periodization_model" "public"."periodization_model" DEFAULT 'linear'::"public"."periodization_model" NOT NULL,
    "periodization_config" "jsonb" DEFAULT '{}'::"jsonb",
    "created_by" "uuid",
    "is_public" boolean DEFAULT false NOT NULL,
    "is_template" boolean DEFAULT false NOT NULL,
    "template_category" "text",
    "primary_goals" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "secondary_goals" "text"[] DEFAULT '{}'::"text"[],
    "equipment_requirements" "uuid"[] DEFAULT '{}'::"uuid"[],
    "space_requirements" "text"[],
    "prerequisites" "jsonb" DEFAULT '{}'::"jsonb",
    "contraindications" "jsonb" DEFAULT '{}'::"jsonb",
    "special_considerations" "text",
    "is_ai_generated" boolean DEFAULT false NOT NULL,
    "ai_provider" "text",
    "ai_model" "text",
    "generation_params" "jsonb",
    "generation_prompt" "text",
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "version" integer DEFAULT 1 NOT NULL,
    "license" "text",
    "attribution" "text",
    "total_enrollments" integer DEFAULT 0 NOT NULL,
    "completion_rate" numeric(5,2),
    "average_rating" numeric(3,2),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "published_at" timestamp with time zone,
    "archived_at" timestamp with time zone,
    CONSTRAINT "programs_difficulty_level_check" CHECK ((("difficulty_level" >= 1) AND ("difficulty_level" <= 10))),
    CONSTRAINT "programs_duration_weeks_check" CHECK ((("duration_weeks" >= 1) AND ("duration_weeks" <= 52))),
    CONSTRAINT "programs_sessions_per_week_check" CHECK ((("sessions_per_week" >= 1) AND ("sessions_per_week" <= 14)))
);


ALTER TABLE "public"."programs" OWNER TO "postgres";


COMMENT ON TABLE "public"."programs" IS 'Multi-week training programs with periodization support';



COMMENT ON COLUMN "public"."programs"."difficulty_level" IS 'Program difficulty on 1-10 scale';



COMMENT ON COLUMN "public"."programs"."periodization_model" IS 'Training periodization strategy used';



CREATE TABLE IF NOT EXISTS "public"."push_queue" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "notification_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "status" character varying(20) DEFAULT 'pending'::character varying,
    "attempts" integer DEFAULT 0,
    "sent_at" timestamp with time zone,
    "error_details" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "push_queue_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['pending'::character varying, 'sent'::character varying, 'failed'::character varying, 'expired'::character varying])::"text"[])))
);


ALTER TABLE "public"."push_queue" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "target_type" "text" NOT NULL,
    "target_id" "uuid" NOT NULL,
    "reporter_id" "uuid" NOT NULL,
    "reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "reports_target_type_check" CHECK (("target_type" = ANY (ARRAY['spot'::"text", 'comment'::"text"])))
);


ALTER TABLE "public"."reports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."session_exercises" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "uuid" NOT NULL,
    "workout_exercise_id" "uuid" NOT NULL,
    "sets_completed" integer,
    "reps_completed" integer[],
    "weight_used_kg" numeric(8,2)[],
    "duration_seconds" integer,
    "distance_meters" numeric(10,2),
    "max_heart_rate" integer,
    "calories_burned" integer,
    "completed" boolean DEFAULT false,
    "skipped" boolean DEFAULT false,
    "modified" boolean DEFAULT false,
    "modification_notes" "text",
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."session_exercises" OWNER TO "postgres";


COMMENT ON TABLE "public"."session_exercises" IS 'Session exercises track individual set_exercises within a workout session. Same underlying exercises can appear multiple times in different sets, so no unique constraint on (session_id, workout_exercise_id) should exist.';



COMMENT ON COLUMN "public"."session_exercises"."workout_exercise_id" IS 'References set_exercises.id in enhanced architecture, workout_template_exercises.id in legacy system';



CREATE TABLE IF NOT EXISTS "public"."set_exercises" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "set_id" "uuid" NOT NULL,
    "exercise_id" "uuid" NOT NULL,
    "order_in_set" integer NOT NULL,
    "parameter_type" "public"."parameter_type" NOT NULL,
    "target_value" integer,
    "target_range_min" integer,
    "target_range_max" integer,
    "intensity_percentage" integer,
    "tempo" character varying(20),
    "range_of_motion" "public"."rom_specification" DEFAULT 'full'::"public"."rom_specification",
    "rest_before" integer,
    "time_cap" integer,
    "cluster_rest" integer,
    "isometric_holds" "jsonb",
    "modifications" "jsonb",
    "coaching_cues" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "set_exercises_intensity_percentage_check" CHECK ((("intensity_percentage" >= 1) AND ("intensity_percentage" <= 100)))
);


ALTER TABLE "public"."set_exercises" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255),
    "description" "text",
    "type" "public"."set_type" NOT NULL,
    "rounds" integer DEFAULT 1 NOT NULL,
    "rest_between_exercises" integer,
    "rest_between_rounds" integer,
    "rest_after_set" integer,
    "time_domain" integer,
    "target_rounds" integer,
    "score_method" "public"."score_method",
    "instructions" "text",
    "coaching_notes" "text"[],
    "difficulty_level" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid",
    "is_template" boolean DEFAULT false,
    CONSTRAINT "sets_difficulty_level_check" CHECK ((("difficulty_level" >= 1) AND ("difficulty_level" <= 10)))
);


ALTER TABLE "public"."sets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_disciplines" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "discipline_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_disciplines" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_disciplines" IS 'Junction table linking users with their fitness disciplines';



COMMENT ON COLUMN "public"."user_disciplines"."user_id" IS 'Reference to user';



COMMENT ON COLUMN "public"."user_disciplines"."discipline_id" IS 'Reference to discipline the user practices';



CREATE TABLE IF NOT EXISTS "public"."user_program_enrollments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "program_id" "uuid" NOT NULL,
    "status" "public"."program_status" DEFAULT 'active'::"public"."program_status" NOT NULL,
    "enrollment_date" timestamp with time zone DEFAULT "now"() NOT NULL,
    "start_date" timestamp with time zone DEFAULT "now"() NOT NULL,
    "target_completion_date" timestamp with time zone,
    "actual_completion_date" timestamp with time zone,
    "current_week" integer DEFAULT 1 NOT NULL,
    "current_phase_id" "uuid",
    "weeks_completed" integer DEFAULT 0 NOT NULL,
    "sessions_completed" integer DEFAULT 0 NOT NULL,
    "sessions_skipped" integer DEFAULT 0 NOT NULL,
    "adherence_rate" numeric(5,2),
    "progression_rate" numeric(5,2),
    "satisfaction_rating" integer,
    "personal_modifications" "jsonb" DEFAULT '{}'::"jsonb",
    "coach_notes" "text",
    "user_goals" "jsonb" DEFAULT '{}'::"jsonb",
    "total_paused_days" integer DEFAULT 0,
    "last_paused_at" timestamp with time zone,
    "pause_reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "user_program_enrollments_satisfaction_rating_check" CHECK ((("satisfaction_rating" >= 1) AND ("satisfaction_rating" <= 5)))
);


ALTER TABLE "public"."user_program_enrollments" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_program_enrollments" IS 'User participation and progress tracking in programs';



COMMENT ON COLUMN "public"."user_program_enrollments"."adherence_rate" IS 'Percentage of planned sessions actually completed';



CREATE TABLE IF NOT EXISTS "public"."user_push_tokens" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "expo_push_token" "text" NOT NULL,
    "device_info" "jsonb" DEFAULT '{}'::"jsonb",
    "last_used_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_push_tokens" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "revenuecat_customer_id" character varying(255),
    "product_id" character varying(255) NOT NULL,
    "subscription_tier" character varying(50),
    "status" character varying(50) NOT NULL,
    "started_at" timestamp with time zone NOT NULL,
    "current_period_start" timestamp with time zone NOT NULL,
    "current_period_end" timestamp with time zone NOT NULL,
    "cancelled_at" timestamp with time zone,
    "expires_at" timestamp with time zone,
    "trial_start" timestamp with time zone,
    "trial_end" timestamp with time zone,
    "is_trial_used" boolean DEFAULT false,
    "platform" character varying(20),
    "store_transaction_id" character varying(255),
    "ai_generations_used" integer DEFAULT 0,
    "ai_generations_limit" integer,
    "ai_generation_reset_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "user_subscriptions_platform_check" CHECK ((("platform")::"text" = ANY ((ARRAY['ios'::character varying, 'android'::character varying, 'web'::character varying])::"text"[]))),
    CONSTRAINT "user_subscriptions_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['active'::character varying, 'cancelled'::character varying, 'expired'::character varying, 'trial'::character varying, 'grace_period'::character varying])::"text"[]))),
    CONSTRAINT "user_subscriptions_subscription_tier_check" CHECK ((("subscription_tier")::"text" = ANY ((ARRAY['free'::character varying, 'premium'::character varying, 'pro'::character varying])::"text"[])))
);


ALTER TABLE "public"."user_subscriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_workout_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "fitness_level" character varying(50),
    "fitness_goals" "text"[],
    "preferred_workout_duration" integer,
    "preferred_difficulty" integer,
    "preferred_workout_types" "text"[],
    "preferred_equipment" "text"[],
    "excluded_exercises" "text"[],
    "excluded_muscle_groups" "text"[],
    "injuries" "text"[],
    "medical_conditions" "text"[],
    "mobility_restrictions" "jsonb",
    "workouts_per_week" integer,
    "preferred_workout_days" integer[],
    "preferred_workout_times" time without time zone[],
    "variety_preference" integer,
    "instruction_detail_level" character varying(20),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "user_workout_preferences_fitness_level_check" CHECK ((("fitness_level")::"text" = ANY ((ARRAY['beginner'::character varying, 'intermediate'::character varying, 'advanced'::character varying, 'expert'::character varying])::"text"[]))),
    CONSTRAINT "user_workout_preferences_instruction_detail_level_check" CHECK ((("instruction_detail_level")::"text" = ANY ((ARRAY['minimal'::character varying, 'standard'::character varying, 'detailed'::character varying])::"text"[]))),
    CONSTRAINT "user_workout_preferences_preferred_difficulty_check" CHECK ((("preferred_difficulty" >= 1) AND ("preferred_difficulty" <= 5))),
    CONSTRAINT "user_workout_preferences_variety_preference_check" CHECK ((("variety_preference" >= 1) AND ("variety_preference" <= 5)))
);


ALTER TABLE "public"."user_workout_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "pseudo" "text",
    "birth_year" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "bio" "text",
    "city" "text",
    "state" "text",
    "name" "text",
    "profile_picture_url" "text",
    "fitness_level" "text",
    "unread_notifications_count" integer DEFAULT 0,
    "last_notification_read_at" timestamp with time zone DEFAULT "now"(),
    "terms_accepted_at" timestamp with time zone,
    "terms_version" "text",
    "marketing_email_opt_in" boolean DEFAULT false NOT NULL,
    "marketing_email_opt_in_at" timestamp with time zone,
    "partner_offers_opt_in" boolean DEFAULT false NOT NULL,
    "partner_offers_opt_in_at" timestamp with time zone,
    "unsubscribe_token" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    CONSTRAINT "users_bio_check" CHECK (("length"("bio") <= 500)),
    CONSTRAINT "users_birth_year_check" CHECK ((("birth_year" >= 1900) AND (("birth_year")::numeric <= EXTRACT(year FROM "now"())))),
    CONSTRAINT "users_city_check" CHECK (("length"("city") <= 100)),
    CONSTRAINT "users_fitness_level_check" CHECK (("fitness_level" = ANY (ARRAY['newbie'::"text", 'beginner'::"text", 'intermediate'::"text", 'advanced'::"text"]))),
    CONSTRAINT "users_name_check" CHECK (("length"("name") <= 100)),
    CONSTRAINT "users_state_check" CHECK (("length"("state") <= 100))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON COLUMN "public"."users"."bio" IS 'User biography/description (max 500 characters)';



COMMENT ON COLUMN "public"."users"."city" IS 'User city (max 100 characters)';



COMMENT ON COLUMN "public"."users"."state" IS 'User state/region (max 100 characters)';



COMMENT ON COLUMN "public"."users"."name" IS 'User full name (max 100 characters)';



COMMENT ON COLUMN "public"."users"."profile_picture_url" IS 'URL to user profile picture in Supabase storage';



COMMENT ON COLUMN "public"."users"."fitness_level" IS 'User fitness experience level';



CREATE TABLE IF NOT EXISTS "public"."website_users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" character varying(255) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."website_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workout_likes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workout_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."workout_likes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workout_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "workout_id" "uuid" NOT NULL,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "completed_at" timestamp with time zone,
    "duration_seconds" integer,
    "calories_burned" integer,
    "average_heart_rate" integer,
    "max_heart_rate" integer,
    "status" character varying(50) DEFAULT 'in_progress'::character varying NOT NULL,
    "completion_percentage" numeric(5,2),
    "difficulty_rating" integer,
    "enjoyment_rating" integer,
    "notes" "text",
    "location_id" "uuid",
    "performed_at_coordinates" "public"."geography"(Point,4326),
    "device_info" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "workout_sessions_difficulty_rating_check" CHECK ((("difficulty_rating" >= 1) AND ("difficulty_rating" <= 5))),
    CONSTRAINT "workout_sessions_enjoyment_rating_check" CHECK ((("enjoyment_rating" >= 1) AND ("enjoyment_rating" <= 5))),
    CONSTRAINT "workout_sessions_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['in_progress'::character varying, 'completed'::character varying, 'paused'::character varying, 'abandoned'::character varying])::"text"[])))
);


ALTER TABLE "public"."workout_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workout_sets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workout_id" "uuid" NOT NULL,
    "set_id" "uuid" NOT NULL,
    "phase" "public"."workout_phase" NOT NULL,
    "order_in_phase" integer NOT NULL,
    "phase_modifications" "jsonb",
    "transition_notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."workout_sets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workout_shares" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workout_id" "uuid" NOT NULL,
    "shared_by" "uuid" NOT NULL,
    "club_id" "uuid",
    "location_id" "uuid",
    "share_type" character varying(50),
    "message" "text",
    "allow_copy" boolean DEFAULT true,
    "allow_modify" boolean DEFAULT false,
    "shared_at" timestamp with time zone DEFAULT "now"(),
    "expires_at" timestamp with time zone,
    CONSTRAINT "workout_shares_check" CHECK (((("club_id" IS NOT NULL) AND ("location_id" IS NULL)) OR (("club_id" IS NULL) AND ("location_id" IS NOT NULL)) OR (("share_type")::"text" = 'public'::"text"))),
    CONSTRAINT "workout_shares_share_type_check" CHECK ((("share_type")::"text" = ANY ((ARRAY['club'::character varying, 'location'::character varying, 'public'::character varying])::"text"[])))
);


ALTER TABLE "public"."workout_shares" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workout_template_exercises" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "template_id" "uuid",
    "exercise_id" "uuid",
    "order_index" integer NOT NULL,
    "sets" integer,
    "reps" integer,
    "duration_seconds" integer,
    "rest_seconds" integer,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."workout_template_exercises" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workout_templates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "category" character varying(100) NOT NULL,
    "author_id" "uuid",
    "is_official" boolean DEFAULT false,
    "is_premium" boolean DEFAULT false,
    "base_workout_data" "jsonb" NOT NULL,
    "customization_options" "jsonb",
    "times_used" integer DEFAULT 0,
    "average_rating" numeric(3,2),
    "tags" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."workout_templates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workouts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "name" character varying(255) NOT NULL,
    "description" "text",
    "type" "public"."workout_type" NOT NULL,
    "focus_areas" "public"."focus_area"[],
    "training_style" "public"."training_style",
    "difficulty_level" integer,
    "estimated_duration" integer,
    "equipment_needed" "uuid"[],
    "space_requirements" "public"."space_requirement" DEFAULT 'minimal'::"public"."space_requirement",
    "energy_system" "public"."energy_system"[],
    "primary_adaptations" "public"."adaptation_type"[],
    "is_ai_generated" boolean DEFAULT false,
    "ai_provider" character varying(50),
    "ai_model" character varying(100),
    "ai_generation_params" "jsonb",
    "ai_prompt_tokens" integer,
    "ai_completion_tokens" integer,
    "is_public" boolean DEFAULT false,
    "is_template" boolean DEFAULT false,
    "share_token" character varying(255),
    "times_completed" integer DEFAULT 0,
    "average_rating" numeric(3,2),
    "likes_count" integer DEFAULT 0,
    "tags" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "deleted_at" timestamp with time zone,
    CONSTRAINT "workouts_difficulty_level_check" CHECK ((("difficulty_level" >= 1) AND ("difficulty_level" <= 10)))
);


ALTER TABLE "public"."workouts" OWNER TO "postgres";


COMMENT ON TABLE "public"."workouts" IS 'Users can access their own workouts, template workouts (user_id IS NULL), public workouts, and workouts from enrolled programs';



CREATE TABLE IF NOT EXISTS "public"."workouts_backup" (
    "id" "uuid",
    "user_id" "uuid",
    "location_id" "uuid",
    "club_id" "uuid",
    "name" character varying(255),
    "description" "text",
    "type" character varying(50),
    "difficulty_level" integer,
    "estimated_duration" integer,
    "estimated_calories" integer,
    "is_ai_generated" boolean,
    "ai_provider" character varying(50),
    "ai_model" character varying(100),
    "generation_params" "jsonb",
    "prompt_tokens" integer,
    "completion_tokens" integer,
    "is_public" boolean,
    "is_template" boolean,
    "share_token" character varying(255),
    "times_completed" integer,
    "average_rating" numeric(3,2),
    "likes_count" integer,
    "tags" "text"[],
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."workouts_backup" OWNER TO "postgres";


ALTER TABLE ONLY "public"."club_members"
    ADD CONSTRAINT "club_members_club_id_user_id_key" UNIQUE ("club_id", "user_id");



ALTER TABLE ONLY "public"."club_members"
    ADD CONSTRAINT "club_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."club_post_comments"
    ADD CONSTRAINT "club_post_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."club_post_likes"
    ADD CONSTRAINT "club_post_likes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."club_post_likes"
    ADD CONSTRAINT "club_post_likes_post_id_user_id_key" UNIQUE ("post_id", "user_id");



ALTER TABLE ONLY "public"."club_posts"
    ADD CONSTRAINT "club_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."club_spots"
    ADD CONSTRAINT "club_spots_club_id_location_id_key" UNIQUE ("club_id", "location_id");



ALTER TABLE ONLY "public"."club_spots"
    ADD CONSTRAINT "club_spots_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."club_tags"
    ADD CONSTRAINT "club_tags_club_id_tag_key" UNIQUE ("club_id", "tag");



ALTER TABLE ONLY "public"."club_tags"
    ADD CONSTRAINT "club_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."clubs"
    ADD CONSTRAINT "clubs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."disciplines"
    ADD CONSTRAINT "disciplines_locale_key_unique" UNIQUE ("discipline_locale_key");



ALTER TABLE ONLY "public"."disciplines"
    ADD CONSTRAINT "disciplines_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."disciplines"
    ADD CONSTRAINT "disciplines_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."equipments"
    ADD CONSTRAINT "equipments_locale_key_unique" UNIQUE ("equipment_locale_key");



ALTER TABLE ONLY "public"."equipments"
    ADD CONSTRAINT "equipments_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."equipments"
    ADD CONSTRAINT "equipments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_images"
    ADD CONSTRAINT "event_images_event_id_image_order_key" UNIQUE ("event_id", "image_order");



ALTER TABLE ONLY "public"."event_images"
    ADD CONSTRAINT "event_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_locations"
    ADD CONSTRAINT "event_locations_event_id_location_id_key" UNIQUE ("event_id", "location_id");



ALTER TABLE ONLY "public"."event_locations"
    ADD CONSTRAINT "event_locations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_participants"
    ADD CONSTRAINT "event_participants_event_id_user_id_key" UNIQUE ("event_id", "user_id");



ALTER TABLE ONLY "public"."event_participants"
    ADD CONSTRAINT "event_participants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_post_comments"
    ADD CONSTRAINT "event_post_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_post_likes"
    ADD CONSTRAINT "event_post_likes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_post_likes"
    ADD CONSTRAINT "event_post_likes_post_id_user_id_key" UNIQUE ("post_id", "user_id");



ALTER TABLE ONLY "public"."event_posts"
    ADD CONSTRAINT "event_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_tag_assignments"
    ADD CONSTRAINT "event_tag_assignments_event_id_tag_id_key" UNIQUE ("event_id", "tag_id");



ALTER TABLE ONLY "public"."event_tag_assignments"
    ADD CONSTRAINT "event_tag_assignments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_tags"
    ADD CONSTRAINT "event_tags_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."event_tags"
    ADD CONSTRAINT "event_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exercise_equipment"
    ADD CONSTRAINT "exercise_equipment_pkey" PRIMARY KEY ("exercise_id", "equipment_id");



ALTER TABLE ONLY "public"."exercise_muscles"
    ADD CONSTRAINT "exercise_muscles_pkey" PRIMARY KEY ("exercise_id", "muscle_id");



ALTER TABLE ONLY "public"."exercise_progressions"
    ADD CONSTRAINT "exercise_progressions_exercise_id_target_exercise_id_key" UNIQUE ("exercise_id", "target_exercise_id");



ALTER TABLE ONLY "public"."exercise_progressions"
    ADD CONSTRAINT "exercise_progressions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exercises"
    ADD CONSTRAINT "exercises_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."location_comments"
    ADD CONSTRAINT "location_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."location_disciplines"
    ADD CONSTRAINT "location_disciplines_location_id_discipline_id_key" UNIQUE ("location_id", "discipline_id");



ALTER TABLE ONLY "public"."location_disciplines"
    ADD CONSTRAINT "location_disciplines_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."location_equipments"
    ADD CONSTRAINT "location_equipments_location_id_equipment_id_key" UNIQUE ("location_id", "equipment_id");



ALTER TABLE ONLY "public"."location_equipments"
    ADD CONSTRAINT "location_equipments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."location_images"
    ADD CONSTRAINT "location_images_location_id_image_order_key" UNIQUE ("location_id", "image_order");



ALTER TABLE ONLY "public"."location_images"
    ADD CONSTRAINT "location_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."location_likes"
    ADD CONSTRAINT "location_likes_location_id_user_id_key" UNIQUE ("location_id", "user_id");



ALTER TABLE ONLY "public"."location_likes"
    ADD CONSTRAINT "location_likes_location_user_unique" UNIQUE ("location_id", "user_id");



ALTER TABLE ONLY "public"."location_likes"
    ADD CONSTRAINT "location_likes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."location_ratings"
    ADD CONSTRAINT "location_ratings_location_user_unique" UNIQUE ("location_id", "user_id");



ALTER TABLE ONLY "public"."location_ratings"
    ADD CONSTRAINT "location_ratings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."location_ratings"
    ADD CONSTRAINT "location_ratings_user_location_unique" UNIQUE ("user_id", "location_id");



ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "locations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."muscles"
    ADD CONSTRAINT "muscles_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."muscles"
    ADD CONSTRAINT "muscles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notification_preferences"
    ADD CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notification_preferences"
    ADD CONSTRAINT "notification_preferences_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."program_phases"
    ADD CONSTRAINT "program_phases_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."program_reviews"
    ADD CONSTRAINT "program_reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."program_reviews"
    ADD CONSTRAINT "program_reviews_program_id_user_id_key" UNIQUE ("program_id", "user_id");



ALTER TABLE ONLY "public"."program_session_completions"
    ADD CONSTRAINT "program_session_completions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."program_weeks"
    ADD CONSTRAINT "program_weeks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."program_weeks"
    ADD CONSTRAINT "program_weeks_program_id_week_number_key" UNIQUE ("program_id", "week_number");



ALTER TABLE ONLY "public"."program_workouts"
    ADD CONSTRAINT "program_workouts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."program_workouts"
    ADD CONSTRAINT "program_workouts_week_id_day_of_week_session_order_key" UNIQUE ("week_id", "day_of_week", "session_order");



ALTER TABLE ONLY "public"."programs"
    ADD CONSTRAINT "programs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."push_queue"
    ADD CONSTRAINT "push_queue_notification_id_user_id_key" UNIQUE ("notification_id", "user_id");



ALTER TABLE ONLY "public"."push_queue"
    ADD CONSTRAINT "push_queue_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."session_exercises"
    ADD CONSTRAINT "session_exercises_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."set_exercises"
    ADD CONSTRAINT "set_exercises_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."set_exercises"
    ADD CONSTRAINT "set_exercises_set_id_order_in_set_key" UNIQUE ("set_id", "order_in_set");



ALTER TABLE ONLY "public"."sets"
    ADD CONSTRAINT "sets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."program_session_completions"
    ADD CONSTRAINT "unique_program_session_completion" UNIQUE ("enrollment_id", "program_workout_id", "workout_session_id");



COMMENT ON CONSTRAINT "unique_program_session_completion" ON "public"."program_session_completions" IS 'Ensures one completion record per enrollment/workout/session combination. Enables upsert operations.';



ALTER TABLE ONLY "public"."user_disciplines"
    ADD CONSTRAINT "user_disciplines_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_disciplines"
    ADD CONSTRAINT "user_disciplines_user_id_discipline_id_key" UNIQUE ("user_id", "discipline_id");



ALTER TABLE ONLY "public"."user_program_enrollments"
    ADD CONSTRAINT "user_program_enrollments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_program_enrollments"
    ADD CONSTRAINT "user_program_enrollments_user_id_program_id_key" UNIQUE ("user_id", "program_id");



ALTER TABLE ONLY "public"."user_push_tokens"
    ADD CONSTRAINT "user_push_tokens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_push_tokens"
    ADD CONSTRAINT "user_push_tokens_user_id_expo_push_token_key" UNIQUE ("user_id", "expo_push_token");



ALTER TABLE ONLY "public"."user_subscriptions"
    ADD CONSTRAINT "user_subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_subscriptions"
    ADD CONSTRAINT "user_subscriptions_revenuecat_customer_id_key" UNIQUE ("revenuecat_customer_id");



ALTER TABLE ONLY "public"."user_subscriptions"
    ADD CONSTRAINT "user_subscriptions_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."user_workout_preferences"
    ADD CONSTRAINT "user_workout_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_workout_preferences"
    ADD CONSTRAINT "user_workout_preferences_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."website_users"
    ADD CONSTRAINT "website_users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."website_users"
    ADD CONSTRAINT "website_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workout_likes"
    ADD CONSTRAINT "workout_likes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workout_likes"
    ADD CONSTRAINT "workout_likes_workout_id_user_id_key" UNIQUE ("workout_id", "user_id");



ALTER TABLE ONLY "public"."workout_sessions"
    ADD CONSTRAINT "workout_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workout_sets"
    ADD CONSTRAINT "workout_sets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workout_sets"
    ADD CONSTRAINT "workout_sets_workout_id_phase_order_in_phase_key" UNIQUE ("workout_id", "phase", "order_in_phase");



ALTER TABLE ONLY "public"."workout_shares"
    ADD CONSTRAINT "workout_shares_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workout_template_exercises"
    ADD CONSTRAINT "workout_template_exercises_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workout_templates"
    ADD CONSTRAINT "workout_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workouts"
    ADD CONSTRAINT "workouts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workouts"
    ADD CONSTRAINT "workouts_share_token_key" UNIQUE ("share_token");



CREATE UNIQUE INDEX "club_members_single_owner" ON "public"."club_members" USING "btree" ("club_id") WHERE ((("role")::"text" = 'owner'::"text") AND (("status")::"text" = 'approved'::"text"));



CREATE INDEX "idx_club_members_club_id" ON "public"."club_members" USING "btree" ("club_id");



CREATE INDEX "idx_club_members_role" ON "public"."club_members" USING "btree" ("role");



CREATE INDEX "idx_club_members_status" ON "public"."club_members" USING "btree" ("status");



CREATE INDEX "idx_club_members_user_id" ON "public"."club_members" USING "btree" ("user_id");



CREATE INDEX "idx_club_post_comments_author_id" ON "public"."club_post_comments" USING "btree" ("author_id");



CREATE INDEX "idx_club_post_comments_created_at" ON "public"."club_post_comments" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_club_post_comments_post_id" ON "public"."club_post_comments" USING "btree" ("post_id");



CREATE INDEX "idx_club_post_likes_created_at" ON "public"."club_post_likes" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_club_post_likes_post_id" ON "public"."club_post_likes" USING "btree" ("post_id");



CREATE INDEX "idx_club_post_likes_user_id" ON "public"."club_post_likes" USING "btree" ("user_id");



CREATE INDEX "idx_club_posts_author_id" ON "public"."club_posts" USING "btree" ("author_id");



CREATE INDEX "idx_club_posts_club_id" ON "public"."club_posts" USING "btree" ("club_id");



CREATE INDEX "idx_club_posts_created_at" ON "public"."club_posts" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_club_spots_club_id" ON "public"."club_spots" USING "btree" ("club_id");



CREATE INDEX "idx_club_spots_location_id" ON "public"."club_spots" USING "btree" ("location_id");



CREATE INDEX "idx_club_tags_club_id" ON "public"."club_tags" USING "btree" ("club_id");



CREATE INDEX "idx_club_tags_tag" ON "public"."club_tags" USING "btree" ("tag");



CREATE INDEX "idx_clubs_category" ON "public"."clubs" USING "btree" ("category");



CREATE INDEX "idx_clubs_created_at" ON "public"."clubs" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_clubs_created_by" ON "public"."clubs" USING "btree" ("created_by");



CREATE INDEX "idx_clubs_privacy" ON "public"."clubs" USING "btree" ("privacy");



CREATE INDEX "idx_clubs_search_vector" ON "public"."clubs" USING "gin" ("search_vector");



CREATE INDEX "idx_disciplines_active" ON "public"."disciplines" USING "btree" ("is_active") WHERE ("is_active" = true);



CREATE INDEX "idx_disciplines_category" ON "public"."disciplines" USING "btree" ("category");



CREATE INDEX "idx_disciplines_locale_key" ON "public"."disciplines" USING "btree" ("discipline_locale_key");



CREATE INDEX "idx_disciplines_name" ON "public"."disciplines" USING "btree" ("name");



CREATE INDEX "idx_equipments_active" ON "public"."equipments" USING "btree" ("is_active") WHERE ("is_active" = true);



CREATE INDEX "idx_equipments_category" ON "public"."equipments" USING "btree" ("category");



CREATE INDEX "idx_equipments_locale_key" ON "public"."equipments" USING "btree" ("equipment_locale_key");



CREATE INDEX "idx_equipments_name" ON "public"."equipments" USING "btree" ("name");



CREATE INDEX "idx_event_images_event_id" ON "public"."event_images" USING "btree" ("event_id");



CREATE INDEX "idx_event_locations_event_id" ON "public"."event_locations" USING "btree" ("event_id");



CREATE INDEX "idx_event_locations_location_id" ON "public"."event_locations" USING "btree" ("location_id");



CREATE UNIQUE INDEX "idx_event_locations_primary" ON "public"."event_locations" USING "btree" ("event_id") WHERE ("is_primary" = true);



CREATE INDEX "idx_event_participants_event_id" ON "public"."event_participants" USING "btree" ("event_id");



CREATE INDEX "idx_event_participants_type_status" ON "public"."event_participants" USING "btree" ("participation_type", "status");



CREATE INDEX "idx_event_participants_user_id" ON "public"."event_participants" USING "btree" ("user_id");



CREATE INDEX "idx_event_post_comments_author_id" ON "public"."event_post_comments" USING "btree" ("author_id");



CREATE INDEX "idx_event_post_comments_created_at" ON "public"."event_post_comments" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_event_post_comments_post_id" ON "public"."event_post_comments" USING "btree" ("post_id");



CREATE INDEX "idx_event_post_likes_post_id" ON "public"."event_post_likes" USING "btree" ("post_id");



CREATE INDEX "idx_event_post_likes_user_id" ON "public"."event_post_likes" USING "btree" ("user_id");



CREATE INDEX "idx_event_posts_author_id" ON "public"."event_posts" USING "btree" ("author_id");



CREATE INDEX "idx_event_posts_created_at" ON "public"."event_posts" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_event_posts_event_id" ON "public"."event_posts" USING "btree" ("event_id");



CREATE INDEX "idx_event_posts_feed_query" ON "public"."event_posts" USING "btree" ("event_id", "created_at" DESC);



CREATE INDEX "idx_events_club_id" ON "public"."events" USING "btree" ("club_id");



CREATE INDEX "idx_events_created_by" ON "public"."events" USING "btree" ("created_by");



CREATE INDEX "idx_events_ends_at" ON "public"."events" USING "btree" ("ends_at");



CREATE INDEX "idx_events_location_search" ON "public"."events" USING "btree" ("starts_at", "status", "visibility");



CREATE INDEX "idx_events_starts_at" ON "public"."events" USING "btree" ("starts_at");



CREATE INDEX "idx_events_status" ON "public"."events" USING "btree" ("status");



CREATE INDEX "idx_events_visibility" ON "public"."events" USING "btree" ("visibility");



CREATE INDEX "idx_exercise_progressions_exercise" ON "public"."exercise_progressions" USING "btree" ("exercise_id");



CREATE INDEX "idx_exercise_progressions_gap" ON "public"."exercise_progressions" USING "btree" ("difficulty_gap");



CREATE INDEX "idx_exercise_progressions_target" ON "public"."exercise_progressions" USING "btree" ("target_exercise_id");



CREATE INDEX "idx_exercise_progressions_type" ON "public"."exercise_progressions" USING "btree" ("progression_type");



CREATE INDEX "idx_exercises_active" ON "public"."exercises" USING "btree" ("is_active") WHERE ("is_active" = true);



CREATE INDEX "idx_exercises_category" ON "public"."exercises" USING "btree" ("category");



CREATE INDEX "idx_exercises_difficulty" ON "public"."exercises" USING "btree" ("difficulty_level");



CREATE INDEX "idx_exercises_family" ON "public"."exercises" USING "btree" ("exercise_family");



CREATE INDEX "idx_exercises_movement_pattern" ON "public"."exercises" USING "btree" ("movement_pattern");



CREATE INDEX "idx_exercises_parameter_type" ON "public"."exercises" USING "btree" ("parameter_type");



CREATE INDEX "idx_exercises_popularity" ON "public"."exercises" USING "btree" ("popularity_score" DESC);



CREATE INDEX "idx_exercises_primary_muscles" ON "public"."exercises" USING "gin" ("primary_muscles");



CREATE INDEX "idx_exercises_subcategory" ON "public"."exercises" USING "btree" ("subcategory");



CREATE INDEX "idx_exercises_verified" ON "public"."exercises" USING "btree" ("is_verified") WHERE ("is_verified" = true);



CREATE INDEX "idx_location_comments_created_at" ON "public"."location_comments" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_location_comments_location_id" ON "public"."location_comments" USING "btree" ("location_id");



CREATE INDEX "idx_location_disciplines_added_by" ON "public"."location_disciplines" USING "btree" ("added_by");



CREATE INDEX "idx_location_disciplines_discipline_id" ON "public"."location_disciplines" USING "btree" ("discipline_id");



CREATE INDEX "idx_location_disciplines_location_discipline" ON "public"."location_disciplines" USING "btree" ("location_id", "discipline_id");



CREATE INDEX "idx_location_disciplines_location_id" ON "public"."location_disciplines" USING "btree" ("location_id");



CREATE INDEX "idx_location_disciplines_verified" ON "public"."location_disciplines" USING "btree" ("verified");



CREATE INDEX "idx_location_equipments_added_by" ON "public"."location_equipments" USING "btree" ("added_by");



CREATE INDEX "idx_location_equipments_equipment_id" ON "public"."location_equipments" USING "btree" ("equipment_id");



CREATE INDEX "idx_location_equipments_location_equipment" ON "public"."location_equipments" USING "btree" ("location_id", "equipment_id");



CREATE INDEX "idx_location_equipments_location_id" ON "public"."location_equipments" USING "btree" ("location_id");



CREATE INDEX "idx_location_equipments_verified" ON "public"."location_equipments" USING "btree" ("verified");



CREATE INDEX "idx_location_images_location_id" ON "public"."location_images" USING "btree" ("location_id");



CREATE INDEX "idx_location_likes_location_id" ON "public"."location_likes" USING "btree" ("location_id");



CREATE INDEX "idx_location_likes_user_id" ON "public"."location_likes" USING "btree" ("user_id");



CREATE INDEX "idx_location_ratings_location_id" ON "public"."location_ratings" USING "btree" ("location_id");



CREATE INDEX "idx_location_ratings_user_id" ON "public"."location_ratings" USING "btree" ("user_id");



CREATE INDEX "idx_locations_address" ON "public"."locations" USING "btree" ("address");



CREATE INDEX "idx_locations_average_rating" ON "public"."locations" USING "btree" ("average_rating") WHERE ("average_rating" IS NOT NULL);



CREATE INDEX "idx_locations_city" ON "public"."locations" USING "btree" ("city") WHERE ("city" IS NOT NULL);



CREATE INDEX "idx_locations_contributor" ON "public"."locations" USING "btree" ("contributor") WHERE ("contributor" IS NOT NULL);



CREATE INDEX "idx_locations_coordinates" ON "public"."locations" USING "gist" ("public"."st_makepoint"(("longitude")::double precision, ("latitude")::double precision));



CREATE INDEX "idx_locations_country" ON "public"."locations" USING "btree" ("country") WHERE ("country" IS NOT NULL);



CREATE INDEX "idx_locations_country_region_city" ON "public"."locations" USING "btree" ("country", "region", "city") WHERE ("country" IS NOT NULL);



CREATE INDEX "idx_locations_created_at" ON "public"."locations" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_locations_created_by" ON "public"."locations" USING "btree" ("created_by");



CREATE INDEX "idx_locations_external_rating_count" ON "public"."locations" USING "btree" ("external_rating_count") WHERE ("external_rating_count" > 0);



CREATE INDEX "idx_locations_lat_lng" ON "public"."locations" USING "btree" ("latitude", "longitude");



CREATE INDEX "idx_locations_metadata" ON "public"."locations" USING "gin" ("metadata");



CREATE INDEX "idx_locations_metadata_source" ON "public"."locations" USING "btree" ((("metadata" ->> 'source'::"text")));



CREATE INDEX "idx_locations_metadata_source_id" ON "public"."locations" USING "btree" ((("metadata" ->> 'source_id'::"text")));



CREATE INDEX "idx_locations_rating" ON "public"."locations" USING "btree" ("rating") WHERE ("rating" IS NOT NULL);



CREATE INDEX "idx_locations_region" ON "public"."locations" USING "btree" ("region") WHERE ("region" IS NOT NULL);



CREATE INDEX "idx_notifications_app_update" ON "public"."notifications" USING "btree" ("type", "created_at") WHERE (("type")::"text" = 'app_update'::"text");



CREATE INDEX "idx_notifications_club_id" ON "public"."notifications" USING "btree" ("club_id");



CREATE INDEX "idx_notifications_created_at" ON "public"."notifications" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_notifications_event_id" ON "public"."notifications" USING "btree" ("event_id");



CREATE INDEX "idx_notifications_event_participant_id" ON "public"."notifications" USING "btree" ("event_participant_id");



CREATE INDEX "idx_notifications_read_at" ON "public"."notifications" USING "btree" ("read_at");



CREATE INDEX "idx_notifications_type" ON "public"."notifications" USING "btree" ("type");



CREATE INDEX "idx_notifications_update_id" ON "public"."notifications" USING "btree" ("update_id") WHERE ("update_id" IS NOT NULL);



CREATE INDEX "idx_notifications_user_id" ON "public"."notifications" USING "btree" ("user_id");



CREATE INDEX "idx_program_phases_order_index" ON "public"."program_phases" USING "btree" ("program_id", "order_index");



CREATE INDEX "idx_program_phases_program_id" ON "public"."program_phases" USING "btree" ("program_id");



CREATE INDEX "idx_program_reviews_is_featured" ON "public"."program_reviews" USING "btree" ("is_featured") WHERE ("is_featured" = true);



CREATE INDEX "idx_program_reviews_program_id" ON "public"."program_reviews" USING "btree" ("program_id");



CREATE INDEX "idx_program_reviews_rating" ON "public"."program_reviews" USING "btree" ("rating");



CREATE INDEX "idx_program_session_completions_completion_date" ON "public"."program_session_completions" USING "btree" ("completion_date");



CREATE INDEX "idx_program_session_completions_enrollment_id" ON "public"."program_session_completions" USING "btree" ("enrollment_id");



CREATE INDEX "idx_program_session_completions_lookup" ON "public"."program_session_completions" USING "btree" ("enrollment_id", "program_workout_id");



CREATE INDEX "idx_program_session_completions_status" ON "public"."program_session_completions" USING "btree" ("status");



CREATE INDEX "idx_program_weeks_program_id" ON "public"."program_weeks" USING "btree" ("program_id");



CREATE INDEX "idx_program_weeks_week_number" ON "public"."program_weeks" USING "btree" ("program_id", "week_number");



CREATE INDEX "idx_program_workouts_program_id" ON "public"."program_workouts" USING "btree" ("program_id");



CREATE INDEX "idx_program_workouts_schedule" ON "public"."program_workouts" USING "btree" ("week_id", "day_of_week", "session_order");



CREATE INDEX "idx_program_workouts_week_id" ON "public"."program_workouts" USING "btree" ("week_id");



CREATE INDEX "idx_programs_created_by" ON "public"."programs" USING "btree" ("created_by");



CREATE INDEX "idx_programs_difficulty_level" ON "public"."programs" USING "btree" ("difficulty_level");



CREATE INDEX "idx_programs_is_public" ON "public"."programs" USING "btree" ("is_public") WHERE ("is_public" = true);



CREATE INDEX "idx_programs_is_template" ON "public"."programs" USING "btree" ("is_template") WHERE ("is_template" = true);



CREATE INDEX "idx_programs_primary_goals" ON "public"."programs" USING "gin" ("primary_goals");



CREATE INDEX "idx_programs_program_type" ON "public"."programs" USING "btree" ("program_type");



CREATE INDEX "idx_push_queue_created" ON "public"."push_queue" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_push_queue_notification" ON "public"."push_queue" USING "btree" ("notification_id");



CREATE INDEX "idx_push_queue_pending" ON "public"."push_queue" USING "btree" ("status", "created_at") WHERE (("status")::"text" = 'pending'::"text");



CREATE INDEX "idx_push_queue_user" ON "public"."push_queue" USING "btree" ("user_id");



CREATE INDEX "idx_session_exercises_session_id" ON "public"."session_exercises" USING "btree" ("session_id");



CREATE INDEX "idx_session_exercises_set_exercise_id" ON "public"."session_exercises" USING "btree" ("workout_exercise_id");



CREATE INDEX "idx_session_exercises_workout_exercise_id" ON "public"."session_exercises" USING "btree" ("workout_exercise_id");



CREATE INDEX "idx_set_exercises_exercise" ON "public"."set_exercises" USING "btree" ("exercise_id");



CREATE INDEX "idx_set_exercises_exercise_id" ON "public"."set_exercises" USING "btree" ("exercise_id");



CREATE INDEX "idx_set_exercises_order" ON "public"."set_exercises" USING "btree" ("set_id", "order_in_set");



CREATE INDEX "idx_set_exercises_parameter_type" ON "public"."set_exercises" USING "btree" ("parameter_type");



CREATE INDEX "idx_set_exercises_set" ON "public"."set_exercises" USING "btree" ("set_id");



CREATE INDEX "idx_sets_created_by" ON "public"."sets" USING "btree" ("created_by");



CREATE INDEX "idx_sets_difficulty" ON "public"."sets" USING "btree" ("difficulty_level");



CREATE INDEX "idx_sets_template" ON "public"."sets" USING "btree" ("is_template") WHERE ("is_template" = true);



CREATE INDEX "idx_sets_type" ON "public"."sets" USING "btree" ("type");



CREATE INDEX "idx_user_disciplines_discipline_id" ON "public"."user_disciplines" USING "btree" ("discipline_id");



CREATE INDEX "idx_user_disciplines_user_discipline" ON "public"."user_disciplines" USING "btree" ("user_id", "discipline_id");



CREATE INDEX "idx_user_disciplines_user_id" ON "public"."user_disciplines" USING "btree" ("user_id");



CREATE INDEX "idx_user_program_enrollments_current_week" ON "public"."user_program_enrollments" USING "btree" ("user_id", "current_week");



CREATE INDEX "idx_user_program_enrollments_program_id" ON "public"."user_program_enrollments" USING "btree" ("program_id");



CREATE INDEX "idx_user_program_enrollments_status" ON "public"."user_program_enrollments" USING "btree" ("status");



CREATE INDEX "idx_user_program_enrollments_user_id" ON "public"."user_program_enrollments" USING "btree" ("user_id");



CREATE INDEX "idx_user_push_tokens_last_used" ON "public"."user_push_tokens" USING "btree" ("last_used_at" DESC);



CREATE INDEX "idx_user_push_tokens_token" ON "public"."user_push_tokens" USING "btree" ("expo_push_token");



CREATE INDEX "idx_user_push_tokens_user_id" ON "public"."user_push_tokens" USING "btree" ("user_id");



CREATE INDEX "idx_user_subscriptions_revenuecat_id" ON "public"."user_subscriptions" USING "btree" ("revenuecat_customer_id");



CREATE INDEX "idx_user_subscriptions_status" ON "public"."user_subscriptions" USING "btree" ("status");



CREATE INDEX "idx_user_subscriptions_user_id" ON "public"."user_subscriptions" USING "btree" ("user_id");



CREATE INDEX "idx_user_workout_preferences_user_id" ON "public"."user_workout_preferences" USING "btree" ("user_id");



CREATE INDEX "idx_workout_likes_user_id" ON "public"."workout_likes" USING "btree" ("user_id");



CREATE INDEX "idx_workout_likes_workout_id" ON "public"."workout_likes" USING "btree" ("workout_id");



CREATE INDEX "idx_workout_sessions_started_at" ON "public"."workout_sessions" USING "btree" ("started_at" DESC);



CREATE INDEX "idx_workout_sessions_status" ON "public"."workout_sessions" USING "btree" ("status");



CREATE INDEX "idx_workout_sessions_user_id" ON "public"."workout_sessions" USING "btree" ("user_id");



CREATE INDEX "idx_workout_sessions_workout_id" ON "public"."workout_sessions" USING "btree" ("workout_id");



CREATE INDEX "idx_workout_sets_order" ON "public"."workout_sets" USING "btree" ("workout_id", "phase", "order_in_phase");



CREATE INDEX "idx_workout_sets_phase" ON "public"."workout_sets" USING "btree" ("phase");



CREATE INDEX "idx_workout_sets_set" ON "public"."workout_sets" USING "btree" ("set_id");



CREATE INDEX "idx_workout_sets_set_id" ON "public"."workout_sets" USING "btree" ("set_id");



CREATE INDEX "idx_workout_sets_workout" ON "public"."workout_sets" USING "btree" ("workout_id");



CREATE INDEX "idx_workout_sets_workout_id" ON "public"."workout_sets" USING "btree" ("workout_id");



CREATE INDEX "idx_workout_shares_club_id" ON "public"."workout_shares" USING "btree" ("club_id");



CREATE INDEX "idx_workout_shares_location_id" ON "public"."workout_shares" USING "btree" ("location_id");



CREATE INDEX "idx_workout_shares_workout_id" ON "public"."workout_shares" USING "btree" ("workout_id");



CREATE INDEX "idx_workout_template_exercises_order" ON "public"."workout_template_exercises" USING "btree" ("template_id", "order_index");



CREATE INDEX "idx_workout_template_exercises_template" ON "public"."workout_template_exercises" USING "btree" ("template_id");



CREATE INDEX "idx_workout_templates_category" ON "public"."workout_templates" USING "btree" ("category");



CREATE INDEX "idx_workout_templates_official" ON "public"."workout_templates" USING "btree" ("is_official");



CREATE INDEX "idx_workouts_ai_generated" ON "public"."workouts" USING "btree" ("is_ai_generated") WHERE ("is_ai_generated" = true);



CREATE INDEX "idx_workouts_created_at" ON "public"."workouts" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_workouts_difficulty" ON "public"."workouts" USING "btree" ("difficulty_level");



CREATE INDEX "idx_workouts_focus_areas" ON "public"."workouts" USING "gin" ("focus_areas");



CREATE INDEX "idx_workouts_public" ON "public"."workouts" USING "btree" ("is_public") WHERE ("is_public" = true);



CREATE INDEX "idx_workouts_template" ON "public"."workouts" USING "btree" ("is_template") WHERE ("is_template" = true);



CREATE INDEX "idx_workouts_training_style" ON "public"."workouts" USING "btree" ("training_style");



CREATE INDEX "idx_workouts_type" ON "public"."workouts" USING "btree" ("type");



CREATE INDEX "idx_workouts_user" ON "public"."workouts" USING "btree" ("user_id");



CREATE UNIQUE INDEX "users_unsubscribe_token_key" ON "public"."users" USING "btree" ("unsubscribe_token");



CREATE OR REPLACE TRIGGER "club_post_comments_updated_at" BEFORE UPDATE ON "public"."club_post_comments" FOR EACH ROW EXECUTE FUNCTION "public"."touch_updated_at"();



COMMENT ON TRIGGER "club_post_comments_updated_at" ON "public"."club_post_comments" IS 'Automatically updates updated_at when comment content is edited';



CREATE OR REPLACE TRIGGER "club_posts_updated_at" BEFORE UPDATE ON "public"."club_posts" FOR EACH ROW EXECUTE FUNCTION "public"."touch_updated_at"();



COMMENT ON TRIGGER "club_posts_updated_at" ON "public"."club_posts" IS 'Automatically updates updated_at when post content is edited';



CREATE OR REPLACE TRIGGER "clubs_updated_at" BEFORE UPDATE ON "public"."clubs" FOR EACH ROW EXECUTE FUNCTION "public"."touch_updated_at"();



COMMENT ON TRIGGER "clubs_updated_at" ON "public"."clubs" IS 'Automatically updates updated_at when club metadata changes';



CREATE OR REPLACE TRIGGER "ensure_user_notification_preferences" AFTER INSERT ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."ensure_notification_preferences"();



CREATE OR REPLACE TRIGGER "event_created_notification_trigger" AFTER INSERT ON "public"."events" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_event_created_notification"();



CREATE OR REPLACE TRIGGER "event_participant_notification_trigger" AFTER INSERT OR UPDATE ON "public"."event_participants" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_event_participant_notification"();



CREATE OR REPLACE TRIGGER "event_updated_notification_trigger" AFTER UPDATE ON "public"."events" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_event_updated_notification"();



CREATE OR REPLACE TRIGGER "membership_request_notification_trigger" AFTER INSERT OR UPDATE ON "public"."club_members" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_membership_request_notification"();



CREATE OR REPLACE TRIGGER "membership_status_notification_trigger" AFTER UPDATE ON "public"."club_members" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_membership_status_notification"();



CREATE OR REPLACE TRIGGER "new_comment_notification_trigger" AFTER INSERT ON "public"."club_post_comments" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_new_comment_notification"();



CREATE OR REPLACE TRIGGER "new_post_notification_trigger" AFTER INSERT ON "public"."club_posts" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_new_post_notification"();



CREATE OR REPLACE TRIGGER "role_change_notification_trigger" AFTER UPDATE ON "public"."club_members" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_role_change_notification"();



CREATE OR REPLACE TRIGGER "trg_enqueue_push" AFTER INSERT ON "public"."notifications" FOR EACH ROW EXECUTE FUNCTION "public"."enqueue_push_on_notification"();



CREATE OR REPLACE TRIGGER "trg_refresh_location_rating" AFTER INSERT OR DELETE OR UPDATE ON "public"."location_ratings" FOR EACH ROW EXECUTE FUNCTION "public"."refresh_location_rating"();



CREATE OR REPLACE TRIGGER "trigger_location_ratings_update" AFTER INSERT OR DELETE OR UPDATE ON "public"."location_ratings" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_update_location_rating"();



CREATE OR REPLACE TRIGGER "trigger_populate_session_exercises" AFTER INSERT ON "public"."workout_sessions" FOR EACH ROW EXECUTE FUNCTION "public"."populate_session_exercises"();



CREATE OR REPLACE TRIGGER "trigger_update_enrollment_progress" AFTER INSERT ON "public"."program_session_completions" FOR EACH ROW EXECUTE FUNCTION "public"."update_enrollment_progress_on_completion"();



CREATE OR REPLACE TRIGGER "trigger_update_enrollment_progress_on_update" AFTER UPDATE ON "public"."program_session_completions" FOR EACH ROW WHEN (("old"."status" IS DISTINCT FROM "new"."status")) EXECUTE FUNCTION "public"."update_enrollment_progress_on_completion"();



CREATE OR REPLACE TRIGGER "trigger_update_workout_stats" AFTER INSERT OR UPDATE ON "public"."workout_sessions" FOR EACH ROW EXECUTE FUNCTION "public"."update_workout_completion_stats"();



CREATE OR REPLACE TRIGGER "trigger_validate_workout_user_assignment" BEFORE INSERT OR UPDATE ON "public"."workouts" FOR EACH ROW EXECUTE FUNCTION "public"."validate_workout_user_assignment"();



CREATE OR REPLACE TRIGGER "update_disciplines_updated_at" BEFORE UPDATE ON "public"."disciplines" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_equipments_updated_at" BEFORE UPDATE ON "public"."equipments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_event_participants_updated_at" BEFORE UPDATE ON "public"."event_participants" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_event_post_comments_updated_at" BEFORE UPDATE ON "public"."event_post_comments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_event_posts_updated_at" BEFORE UPDATE ON "public"."event_posts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_events_updated_at" BEFORE UPDATE ON "public"."events" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_exercises_updated_at" BEFORE UPDATE ON "public"."exercises" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_location_comments_updated_at" BEFORE UPDATE ON "public"."location_comments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_location_disciplines_updated_at" BEFORE UPDATE ON "public"."location_disciplines" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_location_equipments_updated_at" BEFORE UPDATE ON "public"."location_equipments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_locations_updated_at" BEFORE UPDATE ON "public"."locations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_notification_preferences_updated_at" BEFORE UPDATE ON "public"."notification_preferences" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_program_phases_updated_at" BEFORE UPDATE ON "public"."program_phases" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_program_reviews_updated_at" BEFORE UPDATE ON "public"."program_reviews" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_program_session_completions_updated_at" BEFORE UPDATE ON "public"."program_session_completions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_program_weeks_updated_at" BEFORE UPDATE ON "public"."program_weeks" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_program_workouts_updated_at" BEFORE UPDATE ON "public"."program_workouts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_programs_updated_at" BEFORE UPDATE ON "public"."programs" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_set_exercises_updated_at" BEFORE UPDATE ON "public"."set_exercises" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_sets_updated_at" BEFORE UPDATE ON "public"."sets" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_unread_count_on_delete" AFTER DELETE ON "public"."notifications" FOR EACH ROW EXECUTE FUNCTION "public"."update_unread_notification_count"();



CREATE OR REPLACE TRIGGER "update_unread_count_on_insert" AFTER INSERT ON "public"."notifications" FOR EACH ROW EXECUTE FUNCTION "public"."update_unread_notification_count"();



CREATE OR REPLACE TRIGGER "update_unread_count_on_update" AFTER UPDATE ON "public"."notifications" FOR EACH ROW EXECUTE FUNCTION "public"."update_unread_notification_count"();



CREATE OR REPLACE TRIGGER "update_user_program_enrollments_updated_at" BEFORE UPDATE ON "public"."user_program_enrollments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_push_tokens_updated_at" BEFORE UPDATE ON "public"."user_push_tokens" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_workouts_updated_at" BEFORE UPDATE ON "public"."workouts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."club_members"
    ADD CONSTRAINT "club_members_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."club_members"
    ADD CONSTRAINT "club_members_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."club_members"
    ADD CONSTRAINT "club_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."club_post_comments"
    ADD CONSTRAINT "club_post_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."club_post_comments"
    ADD CONSTRAINT "club_post_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."club_posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."club_post_likes"
    ADD CONSTRAINT "club_post_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."club_posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."club_post_likes"
    ADD CONSTRAINT "club_post_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."club_posts"
    ADD CONSTRAINT "club_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."club_posts"
    ADD CONSTRAINT "club_posts_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."club_spots"
    ADD CONSTRAINT "club_spots_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."club_spots"
    ADD CONSTRAINT "club_spots_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."club_spots"
    ADD CONSTRAINT "club_spots_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."club_tags"
    ADD CONSTRAINT "club_tags_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."clubs"
    ADD CONSTRAINT "clubs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."event_images"
    ADD CONSTRAINT "event_images_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_locations"
    ADD CONSTRAINT "event_locations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_locations"
    ADD CONSTRAINT "event_locations_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_participants"
    ADD CONSTRAINT "event_participants_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."event_participants"
    ADD CONSTRAINT "event_participants_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_participants"
    ADD CONSTRAINT "event_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_post_comments"
    ADD CONSTRAINT "event_post_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_post_comments"
    ADD CONSTRAINT "event_post_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."event_posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_post_likes"
    ADD CONSTRAINT "event_post_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."event_posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_post_likes"
    ADD CONSTRAINT "event_post_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_posts"
    ADD CONSTRAINT "event_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_posts"
    ADD CONSTRAINT "event_posts_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_tag_assignments"
    ADD CONSTRAINT "event_tag_assignments_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_tag_assignments"
    ADD CONSTRAINT "event_tag_assignments_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."event_tags"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."exercise_equipment"
    ADD CONSTRAINT "exercise_equipment_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exercise_equipment"
    ADD CONSTRAINT "exercise_equipment_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exercise_muscles"
    ADD CONSTRAINT "exercise_muscles_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exercise_muscles"
    ADD CONSTRAINT "exercise_muscles_muscle_id_fkey" FOREIGN KEY ("muscle_id") REFERENCES "public"."muscles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exercise_progressions"
    ADD CONSTRAINT "exercise_progressions_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exercise_progressions"
    ADD CONSTRAINT "exercise_progressions_target_exercise_id_fkey" FOREIGN KEY ("target_exercise_id") REFERENCES "public"."exercises"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."location_comments"
    ADD CONSTRAINT "location_comments_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."location_comments"
    ADD CONSTRAINT "location_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."location_disciplines"
    ADD CONSTRAINT "location_disciplines_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."location_disciplines"
    ADD CONSTRAINT "location_disciplines_discipline_id_fkey" FOREIGN KEY ("discipline_id") REFERENCES "public"."disciplines"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."location_disciplines"
    ADD CONSTRAINT "location_disciplines_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."location_disciplines"
    ADD CONSTRAINT "location_disciplines_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."location_equipments"
    ADD CONSTRAINT "location_equipments_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."location_equipments"
    ADD CONSTRAINT "location_equipments_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."location_equipments"
    ADD CONSTRAINT "location_equipments_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."location_equipments"
    ADD CONSTRAINT "location_equipments_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."location_images"
    ADD CONSTRAINT "location_images_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."location_images"
    ADD CONSTRAINT "location_images_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."location_likes"
    ADD CONSTRAINT "location_likes_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."location_likes"
    ADD CONSTRAINT "location_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."location_ratings"
    ADD CONSTRAINT "location_ratings_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."location_ratings"
    ADD CONSTRAINT "location_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "locations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."notification_preferences"
    ADD CONSTRAINT "notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."club_post_comments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_event_participant_id_fkey" FOREIGN KEY ("event_participant_id") REFERENCES "public"."event_participants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."club_posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."program_phases"
    ADD CONSTRAINT "program_phases_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."program_reviews"
    ADD CONSTRAINT "program_reviews_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "public"."user_program_enrollments"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."program_reviews"
    ADD CONSTRAINT "program_reviews_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."program_reviews"
    ADD CONSTRAINT "program_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."program_session_completions"
    ADD CONSTRAINT "program_session_completions_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "public"."user_program_enrollments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."program_session_completions"
    ADD CONSTRAINT "program_session_completions_program_workout_id_fkey" FOREIGN KEY ("program_workout_id") REFERENCES "public"."program_workouts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."program_session_completions"
    ADD CONSTRAINT "program_session_completions_workout_session_id_fkey" FOREIGN KEY ("workout_session_id") REFERENCES "public"."workout_sessions"("id");



ALTER TABLE ONLY "public"."program_weeks"
    ADD CONSTRAINT "program_weeks_phase_id_fkey" FOREIGN KEY ("phase_id") REFERENCES "public"."program_phases"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."program_weeks"
    ADD CONSTRAINT "program_weeks_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."program_workouts"
    ADD CONSTRAINT "program_workouts_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."program_workouts"
    ADD CONSTRAINT "program_workouts_week_id_fkey" FOREIGN KEY ("week_id") REFERENCES "public"."program_weeks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."program_workouts"
    ADD CONSTRAINT "program_workouts_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."programs"
    ADD CONSTRAINT "programs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."push_queue"
    ADD CONSTRAINT "push_queue_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "public"."notifications"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."push_queue"
    ADD CONSTRAINT "push_queue_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."session_exercises"
    ADD CONSTRAINT "session_exercises_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."workout_sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."session_exercises"
    ADD CONSTRAINT "session_exercises_set_exercise_id_fkey" FOREIGN KEY ("workout_exercise_id") REFERENCES "public"."set_exercises"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."set_exercises"
    ADD CONSTRAINT "set_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."set_exercises"
    ADD CONSTRAINT "set_exercises_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "public"."sets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sets"
    ADD CONSTRAINT "sets_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_disciplines"
    ADD CONSTRAINT "user_disciplines_discipline_id_fkey" FOREIGN KEY ("discipline_id") REFERENCES "public"."disciplines"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_disciplines"
    ADD CONSTRAINT "user_disciplines_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_program_enrollments"
    ADD CONSTRAINT "user_program_enrollments_current_phase_id_fkey" FOREIGN KEY ("current_phase_id") REFERENCES "public"."program_phases"("id");



ALTER TABLE ONLY "public"."user_program_enrollments"
    ADD CONSTRAINT "user_program_enrollments_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_program_enrollments"
    ADD CONSTRAINT "user_program_enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_push_tokens"
    ADD CONSTRAINT "user_push_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_subscriptions"
    ADD CONSTRAINT "user_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_workout_preferences"
    ADD CONSTRAINT "user_workout_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_likes"
    ADD CONSTRAINT "workout_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_sessions"
    ADD CONSTRAINT "workout_sessions_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id");



ALTER TABLE ONLY "public"."workout_sessions"
    ADD CONSTRAINT "workout_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_sessions"
    ADD CONSTRAINT "workout_sessions_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_sets"
    ADD CONSTRAINT "workout_sets_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "public"."sets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_sets"
    ADD CONSTRAINT "workout_sets_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_shares"
    ADD CONSTRAINT "workout_shares_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_shares"
    ADD CONSTRAINT "workout_shares_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_shares"
    ADD CONSTRAINT "workout_shares_shared_by_fkey" FOREIGN KEY ("shared_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."workout_template_exercises"
    ADD CONSTRAINT "workout_template_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_template_exercises"
    ADD CONSTRAINT "workout_template_exercises_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."workout_templates"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_templates"
    ADD CONSTRAINT "workout_templates_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."workouts"
    ADD CONSTRAINT "workouts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Allow anonymous email lookup for duplicates" ON "public"."website_users" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Allow anonymous email subscription" ON "public"."website_users" FOR INSERT TO "anon" WITH CHECK (true);



CREATE POLICY "Allow authenticated admin full access" ON "public"."website_users" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow system imports" ON "public"."locations" FOR INSERT WITH CHECK (("auth"."uid"() IS NULL));



CREATE POLICY "Allow system imports disciplines" ON "public"."location_disciplines" FOR INSERT WITH CHECK (("auth"."uid"() IS NULL));



CREATE POLICY "Allow system imports equipment" ON "public"."location_equipments" FOR INSERT WITH CHECK (("auth"."uid"() IS NULL));



CREATE POLICY "Allow system imports images" ON "public"."location_images" FOR INSERT WITH CHECK (("auth"."uid"() IS NULL));



CREATE POLICY "Anyone can view active disciplines" ON "public"."disciplines" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view active equipments" ON "public"."equipments" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view approved participants of public events" ON "public"."event_participants" FOR SELECT USING ((("status" = 'approved'::"text") AND (EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "event_participants"."event_id") AND ("events"."visibility" = 'public'::"text"))))));



CREATE POLICY "Anyone can view comments" ON "public"."location_comments" FOR SELECT USING (true);



CREATE POLICY "Anyone can view event tags" ON "public"."event_tags" FOR SELECT USING (true);



CREATE POLICY "Anyone can view likes" ON "public"."location_likes" FOR SELECT USING (true);



CREATE POLICY "Anyone can view location disciplines" ON "public"."location_disciplines" FOR SELECT USING (true);



CREATE POLICY "Anyone can view location equipments" ON "public"."location_equipments" FOR SELECT USING (true);



CREATE POLICY "Anyone can view location images" ON "public"."location_images" FOR SELECT USING (true);



CREATE POLICY "Anyone can view locations" ON "public"."locations" FOR SELECT USING (true);



CREATE POLICY "Anyone can view post likes" ON "public"."club_post_likes" FOR SELECT USING (true);



CREATE POLICY "Authenticated users can add disciplines to locations" ON "public"."location_disciplines" FOR INSERT WITH CHECK (("auth"."uid"() = "added_by"));



CREATE POLICY "Authenticated users can add equipment to any location" ON "public"."location_equipments" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "added_by"));



CREATE POLICY "Authenticated users can create events" ON "public"."events" FOR INSERT WITH CHECK ((("auth"."role"() = 'authenticated'::"text") AND ("auth"."uid"() = "created_by")));



CREATE POLICY "Authenticated users can create notifications" ON "public"."notifications" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can delete any location equipment" ON "public"."location_equipments" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can insert comments" ON "public"."location_comments" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can insert event tags" ON "public"."event_tags" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can insert location images" ON "public"."location_images" FOR INSERT WITH CHECK ((("auth"."role"() = 'authenticated'::"text") AND (EXISTS ( SELECT 1
   FROM "public"."locations"
  WHERE (("locations"."id" = "location_images"."location_id") AND ("locations"."created_by" = "auth"."uid"()))))));



CREATE POLICY "Authenticated users can insert locations" ON "public"."locations" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can like locations" ON "public"."location_likes" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can like posts" ON "public"."club_post_likes" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can suggest disciplines" ON "public"."disciplines" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can suggest equipments" ON "public"."equipments" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can update any location equipment" ON "public"."location_equipments" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Authenticated users can update disciplines" ON "public"."disciplines" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can update equipments" ON "public"."equipments" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can view muscles" ON "public"."muscles" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Event creators can delete their events" ON "public"."events" FOR DELETE USING (("auth"."uid"() = "created_by"));



CREATE POLICY "Event creators can manage event images" ON "public"."event_images" USING ((EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "event_images"."event_id") AND ("events"."created_by" = "auth"."uid"())))));



CREATE POLICY "Event creators can manage event locations" ON "public"."event_locations" USING ((EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "event_locations"."event_id") AND ("events"."created_by" = "auth"."uid"())))));



CREATE POLICY "Event creators can manage participants" ON "public"."event_participants" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "event_participants"."event_id") AND ("events"."created_by" = "auth"."uid"())))));



CREATE POLICY "Event creators can manage tags" ON "public"."event_tag_assignments" USING ((EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "event_tag_assignments"."event_id") AND ("events"."created_by" = "auth"."uid"())))));



CREATE POLICY "Event creators can update their events" ON "public"."events" FOR UPDATE USING (("auth"."uid"() = "created_by"));



CREATE POLICY "Event creators can view all participants" ON "public"."event_participants" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "event_participants"."event_id") AND ("events"."created_by" = "auth"."uid"())))));



CREATE POLICY "Event images follow event visibility" ON "public"."event_images" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "event_images"."event_id") AND (("events"."visibility" = 'public'::"text") OR (("events"."visibility" = 'private'::"text") AND ("auth"."uid"() = "events"."created_by")) OR (("events"."visibility" = 'club_only'::"text") AND (("auth"."uid"() = "events"."created_by") OR (EXISTS ( SELECT 1
           FROM "public"."club_members"
          WHERE (("club_members"."club_id" = "events"."club_id") AND ("club_members"."user_id" = "auth"."uid"()) AND (("club_members"."status")::"text" = 'approved'::"text")))))))))));



CREATE POLICY "Event locations follow event visibility" ON "public"."event_locations" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "event_locations"."event_id") AND (("events"."visibility" = 'public'::"text") OR (("events"."visibility" = 'private'::"text") AND ("auth"."uid"() = "events"."created_by")) OR (("events"."visibility" = 'club_only'::"text") AND (("auth"."uid"() = "events"."created_by") OR (EXISTS ( SELECT 1
           FROM "public"."club_members"
          WHERE (("club_members"."club_id" = "events"."club_id") AND ("club_members"."user_id" = "auth"."uid"()) AND (("club_members"."status")::"text" = 'approved'::"text")))))))))));



CREATE POLICY "Event tag assignments follow event visibility" ON "public"."event_tag_assignments" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "event_tag_assignments"."event_id") AND (("events"."visibility" = 'public'::"text") OR (("events"."visibility" = 'private'::"text") AND ("auth"."uid"() = "events"."created_by")) OR (("events"."visibility" = 'club_only'::"text") AND (("auth"."uid"() = "events"."created_by") OR (EXISTS ( SELECT 1
           FROM "public"."club_members"
          WHERE (("club_members"."club_id" = "events"."club_id") AND ("club_members"."user_id" = "auth"."uid"()) AND (("club_members"."status")::"text" = 'approved'::"text")))))))))));



CREATE POLICY "Exercise equipment viewable by authenticated users" ON "public"."exercise_equipment" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Exercise muscles viewable by authenticated users" ON "public"."exercise_muscles" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Exercise progressions are viewable by authenticated users" ON "public"."exercise_progressions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Exercises are viewable by authenticated users" ON "public"."exercises" FOR SELECT TO "authenticated" USING (("is_active" = true));



CREATE POLICY "Location owners can delete images" ON "public"."location_images" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."locations"
  WHERE (("locations"."id" = "location_images"."location_id") AND ("locations"."created_by" = "auth"."uid"())))));



CREATE POLICY "Location owners can update images" ON "public"."location_images" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."locations"
  WHERE (("locations"."id" = "location_images"."location_id") AND ("locations"."created_by" = "auth"."uid"())))));



CREATE POLICY "Program phases are viewable if program is accessible" ON "public"."program_phases" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."programs" "p"
  WHERE (("p"."id" = "program_phases"."program_id") AND (("p"."is_public" = true) OR ("p"."created_by" = "auth"."uid"()))))));



CREATE POLICY "Program reviews are publicly viewable" ON "public"."program_reviews" FOR SELECT USING ((NOT "is_hidden"));



CREATE POLICY "Program weeks are viewable if program is accessible" ON "public"."program_weeks" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."programs" "p"
  WHERE (("p"."id" = "program_weeks"."program_id") AND (("p"."is_public" = true) OR ("p"."created_by" = "auth"."uid"()))))));



CREATE POLICY "Program workouts are viewable if program is accessible" ON "public"."program_workouts" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."programs" "p"
  WHERE (("p"."id" = "program_workouts"."program_id") AND (("p"."is_public" = true) OR ("p"."created_by" = "auth"."uid"()))))));



CREATE POLICY "Public events are visible to everyone" ON "public"."events" FOR SELECT USING ((("visibility" = 'public'::"text") OR (("visibility" = 'private'::"text") AND ("auth"."uid"() = "created_by")) OR (("visibility" = 'club_only'::"text") AND (("auth"."uid"() = "created_by") OR (EXISTS ( SELECT 1
   FROM "public"."club_members"
  WHERE (("club_members"."club_id" = "events"."club_id") AND ("club_members"."user_id" = "auth"."uid"()) AND (("club_members"."status")::"text" = 'approved'::"text"))))))));



CREATE POLICY "Public programs are viewable by everyone" ON "public"."programs" FOR SELECT USING ((("is_public" = true) OR ("created_by" = "auth"."uid"())));



CREATE POLICY "Service role only for push_queue" ON "public"."push_queue" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Session exercises follow session permissions" ON "public"."session_exercises" USING ((EXISTS ( SELECT 1
   FROM "public"."workout_sessions" "ws"
  WHERE (("ws"."id" = "session_exercises"."session_id") AND ("auth"."uid"() = "ws"."user_id")))));



CREATE POLICY "Set exercises follow accessible sets permissions" ON "public"."set_exercises" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."sets" "s"
  WHERE (("s"."id" = "set_exercises"."set_id") AND (("s"."created_by" = "auth"."uid"()) OR ("s"."is_template" = true) OR (EXISTS ( SELECT 1
           FROM ("public"."workout_sets" "ws"
             JOIN "public"."workouts" "w" ON (("ws"."workout_id" = "w"."id")))
          WHERE (("ws"."set_id" = "s"."id") AND (("w"."user_id" = "auth"."uid"()) OR ("w"."user_id" IS NULL) OR ("w"."is_public" = true) OR (EXISTS ( SELECT 1
                   FROM ("public"."program_workouts" "pw"
                     JOIN "public"."user_program_enrollments" "upe" ON (("pw"."program_id" = "upe"."program_id")))
                  WHERE (("pw"."workout_id" = "w"."id") AND ("upe"."user_id" = "auth"."uid"()) AND ("upe"."status" = ANY (ARRAY['active'::"public"."program_status", 'paused'::"public"."program_status"]))))))))))))));



CREATE POLICY "Template exercises are viewable by authenticated users" ON "public"."workout_template_exercises" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can create reviews for programs they've accessed" ON "public"."program_reviews" FOR INSERT WITH CHECK ((("user_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."programs" "p"
  WHERE (("p"."id" = "program_reviews"."program_id") AND (("p"."is_public" = true) OR ("p"."created_by" = "auth"."uid"())))))));



CREATE POLICY "Users can create sets" ON "public"."sets" FOR INSERT TO "authenticated" WITH CHECK (("created_by" = "auth"."uid"()));



CREATE POLICY "Users can create their own notification preferences" ON "public"."notification_preferences" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can create their own programs" ON "public"."programs" FOR INSERT WITH CHECK (("created_by" = "auth"."uid"()));



CREATE POLICY "Users can create workouts" ON "public"."workouts" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can delete location images" ON "public"."location_images" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Users can delete own comments" ON "public"."location_comments" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own locations" ON "public"."locations" FOR DELETE USING (("auth"."uid"() = "created_by"));



CREATE POLICY "Users can delete own push tokens" ON "public"."user_push_tokens" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own workouts" ON "public"."workouts" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own notification preferences" ON "public"."notification_preferences" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can delete their own notifications" ON "public"."notifications" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can delete their own programs" ON "public"."programs" FOR DELETE USING (("created_by" = "auth"."uid"()));



CREATE POLICY "Users can delete their own ratings" ON "public"."location_ratings" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own reviews" ON "public"."program_reviews" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can enroll in accessible programs" ON "public"."user_program_enrollments" FOR INSERT WITH CHECK ((("user_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."programs" "p"
  WHERE (("p"."id" = "user_program_enrollments"."program_id") AND (("p"."is_public" = true) OR ("p"."created_by" = "auth"."uid"())))))));



CREATE POLICY "Users can insert location images" ON "public"."location_images" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Users can insert own profile" ON "public"."users" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can insert own push tokens" ON "public"."user_push_tokens" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own workouts" ON "public"."workouts" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own ratings" ON "public"."location_ratings" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage own sessions" ON "public"."workout_sessions" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage phases of their programs" ON "public"."program_phases" USING ((EXISTS ( SELECT 1
   FROM "public"."programs" "p"
  WHERE (("p"."id" = "program_phases"."program_id") AND ("p"."created_by" = "auth"."uid"())))));



CREATE POLICY "Users can manage their own disciplines" ON "public"."user_disciplines" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage weeks of their programs" ON "public"."program_weeks" USING ((EXISTS ( SELECT 1
   FROM "public"."programs" "p"
  WHERE (("p"."id" = "program_weeks"."program_id") AND ("p"."created_by" = "auth"."uid"())))));



CREATE POLICY "Users can manage workout shares" ON "public"."workout_shares" USING ((("auth"."uid"() = "shared_by") OR (("club_id" IS NOT NULL) AND ("club_id" IN ( SELECT "club_members"."club_id"
   FROM "public"."club_members"
  WHERE (("club_members"."user_id" = "auth"."uid"()) AND (("club_members"."status")::"text" = 'approved'::"text"))))))) WITH CHECK ((("auth"."uid"() = "shared_by") OR (("club_id" IS NOT NULL) AND ("club_id" IN ( SELECT "club_members"."club_id"
   FROM "public"."club_members"
  WHERE (("club_members"."user_id" = "auth"."uid"()) AND (("club_members"."status")::"text" = ANY ((ARRAY['approved'::character varying, 'moderator'::character varying, 'owner'::character varying])::"text"[]))))))));



CREATE POLICY "Users can manage workouts of their programs" ON "public"."program_workouts" USING ((EXISTS ( SELECT 1
   FROM "public"."programs" "p"
  WHERE (("p"."id" = "program_workouts"."program_id") AND ("p"."created_by" = "auth"."uid"())))));



CREATE POLICY "Users can participate in events" ON "public"."event_participants" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") AND (EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "event_participants"."event_id") AND (("events"."visibility" = 'public'::"text") OR (("events"."visibility" = 'club_only'::"text") AND (EXISTS ( SELECT 1
           FROM "public"."club_members"
          WHERE (("club_members"."club_id" = "events"."club_id") AND ("club_members"."user_id" = "auth"."uid"()) AND (("club_members"."status")::"text" = 'approved'::"text")))))))))));



CREATE POLICY "Users can read accessible workouts" ON "public"."workouts" FOR SELECT USING ((("auth"."uid"() = "user_id") OR ("user_id" IS NULL) OR ("is_public" = true) OR (EXISTS ( SELECT 1
   FROM ("public"."program_workouts" "pw"
     JOIN "public"."user_program_enrollments" "upe" ON (("pw"."program_id" = "upe"."program_id")))
  WHERE (("pw"."workout_id" = "workouts"."id") AND ("upe"."user_id" = "auth"."uid"()) AND ("upe"."status" = ANY (ARRAY['active'::"public"."program_status", 'paused'::"public"."program_status"])))))));



CREATE POLICY "Users can record their own session completions" ON "public"."program_session_completions" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_program_enrollments" "e"
  WHERE (("e"."id" = "program_session_completions"."enrollment_id") AND ("e"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can remove disciplines they added" ON "public"."location_disciplines" FOR DELETE USING (("auth"."uid"() = "added_by"));



CREATE POLICY "Users can unlike their own likes" ON "public"."club_post_likes" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can unlike their own likes" ON "public"."location_likes" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update disciplines they added or verified" ON "public"."location_disciplines" FOR UPDATE USING ((("auth"."uid"() = "added_by") OR ("auth"."uid"() = "verified_by")));



CREATE POLICY "Users can update location images" ON "public"."location_images" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Users can update own comments" ON "public"."location_comments" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own locations" ON "public"."locations" FOR UPDATE USING (("auth"."uid"() = "created_by"));



CREATE POLICY "Users can update own profile" ON "public"."users" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update own push tokens" ON "public"."user_push_tokens" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own sets" ON "public"."sets" FOR UPDATE TO "authenticated" USING (("created_by" = "auth"."uid"())) WITH CHECK (("created_by" = "auth"."uid"()));



CREATE POLICY "Users can update own workouts" ON "public"."workouts" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own enrollments" ON "public"."user_program_enrollments" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can update their own notification preferences" ON "public"."notification_preferences" FOR UPDATE USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can update their own notifications" ON "public"."notifications" FOR UPDATE USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can update their own participation" ON "public"."event_participants" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own programs" ON "public"."programs" FOR UPDATE USING (("created_by" = "auth"."uid"()));



CREATE POLICY "Users can update their own ratings" ON "public"."location_ratings" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own reviews" ON "public"."program_reviews" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can update their own session completions" ON "public"."program_session_completions" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_program_enrollments" "e"
  WHERE (("e"."id" = "program_session_completions"."enrollment_id") AND ("e"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view accessible sets" ON "public"."sets" FOR SELECT TO "authenticated" USING ((("created_by" = "auth"."uid"()) OR ("is_template" = true) OR (EXISTS ( SELECT 1
   FROM ("public"."workout_sets" "ws"
     JOIN "public"."workouts" "w" ON (("ws"."workout_id" = "w"."id")))
  WHERE (("ws"."set_id" = "sets"."id") AND (("w"."user_id" = "auth"."uid"()) OR ("w"."user_id" IS NULL) OR ("w"."is_public" = true) OR (EXISTS ( SELECT 1
           FROM ("public"."program_workouts" "pw"
             JOIN "public"."user_program_enrollments" "upe" ON (("pw"."program_id" = "upe"."program_id")))
          WHERE (("pw"."workout_id" = "w"."id") AND ("upe"."user_id" = "auth"."uid"()) AND ("upe"."status" = ANY (ARRAY['active'::"public"."program_status", 'paused'::"public"."program_status"])))))))))));



CREATE POLICY "Users can view all location ratings" ON "public"."location_ratings" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can view all profiles" ON "public"."users" FOR SELECT USING (true);



CREATE POLICY "Users can view all user disciplines" ON "public"."user_disciplines" FOR SELECT USING (true);



CREATE POLICY "Users can view appropriate templates" ON "public"."workout_templates" FOR SELECT USING ((("is_official" = true) OR ("author_id" = "auth"."uid"()) OR ("is_premium" = false) OR (("is_premium" = true) AND (EXISTS ( SELECT 1
   FROM "public"."user_subscriptions"
  WHERE (("user_subscriptions"."user_id" = "auth"."uid"()) AND (("user_subscriptions"."status")::"text" = 'active'::"text") AND (("user_subscriptions"."subscription_tier")::"text" = ANY ((ARRAY['premium'::character varying, 'pro'::character varying])::"text"[]))))))));



CREATE POLICY "Users can view appropriate workouts" ON "public"."workouts" FOR SELECT TO "authenticated" USING ((("user_id" = "auth"."uid"()) OR ("is_public" = true) OR ("is_template" = true)));



CREATE POLICY "Users can view location images" ON "public"."location_images" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can view own push tokens" ON "public"."user_push_tokens" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own enrollments" ON "public"."user_program_enrollments" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own notification preferences" ON "public"."notification_preferences" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own notifications" ON "public"."notifications" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own participation" ON "public"."event_participants" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own session completions" ON "public"."program_session_completions" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_program_enrollments" "e"
  WHERE (("e"."id" = "program_session_completions"."enrollment_id") AND ("e"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can withdraw from events" ON "public"."event_participants" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users manage own preferences" ON "public"."user_workout_preferences" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users manage own subscriptions" ON "public"."user_subscriptions" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Workout sets follow workout permissions" ON "public"."workout_sets" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."workouts" "w"
  WHERE (("w"."id" = "workout_sets"."workout_id") AND (("w"."user_id" = "auth"."uid"()) OR ("w"."is_public" = true) OR ("w"."is_template" = true))))));



ALTER TABLE "public"."club_members" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "club_members_delete_self" ON "public"."club_members" FOR DELETE USING ((("user_id" = "auth"."uid"()) AND (("role")::"text" <> 'owner'::"text")));



CREATE POLICY "club_members_delete_staff" ON "public"."club_members" FOR DELETE USING (((EXISTS ( SELECT 1
   FROM "public"."club_members" "staff"
  WHERE (("staff"."club_id" = "club_members"."club_id") AND ("staff"."user_id" = "auth"."uid"()) AND (("staff"."role")::"text" = ANY ((ARRAY['owner'::character varying, 'moderator'::character varying])::"text"[])) AND (("staff"."status")::"text" = 'approved'::"text")))) AND (("role")::"text" <> 'owner'::"text")));



CREATE POLICY "club_members_insert_request" ON "public"."club_members" FOR INSERT WITH CHECK ((("auth"."uid"() IS NOT NULL) AND ("user_id" = "auth"."uid"()) AND (("role")::"text" = 'member'::"text")));



CREATE POLICY "club_members_select_own" ON "public"."club_members" FOR SELECT USING (("user_id" = "auth"."uid"()));



COMMENT ON POLICY "club_members_select_own" ON "public"."club_members" IS 'Users can always see their own membership records';



CREATE POLICY "club_members_select_private_members" ON "public"."club_members" FOR SELECT USING (((EXISTS ( SELECT 1
   FROM "public"."clubs"
  WHERE (("clubs"."id" = "club_members"."club_id") AND (("clubs"."privacy")::"text" = 'private'::"text")))) AND "public"."is_approved_club_member"("club_id", "auth"."uid"())));



CREATE POLICY "club_members_select_public" ON "public"."club_members" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."clubs"
  WHERE (("clubs"."id" = "club_members"."club_id") AND (("clubs"."privacy")::"text" = 'public'::"text")))));



CREATE POLICY "club_members_update_staff" ON "public"."club_members" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."club_members" "staff"
  WHERE (("staff"."club_id" = "club_members"."club_id") AND ("staff"."user_id" = "auth"."uid"()) AND (("staff"."role")::"text" = ANY ((ARRAY['owner'::character varying, 'moderator'::character varying])::"text"[])) AND (("staff"."status")::"text" = 'approved'::"text")))));



ALTER TABLE "public"."club_post_comments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "club_post_comments_delete_author" ON "public"."club_post_comments" FOR DELETE USING (("author_id" = "auth"."uid"()));



CREATE POLICY "club_post_comments_delete_staff" ON "public"."club_post_comments" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM ("public"."club_posts" "p"
     JOIN "public"."club_members" "m" ON (("m"."club_id" = "p"."club_id")))
  WHERE (("p"."id" = "club_post_comments"."post_id") AND ("m"."user_id" = "auth"."uid"()) AND (("m"."role")::"text" = ANY ((ARRAY['owner'::character varying, 'moderator'::character varying])::"text"[])) AND (("m"."status")::"text" = 'approved'::"text")))));



COMMENT ON POLICY "club_post_comments_delete_staff" ON "public"."club_post_comments" IS 'FIXED: Staff can delete comments - all column references qualified';



CREATE POLICY "club_post_comments_insert_members" ON "public"."club_post_comments" FOR INSERT WITH CHECK ((("auth"."uid"() IS NOT NULL) AND ("author_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM ("public"."club_posts" "p"
     JOIN "public"."club_members" "m" ON (("m"."club_id" = "p"."club_id")))
  WHERE (("p"."id" = "club_post_comments"."post_id") AND ("m"."user_id" = "auth"."uid"()) AND (("m"."status")::"text" = 'approved'::"text"))))));



COMMENT ON POLICY "club_post_comments_insert_members" ON "public"."club_post_comments" IS 'FIXED: Members can create comments - all column references qualified';



CREATE POLICY "club_post_comments_select_private_members" ON "public"."club_post_comments" FOR SELECT USING (((EXISTS ( SELECT 1
   FROM ("public"."club_posts" "p"
     JOIN "public"."clubs" "c" ON (("c"."id" = "p"."club_id")))
  WHERE (("p"."id" = "club_post_comments"."post_id") AND (("c"."privacy")::"text" = 'private'::"text")))) AND (EXISTS ( SELECT 1
   FROM ("public"."club_posts" "p"
     JOIN "public"."club_members" "m" ON (("m"."club_id" = "p"."club_id")))
  WHERE (("p"."id" = "club_post_comments"."post_id") AND ("m"."user_id" = "auth"."uid"()) AND (("m"."status")::"text" = 'approved'::"text"))))));



COMMENT ON POLICY "club_post_comments_select_private_members" ON "public"."club_post_comments" IS 'FIXED: Private club comments visible to members - all column references qualified';



CREATE POLICY "club_post_comments_select_public" ON "public"."club_post_comments" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."club_posts" "p"
     JOIN "public"."clubs" "c" ON (("c"."id" = "p"."club_id")))
  WHERE (("p"."id" = "club_post_comments"."post_id") AND (("c"."privacy")::"text" = 'public'::"text")))));



CREATE POLICY "club_post_comments_update_author" ON "public"."club_post_comments" FOR UPDATE USING (("author_id" = "auth"."uid"()));



ALTER TABLE "public"."club_post_likes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."club_posts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "club_posts_delete_author" ON "public"."club_posts" FOR DELETE USING (("author_id" = "auth"."uid"()));



CREATE POLICY "club_posts_delete_staff" ON "public"."club_posts" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."club_members"
  WHERE (("club_members"."club_id" = "club_posts"."club_id") AND ("club_members"."user_id" = "auth"."uid"()) AND (("club_members"."role")::"text" = ANY ((ARRAY['owner'::character varying, 'moderator'::character varying])::"text"[])) AND (("club_members"."status")::"text" = 'approved'::"text")))));



COMMENT ON POLICY "club_posts_delete_staff" ON "public"."club_posts" IS 'FIXED: Staff can delete posts - all column references qualified';



CREATE POLICY "club_posts_insert_members" ON "public"."club_posts" FOR INSERT WITH CHECK ((("auth"."uid"() IS NOT NULL) AND ("author_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."club_members"
  WHERE (("club_members"."club_id" = "club_posts"."club_id") AND ("club_members"."user_id" = "auth"."uid"()) AND (("club_members"."status")::"text" = 'approved'::"text"))))));



COMMENT ON POLICY "club_posts_insert_members" ON "public"."club_posts" IS 'FIXED: Members can create posts - all column references qualified';



CREATE POLICY "club_posts_select_private_members" ON "public"."club_posts" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."clubs"
  WHERE (("clubs"."id" = "club_posts"."club_id") AND (("clubs"."privacy")::"text" = 'private'::"text") AND (EXISTS ( SELECT 1
           FROM "public"."club_members"
          WHERE (("club_members"."club_id" = "clubs"."id") AND ("club_members"."user_id" = "auth"."uid"()) AND (("club_members"."status")::"text" = 'approved'::"text"))))))));



COMMENT ON POLICY "club_posts_select_private_members" ON "public"."club_posts" IS 'Private club posts only visible to approved members';



CREATE POLICY "club_posts_select_public" ON "public"."club_posts" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."clubs"
  WHERE (("clubs"."id" = "club_posts"."club_id") AND (("clubs"."privacy")::"text" = 'public'::"text")))));



COMMENT ON POLICY "club_posts_select_public" ON "public"."club_posts" IS 'Public club posts are visible to everyone';



CREATE POLICY "club_posts_update_author" ON "public"."club_posts" FOR UPDATE USING (("author_id" = "auth"."uid"()));



ALTER TABLE "public"."club_spots" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "club_spots_delete_author_or_staff" ON "public"."club_spots" FOR DELETE USING ((("added_by" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."club_members"
  WHERE (("club_members"."club_id" = "club_spots"."club_id") AND ("club_members"."user_id" = "auth"."uid"()) AND (("club_members"."role")::"text" = ANY ((ARRAY['owner'::character varying, 'moderator'::character varying])::"text"[])) AND (("club_members"."status")::"text" = 'approved'::"text"))))));



CREATE POLICY "club_spots_insert_members" ON "public"."club_spots" FOR INSERT WITH CHECK ((("auth"."uid"() IS NOT NULL) AND ("added_by" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."club_members"
  WHERE (("club_members"."club_id" = "club_spots"."club_id") AND ("club_members"."user_id" = "auth"."uid"()) AND (("club_members"."status")::"text" = 'approved'::"text"))))));



CREATE POLICY "club_spots_select_private_members" ON "public"."club_spots" FOR SELECT USING (((EXISTS ( SELECT 1
   FROM "public"."clubs"
  WHERE (("clubs"."id" = "club_spots"."club_id") AND (("clubs"."privacy")::"text" = 'private'::"text")))) AND (EXISTS ( SELECT 1
   FROM "public"."club_members"
  WHERE (("club_members"."club_id" = "club_spots"."club_id") AND ("club_members"."user_id" = "auth"."uid"()) AND (("club_members"."status")::"text" = 'approved'::"text"))))));



CREATE POLICY "club_spots_select_public" ON "public"."club_spots" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."clubs"
  WHERE (("clubs"."id" = "club_spots"."club_id") AND (("clubs"."privacy")::"text" = 'public'::"text")))));



ALTER TABLE "public"."club_tags" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "club_tags_delete_staff" ON "public"."club_tags" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."club_members"
  WHERE (("club_members"."club_id" = "club_tags"."club_id") AND ("club_members"."user_id" = "auth"."uid"()) AND (("club_members"."role")::"text" = ANY ((ARRAY['owner'::character varying, 'moderator'::character varying])::"text"[])) AND (("club_members"."status")::"text" = 'approved'::"text")))));



CREATE POLICY "club_tags_insert_staff" ON "public"."club_tags" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."club_members"
  WHERE (("club_members"."club_id" = "club_tags"."club_id") AND ("club_members"."user_id" = "auth"."uid"()) AND (("club_members"."role")::"text" = ANY ((ARRAY['owner'::character varying, 'moderator'::character varying])::"text"[])) AND (("club_members"."status")::"text" = 'approved'::"text")))));



CREATE POLICY "club_tags_select_private_members" ON "public"."club_tags" FOR SELECT USING (((EXISTS ( SELECT 1
   FROM "public"."clubs"
  WHERE (("clubs"."id" = "club_tags"."club_id") AND (("clubs"."privacy")::"text" = 'private'::"text")))) AND (EXISTS ( SELECT 1
   FROM "public"."club_members"
  WHERE (("club_members"."club_id" = "club_tags"."club_id") AND ("club_members"."user_id" = "auth"."uid"()) AND (("club_members"."status")::"text" = 'approved'::"text"))))));



CREATE POLICY "club_tags_select_public" ON "public"."club_tags" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."clubs"
  WHERE (("clubs"."id" = "club_tags"."club_id") AND (("clubs"."privacy")::"text" = 'public'::"text")))));



ALTER TABLE "public"."clubs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "clubs_delete_owner" ON "public"."clubs" FOR DELETE USING ("public"."is_club_owner_secure"("id", "auth"."uid"()));



CREATE POLICY "clubs_insert_authenticated" ON "public"."clubs" FOR INSERT WITH CHECK ((("auth"."uid"() IS NOT NULL) AND ("created_by" = "auth"."uid"())));



CREATE POLICY "clubs_select_all_for_discovery" ON "public"."clubs" FOR SELECT USING (true);



COMMENT ON POLICY "clubs_select_all_for_discovery" ON "public"."clubs" IS 'All clubs (public and private) are visible in listings for discovery. Private club content remains restricted.';



CREATE POLICY "clubs_update_owner" ON "public"."clubs" FOR UPDATE USING ("public"."is_club_owner_secure"("id", "auth"."uid"()));



ALTER TABLE "public"."disciplines" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."equipments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_images" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_locations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_participants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_post_comments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "event_post_comments_delete_author" ON "public"."event_post_comments" FOR DELETE USING (("author_id" = "auth"."uid"()));



CREATE POLICY "event_post_comments_delete_creator" ON "public"."event_post_comments" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM ("public"."event_posts" "p"
     JOIN "public"."events" "e" ON (("e"."id" = "p"."event_id")))
  WHERE (("p"."id" = "event_post_comments"."post_id") AND ("e"."created_by" = "auth"."uid"())))));



CREATE POLICY "event_post_comments_insert_participants" ON "public"."event_post_comments" FOR INSERT WITH CHECK ((("auth"."uid"() IS NOT NULL) AND ("author_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM ("public"."event_posts" "p"
     JOIN "public"."event_participants" "ep" ON (("ep"."event_id" = "p"."event_id")))
  WHERE (("p"."id" = "event_post_comments"."post_id") AND ("ep"."user_id" = "auth"."uid"()) AND ("ep"."participation_type" = 'participating'::"text") AND ("ep"."status" = 'approved'::"text"))))));



CREATE POLICY "event_post_comments_select_visibility" ON "public"."event_post_comments" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."event_posts" "p"
     JOIN "public"."events" "e" ON (("e"."id" = "p"."event_id")))
  WHERE (("p"."id" = "event_post_comments"."post_id") AND (("e"."visibility" = 'public'::"text") OR (("e"."visibility" = 'private'::"text") AND ("auth"."uid"() = "e"."created_by")) OR (("e"."visibility" = 'club_only'::"text") AND (("auth"."uid"() = "e"."created_by") OR (EXISTS ( SELECT 1
           FROM "public"."club_members"
          WHERE (("club_members"."club_id" = "e"."club_id") AND ("club_members"."user_id" = "auth"."uid"()) AND (("club_members"."status")::"text" = 'approved'::"text")))))) OR (EXISTS ( SELECT 1
           FROM "public"."event_participants"
          WHERE (("event_participants"."event_id" = "e"."id") AND ("event_participants"."user_id" = "auth"."uid"()) AND ("event_participants"."status" = 'approved'::"text")))))))));



CREATE POLICY "event_post_comments_update_author" ON "public"."event_post_comments" FOR UPDATE USING (("author_id" = "auth"."uid"()));



ALTER TABLE "public"."event_post_likes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "event_post_likes_delete_own" ON "public"."event_post_likes" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "event_post_likes_insert_participants" ON "public"."event_post_likes" FOR INSERT WITH CHECK ((("auth"."uid"() IS NOT NULL) AND ("user_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM ("public"."event_posts" "p"
     JOIN "public"."event_participants" "ep" ON (("ep"."event_id" = "p"."event_id")))
  WHERE (("p"."id" = "event_post_likes"."post_id") AND ("ep"."user_id" = "auth"."uid"()) AND ("ep"."status" = 'approved'::"text"))))));



CREATE POLICY "event_post_likes_select_visibility" ON "public"."event_post_likes" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."event_posts" "p"
     JOIN "public"."events" "e" ON (("e"."id" = "p"."event_id")))
  WHERE (("p"."id" = "event_post_likes"."post_id") AND (("e"."visibility" = 'public'::"text") OR (("e"."visibility" = 'private'::"text") AND ("auth"."uid"() = "e"."created_by")) OR (("e"."visibility" = 'club_only'::"text") AND (("auth"."uid"() = "e"."created_by") OR (EXISTS ( SELECT 1
           FROM "public"."club_members"
          WHERE (("club_members"."club_id" = "e"."club_id") AND ("club_members"."user_id" = "auth"."uid"()) AND (("club_members"."status")::"text" = 'approved'::"text")))))) OR (EXISTS ( SELECT 1
           FROM "public"."event_participants"
          WHERE (("event_participants"."event_id" = "e"."id") AND ("event_participants"."user_id" = "auth"."uid"()) AND ("event_participants"."status" = 'approved'::"text")))))))));



ALTER TABLE "public"."event_posts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "event_posts_delete_author" ON "public"."event_posts" FOR DELETE USING (("author_id" = "auth"."uid"()));



CREATE POLICY "event_posts_delete_creator" ON "public"."event_posts" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "event_posts"."event_id") AND ("events"."created_by" = "auth"."uid"())))));



COMMENT ON POLICY "event_posts_delete_creator" ON "public"."event_posts" IS 'Event creators can moderate any posts in their events';



CREATE POLICY "event_posts_insert_participants" ON "public"."event_posts" FOR INSERT WITH CHECK ((("auth"."uid"() IS NOT NULL) AND ("author_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."event_participants"
  WHERE (("event_participants"."event_id" = "event_posts"."event_id") AND ("event_participants"."user_id" = "auth"."uid"()) AND ("event_participants"."participation_type" = 'participating'::"text") AND ("event_participants"."status" = 'approved'::"text"))))));



COMMENT ON POLICY "event_posts_insert_participants" ON "public"."event_posts" IS 'Only approved event participants can post';



CREATE POLICY "event_posts_select_visibility" ON "public"."event_posts" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "event_posts"."event_id") AND (("events"."visibility" = 'public'::"text") OR (("events"."visibility" = 'private'::"text") AND ("auth"."uid"() = "events"."created_by")) OR (("events"."visibility" = 'club_only'::"text") AND (("auth"."uid"() = "events"."created_by") OR (EXISTS ( SELECT 1
           FROM "public"."club_members"
          WHERE (("club_members"."club_id" = "events"."club_id") AND ("club_members"."user_id" = "auth"."uid"()) AND (("club_members"."status")::"text" = 'approved'::"text")))))) OR (EXISTS ( SELECT 1
           FROM "public"."event_participants"
          WHERE (("event_participants"."event_id" = "events"."id") AND ("event_participants"."user_id" = "auth"."uid"()) AND ("event_participants"."status" = 'approved'::"text")))))))));



COMMENT ON POLICY "event_posts_select_visibility" ON "public"."event_posts" IS 'Posts visible based on event visibility and participation';



CREATE POLICY "event_posts_update_author" ON "public"."event_posts" FOR UPDATE USING (("author_id" = "auth"."uid"()));



ALTER TABLE "public"."event_tag_assignments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_tags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercise_equipment" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercise_muscles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercise_progressions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercises" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."location_comments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "location_comments delete own" ON "public"."location_comments" FOR DELETE TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "location_comments insert own" ON "public"."location_comments" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "location_comments update own" ON "public"."location_comments" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."location_disciplines" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "location_disciplines delete authed" ON "public"."location_disciplines" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "location_disciplines insert own" ON "public"."location_disciplines" FOR INSERT TO "authenticated" WITH CHECK (("added_by" = "auth"."uid"()));



ALTER TABLE "public"."location_equipments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "location_equipments delete authed" ON "public"."location_equipments" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "location_equipments insert own" ON "public"."location_equipments" FOR INSERT TO "authenticated" WITH CHECK (("added_by" = "auth"."uid"()));



ALTER TABLE "public"."location_images" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "location_images delete authed" ON "public"."location_images" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "location_images insert own" ON "public"."location_images" FOR INSERT TO "authenticated" WITH CHECK (("uploaded_by" = "auth"."uid"()));



ALTER TABLE "public"."location_likes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "location_likes delete own" ON "public"."location_likes" FOR DELETE TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "location_likes insert own" ON "public"."location_likes" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."location_ratings" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "location_ratings delete own" ON "public"."location_ratings" FOR DELETE TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "location_ratings insert own" ON "public"."location_ratings" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "location_ratings update own" ON "public"."location_ratings" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."locations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "locations insert own" ON "public"."locations" FOR INSERT TO "authenticated" WITH CHECK (("created_by" = "auth"."uid"()));



CREATE POLICY "locations update authed" ON "public"."locations" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



ALTER TABLE "public"."muscles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notification_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."program_phases" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."program_reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."program_session_completions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."program_weeks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."program_workouts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."programs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."push_queue" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reports" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "reports insert own" ON "public"."reports" FOR INSERT TO "authenticated" WITH CHECK (("reporter_id" = "auth"."uid"()));



ALTER TABLE "public"."session_exercises" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."set_exercises" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_disciplines" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_program_enrollments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_push_tokens" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_subscriptions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_workout_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users update own" ON "public"."users" FOR UPDATE TO "authenticated" USING (("id" = "auth"."uid"())) WITH CHECK (("id" = "auth"."uid"()));



ALTER TABLE "public"."website_users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workout_likes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workout_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workout_sets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workout_shares" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workout_template_exercises" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workout_templates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workouts" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."club_members";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."club_post_comments";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."club_posts";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."clubs";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."notifications";









GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."box2d_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."box2d_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."box2d_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box2d_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."box2d_out"("public"."box2d") TO "postgres";
GRANT ALL ON FUNCTION "public"."box2d_out"("public"."box2d") TO "anon";
GRANT ALL ON FUNCTION "public"."box2d_out"("public"."box2d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box2d_out"("public"."box2d") TO "service_role";



GRANT ALL ON FUNCTION "public"."box2df_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."box2df_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."box2df_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box2df_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."box2df_out"("public"."box2df") TO "postgres";
GRANT ALL ON FUNCTION "public"."box2df_out"("public"."box2df") TO "anon";
GRANT ALL ON FUNCTION "public"."box2df_out"("public"."box2df") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box2df_out"("public"."box2df") TO "service_role";



GRANT ALL ON FUNCTION "public"."box3d_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."box3d_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."box3d_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box3d_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."box3d_out"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."box3d_out"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."box3d_out"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box3d_out"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_analyze"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_analyze"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_analyze"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_analyze"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_in"("cstring", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_in"("cstring", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."geography_in"("cstring", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_in"("cstring", "oid", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_out"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_out"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_out"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_out"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_recv"("internal", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_recv"("internal", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."geography_recv"("internal", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_recv"("internal", "oid", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_send"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_send"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_send"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_send"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_typmod_in"("cstring"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_typmod_in"("cstring"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."geography_typmod_in"("cstring"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_typmod_in"("cstring"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_typmod_out"(integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_typmod_out"(integer) TO "anon";
GRANT ALL ON FUNCTION "public"."geography_typmod_out"(integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_typmod_out"(integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_analyze"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_analyze"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_analyze"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_analyze"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_out"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_out"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_out"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_out"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_recv"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_recv"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_recv"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_recv"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_send"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_send"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_send"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_send"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_typmod_in"("cstring"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_typmod_in"("cstring"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_typmod_in"("cstring"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_typmod_in"("cstring"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_typmod_out"(integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_typmod_out"(integer) TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_typmod_out"(integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_typmod_out"(integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."gidx_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."gidx_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."gidx_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gidx_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."gidx_out"("public"."gidx") TO "postgres";
GRANT ALL ON FUNCTION "public"."gidx_out"("public"."gidx") TO "anon";
GRANT ALL ON FUNCTION "public"."gidx_out"("public"."gidx") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gidx_out"("public"."gidx") TO "service_role";



GRANT ALL ON FUNCTION "public"."spheroid_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."spheroid_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."spheroid_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."spheroid_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."spheroid_out"("public"."spheroid") TO "postgres";
GRANT ALL ON FUNCTION "public"."spheroid_out"("public"."spheroid") TO "anon";
GRANT ALL ON FUNCTION "public"."spheroid_out"("public"."spheroid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."spheroid_out"("public"."spheroid") TO "service_role";



GRANT ALL ON FUNCTION "public"."box3d"("public"."box2d") TO "postgres";
GRANT ALL ON FUNCTION "public"."box3d"("public"."box2d") TO "anon";
GRANT ALL ON FUNCTION "public"."box3d"("public"."box2d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box3d"("public"."box2d") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry"("public"."box2d") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry"("public"."box2d") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry"("public"."box2d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry"("public"."box2d") TO "service_role";



GRANT ALL ON FUNCTION "public"."box"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."box"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."box"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."box2d"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."box2d"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."box2d"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box2d"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."geography"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."bytea"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."bytea"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."bytea"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."bytea"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography"("public"."geography", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."geography"("public"."geography", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."geography"("public"."geography", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography"("public"."geography", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."box"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."box"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."box"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."box2d"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."box2d"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."box2d"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box2d"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."box3d"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."box3d"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."box3d"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box3d"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."bytea"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."bytea"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."bytea"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."bytea"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geography"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry"("public"."geometry", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry"("public"."geometry", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."geometry"("public"."geometry", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry"("public"."geometry", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."json"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."json"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."json"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."json"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."jsonb"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."jsonb"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."jsonb"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."jsonb"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."path"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."path"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."path"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."path"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."point"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."point"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."point"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."point"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."polygon"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."polygon"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."polygon"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."polygon"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."text"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."text"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."text"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."text"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry"("path") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry"("path") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry"("path") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry"("path") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry"("point") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry"("point") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry"("point") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry"("point") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry"("polygon") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry"("polygon") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry"("polygon") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry"("polygon") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry"("text") TO "service_role";











































































































































































GRANT ALL ON FUNCTION "public"."_postgis_deprecate"("oldname" "text", "newname" "text", "version" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."_postgis_deprecate"("oldname" "text", "newname" "text", "version" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."_postgis_deprecate"("oldname" "text", "newname" "text", "version" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_postgis_deprecate"("oldname" "text", "newname" "text", "version" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."_postgis_index_extent"("tbl" "regclass", "col" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."_postgis_index_extent"("tbl" "regclass", "col" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."_postgis_index_extent"("tbl" "regclass", "col" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_postgis_index_extent"("tbl" "regclass", "col" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."_postgis_join_selectivity"("regclass", "text", "regclass", "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."_postgis_join_selectivity"("regclass", "text", "regclass", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."_postgis_join_selectivity"("regclass", "text", "regclass", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_postgis_join_selectivity"("regclass", "text", "regclass", "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."_postgis_pgsql_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."_postgis_pgsql_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."_postgis_pgsql_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."_postgis_pgsql_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."_postgis_scripts_pgsql_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."_postgis_scripts_pgsql_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."_postgis_scripts_pgsql_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."_postgis_scripts_pgsql_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."_postgis_selectivity"("tbl" "regclass", "att_name" "text", "geom" "public"."geometry", "mode" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."_postgis_selectivity"("tbl" "regclass", "att_name" "text", "geom" "public"."geometry", "mode" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."_postgis_selectivity"("tbl" "regclass", "att_name" "text", "geom" "public"."geometry", "mode" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_postgis_selectivity"("tbl" "regclass", "att_name" "text", "geom" "public"."geometry", "mode" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."_postgis_stats"("tbl" "regclass", "att_name" "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."_postgis_stats"("tbl" "regclass", "att_name" "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."_postgis_stats"("tbl" "regclass", "att_name" "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_postgis_stats"("tbl" "regclass", "att_name" "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_3ddfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_3ddfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_3ddfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_3ddfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_3ddwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_3ddwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_3ddwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_3ddwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_3dintersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_3dintersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_3dintersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_3dintersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_asgml"(integer, "public"."geometry", integer, integer, "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_asgml"(integer, "public"."geometry", integer, integer, "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_asgml"(integer, "public"."geometry", integer, integer, "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_asgml"(integer, "public"."geometry", integer, integer, "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_asx3d"(integer, "public"."geometry", integer, integer, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_asx3d"(integer, "public"."geometry", integer, integer, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_asx3d"(integer, "public"."geometry", integer, integer, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_asx3d"(integer, "public"."geometry", integer, integer, "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_bestsrid"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_bestsrid"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_bestsrid"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_bestsrid"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_bestsrid"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_bestsrid"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_bestsrid"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_bestsrid"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_containsproperly"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_containsproperly"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_containsproperly"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_containsproperly"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_coveredby"("geog1" "public"."geography", "geog2" "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_coveredby"("geog1" "public"."geography", "geog2" "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_coveredby"("geog1" "public"."geography", "geog2" "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_coveredby"("geog1" "public"."geography", "geog2" "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_coveredby"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_coveredby"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_coveredby"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_coveredby"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_covers"("geog1" "public"."geography", "geog2" "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_covers"("geog1" "public"."geography", "geog2" "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_covers"("geog1" "public"."geography", "geog2" "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_covers"("geog1" "public"."geography", "geog2" "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_covers"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_covers"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_covers"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_covers"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_crosses"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_crosses"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_crosses"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_crosses"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_dfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_dfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_dfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_dfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_distancetree"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_distancetree"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_distancetree"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_distancetree"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_distancetree"("public"."geography", "public"."geography", double precision, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_distancetree"("public"."geography", "public"."geography", double precision, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_distancetree"("public"."geography", "public"."geography", double precision, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_distancetree"("public"."geography", "public"."geography", double precision, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography", boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography", boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography", boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography", boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography", double precision, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography", double precision, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography", double precision, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography", double precision, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_dwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_dwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_dwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_dwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_dwithin"("geog1" "public"."geography", "geog2" "public"."geography", "tolerance" double precision, "use_spheroid" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_dwithin"("geog1" "public"."geography", "geog2" "public"."geography", "tolerance" double precision, "use_spheroid" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_dwithin"("geog1" "public"."geography", "geog2" "public"."geography", "tolerance" double precision, "use_spheroid" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_dwithin"("geog1" "public"."geography", "geog2" "public"."geography", "tolerance" double precision, "use_spheroid" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_dwithinuncached"("public"."geography", "public"."geography", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_dwithinuncached"("public"."geography", "public"."geography", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_dwithinuncached"("public"."geography", "public"."geography", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_dwithinuncached"("public"."geography", "public"."geography", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_dwithinuncached"("public"."geography", "public"."geography", double precision, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_dwithinuncached"("public"."geography", "public"."geography", double precision, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_dwithinuncached"("public"."geography", "public"."geography", double precision, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_dwithinuncached"("public"."geography", "public"."geography", double precision, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_expand"("public"."geography", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_expand"("public"."geography", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_expand"("public"."geography", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_expand"("public"."geography", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_geomfromgml"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_geomfromgml"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_geomfromgml"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_geomfromgml"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_intersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_intersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_intersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_intersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_linecrossingdirection"("line1" "public"."geometry", "line2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_linecrossingdirection"("line1" "public"."geometry", "line2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_linecrossingdirection"("line1" "public"."geometry", "line2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_linecrossingdirection"("line1" "public"."geometry", "line2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_longestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_longestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_longestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_longestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_maxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_maxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_maxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_maxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_orderingequals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_orderingequals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_orderingequals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_orderingequals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_pointoutside"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_pointoutside"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_pointoutside"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_pointoutside"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_sortablehash"("geom" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_sortablehash"("geom" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_sortablehash"("geom" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_sortablehash"("geom" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_touches"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_touches"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_touches"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_touches"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_voronoi"("g1" "public"."geometry", "clip" "public"."geometry", "tolerance" double precision, "return_polygons" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_voronoi"("g1" "public"."geometry", "clip" "public"."geometry", "tolerance" double precision, "return_polygons" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_voronoi"("g1" "public"."geometry", "clip" "public"."geometry", "tolerance" double precision, "return_polygons" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_voronoi"("g1" "public"."geometry", "clip" "public"."geometry", "tolerance" double precision, "return_polygons" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."addauth"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."addauth"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."addauth"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."addauth"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("table_name" character varying, "column_name" character varying, "new_srid" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("table_name" character varying, "column_name" character varying, "new_srid" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("table_name" character varying, "column_name" character varying, "new_srid" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("table_name" character varying, "column_name" character varying, "new_srid" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid_in" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid_in" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid_in" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid_in" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."backfill_push_queue"() TO "anon";
GRANT ALL ON FUNCTION "public"."backfill_push_queue"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."backfill_push_queue"() TO "service_role";



GRANT ALL ON FUNCTION "public"."box3dtobox"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."box3dtobox"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."box3dtobox"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box3dtobox"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_workout_stats"("workout_id_param" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_workout_stats"("workout_id_param" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_workout_stats"("workout_id_param" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."checkauth"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."checkauth"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."checkauth"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."checkauth"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."checkauth"("text", "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."checkauth"("text", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."checkauth"("text", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."checkauth"("text", "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."checkauthtrigger"() TO "postgres";
GRANT ALL ON FUNCTION "public"."checkauthtrigger"() TO "anon";
GRANT ALL ON FUNCTION "public"."checkauthtrigger"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."checkauthtrigger"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_old_push_tokens"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_old_push_tokens"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_old_push_tokens"() TO "service_role";



GRANT ALL ON FUNCTION "public"."contains_2d"("public"."box2df", "public"."box2df") TO "postgres";
GRANT ALL ON FUNCTION "public"."contains_2d"("public"."box2df", "public"."box2df") TO "anon";
GRANT ALL ON FUNCTION "public"."contains_2d"("public"."box2df", "public"."box2df") TO "authenticated";
GRANT ALL ON FUNCTION "public"."contains_2d"("public"."box2df", "public"."box2df") TO "service_role";



GRANT ALL ON FUNCTION "public"."contains_2d"("public"."box2df", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."contains_2d"("public"."box2df", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."contains_2d"("public"."box2df", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."contains_2d"("public"."box2df", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."contains_2d"("public"."geometry", "public"."box2df") TO "postgres";
GRANT ALL ON FUNCTION "public"."contains_2d"("public"."geometry", "public"."box2df") TO "anon";
GRANT ALL ON FUNCTION "public"."contains_2d"("public"."geometry", "public"."box2df") TO "authenticated";
GRANT ALL ON FUNCTION "public"."contains_2d"("public"."geometry", "public"."box2df") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_event_approval_request_notification"("p_event_id" "uuid", "p_event_participant_id" "uuid", "p_requester_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_event_approval_request_notification"("p_event_id" "uuid", "p_event_participant_id" "uuid", "p_requester_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_event_approval_request_notification"("p_event_id" "uuid", "p_event_participant_id" "uuid", "p_requester_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_event_cancelled_notification"("p_event_id" "uuid", "p_canceller_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_event_cancelled_notification"("p_event_id" "uuid", "p_canceller_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_event_cancelled_notification"("p_event_id" "uuid", "p_canceller_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_event_created_notification"("p_event_id" "uuid", "p_creator_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_event_created_notification"("p_event_id" "uuid", "p_creator_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_event_created_notification"("p_event_id" "uuid", "p_creator_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_event_participant_joined_notification"("p_event_id" "uuid", "p_participant_id" "uuid", "p_event_participant_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_event_participant_joined_notification"("p_event_id" "uuid", "p_participant_id" "uuid", "p_event_participant_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_event_participant_joined_notification"("p_event_id" "uuid", "p_participant_id" "uuid", "p_event_participant_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_event_updated_notification"("p_event_id" "uuid", "p_updater_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_event_updated_notification"("p_event_id" "uuid", "p_updater_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_event_updated_notification"("p_event_id" "uuid", "p_updater_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_membership_request_notification"("p_club_id" "uuid", "p_requester_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_membership_request_notification"("p_club_id" "uuid", "p_requester_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_membership_request_notification"("p_club_id" "uuid", "p_requester_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_membership_status_notification"("p_club_id" "uuid", "p_member_id" "uuid", "p_status" character varying, "p_actor_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_membership_status_notification"("p_club_id" "uuid", "p_member_id" "uuid", "p_status" character varying, "p_actor_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_membership_status_notification"("p_club_id" "uuid", "p_member_id" "uuid", "p_status" character varying, "p_actor_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_new_comment_notification"("p_post_id" "uuid", "p_comment_id" "uuid", "p_commenter_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_new_comment_notification"("p_post_id" "uuid", "p_comment_id" "uuid", "p_commenter_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_new_comment_notification"("p_post_id" "uuid", "p_comment_id" "uuid", "p_commenter_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_new_post_notification"("p_club_id" "uuid", "p_post_id" "uuid", "p_author_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_new_post_notification"("p_club_id" "uuid", "p_post_id" "uuid", "p_author_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_new_post_notification"("p_club_id" "uuid", "p_post_id" "uuid", "p_author_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_role_change_notification"("p_club_id" "uuid", "p_member_id" "uuid", "p_old_role" character varying, "p_new_role" character varying, "p_actor_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_role_change_notification"("p_club_id" "uuid", "p_member_id" "uuid", "p_old_role" character varying, "p_new_role" character varying, "p_actor_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_role_change_notification"("p_club_id" "uuid", "p_member_id" "uuid", "p_old_role" character varying, "p_new_role" character varying, "p_actor_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_straight_set"("set_name" character varying, "exercise_id_param" "uuid", "sets_count" integer, "reps_target" integer, "rest_seconds" integer, "user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_straight_set"("set_name" character varying, "exercise_id_param" "uuid", "sets_count" integer, "reps_target" integer, "rest_seconds" integer, "user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_straight_set"("set_name" character varying, "exercise_id_param" "uuid", "sets_count" integer, "reps_target" integer, "rest_seconds" integer, "user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_superset"("set_name" character varying, "exercise_ids" "uuid"[], "exercise_targets" integer[], "sets_count" integer, "rest_between_exercises" integer, "rest_between_rounds" integer, "user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_superset"("set_name" character varying, "exercise_ids" "uuid"[], "exercise_targets" integer[], "sets_count" integer, "rest_between_exercises" integer, "rest_between_rounds" integer, "user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_superset"("set_name" character varying, "exercise_ids" "uuid"[], "exercise_targets" integer[], "sets_count" integer, "rest_between_exercises" integer, "rest_between_rounds" integer, "user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_user_profile"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_user_profile"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_user_profile"() TO "service_role";



GRANT ALL ON FUNCTION "public"."disablelongtransactions"() TO "postgres";
GRANT ALL ON FUNCTION "public"."disablelongtransactions"() TO "anon";
GRANT ALL ON FUNCTION "public"."disablelongtransactions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."disablelongtransactions"() TO "service_role";



GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("table_name" character varying, "column_name" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("table_name" character varying, "column_name" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("table_name" character varying, "column_name" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("table_name" character varying, "column_name" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("schema_name" character varying, "table_name" character varying, "column_name" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("schema_name" character varying, "table_name" character varying, "column_name" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("schema_name" character varying, "table_name" character varying, "column_name" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("schema_name" character varying, "table_name" character varying, "column_name" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."dropgeometrytable"("table_name" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."dropgeometrytable"("table_name" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."dropgeometrytable"("table_name" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."dropgeometrytable"("table_name" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."dropgeometrytable"("schema_name" character varying, "table_name" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."dropgeometrytable"("schema_name" character varying, "table_name" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."dropgeometrytable"("schema_name" character varying, "table_name" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."dropgeometrytable"("schema_name" character varying, "table_name" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."dropgeometrytable"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."dropgeometrytable"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."dropgeometrytable"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."dropgeometrytable"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."enablelongtransactions"() TO "postgres";
GRANT ALL ON FUNCTION "public"."enablelongtransactions"() TO "anon";
GRANT ALL ON FUNCTION "public"."enablelongtransactions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."enablelongtransactions"() TO "service_role";



GRANT ALL ON FUNCTION "public"."enqueue_push_on_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."enqueue_push_on_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."enqueue_push_on_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."ensure_notification_preferences"() TO "anon";
GRANT ALL ON FUNCTION "public"."ensure_notification_preferences"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."ensure_notification_preferences"() TO "service_role";



GRANT ALL ON FUNCTION "public"."equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."extract_club_id_from_path"("path" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."extract_club_id_from_path"("path" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."extract_club_id_from_path"("path" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."extract_event_id_from_path"("path" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."extract_event_id_from_path"("path" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."extract_event_id_from_path"("path" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."extract_user_id_from_path"("path" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."extract_user_id_from_path"("path" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."extract_user_id_from_path"("path" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."find_exercises_by_criteria"("category_param" "public"."exercise_category", "difficulty_min" integer, "difficulty_max" integer, "muscle_groups_param" "public"."muscle_group"[], "movement_pattern_param" "public"."movement_pattern") TO "anon";
GRANT ALL ON FUNCTION "public"."find_exercises_by_criteria"("category_param" "public"."exercise_category", "difficulty_min" integer, "difficulty_max" integer, "muscle_groups_param" "public"."muscle_group"[], "movement_pattern_param" "public"."movement_pattern") TO "authenticated";
GRANT ALL ON FUNCTION "public"."find_exercises_by_criteria"("category_param" "public"."exercise_category", "difficulty_min" integer, "difficulty_max" integer, "muscle_groups_param" "public"."muscle_group"[], "movement_pattern_param" "public"."movement_pattern") TO "service_role";



GRANT ALL ON FUNCTION "public"."find_srid"(character varying, character varying, character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."find_srid"(character varying, character varying, character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."find_srid"(character varying, character varying, character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."find_srid"(character varying, character varying, character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."geog_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geog_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geog_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geog_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_cmp"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_cmp"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_cmp"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_cmp"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_distance_knn"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_distance_knn"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_distance_knn"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_distance_knn"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_eq"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_eq"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_eq"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_eq"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_ge"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_ge"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_ge"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_ge"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_gist_compress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_gist_compress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_gist_compress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_gist_compress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_gist_consistent"("internal", "public"."geography", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_gist_consistent"("internal", "public"."geography", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."geography_gist_consistent"("internal", "public"."geography", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_gist_consistent"("internal", "public"."geography", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_gist_decompress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_gist_decompress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_gist_decompress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_gist_decompress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_gist_distance"("internal", "public"."geography", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_gist_distance"("internal", "public"."geography", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."geography_gist_distance"("internal", "public"."geography", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_gist_distance"("internal", "public"."geography", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_gist_penalty"("internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_gist_penalty"("internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_gist_penalty"("internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_gist_penalty"("internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_gist_picksplit"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_gist_picksplit"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_gist_picksplit"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_gist_picksplit"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_gist_same"("public"."box2d", "public"."box2d", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_gist_same"("public"."box2d", "public"."box2d", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_gist_same"("public"."box2d", "public"."box2d", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_gist_same"("public"."box2d", "public"."box2d", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_gist_union"("bytea", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_gist_union"("bytea", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_gist_union"("bytea", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_gist_union"("bytea", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_gt"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_gt"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_gt"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_gt"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_le"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_le"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_le"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_le"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_lt"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_lt"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_lt"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_lt"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_overlaps"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_overlaps"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_overlaps"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_overlaps"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_spgist_choose_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_spgist_choose_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_spgist_choose_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_spgist_choose_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_spgist_compress_nd"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_spgist_compress_nd"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_spgist_compress_nd"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_spgist_compress_nd"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_spgist_config_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_spgist_config_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_spgist_config_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_spgist_config_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_spgist_inner_consistent_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_spgist_inner_consistent_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_spgist_inner_consistent_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_spgist_inner_consistent_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_spgist_leaf_consistent_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_spgist_leaf_consistent_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_spgist_leaf_consistent_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_spgist_leaf_consistent_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_spgist_picksplit_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_spgist_picksplit_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_spgist_picksplit_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_spgist_picksplit_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geom2d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geom2d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geom2d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geom2d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geom3d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geom3d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geom3d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geom3d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geom4d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geom4d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geom4d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geom4d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_above"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_above"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_above"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_above"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_below"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_below"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_below"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_below"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_cmp"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_cmp"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_cmp"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_cmp"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_contained_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_contained_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_contained_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_contained_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_contains_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_contains_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_contains_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_contains_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_contains_nd"("public"."geometry", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_contains_nd"("public"."geometry", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_contains_nd"("public"."geometry", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_contains_nd"("public"."geometry", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_distance_box"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_distance_box"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_distance_box"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_distance_box"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_distance_centroid"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_distance_centroid"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_distance_centroid"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_distance_centroid"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_distance_centroid_nd"("public"."geometry", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_distance_centroid_nd"("public"."geometry", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_distance_centroid_nd"("public"."geometry", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_distance_centroid_nd"("public"."geometry", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_distance_cpa"("public"."geometry", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_distance_cpa"("public"."geometry", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_distance_cpa"("public"."geometry", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_distance_cpa"("public"."geometry", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_eq"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_eq"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_eq"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_eq"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_ge"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_ge"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_ge"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_ge"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_compress_2d"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_compress_2d"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_compress_2d"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_compress_2d"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_compress_nd"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_compress_nd"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_compress_nd"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_compress_nd"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_consistent_2d"("internal", "public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_consistent_2d"("internal", "public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_consistent_2d"("internal", "public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_consistent_2d"("internal", "public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_consistent_nd"("internal", "public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_consistent_nd"("internal", "public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_consistent_nd"("internal", "public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_consistent_nd"("internal", "public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_decompress_2d"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_decompress_2d"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_decompress_2d"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_decompress_2d"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_decompress_nd"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_decompress_nd"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_decompress_nd"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_decompress_nd"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_distance_2d"("internal", "public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_distance_2d"("internal", "public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_distance_2d"("internal", "public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_distance_2d"("internal", "public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_distance_nd"("internal", "public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_distance_nd"("internal", "public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_distance_nd"("internal", "public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_distance_nd"("internal", "public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_penalty_2d"("internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_penalty_2d"("internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_penalty_2d"("internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_penalty_2d"("internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_penalty_nd"("internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_penalty_nd"("internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_penalty_nd"("internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_penalty_nd"("internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_picksplit_2d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_picksplit_2d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_picksplit_2d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_picksplit_2d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_picksplit_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_picksplit_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_picksplit_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_picksplit_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_same_2d"("geom1" "public"."geometry", "geom2" "public"."geometry", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_same_2d"("geom1" "public"."geometry", "geom2" "public"."geometry", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_same_2d"("geom1" "public"."geometry", "geom2" "public"."geometry", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_same_2d"("geom1" "public"."geometry", "geom2" "public"."geometry", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_same_nd"("public"."geometry", "public"."geometry", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_same_nd"("public"."geometry", "public"."geometry", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_same_nd"("public"."geometry", "public"."geometry", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_same_nd"("public"."geometry", "public"."geometry", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_sortsupport_2d"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_sortsupport_2d"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_sortsupport_2d"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_sortsupport_2d"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_union_2d"("bytea", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_union_2d"("bytea", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_union_2d"("bytea", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_union_2d"("bytea", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_union_nd"("bytea", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_union_nd"("bytea", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_union_nd"("bytea", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_union_nd"("bytea", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gt"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gt"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gt"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gt"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_hash"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_hash"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_hash"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_hash"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_le"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_le"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_le"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_le"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_left"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_left"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_left"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_left"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_lt"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_lt"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_lt"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_lt"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_overabove"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_overabove"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_overabove"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_overabove"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_overbelow"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_overbelow"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_overbelow"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_overbelow"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_overlaps_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_overlaps_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_overlaps_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_overlaps_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_overlaps_nd"("public"."geometry", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_overlaps_nd"("public"."geometry", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_overlaps_nd"("public"."geometry", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_overlaps_nd"("public"."geometry", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_overleft"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_overleft"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_overleft"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_overleft"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_overright"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_overright"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_overright"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_overright"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_right"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_right"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_right"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_right"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_same"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_same"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_same"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_same"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_same_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_same_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_same_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_same_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_same_nd"("public"."geometry", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_same_nd"("public"."geometry", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_same_nd"("public"."geometry", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_same_nd"("public"."geometry", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_sortsupport"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_sortsupport"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_sortsupport"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_sortsupport"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_2d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_2d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_2d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_2d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_3d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_3d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_3d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_3d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_2d"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_2d"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_2d"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_2d"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_3d"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_3d"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_3d"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_3d"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_nd"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_nd"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_nd"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_nd"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_config_2d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_config_2d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_config_2d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_config_2d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_config_3d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_config_3d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_config_3d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_config_3d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_config_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_config_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_config_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_config_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_2d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_2d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_2d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_2d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_3d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_3d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_3d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_3d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_2d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_2d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_2d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_2d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_3d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_3d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_3d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_3d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_2d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_2d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_2d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_2d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_3d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_3d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_3d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_3d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_within_nd"("public"."geometry", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_within_nd"("public"."geometry", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_within_nd"("public"."geometry", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_within_nd"("public"."geometry", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometrytype"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometrytype"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geometrytype"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometrytype"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometrytype"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometrytype"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometrytype"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometrytype"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geomfromewkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."geomfromewkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."geomfromewkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geomfromewkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."geomfromewkt"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."geomfromewkt"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."geomfromewkt"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geomfromewkt"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_club_image_url"("club_id" "uuid", "filename" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_club_image_url"("club_id" "uuid", "filename" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_club_image_url"("club_id" "uuid", "filename" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_discipline_name"("disc_name" "text", "disc_name_fr" "text", "locale" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_discipline_name"("disc_name" "text", "disc_name_fr" "text", "locale" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_discipline_name"("disc_name" "text", "disc_name_fr" "text", "locale" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_equipment_name"("eq_name" "text", "eq_name_fr" "text", "locale" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_equipment_name"("eq_name" "text", "eq_name_fr" "text", "locale" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_equipment_name"("eq_name" "text", "eq_name_fr" "text", "locale" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_exercise_progressions"("exercise_id_param" "uuid", "progression_type_param" "public"."progression_type") TO "anon";
GRANT ALL ON FUNCTION "public"."get_exercise_progressions"("exercise_id_param" "uuid", "progression_type_param" "public"."progression_type") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_exercise_progressions"("exercise_id_param" "uuid", "progression_type_param" "public"."progression_type") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_locations_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_locations_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_locations_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_nearby_locations"("user_lat" double precision, "user_lng" double precision, "limit_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_nearby_locations"("user_lat" double precision, "user_lng" double precision, "limit_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_nearby_locations"("user_lat" double precision, "user_lng" double precision, "limit_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_or_create_discipline"("discipline_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_or_create_discipline"("discipline_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_or_create_discipline"("discipline_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_or_create_equipment"("equipment_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_or_create_equipment"("equipment_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_or_create_equipment"("equipment_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_post_image_url"("club_id" "uuid", "post_id" "uuid", "filename" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_post_image_url"("club_id" "uuid", "post_id" "uuid", "filename" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_post_image_url"("club_id" "uuid", "post_id" "uuid", "filename" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_proj4_from_srid"(integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."get_proj4_from_srid"(integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_proj4_from_srid"(integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_proj4_from_srid"(integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_recommended_exercises_for_level"("user_fitness_level" integer, "category_filter" "public"."exercise_category", "limit_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_recommended_exercises_for_level"("user_fitness_level" integer, "category_filter" "public"."exercise_category", "limit_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_recommended_exercises_for_level"("user_fitness_level" integer, "category_filter" "public"."exercise_category", "limit_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_avatar_url"("user_id" "uuid", "filename" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_avatar_url"("user_id" "uuid", "filename" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_avatar_url"("user_id" "uuid", "filename" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_workout_with_sets"("workout_id_param" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_workout_with_sets"("workout_id_param" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_workout_with_sets"("workout_id_param" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."gettransactionid"() TO "postgres";
GRANT ALL ON FUNCTION "public"."gettransactionid"() TO "anon";
GRANT ALL ON FUNCTION "public"."gettransactionid"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."gettransactionid"() TO "service_role";



GRANT ALL ON FUNCTION "public"."gserialized_gist_joinsel_2d"("internal", "oid", "internal", smallint) TO "postgres";
GRANT ALL ON FUNCTION "public"."gserialized_gist_joinsel_2d"("internal", "oid", "internal", smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."gserialized_gist_joinsel_2d"("internal", "oid", "internal", smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."gserialized_gist_joinsel_2d"("internal", "oid", "internal", smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."gserialized_gist_joinsel_nd"("internal", "oid", "internal", smallint) TO "postgres";
GRANT ALL ON FUNCTION "public"."gserialized_gist_joinsel_nd"("internal", "oid", "internal", smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."gserialized_gist_joinsel_nd"("internal", "oid", "internal", smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."gserialized_gist_joinsel_nd"("internal", "oid", "internal", smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."gserialized_gist_sel_2d"("internal", "oid", "internal", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."gserialized_gist_sel_2d"("internal", "oid", "internal", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."gserialized_gist_sel_2d"("internal", "oid", "internal", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."gserialized_gist_sel_2d"("internal", "oid", "internal", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."gserialized_gist_sel_nd"("internal", "oid", "internal", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."gserialized_gist_sel_nd"("internal", "oid", "internal", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."gserialized_gist_sel_nd"("internal", "oid", "internal", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."gserialized_gist_sel_nd"("internal", "oid", "internal", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."import_spot"("spot_data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."import_spot"("spot_data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."import_spot"("spot_data" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_unread_notifications"("user_ids" "uuid"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."increment_unread_notifications"("user_ids" "uuid"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_unread_notifications"("user_ids" "uuid"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."is_approved_club_member"("p_club_id" "uuid", "p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_approved_club_member"("p_club_id" "uuid", "p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_approved_club_member"("p_club_id" "uuid", "p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_club_member"("user_id" "uuid", "club_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_club_member"("user_id" "uuid", "club_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_club_member"("user_id" "uuid", "club_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_club_member_secure"("p_club_id" "uuid", "p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_club_member_secure"("p_club_id" "uuid", "p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_club_member_secure"("p_club_id" "uuid", "p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_club_owner_secure"("p_club_id" "uuid", "p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_club_owner_secure"("p_club_id" "uuid", "p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_club_owner_secure"("p_club_id" "uuid", "p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_club_staff"("user_id" "uuid", "club_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_club_staff"("user_id" "uuid", "club_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_club_staff"("user_id" "uuid", "club_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_club_staff_member"("p_club_id" "uuid", "p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_club_staff_member"("p_club_id" "uuid", "p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_club_staff_member"("p_club_id" "uuid", "p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."box2df", "public"."box2df") TO "postgres";
GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."box2df", "public"."box2df") TO "anon";
GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."box2df", "public"."box2df") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."box2df", "public"."box2df") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."box2df", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."box2df", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."box2df", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."box2df", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."geometry", "public"."box2df") TO "postgres";
GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."geometry", "public"."box2df") TO "anon";
GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."geometry", "public"."box2df") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."geometry", "public"."box2df") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_duplicate_location"("p_lat" numeric, "p_lng" numeric, "p_source_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."is_duplicate_location"("p_lat" numeric, "p_lng" numeric, "p_source_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_duplicate_location"("p_lat" numeric, "p_lng" numeric, "p_source_id" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_event_participant"("user_id" "uuid", "event_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_event_participant"("user_id" "uuid", "event_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_event_participant"("user_id" "uuid", "event_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", timestamp without time zone) TO "postgres";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", timestamp without time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", timestamp without time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", timestamp without time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", "text", timestamp without time zone) TO "postgres";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", "text", timestamp without time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", "text", timestamp without time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", "text", timestamp without time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."longtransactionsenabled"() TO "postgres";
GRANT ALL ON FUNCTION "public"."longtransactionsenabled"() TO "anon";
GRANT ALL ON FUNCTION "public"."longtransactionsenabled"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."longtransactionsenabled"() TO "service_role";



GRANT ALL ON FUNCTION "public"."migrate_existing_workouts"() TO "anon";
GRANT ALL ON FUNCTION "public"."migrate_existing_workouts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."migrate_existing_workouts"() TO "service_role";



GRANT ALL ON FUNCTION "public"."migrate_legacy_ratings"() TO "anon";
GRANT ALL ON FUNCTION "public"."migrate_legacy_ratings"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."migrate_legacy_ratings"() TO "service_role";



GRANT ALL ON FUNCTION "public"."normalize_equipment_name"("name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."normalize_equipment_name"("name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."normalize_equipment_name"("name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."box2df", "public"."box2df") TO "postgres";
GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."box2df", "public"."box2df") TO "anon";
GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."box2df", "public"."box2df") TO "authenticated";
GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."box2df", "public"."box2df") TO "service_role";



GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."box2df", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."box2df", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."box2df", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."box2df", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."geometry", "public"."box2df") TO "postgres";
GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."geometry", "public"."box2df") TO "anon";
GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."geometry", "public"."box2df") TO "authenticated";
GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."geometry", "public"."box2df") TO "service_role";



GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."geography", "public"."gidx") TO "postgres";
GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."geography", "public"."gidx") TO "anon";
GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."geography", "public"."gidx") TO "authenticated";
GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."geography", "public"."gidx") TO "service_role";



GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."gidx", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."gidx", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."gidx", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."gidx", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."gidx", "public"."gidx") TO "postgres";
GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."gidx", "public"."gidx") TO "anon";
GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."gidx", "public"."gidx") TO "authenticated";
GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."gidx", "public"."gidx") TO "service_role";



GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."geometry", "public"."gidx") TO "postgres";
GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."geometry", "public"."gidx") TO "anon";
GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."geometry", "public"."gidx") TO "authenticated";
GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."geometry", "public"."gidx") TO "service_role";



GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."gidx", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."gidx", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."gidx", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."gidx", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."gidx", "public"."gidx") TO "postgres";
GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."gidx", "public"."gidx") TO "anon";
GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."gidx", "public"."gidx") TO "authenticated";
GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."gidx", "public"."gidx") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_finalfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_finalfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_finalfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_finalfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement", boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement", boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement", boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement", boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement", boolean, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement", boolean, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement", boolean, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement", boolean, "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_finalfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_finalfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_finalfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_finalfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_transfn"("internal", "anyelement") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_transfn"("internal", "anyelement") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_transfn"("internal", "anyelement") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_transfn"("internal", "anyelement") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_transfn"("internal", "anyelement", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_transfn"("internal", "anyelement", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_transfn"("internal", "anyelement", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_transfn"("internal", "anyelement", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asmvt_combinefn"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_combinefn"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_combinefn"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_combinefn"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asmvt_deserialfn"("bytea", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_deserialfn"("bytea", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_deserialfn"("bytea", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_deserialfn"("bytea", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asmvt_finalfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_finalfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_finalfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_finalfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asmvt_serialfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_serialfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_serialfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_serialfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer, "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer, "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer, "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer, "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer, "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry", double precision, integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry", double precision, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry", double precision, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry", double precision, integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_clusterintersecting_finalfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_clusterintersecting_finalfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_clusterintersecting_finalfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_clusterintersecting_finalfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_clusterwithin_finalfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_clusterwithin_finalfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_clusterwithin_finalfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_clusterwithin_finalfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_collect_finalfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_collect_finalfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_collect_finalfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_collect_finalfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_makeline_finalfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_makeline_finalfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_makeline_finalfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_makeline_finalfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_polygonize_finalfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_polygonize_finalfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_polygonize_finalfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_polygonize_finalfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_combinefn"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_combinefn"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_combinefn"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_combinefn"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_deserialfn"("bytea", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_deserialfn"("bytea", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_deserialfn"("bytea", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_deserialfn"("bytea", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_finalfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_finalfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_finalfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_finalfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_serialfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_serialfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_serialfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_serialfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_transfn"("internal", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_transfn"("internal", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_transfn"("internal", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_transfn"("internal", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_transfn"("internal", "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_transfn"("internal", "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_transfn"("internal", "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_transfn"("internal", "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."populate_geometry_columns"("use_typmod" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."populate_geometry_columns"("use_typmod" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."populate_geometry_columns"("use_typmod" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."populate_geometry_columns"("use_typmod" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."populate_geometry_columns"("tbl_oid" "oid", "use_typmod" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."populate_geometry_columns"("tbl_oid" "oid", "use_typmod" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."populate_geometry_columns"("tbl_oid" "oid", "use_typmod" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."populate_geometry_columns"("tbl_oid" "oid", "use_typmod" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."populate_session_exercises"() TO "anon";
GRANT ALL ON FUNCTION "public"."populate_session_exercises"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."populate_session_exercises"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_addbbox"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_addbbox"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_addbbox"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_addbbox"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_cache_bbox"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_cache_bbox"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_cache_bbox"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_cache_bbox"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_constraint_dims"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_constraint_dims"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_constraint_dims"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_constraint_dims"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_constraint_srid"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_constraint_srid"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_constraint_srid"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_constraint_srid"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_constraint_type"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_constraint_type"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_constraint_type"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_constraint_type"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_dropbbox"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_dropbbox"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_dropbbox"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_dropbbox"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_extensions_upgrade"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_extensions_upgrade"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_extensions_upgrade"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_extensions_upgrade"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_full_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_full_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_full_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_full_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_geos_noop"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_geos_noop"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_geos_noop"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_geos_noop"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_geos_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_geos_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_geos_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_geos_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_getbbox"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_getbbox"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_getbbox"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_getbbox"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_hasbbox"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_hasbbox"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_hasbbox"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_hasbbox"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_index_supportfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_index_supportfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_index_supportfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_index_supportfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_lib_build_date"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_lib_build_date"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_lib_build_date"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_lib_build_date"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_lib_revision"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_lib_revision"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_lib_revision"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_lib_revision"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_lib_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_lib_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_lib_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_lib_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_libjson_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_libjson_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_libjson_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_libjson_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_liblwgeom_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_liblwgeom_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_liblwgeom_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_liblwgeom_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_libprotobuf_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_libprotobuf_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_libprotobuf_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_libprotobuf_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_libxml_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_libxml_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_libxml_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_libxml_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_noop"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_noop"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_noop"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_noop"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_proj_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_proj_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_proj_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_proj_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_scripts_build_date"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_scripts_build_date"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_scripts_build_date"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_scripts_build_date"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_scripts_installed"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_scripts_installed"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_scripts_installed"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_scripts_installed"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_scripts_released"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_scripts_released"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_scripts_released"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_scripts_released"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_svn_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_svn_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_svn_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_svn_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_transform_geometry"("geom" "public"."geometry", "text", "text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_transform_geometry"("geom" "public"."geometry", "text", "text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_transform_geometry"("geom" "public"."geometry", "text", "text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_transform_geometry"("geom" "public"."geometry", "text", "text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_type_name"("geomname" character varying, "coord_dimension" integer, "use_new_name" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_type_name"("geomname" character varying, "coord_dimension" integer, "use_new_name" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_type_name"("geomname" character varying, "coord_dimension" integer, "use_new_name" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_type_name"("geomname" character varying, "coord_dimension" integer, "use_new_name" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_typmod_dims"(integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_typmod_dims"(integer) TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_typmod_dims"(integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_typmod_dims"(integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_typmod_srid"(integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_typmod_srid"(integer) TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_typmod_srid"(integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_typmod_srid"(integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_typmod_type"(integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_typmod_type"(integer) TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_typmod_type"(integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_typmod_type"(integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_wagyu_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_wagyu_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_wagyu_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_wagyu_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."process_staged_imports"() TO "anon";
GRANT ALL ON FUNCTION "public"."process_staged_imports"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."process_staged_imports"() TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_location_rating"() TO "anon";
GRANT ALL ON FUNCTION "public"."refresh_location_rating"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."refresh_location_rating"() TO "service_role";



GRANT ALL ON FUNCTION "public"."reset_failed_imports"() TO "anon";
GRANT ALL ON FUNCTION "public"."reset_failed_imports"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."reset_failed_imports"() TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_approve_member"("p_membership_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_approve_member"("p_membership_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_approve_member"("p_membership_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_change_member_role"("p_club_id" "uuid", "p_member_user_id" "uuid", "p_new_role" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_change_member_role"("p_club_id" "uuid", "p_member_user_id" "uuid", "p_new_role" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_change_member_role"("p_club_id" "uuid", "p_member_user_id" "uuid", "p_new_role" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_create_club"("p_name" character varying, "p_description" "text", "p_privacy" character varying, "p_category" character varying, "p_rules" "text", "p_cover_image_url" "text", "p_tags" "text"[], "p_linked_spot_ids" "uuid"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_create_club"("p_name" character varying, "p_description" "text", "p_privacy" character varying, "p_category" character varying, "p_rules" "text", "p_cover_image_url" "text", "p_tags" "text"[], "p_linked_spot_ids" "uuid"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_create_club"("p_name" character varying, "p_description" "text", "p_privacy" character varying, "p_category" character varying, "p_rules" "text", "p_cover_image_url" "text", "p_tags" "text"[], "p_linked_spot_ids" "uuid"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_get_club_with_details"("p_club_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_get_club_with_details"("p_club_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_get_club_with_details"("p_club_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_kick_member"("p_club_id" "uuid", "p_member_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_kick_member"("p_club_id" "uuid", "p_member_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_kick_member"("p_club_id" "uuid", "p_member_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_leave_club"("p_club_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_leave_club"("p_club_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_leave_club"("p_club_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_reject_member"("p_membership_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_reject_member"("p_membership_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_reject_member"("p_membership_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_request_club_membership"("p_club_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_request_club_membership"("p_club_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_request_club_membership"("p_club_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_transfer_ownership"("p_club_id" "uuid", "p_new_owner_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_transfer_ownership"("p_club_id" "uuid", "p_new_owner_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_transfer_ownership"("p_club_id" "uuid", "p_new_owner_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_update_club"("p_club_id" "uuid", "p_name" character varying, "p_description" "text", "p_privacy" character varying, "p_category" character varying, "p_rules" "text", "p_cover_image_url" "text", "p_tags" "text"[], "p_linked_spot_ids" "uuid"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_update_club"("p_club_id" "uuid", "p_name" character varying, "p_description" "text", "p_privacy" character varying, "p_category" character varying, "p_rules" "text", "p_cover_image_url" "text", "p_tags" "text"[], "p_linked_spot_ids" "uuid"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_update_club"("p_club_id" "uuid", "p_name" character varying, "p_description" "text", "p_privacy" character varying, "p_category" character varying, "p_rules" "text", "p_cover_image_url" "text", "p_tags" "text"[], "p_linked_spot_ids" "uuid"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3dclosestpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3dclosestpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_3dclosestpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3dclosestpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3ddfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3ddfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_3ddfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3ddfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3ddistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3ddistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_3ddistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3ddistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3ddwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3ddwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_3ddwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3ddwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3dintersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3dintersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_3dintersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3dintersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3dlength"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3dlength"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_3dlength"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3dlength"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3dlineinterpolatepoint"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3dlineinterpolatepoint"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_3dlineinterpolatepoint"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3dlineinterpolatepoint"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3dlongestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3dlongestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_3dlongestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3dlongestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3dmakebox"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3dmakebox"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_3dmakebox"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3dmakebox"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3dmaxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3dmaxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_3dmaxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3dmaxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3dperimeter"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3dperimeter"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_3dperimeter"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3dperimeter"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3dshortestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3dshortestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_3dshortestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3dshortestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_addmeasure"("public"."geometry", double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_addmeasure"("public"."geometry", double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_addmeasure"("public"."geometry", double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_addmeasure"("public"."geometry", double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_addpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_addpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_addpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_addpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_addpoint"("geom1" "public"."geometry", "geom2" "public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_addpoint"("geom1" "public"."geometry", "geom2" "public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_addpoint"("geom1" "public"."geometry", "geom2" "public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_addpoint"("geom1" "public"."geometry", "geom2" "public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_affine"("public"."geometry", double precision, double precision, double precision, double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_affine"("public"."geometry", double precision, double precision, double precision, double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_affine"("public"."geometry", double precision, double precision, double precision, double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_affine"("public"."geometry", double precision, double precision, double precision, double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_affine"("public"."geometry", double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_affine"("public"."geometry", double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_affine"("public"."geometry", double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_affine"("public"."geometry", double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_angle"("line1" "public"."geometry", "line2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_angle"("line1" "public"."geometry", "line2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_angle"("line1" "public"."geometry", "line2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_angle"("line1" "public"."geometry", "line2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_angle"("pt1" "public"."geometry", "pt2" "public"."geometry", "pt3" "public"."geometry", "pt4" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_angle"("pt1" "public"."geometry", "pt2" "public"."geometry", "pt3" "public"."geometry", "pt4" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_angle"("pt1" "public"."geometry", "pt2" "public"."geometry", "pt3" "public"."geometry", "pt4" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_angle"("pt1" "public"."geometry", "pt2" "public"."geometry", "pt3" "public"."geometry", "pt4" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_area"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_area"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_area"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_area"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_area"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_area"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_area"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_area"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_area"("geog" "public"."geography", "use_spheroid" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_area"("geog" "public"."geography", "use_spheroid" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_area"("geog" "public"."geography", "use_spheroid" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_area"("geog" "public"."geography", "use_spheroid" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_area2d"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_area2d"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_area2d"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_area2d"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geography", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geography", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geography", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geography", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geometry", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geometry", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geometry", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geometry", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asencodedpolyline"("geom" "public"."geometry", "nprecision" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asencodedpolyline"("geom" "public"."geometry", "nprecision" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asencodedpolyline"("geom" "public"."geometry", "nprecision" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asencodedpolyline"("geom" "public"."geometry", "nprecision" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asewkb"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asewkb"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asewkb"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asewkb"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asewkb"("public"."geometry", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asewkb"("public"."geometry", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asewkb"("public"."geometry", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asewkb"("public"."geometry", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asewkt"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asewkt"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asewkt"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asewkt"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geography", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geography", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geography", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geography", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgeojson"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgeojson"("geog" "public"."geography", "maxdecimaldigits" integer, "options" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("geog" "public"."geography", "maxdecimaldigits" integer, "options" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("geog" "public"."geography", "maxdecimaldigits" integer, "options" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("geog" "public"."geography", "maxdecimaldigits" integer, "options" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgeojson"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgeojson"("r" "record", "geom_column" "text", "maxdecimaldigits" integer, "pretty_bool" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("r" "record", "geom_column" "text", "maxdecimaldigits" integer, "pretty_bool" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("r" "record", "geom_column" "text", "maxdecimaldigits" integer, "pretty_bool" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("r" "record", "geom_column" "text", "maxdecimaldigits" integer, "pretty_bool" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgml"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgml"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgml"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgml"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgml"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgml"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgml"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgml"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgml"("geog" "public"."geography", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgml"("geog" "public"."geography", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgml"("geog" "public"."geography", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgml"("geog" "public"."geography", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgml"("version" integer, "geog" "public"."geography", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgml"("version" integer, "geog" "public"."geography", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgml"("version" integer, "geog" "public"."geography", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgml"("version" integer, "geog" "public"."geography", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgml"("version" integer, "geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgml"("version" integer, "geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgml"("version" integer, "geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgml"("version" integer, "geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_ashexewkb"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_ashexewkb"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_ashexewkb"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_ashexewkb"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_ashexewkb"("public"."geometry", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_ashexewkb"("public"."geometry", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_ashexewkb"("public"."geometry", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_ashexewkb"("public"."geometry", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_askml"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_askml"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_askml"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_askml"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_askml"("geog" "public"."geography", "maxdecimaldigits" integer, "nprefix" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_askml"("geog" "public"."geography", "maxdecimaldigits" integer, "nprefix" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_askml"("geog" "public"."geography", "maxdecimaldigits" integer, "nprefix" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_askml"("geog" "public"."geography", "maxdecimaldigits" integer, "nprefix" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_askml"("geom" "public"."geometry", "maxdecimaldigits" integer, "nprefix" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_askml"("geom" "public"."geometry", "maxdecimaldigits" integer, "nprefix" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_askml"("geom" "public"."geometry", "maxdecimaldigits" integer, "nprefix" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_askml"("geom" "public"."geometry", "maxdecimaldigits" integer, "nprefix" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_aslatlontext"("geom" "public"."geometry", "tmpl" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_aslatlontext"("geom" "public"."geometry", "tmpl" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_aslatlontext"("geom" "public"."geometry", "tmpl" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_aslatlontext"("geom" "public"."geometry", "tmpl" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asmarc21"("geom" "public"."geometry", "format" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asmarc21"("geom" "public"."geometry", "format" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asmarc21"("geom" "public"."geometry", "format" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asmarc21"("geom" "public"."geometry", "format" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asmvtgeom"("geom" "public"."geometry", "bounds" "public"."box2d", "extent" integer, "buffer" integer, "clip_geom" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asmvtgeom"("geom" "public"."geometry", "bounds" "public"."box2d", "extent" integer, "buffer" integer, "clip_geom" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asmvtgeom"("geom" "public"."geometry", "bounds" "public"."box2d", "extent" integer, "buffer" integer, "clip_geom" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asmvtgeom"("geom" "public"."geometry", "bounds" "public"."box2d", "extent" integer, "buffer" integer, "clip_geom" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_assvg"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_assvg"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_assvg"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_assvg"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_assvg"("geog" "public"."geography", "rel" integer, "maxdecimaldigits" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_assvg"("geog" "public"."geography", "rel" integer, "maxdecimaldigits" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_assvg"("geog" "public"."geography", "rel" integer, "maxdecimaldigits" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_assvg"("geog" "public"."geography", "rel" integer, "maxdecimaldigits" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_assvg"("geom" "public"."geometry", "rel" integer, "maxdecimaldigits" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_assvg"("geom" "public"."geometry", "rel" integer, "maxdecimaldigits" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_assvg"("geom" "public"."geometry", "rel" integer, "maxdecimaldigits" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_assvg"("geom" "public"."geometry", "rel" integer, "maxdecimaldigits" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_astext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_astext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_astext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_astext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_astext"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_astext"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_astext"("public"."geography", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geography", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geography", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geography", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_astext"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_astwkb"("geom" "public"."geometry", "prec" integer, "prec_z" integer, "prec_m" integer, "with_sizes" boolean, "with_boxes" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_astwkb"("geom" "public"."geometry", "prec" integer, "prec_z" integer, "prec_m" integer, "with_sizes" boolean, "with_boxes" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_astwkb"("geom" "public"."geometry", "prec" integer, "prec_z" integer, "prec_m" integer, "with_sizes" boolean, "with_boxes" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_astwkb"("geom" "public"."geometry", "prec" integer, "prec_z" integer, "prec_m" integer, "with_sizes" boolean, "with_boxes" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_astwkb"("geom" "public"."geometry"[], "ids" bigint[], "prec" integer, "prec_z" integer, "prec_m" integer, "with_sizes" boolean, "with_boxes" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_astwkb"("geom" "public"."geometry"[], "ids" bigint[], "prec" integer, "prec_z" integer, "prec_m" integer, "with_sizes" boolean, "with_boxes" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_astwkb"("geom" "public"."geometry"[], "ids" bigint[], "prec" integer, "prec_z" integer, "prec_m" integer, "with_sizes" boolean, "with_boxes" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_astwkb"("geom" "public"."geometry"[], "ids" bigint[], "prec" integer, "prec_z" integer, "prec_m" integer, "with_sizes" boolean, "with_boxes" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asx3d"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asx3d"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asx3d"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asx3d"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_azimuth"("geog1" "public"."geography", "geog2" "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_azimuth"("geog1" "public"."geography", "geog2" "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."st_azimuth"("geog1" "public"."geography", "geog2" "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_azimuth"("geog1" "public"."geography", "geog2" "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_azimuth"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_azimuth"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_azimuth"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_azimuth"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_bdmpolyfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_bdmpolyfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_bdmpolyfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_bdmpolyfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_bdpolyfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_bdpolyfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_bdpolyfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_bdpolyfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_boundary"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_boundary"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_boundary"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_boundary"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_boundingdiagonal"("geom" "public"."geometry", "fits" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_boundingdiagonal"("geom" "public"."geometry", "fits" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_boundingdiagonal"("geom" "public"."geometry", "fits" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_boundingdiagonal"("geom" "public"."geometry", "fits" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_box2dfromgeohash"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_box2dfromgeohash"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_box2dfromgeohash"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_box2dfromgeohash"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision, integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision, integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision, "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision, integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision, integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision, "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_buffer"("geom" "public"."geometry", "radius" double precision, "quadsegs" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_buffer"("geom" "public"."geometry", "radius" double precision, "quadsegs" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_buffer"("geom" "public"."geometry", "radius" double precision, "quadsegs" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_buffer"("geom" "public"."geometry", "radius" double precision, "quadsegs" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_buffer"("geom" "public"."geometry", "radius" double precision, "options" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_buffer"("geom" "public"."geometry", "radius" double precision, "options" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_buffer"("geom" "public"."geometry", "radius" double precision, "options" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_buffer"("geom" "public"."geometry", "radius" double precision, "options" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_buildarea"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_buildarea"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_buildarea"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_buildarea"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_centroid"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_centroid"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_centroid"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_centroid"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_centroid"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_centroid"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_centroid"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_centroid"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_centroid"("public"."geography", "use_spheroid" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_centroid"("public"."geography", "use_spheroid" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_centroid"("public"."geography", "use_spheroid" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_centroid"("public"."geography", "use_spheroid" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_chaikinsmoothing"("public"."geometry", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_chaikinsmoothing"("public"."geometry", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_chaikinsmoothing"("public"."geometry", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_chaikinsmoothing"("public"."geometry", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_cleangeometry"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_cleangeometry"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_cleangeometry"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_cleangeometry"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_clipbybox2d"("geom" "public"."geometry", "box" "public"."box2d") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_clipbybox2d"("geom" "public"."geometry", "box" "public"."box2d") TO "anon";
GRANT ALL ON FUNCTION "public"."st_clipbybox2d"("geom" "public"."geometry", "box" "public"."box2d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_clipbybox2d"("geom" "public"."geometry", "box" "public"."box2d") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_closestpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_closestpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_closestpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_closestpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_closestpointofapproach"("public"."geometry", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_closestpointofapproach"("public"."geometry", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_closestpointofapproach"("public"."geometry", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_closestpointofapproach"("public"."geometry", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_clusterdbscan"("public"."geometry", "eps" double precision, "minpoints" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_clusterdbscan"("public"."geometry", "eps" double precision, "minpoints" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_clusterdbscan"("public"."geometry", "eps" double precision, "minpoints" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_clusterdbscan"("public"."geometry", "eps" double precision, "minpoints" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_clusterintersecting"("public"."geometry"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_clusterintersecting"("public"."geometry"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."st_clusterintersecting"("public"."geometry"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_clusterintersecting"("public"."geometry"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_clusterkmeans"("geom" "public"."geometry", "k" integer, "max_radius" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_clusterkmeans"("geom" "public"."geometry", "k" integer, "max_radius" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_clusterkmeans"("geom" "public"."geometry", "k" integer, "max_radius" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_clusterkmeans"("geom" "public"."geometry", "k" integer, "max_radius" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_clusterwithin"("public"."geometry"[], double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_clusterwithin"("public"."geometry"[], double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_clusterwithin"("public"."geometry"[], double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_clusterwithin"("public"."geometry"[], double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_collect"("public"."geometry"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_collect"("public"."geometry"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."st_collect"("public"."geometry"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_collect"("public"."geometry"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_collect"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_collect"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_collect"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_collect"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_collectionextract"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_collectionextract"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_collectionextract"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_collectionextract"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_collectionextract"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_collectionextract"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_collectionextract"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_collectionextract"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_collectionhomogenize"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_collectionhomogenize"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_collectionhomogenize"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_collectionhomogenize"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box2d", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box2d", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box2d", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box2d", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box3d", "public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box3d", "public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box3d", "public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box3d", "public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box3d", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box3d", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box3d", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box3d", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_concavehull"("param_geom" "public"."geometry", "param_pctconvex" double precision, "param_allow_holes" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_concavehull"("param_geom" "public"."geometry", "param_pctconvex" double precision, "param_allow_holes" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_concavehull"("param_geom" "public"."geometry", "param_pctconvex" double precision, "param_allow_holes" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_concavehull"("param_geom" "public"."geometry", "param_pctconvex" double precision, "param_allow_holes" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_containsproperly"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_containsproperly"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_containsproperly"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_containsproperly"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_convexhull"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_convexhull"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_convexhull"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_convexhull"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_coorddim"("geometry" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_coorddim"("geometry" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_coorddim"("geometry" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_coorddim"("geometry" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_coveredby"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_coveredby"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_coveredby"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_coveredby"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_coveredby"("geog1" "public"."geography", "geog2" "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_coveredby"("geog1" "public"."geography", "geog2" "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."st_coveredby"("geog1" "public"."geography", "geog2" "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_coveredby"("geog1" "public"."geography", "geog2" "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_coveredby"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_coveredby"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_coveredby"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_coveredby"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_covers"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_covers"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_covers"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_covers"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_covers"("geog1" "public"."geography", "geog2" "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_covers"("geog1" "public"."geography", "geog2" "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."st_covers"("geog1" "public"."geography", "geog2" "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_covers"("geog1" "public"."geography", "geog2" "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_covers"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_covers"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_covers"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_covers"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_cpawithin"("public"."geometry", "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_cpawithin"("public"."geometry", "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_cpawithin"("public"."geometry", "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_cpawithin"("public"."geometry", "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_crosses"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_crosses"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_crosses"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_crosses"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_curvetoline"("geom" "public"."geometry", "tol" double precision, "toltype" integer, "flags" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_curvetoline"("geom" "public"."geometry", "tol" double precision, "toltype" integer, "flags" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_curvetoline"("geom" "public"."geometry", "tol" double precision, "toltype" integer, "flags" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_curvetoline"("geom" "public"."geometry", "tol" double precision, "toltype" integer, "flags" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_delaunaytriangles"("g1" "public"."geometry", "tolerance" double precision, "flags" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_delaunaytriangles"("g1" "public"."geometry", "tolerance" double precision, "flags" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_delaunaytriangles"("g1" "public"."geometry", "tolerance" double precision, "flags" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_delaunaytriangles"("g1" "public"."geometry", "tolerance" double precision, "flags" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_dfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_dfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_dfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_dfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_difference"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_difference"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_difference"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_difference"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_dimension"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_dimension"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_dimension"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_dimension"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_disjoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_disjoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_disjoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_disjoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_distance"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_distance"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_distance"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_distance"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_distance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_distance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_distance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_distance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_distance"("geog1" "public"."geography", "geog2" "public"."geography", "use_spheroid" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_distance"("geog1" "public"."geography", "geog2" "public"."geography", "use_spheroid" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_distance"("geog1" "public"."geography", "geog2" "public"."geography", "use_spheroid" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_distance"("geog1" "public"."geography", "geog2" "public"."geography", "use_spheroid" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_distancecpa"("public"."geometry", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_distancecpa"("public"."geometry", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_distancecpa"("public"."geometry", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_distancecpa"("public"."geometry", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_distancesphere"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_distancesphere"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_distancesphere"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_distancesphere"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_distancesphere"("geom1" "public"."geometry", "geom2" "public"."geometry", "radius" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_distancesphere"("geom1" "public"."geometry", "geom2" "public"."geometry", "radius" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_distancesphere"("geom1" "public"."geometry", "geom2" "public"."geometry", "radius" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_distancesphere"("geom1" "public"."geometry", "geom2" "public"."geometry", "radius" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_distancespheroid"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_distancespheroid"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_distancespheroid"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_distancespheroid"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_distancespheroid"("geom1" "public"."geometry", "geom2" "public"."geometry", "public"."spheroid") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_distancespheroid"("geom1" "public"."geometry", "geom2" "public"."geometry", "public"."spheroid") TO "anon";
GRANT ALL ON FUNCTION "public"."st_distancespheroid"("geom1" "public"."geometry", "geom2" "public"."geometry", "public"."spheroid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_distancespheroid"("geom1" "public"."geometry", "geom2" "public"."geometry", "public"."spheroid") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_dump"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_dump"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_dump"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_dump"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_dumppoints"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_dumppoints"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_dumppoints"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_dumppoints"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_dumprings"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_dumprings"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_dumprings"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_dumprings"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_dumpsegments"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_dumpsegments"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_dumpsegments"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_dumpsegments"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_dwithin"("text", "text", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_dwithin"("text", "text", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_dwithin"("text", "text", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_dwithin"("text", "text", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_dwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_dwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_dwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_dwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_dwithin"("geog1" "public"."geography", "geog2" "public"."geography", "tolerance" double precision, "use_spheroid" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_dwithin"("geog1" "public"."geography", "geog2" "public"."geography", "tolerance" double precision, "use_spheroid" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_dwithin"("geog1" "public"."geography", "geog2" "public"."geography", "tolerance" double precision, "use_spheroid" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_dwithin"("geog1" "public"."geography", "geog2" "public"."geography", "tolerance" double precision, "use_spheroid" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_endpoint"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_endpoint"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_endpoint"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_endpoint"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_envelope"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_envelope"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_envelope"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_envelope"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text", "text", boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text", "text", boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text", "text", boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text", "text", boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_expand"("public"."box2d", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_expand"("public"."box2d", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_expand"("public"."box2d", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_expand"("public"."box2d", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_expand"("public"."box3d", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_expand"("public"."box3d", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_expand"("public"."box3d", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_expand"("public"."box3d", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_expand"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_expand"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_expand"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_expand"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_expand"("box" "public"."box2d", "dx" double precision, "dy" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_expand"("box" "public"."box2d", "dx" double precision, "dy" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_expand"("box" "public"."box2d", "dx" double precision, "dy" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_expand"("box" "public"."box2d", "dx" double precision, "dy" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_expand"("box" "public"."box3d", "dx" double precision, "dy" double precision, "dz" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_expand"("box" "public"."box3d", "dx" double precision, "dy" double precision, "dz" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_expand"("box" "public"."box3d", "dx" double precision, "dy" double precision, "dz" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_expand"("box" "public"."box3d", "dx" double precision, "dy" double precision, "dz" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_expand"("geom" "public"."geometry", "dx" double precision, "dy" double precision, "dz" double precision, "dm" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_expand"("geom" "public"."geometry", "dx" double precision, "dy" double precision, "dz" double precision, "dm" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_expand"("geom" "public"."geometry", "dx" double precision, "dy" double precision, "dz" double precision, "dm" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_expand"("geom" "public"."geometry", "dx" double precision, "dy" double precision, "dz" double precision, "dm" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_exteriorring"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_exteriorring"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_exteriorring"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_exteriorring"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_filterbym"("public"."geometry", double precision, double precision, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_filterbym"("public"."geometry", double precision, double precision, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_filterbym"("public"."geometry", double precision, double precision, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_filterbym"("public"."geometry", double precision, double precision, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_findextent"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_findextent"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_findextent"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_findextent"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_findextent"("text", "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_findextent"("text", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_findextent"("text", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_findextent"("text", "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_flipcoordinates"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_flipcoordinates"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_flipcoordinates"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_flipcoordinates"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_force2d"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_force2d"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_force2d"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_force2d"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_force3d"("geom" "public"."geometry", "zvalue" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_force3d"("geom" "public"."geometry", "zvalue" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_force3d"("geom" "public"."geometry", "zvalue" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_force3d"("geom" "public"."geometry", "zvalue" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_force3dm"("geom" "public"."geometry", "mvalue" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_force3dm"("geom" "public"."geometry", "mvalue" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_force3dm"("geom" "public"."geometry", "mvalue" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_force3dm"("geom" "public"."geometry", "mvalue" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_force3dz"("geom" "public"."geometry", "zvalue" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_force3dz"("geom" "public"."geometry", "zvalue" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_force3dz"("geom" "public"."geometry", "zvalue" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_force3dz"("geom" "public"."geometry", "zvalue" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_force4d"("geom" "public"."geometry", "zvalue" double precision, "mvalue" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_force4d"("geom" "public"."geometry", "zvalue" double precision, "mvalue" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_force4d"("geom" "public"."geometry", "zvalue" double precision, "mvalue" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_force4d"("geom" "public"."geometry", "zvalue" double precision, "mvalue" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_forcecollection"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_forcecollection"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_forcecollection"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_forcecollection"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_forcecurve"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_forcecurve"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_forcecurve"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_forcecurve"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_forcepolygonccw"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_forcepolygonccw"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_forcepolygonccw"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_forcepolygonccw"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_forcepolygoncw"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_forcepolygoncw"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_forcepolygoncw"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_forcepolygoncw"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_forcerhr"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_forcerhr"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_forcerhr"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_forcerhr"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_forcesfs"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_forcesfs"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_forcesfs"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_forcesfs"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_forcesfs"("public"."geometry", "version" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_forcesfs"("public"."geometry", "version" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_forcesfs"("public"."geometry", "version" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_forcesfs"("public"."geometry", "version" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_frechetdistance"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_frechetdistance"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_frechetdistance"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_frechetdistance"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_fromflatgeobuf"("anyelement", "bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_fromflatgeobuf"("anyelement", "bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_fromflatgeobuf"("anyelement", "bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_fromflatgeobuf"("anyelement", "bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_fromflatgeobuftotable"("text", "text", "bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_fromflatgeobuftotable"("text", "text", "bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_fromflatgeobuftotable"("text", "text", "bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_fromflatgeobuftotable"("text", "text", "bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_generatepoints"("area" "public"."geometry", "npoints" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_generatepoints"("area" "public"."geometry", "npoints" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_generatepoints"("area" "public"."geometry", "npoints" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_generatepoints"("area" "public"."geometry", "npoints" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_generatepoints"("area" "public"."geometry", "npoints" integer, "seed" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_generatepoints"("area" "public"."geometry", "npoints" integer, "seed" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_generatepoints"("area" "public"."geometry", "npoints" integer, "seed" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_generatepoints"("area" "public"."geometry", "npoints" integer, "seed" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geogfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geogfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geogfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geogfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geogfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geogfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geogfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geogfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geographyfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geographyfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geographyfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geographyfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geohash"("geog" "public"."geography", "maxchars" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geohash"("geog" "public"."geography", "maxchars" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geohash"("geog" "public"."geography", "maxchars" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geohash"("geog" "public"."geography", "maxchars" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geohash"("geom" "public"."geometry", "maxchars" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geohash"("geom" "public"."geometry", "maxchars" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geohash"("geom" "public"."geometry", "maxchars" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geohash"("geom" "public"."geometry", "maxchars" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomcollfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomcollfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomcollfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomcollfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomcollfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomcollfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomcollfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomcollfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomcollfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomcollfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomcollfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomcollfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomcollfromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomcollfromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomcollfromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomcollfromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geometricmedian"("g" "public"."geometry", "tolerance" double precision, "max_iter" integer, "fail_if_not_converged" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geometricmedian"("g" "public"."geometry", "tolerance" double precision, "max_iter" integer, "fail_if_not_converged" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geometricmedian"("g" "public"."geometry", "tolerance" double precision, "max_iter" integer, "fail_if_not_converged" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geometricmedian"("g" "public"."geometry", "tolerance" double precision, "max_iter" integer, "fail_if_not_converged" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geometryfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geometryfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geometryfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geometryfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geometryfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geometryfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geometryfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geometryfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geometryn"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geometryn"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geometryn"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geometryn"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geometrytype"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geometrytype"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geometrytype"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geometrytype"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromewkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromewkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromewkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromewkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromewkt"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromewkt"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromewkt"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromewkt"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromgeohash"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromgeohash"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromgeohash"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromgeohash"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"(json) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"(json) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"(json) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"(json) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"("jsonb") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"("jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"("jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"("jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromgml"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromgml"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromgml"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromgml"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromgml"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromgml"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromgml"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromgml"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromkml"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromkml"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromkml"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromkml"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfrommarc21"("marc21xml" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfrommarc21"("marc21xml" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfrommarc21"("marc21xml" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfrommarc21"("marc21xml" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromtwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromtwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromtwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromtwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_gmltosql"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_gmltosql"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_gmltosql"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_gmltosql"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_gmltosql"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_gmltosql"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_gmltosql"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_gmltosql"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_hasarc"("geometry" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_hasarc"("geometry" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_hasarc"("geometry" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_hasarc"("geometry" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_hausdorffdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_hausdorffdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_hausdorffdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_hausdorffdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_hausdorffdistance"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_hausdorffdistance"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_hausdorffdistance"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_hausdorffdistance"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_hexagon"("size" double precision, "cell_i" integer, "cell_j" integer, "origin" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_hexagon"("size" double precision, "cell_i" integer, "cell_j" integer, "origin" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_hexagon"("size" double precision, "cell_i" integer, "cell_j" integer, "origin" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_hexagon"("size" double precision, "cell_i" integer, "cell_j" integer, "origin" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_hexagongrid"("size" double precision, "bounds" "public"."geometry", OUT "geom" "public"."geometry", OUT "i" integer, OUT "j" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_hexagongrid"("size" double precision, "bounds" "public"."geometry", OUT "geom" "public"."geometry", OUT "i" integer, OUT "j" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_hexagongrid"("size" double precision, "bounds" "public"."geometry", OUT "geom" "public"."geometry", OUT "i" integer, OUT "j" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_hexagongrid"("size" double precision, "bounds" "public"."geometry", OUT "geom" "public"."geometry", OUT "i" integer, OUT "j" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_interiorringn"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_interiorringn"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_interiorringn"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_interiorringn"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_interpolatepoint"("line" "public"."geometry", "point" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_interpolatepoint"("line" "public"."geometry", "point" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_interpolatepoint"("line" "public"."geometry", "point" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_interpolatepoint"("line" "public"."geometry", "point" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_intersection"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_intersection"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_intersection"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_intersection"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_intersection"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_intersection"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."st_intersection"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_intersection"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_intersection"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_intersection"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_intersection"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_intersection"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_intersects"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_intersects"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_intersects"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_intersects"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_intersects"("geog1" "public"."geography", "geog2" "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_intersects"("geog1" "public"."geography", "geog2" "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."st_intersects"("geog1" "public"."geography", "geog2" "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_intersects"("geog1" "public"."geography", "geog2" "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_intersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_intersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_intersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_intersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_isclosed"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_isclosed"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_isclosed"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_isclosed"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_iscollection"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_iscollection"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_iscollection"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_iscollection"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_isempty"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_isempty"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_isempty"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_isempty"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_ispolygonccw"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_ispolygonccw"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_ispolygonccw"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_ispolygonccw"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_ispolygoncw"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_ispolygoncw"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_ispolygoncw"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_ispolygoncw"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_isring"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_isring"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_isring"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_isring"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_issimple"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_issimple"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_issimple"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_issimple"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_isvalid"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_isvalid"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_isvalid"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_isvalid"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_isvalid"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_isvalid"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_isvalid"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_isvalid"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_isvaliddetail"("geom" "public"."geometry", "flags" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_isvaliddetail"("geom" "public"."geometry", "flags" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_isvaliddetail"("geom" "public"."geometry", "flags" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_isvaliddetail"("geom" "public"."geometry", "flags" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_isvalidreason"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_isvalidreason"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_isvalidreason"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_isvalidreason"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_isvalidreason"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_isvalidreason"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_isvalidreason"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_isvalidreason"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_isvalidtrajectory"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_isvalidtrajectory"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_isvalidtrajectory"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_isvalidtrajectory"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_length"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_length"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_length"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_length"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_length"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_length"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_length"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_length"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_length"("geog" "public"."geography", "use_spheroid" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_length"("geog" "public"."geography", "use_spheroid" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_length"("geog" "public"."geography", "use_spheroid" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_length"("geog" "public"."geography", "use_spheroid" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_length2d"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_length2d"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_length2d"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_length2d"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_length2dspheroid"("public"."geometry", "public"."spheroid") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_length2dspheroid"("public"."geometry", "public"."spheroid") TO "anon";
GRANT ALL ON FUNCTION "public"."st_length2dspheroid"("public"."geometry", "public"."spheroid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_length2dspheroid"("public"."geometry", "public"."spheroid") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_lengthspheroid"("public"."geometry", "public"."spheroid") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_lengthspheroid"("public"."geometry", "public"."spheroid") TO "anon";
GRANT ALL ON FUNCTION "public"."st_lengthspheroid"("public"."geometry", "public"."spheroid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_lengthspheroid"("public"."geometry", "public"."spheroid") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_letters"("letters" "text", "font" json) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_letters"("letters" "text", "font" json) TO "anon";
GRANT ALL ON FUNCTION "public"."st_letters"("letters" "text", "font" json) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_letters"("letters" "text", "font" json) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linecrossingdirection"("line1" "public"."geometry", "line2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linecrossingdirection"("line1" "public"."geometry", "line2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_linecrossingdirection"("line1" "public"."geometry", "line2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linecrossingdirection"("line1" "public"."geometry", "line2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linefromencodedpolyline"("txtin" "text", "nprecision" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linefromencodedpolyline"("txtin" "text", "nprecision" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_linefromencodedpolyline"("txtin" "text", "nprecision" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linefromencodedpolyline"("txtin" "text", "nprecision" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linefrommultipoint"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linefrommultipoint"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_linefrommultipoint"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linefrommultipoint"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linefromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linefromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_linefromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linefromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linefromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linefromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_linefromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linefromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linefromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linefromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_linefromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linefromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linefromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linefromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_linefromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linefromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_lineinterpolatepoint"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_lineinterpolatepoint"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_lineinterpolatepoint"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_lineinterpolatepoint"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_lineinterpolatepoints"("public"."geometry", double precision, "repeat" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_lineinterpolatepoints"("public"."geometry", double precision, "repeat" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_lineinterpolatepoints"("public"."geometry", double precision, "repeat" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_lineinterpolatepoints"("public"."geometry", double precision, "repeat" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linelocatepoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linelocatepoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_linelocatepoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linelocatepoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linemerge"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linemerge"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_linemerge"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linemerge"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linemerge"("public"."geometry", boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linemerge"("public"."geometry", boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_linemerge"("public"."geometry", boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linemerge"("public"."geometry", boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linestringfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linestringfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_linestringfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linestringfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linestringfromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linestringfromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_linestringfromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linestringfromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linesubstring"("public"."geometry", double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linesubstring"("public"."geometry", double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_linesubstring"("public"."geometry", double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linesubstring"("public"."geometry", double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linetocurve"("geometry" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linetocurve"("geometry" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_linetocurve"("geometry" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linetocurve"("geometry" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_locatealong"("geometry" "public"."geometry", "measure" double precision, "leftrightoffset" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_locatealong"("geometry" "public"."geometry", "measure" double precision, "leftrightoffset" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_locatealong"("geometry" "public"."geometry", "measure" double precision, "leftrightoffset" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_locatealong"("geometry" "public"."geometry", "measure" double precision, "leftrightoffset" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_locatebetween"("geometry" "public"."geometry", "frommeasure" double precision, "tomeasure" double precision, "leftrightoffset" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_locatebetween"("geometry" "public"."geometry", "frommeasure" double precision, "tomeasure" double precision, "leftrightoffset" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_locatebetween"("geometry" "public"."geometry", "frommeasure" double precision, "tomeasure" double precision, "leftrightoffset" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_locatebetween"("geometry" "public"."geometry", "frommeasure" double precision, "tomeasure" double precision, "leftrightoffset" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_locatebetweenelevations"("geometry" "public"."geometry", "fromelevation" double precision, "toelevation" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_locatebetweenelevations"("geometry" "public"."geometry", "fromelevation" double precision, "toelevation" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_locatebetweenelevations"("geometry" "public"."geometry", "fromelevation" double precision, "toelevation" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_locatebetweenelevations"("geometry" "public"."geometry", "fromelevation" double precision, "toelevation" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_longestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_longestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_longestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_longestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_m"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_m"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_m"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_m"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makebox2d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makebox2d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_makebox2d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makebox2d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makeenvelope"(double precision, double precision, double precision, double precision, integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makeenvelope"(double precision, double precision, double precision, double precision, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_makeenvelope"(double precision, double precision, double precision, double precision, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makeenvelope"(double precision, double precision, double precision, double precision, integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makeline"("public"."geometry"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makeline"("public"."geometry"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."st_makeline"("public"."geometry"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makeline"("public"."geometry"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makeline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makeline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_makeline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makeline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makepointm"(double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makepointm"(double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_makepointm"(double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makepointm"(double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makepolygon"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makepolygon"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_makepolygon"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makepolygon"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makepolygon"("public"."geometry", "public"."geometry"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makepolygon"("public"."geometry", "public"."geometry"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."st_makepolygon"("public"."geometry", "public"."geometry"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makepolygon"("public"."geometry", "public"."geometry"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makevalid"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makevalid"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_makevalid"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makevalid"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makevalid"("geom" "public"."geometry", "params" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makevalid"("geom" "public"."geometry", "params" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_makevalid"("geom" "public"."geometry", "params" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makevalid"("geom" "public"."geometry", "params" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_maxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_maxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_maxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_maxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_maximuminscribedcircle"("public"."geometry", OUT "center" "public"."geometry", OUT "nearest" "public"."geometry", OUT "radius" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_maximuminscribedcircle"("public"."geometry", OUT "center" "public"."geometry", OUT "nearest" "public"."geometry", OUT "radius" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_maximuminscribedcircle"("public"."geometry", OUT "center" "public"."geometry", OUT "nearest" "public"."geometry", OUT "radius" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_maximuminscribedcircle"("public"."geometry", OUT "center" "public"."geometry", OUT "nearest" "public"."geometry", OUT "radius" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_memsize"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_memsize"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_memsize"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_memsize"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_minimumboundingcircle"("inputgeom" "public"."geometry", "segs_per_quarter" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_minimumboundingcircle"("inputgeom" "public"."geometry", "segs_per_quarter" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_minimumboundingcircle"("inputgeom" "public"."geometry", "segs_per_quarter" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_minimumboundingcircle"("inputgeom" "public"."geometry", "segs_per_quarter" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_minimumboundingradius"("public"."geometry", OUT "center" "public"."geometry", OUT "radius" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_minimumboundingradius"("public"."geometry", OUT "center" "public"."geometry", OUT "radius" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_minimumboundingradius"("public"."geometry", OUT "center" "public"."geometry", OUT "radius" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_minimumboundingradius"("public"."geometry", OUT "center" "public"."geometry", OUT "radius" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_minimumclearance"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_minimumclearance"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_minimumclearance"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_minimumclearance"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_minimumclearanceline"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_minimumclearanceline"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_minimumclearanceline"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_minimumclearanceline"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mlinefromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mlinefromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_mlinefromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mlinefromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mlinefromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mlinefromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_mlinefromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mlinefromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mlinefromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mlinefromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_mlinefromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mlinefromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mlinefromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mlinefromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_mlinefromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mlinefromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mpointfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mpointfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_mpointfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mpointfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mpointfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mpointfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_mpointfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mpointfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mpointfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mpointfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_mpointfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mpointfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mpointfromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mpointfromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_mpointfromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mpointfromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mpolyfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mpolyfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_mpolyfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mpolyfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mpolyfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mpolyfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_mpolyfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mpolyfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mpolyfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mpolyfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_mpolyfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mpolyfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mpolyfromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mpolyfromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_mpolyfromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mpolyfromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multi"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multi"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_multi"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multi"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multilinefromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multilinefromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_multilinefromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multilinefromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multilinestringfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multilinestringfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_multilinestringfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multilinestringfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multilinestringfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multilinestringfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_multilinestringfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multilinestringfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multipointfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multipointfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_multipointfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multipointfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multipointfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multipointfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_multipointfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multipointfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multipointfromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multipointfromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_multipointfromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multipointfromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multipolyfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multipolyfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_multipolyfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multipolyfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multipolyfromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multipolyfromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_multipolyfromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multipolyfromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multipolygonfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multipolygonfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_multipolygonfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multipolygonfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multipolygonfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multipolygonfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_multipolygonfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multipolygonfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_ndims"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_ndims"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_ndims"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_ndims"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_node"("g" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_node"("g" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_node"("g" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_node"("g" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_normalize"("geom" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_normalize"("geom" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_normalize"("geom" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_normalize"("geom" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_npoints"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_npoints"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_npoints"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_npoints"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_nrings"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_nrings"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_nrings"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_nrings"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_numgeometries"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_numgeometries"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_numgeometries"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_numgeometries"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_numinteriorring"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_numinteriorring"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_numinteriorring"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_numinteriorring"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_numinteriorrings"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_numinteriorrings"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_numinteriorrings"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_numinteriorrings"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_numpatches"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_numpatches"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_numpatches"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_numpatches"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_numpoints"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_numpoints"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_numpoints"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_numpoints"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_offsetcurve"("line" "public"."geometry", "distance" double precision, "params" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_offsetcurve"("line" "public"."geometry", "distance" double precision, "params" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_offsetcurve"("line" "public"."geometry", "distance" double precision, "params" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_offsetcurve"("line" "public"."geometry", "distance" double precision, "params" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_orderingequals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_orderingequals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_orderingequals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_orderingequals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_orientedenvelope"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_orientedenvelope"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_orientedenvelope"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_orientedenvelope"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_patchn"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_patchn"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_patchn"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_patchn"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_perimeter"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_perimeter"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_perimeter"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_perimeter"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_perimeter"("geog" "public"."geography", "use_spheroid" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_perimeter"("geog" "public"."geography", "use_spheroid" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_perimeter"("geog" "public"."geography", "use_spheroid" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_perimeter"("geog" "public"."geography", "use_spheroid" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_perimeter2d"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_perimeter2d"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_perimeter2d"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_perimeter2d"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_point"(double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_point"(double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_point"(double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_point"(double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_point"(double precision, double precision, "srid" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_point"(double precision, double precision, "srid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_point"(double precision, double precision, "srid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_point"(double precision, double precision, "srid" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointfromgeohash"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointfromgeohash"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointfromgeohash"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointfromgeohash"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointfromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointfromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointfromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointfromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointinsidecircle"("public"."geometry", double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointinsidecircle"("public"."geometry", double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointinsidecircle"("public"."geometry", double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointinsidecircle"("public"."geometry", double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointm"("xcoordinate" double precision, "ycoordinate" double precision, "mcoordinate" double precision, "srid" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointm"("xcoordinate" double precision, "ycoordinate" double precision, "mcoordinate" double precision, "srid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointm"("xcoordinate" double precision, "ycoordinate" double precision, "mcoordinate" double precision, "srid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointm"("xcoordinate" double precision, "ycoordinate" double precision, "mcoordinate" double precision, "srid" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointn"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointn"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointn"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointn"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointonsurface"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointonsurface"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointonsurface"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointonsurface"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_points"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_points"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_points"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_points"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointz"("xcoordinate" double precision, "ycoordinate" double precision, "zcoordinate" double precision, "srid" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointz"("xcoordinate" double precision, "ycoordinate" double precision, "zcoordinate" double precision, "srid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointz"("xcoordinate" double precision, "ycoordinate" double precision, "zcoordinate" double precision, "srid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointz"("xcoordinate" double precision, "ycoordinate" double precision, "zcoordinate" double precision, "srid" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointzm"("xcoordinate" double precision, "ycoordinate" double precision, "zcoordinate" double precision, "mcoordinate" double precision, "srid" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointzm"("xcoordinate" double precision, "ycoordinate" double precision, "zcoordinate" double precision, "mcoordinate" double precision, "srid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointzm"("xcoordinate" double precision, "ycoordinate" double precision, "zcoordinate" double precision, "mcoordinate" double precision, "srid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointzm"("xcoordinate" double precision, "ycoordinate" double precision, "zcoordinate" double precision, "mcoordinate" double precision, "srid" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polyfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polyfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_polyfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polyfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polyfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polyfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_polyfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polyfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polyfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polyfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_polyfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polyfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polyfromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polyfromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_polyfromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polyfromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polygon"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polygon"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_polygon"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polygon"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polygonfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polygonfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_polygonfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polygonfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polygonfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polygonfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_polygonfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polygonfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polygonfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polygonfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_polygonfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polygonfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polygonfromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polygonfromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_polygonfromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polygonfromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polygonize"("public"."geometry"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polygonize"("public"."geometry"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."st_polygonize"("public"."geometry"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polygonize"("public"."geometry"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_project"("geog" "public"."geography", "distance" double precision, "azimuth" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_project"("geog" "public"."geography", "distance" double precision, "azimuth" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_project"("geog" "public"."geography", "distance" double precision, "azimuth" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_project"("geog" "public"."geography", "distance" double precision, "azimuth" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_quantizecoordinates"("g" "public"."geometry", "prec_x" integer, "prec_y" integer, "prec_z" integer, "prec_m" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_quantizecoordinates"("g" "public"."geometry", "prec_x" integer, "prec_y" integer, "prec_z" integer, "prec_m" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_quantizecoordinates"("g" "public"."geometry", "prec_x" integer, "prec_y" integer, "prec_z" integer, "prec_m" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_quantizecoordinates"("g" "public"."geometry", "prec_x" integer, "prec_y" integer, "prec_z" integer, "prec_m" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_reduceprecision"("geom" "public"."geometry", "gridsize" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_reduceprecision"("geom" "public"."geometry", "gridsize" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_reduceprecision"("geom" "public"."geometry", "gridsize" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_reduceprecision"("geom" "public"."geometry", "gridsize" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_relatematch"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_relatematch"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_relatematch"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_relatematch"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_removepoint"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_removepoint"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_removepoint"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_removepoint"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_removerepeatedpoints"("geom" "public"."geometry", "tolerance" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_removerepeatedpoints"("geom" "public"."geometry", "tolerance" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_removerepeatedpoints"("geom" "public"."geometry", "tolerance" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_removerepeatedpoints"("geom" "public"."geometry", "tolerance" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_reverse"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_reverse"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_reverse"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_reverse"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision, "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision, "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision, "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision, "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_rotatex"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_rotatex"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_rotatex"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_rotatex"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_rotatey"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_rotatey"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_rotatey"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_rotatey"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_rotatez"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_rotatez"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_rotatez"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_rotatez"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", "public"."geometry", "origin" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", "public"."geometry", "origin" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", "public"."geometry", "origin" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", "public"."geometry", "origin" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_scroll"("public"."geometry", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_scroll"("public"."geometry", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_scroll"("public"."geometry", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_scroll"("public"."geometry", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_segmentize"("geog" "public"."geography", "max_segment_length" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_segmentize"("geog" "public"."geography", "max_segment_length" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_segmentize"("geog" "public"."geography", "max_segment_length" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_segmentize"("geog" "public"."geography", "max_segment_length" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_segmentize"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_segmentize"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_segmentize"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_segmentize"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_seteffectivearea"("public"."geometry", double precision, integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_seteffectivearea"("public"."geometry", double precision, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_seteffectivearea"("public"."geometry", double precision, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_seteffectivearea"("public"."geometry", double precision, integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_setpoint"("public"."geometry", integer, "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_setpoint"("public"."geometry", integer, "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_setpoint"("public"."geometry", integer, "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_setpoint"("public"."geometry", integer, "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_setsrid"("geog" "public"."geography", "srid" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_setsrid"("geog" "public"."geography", "srid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_setsrid"("geog" "public"."geography", "srid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_setsrid"("geog" "public"."geography", "srid" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_setsrid"("geom" "public"."geometry", "srid" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_setsrid"("geom" "public"."geometry", "srid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_setsrid"("geom" "public"."geometry", "srid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_setsrid"("geom" "public"."geometry", "srid" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_sharedpaths"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_sharedpaths"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_sharedpaths"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_sharedpaths"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_shiftlongitude"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_shiftlongitude"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_shiftlongitude"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_shiftlongitude"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_shortestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_shortestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_shortestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_shortestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_simplify"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_simplify"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_simplify"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_simplify"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_simplify"("public"."geometry", double precision, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_simplify"("public"."geometry", double precision, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_simplify"("public"."geometry", double precision, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_simplify"("public"."geometry", double precision, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_simplifypolygonhull"("geom" "public"."geometry", "vertex_fraction" double precision, "is_outer" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_simplifypolygonhull"("geom" "public"."geometry", "vertex_fraction" double precision, "is_outer" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_simplifypolygonhull"("geom" "public"."geometry", "vertex_fraction" double precision, "is_outer" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_simplifypolygonhull"("geom" "public"."geometry", "vertex_fraction" double precision, "is_outer" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_simplifypreservetopology"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_simplifypreservetopology"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_simplifypreservetopology"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_simplifypreservetopology"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_simplifyvw"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_simplifyvw"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_simplifyvw"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_simplifyvw"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_snap"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_snap"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_snap"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_snap"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision, double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision, double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision, double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision, double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_snaptogrid"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision, double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision, double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision, double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision, double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_split"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_split"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_split"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_split"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_square"("size" double precision, "cell_i" integer, "cell_j" integer, "origin" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_square"("size" double precision, "cell_i" integer, "cell_j" integer, "origin" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_square"("size" double precision, "cell_i" integer, "cell_j" integer, "origin" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_square"("size" double precision, "cell_i" integer, "cell_j" integer, "origin" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_squaregrid"("size" double precision, "bounds" "public"."geometry", OUT "geom" "public"."geometry", OUT "i" integer, OUT "j" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_squaregrid"("size" double precision, "bounds" "public"."geometry", OUT "geom" "public"."geometry", OUT "i" integer, OUT "j" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_squaregrid"("size" double precision, "bounds" "public"."geometry", OUT "geom" "public"."geometry", OUT "i" integer, OUT "j" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_squaregrid"("size" double precision, "bounds" "public"."geometry", OUT "geom" "public"."geometry", OUT "i" integer, OUT "j" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_srid"("geog" "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_srid"("geog" "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."st_srid"("geog" "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_srid"("geog" "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_srid"("geom" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_srid"("geom" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_srid"("geom" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_srid"("geom" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_startpoint"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_startpoint"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_startpoint"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_startpoint"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_subdivide"("geom" "public"."geometry", "maxvertices" integer, "gridsize" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_subdivide"("geom" "public"."geometry", "maxvertices" integer, "gridsize" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_subdivide"("geom" "public"."geometry", "maxvertices" integer, "gridsize" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_subdivide"("geom" "public"."geometry", "maxvertices" integer, "gridsize" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_summary"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_summary"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."st_summary"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_summary"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_summary"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_summary"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_summary"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_summary"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_swapordinates"("geom" "public"."geometry", "ords" "cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_swapordinates"("geom" "public"."geometry", "ords" "cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."st_swapordinates"("geom" "public"."geometry", "ords" "cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_swapordinates"("geom" "public"."geometry", "ords" "cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_symdifference"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_symdifference"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_symdifference"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_symdifference"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_symmetricdifference"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_symmetricdifference"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_symmetricdifference"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_symmetricdifference"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_tileenvelope"("zoom" integer, "x" integer, "y" integer, "bounds" "public"."geometry", "margin" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_tileenvelope"("zoom" integer, "x" integer, "y" integer, "bounds" "public"."geometry", "margin" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_tileenvelope"("zoom" integer, "x" integer, "y" integer, "bounds" "public"."geometry", "margin" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_tileenvelope"("zoom" integer, "x" integer, "y" integer, "bounds" "public"."geometry", "margin" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_touches"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_touches"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_touches"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_touches"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_transform"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_transform"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_transform"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_transform"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "to_proj" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "to_proj" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "to_proj" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "to_proj" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "from_proj" "text", "to_srid" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "from_proj" "text", "to_srid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "from_proj" "text", "to_srid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "from_proj" "text", "to_srid" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "from_proj" "text", "to_proj" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "from_proj" "text", "to_proj" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "from_proj" "text", "to_proj" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "from_proj" "text", "to_proj" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_translate"("public"."geometry", double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_translate"("public"."geometry", double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_translate"("public"."geometry", double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_translate"("public"."geometry", double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_translate"("public"."geometry", double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_translate"("public"."geometry", double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_translate"("public"."geometry", double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_translate"("public"."geometry", double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_transscale"("public"."geometry", double precision, double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_transscale"("public"."geometry", double precision, double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_transscale"("public"."geometry", double precision, double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_transscale"("public"."geometry", double precision, double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_triangulatepolygon"("g1" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_triangulatepolygon"("g1" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_triangulatepolygon"("g1" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_triangulatepolygon"("g1" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_unaryunion"("public"."geometry", "gridsize" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_unaryunion"("public"."geometry", "gridsize" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_unaryunion"("public"."geometry", "gridsize" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_unaryunion"("public"."geometry", "gridsize" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_union"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_union"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_union"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_union"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_union"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_union"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_union"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_union"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_voronoilines"("g1" "public"."geometry", "tolerance" double precision, "extend_to" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_voronoilines"("g1" "public"."geometry", "tolerance" double precision, "extend_to" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_voronoilines"("g1" "public"."geometry", "tolerance" double precision, "extend_to" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_voronoilines"("g1" "public"."geometry", "tolerance" double precision, "extend_to" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_voronoipolygons"("g1" "public"."geometry", "tolerance" double precision, "extend_to" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_voronoipolygons"("g1" "public"."geometry", "tolerance" double precision, "extend_to" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_voronoipolygons"("g1" "public"."geometry", "tolerance" double precision, "extend_to" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_voronoipolygons"("g1" "public"."geometry", "tolerance" double precision, "extend_to" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_wkbtosql"("wkb" "bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_wkbtosql"("wkb" "bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_wkbtosql"("wkb" "bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_wkbtosql"("wkb" "bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_wkttosql"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_wkttosql"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_wkttosql"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_wkttosql"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_wrapx"("geom" "public"."geometry", "wrap" double precision, "move" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_wrapx"("geom" "public"."geometry", "wrap" double precision, "move" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_wrapx"("geom" "public"."geometry", "wrap" double precision, "move" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_wrapx"("geom" "public"."geometry", "wrap" double precision, "move" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_x"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_x"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_x"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_x"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_xmax"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_xmax"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."st_xmax"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_xmax"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_xmin"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_xmin"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."st_xmin"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_xmin"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_y"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_y"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_y"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_y"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_ymax"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_ymax"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."st_ymax"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_ymax"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_ymin"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_ymin"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."st_ymin"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_ymin"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_z"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_z"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_z"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_z"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_zmax"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_zmax"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."st_zmax"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_zmax"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_zmflag"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_zmflag"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_zmflag"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_zmflag"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_zmin"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_zmin"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."st_zmin"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_zmin"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."touch_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."touch_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."touch_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trigger_event_created_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."trigger_event_created_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trigger_event_created_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trigger_event_participant_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."trigger_event_participant_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trigger_event_participant_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trigger_event_updated_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."trigger_event_updated_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trigger_event_updated_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trigger_membership_request_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."trigger_membership_request_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trigger_membership_request_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trigger_membership_status_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."trigger_membership_status_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trigger_membership_status_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trigger_new_comment_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."trigger_new_comment_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trigger_new_comment_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trigger_new_post_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."trigger_new_post_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trigger_new_post_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trigger_role_change_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."trigger_role_change_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trigger_role_change_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trigger_update_location_rating"() TO "anon";
GRANT ALL ON FUNCTION "public"."trigger_update_location_rating"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trigger_update_location_rating"() TO "service_role";



GRANT ALL ON FUNCTION "public"."unlockrows"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."unlockrows"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."unlockrows"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unlockrows"("text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."unsubscribe_marketing"("p_token" "uuid", "p_type" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."unsubscribe_marketing"("p_token" "uuid", "p_type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."unsubscribe_marketing"("p_token" "uuid", "p_type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unsubscribe_marketing"("p_token" "uuid", "p_type" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_enrollment_progress_manual"("p_enrollment_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."update_enrollment_progress_manual"("p_enrollment_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_enrollment_progress_manual"("p_enrollment_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_enrollment_progress_on_completion"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_enrollment_progress_on_completion"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_enrollment_progress_on_completion"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_location_rating"("location_id_param" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."update_location_rating"("location_id_param" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_location_rating"("location_id_param" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_push_token_last_used"("p_token" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_push_token_last_used"("p_token" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_push_token_last_used"("p_token" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_unread_notification_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_unread_notification_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_unread_notification_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_workout_completion_stats"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_workout_completion_stats"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_workout_completion_stats"() TO "service_role";



GRANT ALL ON FUNCTION "public"."updategeometrysrid"(character varying, character varying, integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."updategeometrysrid"(character varying, character varying, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."updategeometrysrid"(character varying, character varying, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."updategeometrysrid"(character varying, character varying, integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."updategeometrysrid"(character varying, character varying, character varying, integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."updategeometrysrid"(character varying, character varying, character varying, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."updategeometrysrid"(character varying, character varying, character varying, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."updategeometrysrid"(character varying, character varying, character varying, integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."updategeometrysrid"("catalogn_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid_in" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."updategeometrysrid"("catalogn_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid_in" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."updategeometrysrid"("catalogn_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid_in" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."updategeometrysrid"("catalogn_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid_in" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_enrollment_progress"() TO "anon";
GRANT ALL ON FUNCTION "public"."validate_enrollment_progress"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_enrollment_progress"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_set_structure"("set_id_param" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."validate_set_structure"("set_id_param" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_set_structure"("set_id_param" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_workout_user_assignment"() TO "anon";
GRANT ALL ON FUNCTION "public"."validate_workout_user_assignment"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_workout_user_assignment"() TO "service_role";



GRANT ALL ON FUNCTION "public"."verify_club_storage_setup"() TO "anon";
GRANT ALL ON FUNCTION "public"."verify_club_storage_setup"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."verify_club_storage_setup"() TO "service_role";












GRANT ALL ON FUNCTION "public"."st_3dextent"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3dextent"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_3dextent"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3dextent"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement", boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement", boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement", boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement", boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement", boolean, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement", boolean, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement", boolean, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement", boolean, "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgeobuf"("anyelement") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgeobuf"("anyelement") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgeobuf"("anyelement") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgeobuf"("anyelement") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgeobuf"("anyelement", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgeobuf"("anyelement", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgeobuf"("anyelement", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgeobuf"("anyelement", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer, "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer, "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer, "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer, "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer, "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_clusterintersecting"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_clusterintersecting"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_clusterintersecting"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_clusterintersecting"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_clusterwithin"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_clusterwithin"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_clusterwithin"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_clusterwithin"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_collect"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_collect"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_collect"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_collect"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_extent"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_extent"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_extent"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_extent"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makeline"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makeline"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_makeline"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makeline"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_memcollect"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_memcollect"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_memcollect"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_memcollect"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_memunion"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_memunion"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_memunion"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_memunion"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polygonize"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polygonize"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_polygonize"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polygonize"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry", double precision) TO "service_role";















GRANT ALL ON TABLE "public"."club_members" TO "anon";
GRANT ALL ON TABLE "public"."club_members" TO "authenticated";
GRANT ALL ON TABLE "public"."club_members" TO "service_role";



GRANT ALL ON TABLE "public"."club_post_comments" TO "anon";
GRANT ALL ON TABLE "public"."club_post_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."club_post_comments" TO "service_role";



GRANT ALL ON TABLE "public"."club_post_likes" TO "anon";
GRANT ALL ON TABLE "public"."club_post_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."club_post_likes" TO "service_role";



GRANT ALL ON TABLE "public"."club_posts" TO "anon";
GRANT ALL ON TABLE "public"."club_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."club_posts" TO "service_role";



GRANT ALL ON TABLE "public"."club_spots" TO "anon";
GRANT ALL ON TABLE "public"."club_spots" TO "authenticated";
GRANT ALL ON TABLE "public"."club_spots" TO "service_role";



GRANT ALL ON TABLE "public"."club_tags" TO "anon";
GRANT ALL ON TABLE "public"."club_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."club_tags" TO "service_role";



GRANT ALL ON TABLE "public"."clubs" TO "anon";
GRANT ALL ON TABLE "public"."clubs" TO "authenticated";
GRANT ALL ON TABLE "public"."clubs" TO "service_role";



GRANT ALL ON TABLE "public"."disciplines" TO "anon";
GRANT ALL ON TABLE "public"."disciplines" TO "authenticated";
GRANT ALL ON TABLE "public"."disciplines" TO "service_role";



GRANT ALL ON TABLE "public"."equipments" TO "anon";
GRANT ALL ON TABLE "public"."equipments" TO "authenticated";
GRANT ALL ON TABLE "public"."equipments" TO "service_role";



GRANT ALL ON TABLE "public"."event_images" TO "anon";
GRANT ALL ON TABLE "public"."event_images" TO "authenticated";
GRANT ALL ON TABLE "public"."event_images" TO "service_role";



GRANT ALL ON TABLE "public"."event_locations" TO "anon";
GRANT ALL ON TABLE "public"."event_locations" TO "authenticated";
GRANT ALL ON TABLE "public"."event_locations" TO "service_role";



GRANT ALL ON TABLE "public"."event_participants" TO "anon";
GRANT ALL ON TABLE "public"."event_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."event_participants" TO "service_role";



GRANT ALL ON TABLE "public"."event_post_comments" TO "anon";
GRANT ALL ON TABLE "public"."event_post_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."event_post_comments" TO "service_role";



GRANT ALL ON TABLE "public"."event_post_likes" TO "anon";
GRANT ALL ON TABLE "public"."event_post_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."event_post_likes" TO "service_role";



GRANT ALL ON TABLE "public"."event_posts" TO "anon";
GRANT ALL ON TABLE "public"."event_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."event_posts" TO "service_role";



GRANT ALL ON TABLE "public"."event_tag_assignments" TO "anon";
GRANT ALL ON TABLE "public"."event_tag_assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."event_tag_assignments" TO "service_role";



GRANT ALL ON TABLE "public"."event_tags" TO "anon";
GRANT ALL ON TABLE "public"."event_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."event_tags" TO "service_role";



GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";



GRANT ALL ON TABLE "public"."exercise_equipment" TO "anon";
GRANT ALL ON TABLE "public"."exercise_equipment" TO "authenticated";
GRANT ALL ON TABLE "public"."exercise_equipment" TO "service_role";



GRANT ALL ON TABLE "public"."exercise_muscles" TO "anon";
GRANT ALL ON TABLE "public"."exercise_muscles" TO "authenticated";
GRANT ALL ON TABLE "public"."exercise_muscles" TO "service_role";



GRANT ALL ON TABLE "public"."exercise_progressions" TO "anon";
GRANT ALL ON TABLE "public"."exercise_progressions" TO "authenticated";
GRANT ALL ON TABLE "public"."exercise_progressions" TO "service_role";



GRANT ALL ON TABLE "public"."exercises" TO "anon";
GRANT ALL ON TABLE "public"."exercises" TO "authenticated";
GRANT ALL ON TABLE "public"."exercises" TO "service_role";



GRANT ALL ON TABLE "public"."location_comments" TO "anon";
GRANT ALL ON TABLE "public"."location_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."location_comments" TO "service_role";



GRANT ALL ON TABLE "public"."location_disciplines" TO "anon";
GRANT ALL ON TABLE "public"."location_disciplines" TO "authenticated";
GRANT ALL ON TABLE "public"."location_disciplines" TO "service_role";



GRANT ALL ON TABLE "public"."location_equipments" TO "anon";
GRANT ALL ON TABLE "public"."location_equipments" TO "authenticated";
GRANT ALL ON TABLE "public"."location_equipments" TO "service_role";



GRANT ALL ON TABLE "public"."location_images" TO "anon";
GRANT ALL ON TABLE "public"."location_images" TO "authenticated";
GRANT ALL ON TABLE "public"."location_images" TO "service_role";



GRANT ALL ON TABLE "public"."location_likes" TO "anon";
GRANT ALL ON TABLE "public"."location_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."location_likes" TO "service_role";



GRANT ALL ON TABLE "public"."location_ratings" TO "anon";
GRANT ALL ON TABLE "public"."location_ratings" TO "authenticated";
GRANT ALL ON TABLE "public"."location_ratings" TO "service_role";



GRANT ALL ON TABLE "public"."locations" TO "anon";
GRANT ALL ON TABLE "public"."locations" TO "authenticated";
GRANT ALL ON TABLE "public"."locations" TO "service_role";



GRANT ALL ON TABLE "public"."muscles" TO "anon";
GRANT ALL ON TABLE "public"."muscles" TO "authenticated";
GRANT ALL ON TABLE "public"."muscles" TO "service_role";



GRANT ALL ON TABLE "public"."notification_preferences" TO "anon";
GRANT ALL ON TABLE "public"."notification_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."notification_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."program_phases" TO "anon";
GRANT ALL ON TABLE "public"."program_phases" TO "authenticated";
GRANT ALL ON TABLE "public"."program_phases" TO "service_role";



GRANT ALL ON TABLE "public"."program_reviews" TO "anon";
GRANT ALL ON TABLE "public"."program_reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."program_reviews" TO "service_role";



GRANT ALL ON TABLE "public"."program_session_completions" TO "anon";
GRANT ALL ON TABLE "public"."program_session_completions" TO "authenticated";
GRANT ALL ON TABLE "public"."program_session_completions" TO "service_role";



GRANT ALL ON TABLE "public"."program_weeks" TO "anon";
GRANT ALL ON TABLE "public"."program_weeks" TO "authenticated";
GRANT ALL ON TABLE "public"."program_weeks" TO "service_role";



GRANT ALL ON TABLE "public"."program_workouts" TO "anon";
GRANT ALL ON TABLE "public"."program_workouts" TO "authenticated";
GRANT ALL ON TABLE "public"."program_workouts" TO "service_role";



GRANT ALL ON TABLE "public"."programs" TO "anon";
GRANT ALL ON TABLE "public"."programs" TO "authenticated";
GRANT ALL ON TABLE "public"."programs" TO "service_role";



GRANT ALL ON TABLE "public"."push_queue" TO "anon";
GRANT ALL ON TABLE "public"."push_queue" TO "authenticated";
GRANT ALL ON TABLE "public"."push_queue" TO "service_role";



GRANT ALL ON TABLE "public"."reports" TO "anon";
GRANT ALL ON TABLE "public"."reports" TO "authenticated";
GRANT ALL ON TABLE "public"."reports" TO "service_role";



GRANT ALL ON TABLE "public"."session_exercises" TO "anon";
GRANT ALL ON TABLE "public"."session_exercises" TO "authenticated";
GRANT ALL ON TABLE "public"."session_exercises" TO "service_role";



GRANT ALL ON TABLE "public"."set_exercises" TO "anon";
GRANT ALL ON TABLE "public"."set_exercises" TO "authenticated";
GRANT ALL ON TABLE "public"."set_exercises" TO "service_role";



GRANT ALL ON TABLE "public"."sets" TO "anon";
GRANT ALL ON TABLE "public"."sets" TO "authenticated";
GRANT ALL ON TABLE "public"."sets" TO "service_role";



GRANT ALL ON TABLE "public"."user_disciplines" TO "anon";
GRANT ALL ON TABLE "public"."user_disciplines" TO "authenticated";
GRANT ALL ON TABLE "public"."user_disciplines" TO "service_role";



GRANT ALL ON TABLE "public"."user_program_enrollments" TO "anon";
GRANT ALL ON TABLE "public"."user_program_enrollments" TO "authenticated";
GRANT ALL ON TABLE "public"."user_program_enrollments" TO "service_role";



GRANT ALL ON TABLE "public"."user_push_tokens" TO "anon";
GRANT ALL ON TABLE "public"."user_push_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."user_push_tokens" TO "service_role";



GRANT ALL ON TABLE "public"."user_subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."user_subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."user_subscriptions" TO "service_role";



GRANT ALL ON TABLE "public"."user_workout_preferences" TO "anon";
GRANT ALL ON TABLE "public"."user_workout_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."user_workout_preferences" TO "service_role";



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."users" TO "anon";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT SELECT("id") ON TABLE "public"."users" TO "anon";
GRANT SELECT("id") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT("email") ON TABLE "public"."users" TO "anon";
GRANT SELECT("email") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT("pseudo") ON TABLE "public"."users" TO "anon";
GRANT SELECT("pseudo") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT("birth_year") ON TABLE "public"."users" TO "anon";
GRANT SELECT("birth_year") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT("created_at") ON TABLE "public"."users" TO "anon";
GRANT SELECT("created_at") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT("updated_at") ON TABLE "public"."users" TO "anon";
GRANT SELECT("updated_at") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT("bio") ON TABLE "public"."users" TO "anon";
GRANT SELECT("bio") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT("city") ON TABLE "public"."users" TO "anon";
GRANT SELECT("city") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT("state") ON TABLE "public"."users" TO "anon";
GRANT SELECT("state") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT("name") ON TABLE "public"."users" TO "anon";
GRANT SELECT("name") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT("profile_picture_url") ON TABLE "public"."users" TO "anon";
GRANT SELECT("profile_picture_url") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT("fitness_level") ON TABLE "public"."users" TO "anon";
GRANT SELECT("fitness_level") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT("unread_notifications_count") ON TABLE "public"."users" TO "anon";
GRANT SELECT("unread_notifications_count") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT("last_notification_read_at") ON TABLE "public"."users" TO "anon";
GRANT SELECT("last_notification_read_at") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT("terms_accepted_at") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT("terms_version") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT("marketing_email_opt_in") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT("marketing_email_opt_in_at") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT("partner_offers_opt_in") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT("partner_offers_opt_in_at") ON TABLE "public"."users" TO "authenticated";



GRANT ALL ON TABLE "public"."website_users" TO "anon";
GRANT ALL ON TABLE "public"."website_users" TO "authenticated";
GRANT ALL ON TABLE "public"."website_users" TO "service_role";



GRANT ALL ON TABLE "public"."workout_likes" TO "anon";
GRANT ALL ON TABLE "public"."workout_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_likes" TO "service_role";



GRANT ALL ON TABLE "public"."workout_sessions" TO "anon";
GRANT ALL ON TABLE "public"."workout_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."workout_sets" TO "anon";
GRANT ALL ON TABLE "public"."workout_sets" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_sets" TO "service_role";



GRANT ALL ON TABLE "public"."workout_shares" TO "anon";
GRANT ALL ON TABLE "public"."workout_shares" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_shares" TO "service_role";



GRANT ALL ON TABLE "public"."workout_template_exercises" TO "anon";
GRANT ALL ON TABLE "public"."workout_template_exercises" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_template_exercises" TO "service_role";



GRANT ALL ON TABLE "public"."workout_templates" TO "anon";
GRANT ALL ON TABLE "public"."workout_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_templates" TO "service_role";



GRANT ALL ON TABLE "public"."workouts" TO "anon";
GRANT ALL ON TABLE "public"."workouts" TO "authenticated";
GRANT ALL ON TABLE "public"."workouts" TO "service_role";



GRANT ALL ON TABLE "public"."workouts_backup" TO "anon";
GRANT ALL ON TABLE "public"."workouts_backup" TO "authenticated";
GRANT ALL ON TABLE "public"."workouts_backup" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























