export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      club_members: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          club_id: string
          id: string
          joined_at: string | null
          role: string
          status: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          club_id: string
          id?: string
          joined_at?: string | null
          role?: string
          status?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          club_id?: string
          id?: string
          joined_at?: string | null
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_members_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_members_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      club_post_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          post_id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_post_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "club_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      club_post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "club_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      club_posts: {
        Row: {
          author_id: string
          club_id: string
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          updated_at: string | null
        }
        Insert: {
          author_id: string
          club_id: string
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          club_id?: string
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_posts_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      club_spots: {
        Row: {
          added_at: string | null
          added_by: string
          club_id: string
          id: string
          location_id: string
        }
        Insert: {
          added_at?: string | null
          added_by: string
          club_id: string
          id?: string
          location_id: string
        }
        Update: {
          added_at?: string | null
          added_by?: string
          club_id?: string
          id?: string
          location_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_spots_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_spots_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_spots_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      club_tags: {
        Row: {
          club_id: string
          created_at: string | null
          id: string
          tag: string
        }
        Insert: {
          club_id: string
          created_at?: string | null
          id?: string
          tag: string
        }
        Update: {
          club_id?: string
          created_at?: string | null
          id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_tags_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          category: string
          cover_image_url: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          privacy: string
          rules: string | null
          search_vector: unknown
          updated_at: string | null
        }
        Insert: {
          category: string
          cover_image_url?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          privacy: string
          rules?: string | null
          search_vector?: unknown
          updated_at?: string | null
        }
        Update: {
          category?: string
          cover_image_url?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          privacy?: string
          rules?: string | null
          search_vector?: unknown
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clubs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      disciplines: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          description_locale_key: string | null
          discipline_locale_key: string
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          description_locale_key?: string | null
          discipline_locale_key: string
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          description_locale_key?: string | null
          discipline_locale_key?: string
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      equipments: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          description_locale_key: string | null
          equipment_locale_key: string
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          description_locale_key?: string | null
          equipment_locale_key: string
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          description_locale_key?: string | null
          equipment_locale_key?: string
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      event_images: {
        Row: {
          caption: string | null
          created_at: string | null
          event_id: string
          file_size: number | null
          id: string
          image_order: number
          image_path: string
          image_url: string
          mime_type: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          event_id: string
          file_size?: number | null
          id?: string
          image_order: number
          image_path: string
          image_url: string
          mime_type?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          event_id?: string
          file_size?: number | null
          id?: string
          image_order?: number
          image_path?: string
          image_url?: string
          mime_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_images_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_locations: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          is_primary: boolean
          location_id: string
          location_order: number
          notes: string | null
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          is_primary?: boolean
          location_id: string
          location_order?: number
          notes?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          is_primary?: boolean
          location_id?: string
          location_order?: number
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_locations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participants: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          event_id: string
          id: string
          notes: string | null
          participation_type: string
          payment_reference: string | null
          payment_status: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          event_id: string
          id?: string
          notes?: string | null
          participation_type: string
          payment_reference?: string | null
          payment_status?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          event_id?: string
          id?: string
          notes?: string | null
          participation_type?: string
          payment_reference?: string | null
          payment_status?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_post_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          post_id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_post_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "event_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      event_post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "event_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          event_id: string
          id: string
          image_url: string | null
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          event_id: string
          id?: string
          image_url?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          event_id?: string
          id?: string
          image_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_posts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_tag_assignments: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_tag_assignments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_tag_assignments_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "event_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      event_tags: {
        Row: {
          color: string
          created_at: string | null
          icon: string | null
          id: string
          name: string
          name_fr: string
        }
        Insert: {
          color?: string
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          name_fr: string
        }
        Update: {
          color?: string
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          name_fr?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          cancellation_reason: string | null
          club_id: string | null
          created_at: string | null
          created_by: string
          description: string | null
          ends_at: string
          featured_image_path: string | null
          featured_image_url: string | null
          id: string
          is_free: boolean
          max_participants: number | null
          min_participants: number | null
          organizer_contact: string | null
          organizer_name: string | null
          price_amount: number | null
          price_currency: string | null
          registration_deadline: string | null
          requires_approval: boolean
          starts_at: string
          status: string
          timezone: string
          title: string
          updated_at: string | null
          visibility: string
        }
        Insert: {
          cancellation_reason?: string | null
          club_id?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          ends_at: string
          featured_image_path?: string | null
          featured_image_url?: string | null
          id?: string
          is_free?: boolean
          max_participants?: number | null
          min_participants?: number | null
          organizer_contact?: string | null
          organizer_name?: string | null
          price_amount?: number | null
          price_currency?: string | null
          registration_deadline?: string | null
          requires_approval?: boolean
          starts_at: string
          status?: string
          timezone?: string
          title: string
          updated_at?: string | null
          visibility?: string
        }
        Update: {
          cancellation_reason?: string | null
          club_id?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          ends_at?: string
          featured_image_path?: string | null
          featured_image_url?: string | null
          id?: string
          is_free?: boolean
          max_participants?: number | null
          min_participants?: number | null
          organizer_contact?: string | null
          organizer_name?: string | null
          price_amount?: number | null
          price_currency?: string | null
          registration_deadline?: string | null
          requires_approval?: boolean
          starts_at?: string
          status?: string
          timezone?: string
          title?: string
          updated_at?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_equipment: {
        Row: {
          equipment_id: string
          exercise_id: string
          quantity: number | null
          requirement_type: Database["public"]["Enums"]["equipment_requirement_type"]
          usage_notes: string | null
        }
        Insert: {
          equipment_id: string
          exercise_id: string
          quantity?: number | null
          requirement_type: Database["public"]["Enums"]["equipment_requirement_type"]
          usage_notes?: string | null
        }
        Update: {
          equipment_id?: string
          exercise_id?: string
          quantity?: number | null
          requirement_type?: Database["public"]["Enums"]["equipment_requirement_type"]
          usage_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_equipment_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_equipment_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_muscles: {
        Row: {
          activation_percentage: number | null
          exercise_id: string
          involvement_type: Database["public"]["Enums"]["muscle_involvement_type"]
          muscle_id: string
        }
        Insert: {
          activation_percentage?: number | null
          exercise_id: string
          involvement_type: Database["public"]["Enums"]["muscle_involvement_type"]
          muscle_id: string
        }
        Update: {
          activation_percentage?: number | null
          exercise_id?: string
          involvement_type?: Database["public"]["Enums"]["muscle_involvement_type"]
          muscle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_muscles_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_muscles_muscle_id_fkey"
            columns: ["muscle_id"]
            isOneToOne: false
            referencedRelation: "muscles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_progressions: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          difficulty_gap: number
          estimated_transition_time: number | null
          exercise_id: string
          id: string
          mastery_criteria: string | null
          progression_type: Database["public"]["Enums"]["progression_type"]
          target_exercise_id: string
          transition_requirements: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          difficulty_gap: number
          estimated_transition_time?: number | null
          exercise_id: string
          id?: string
          mastery_criteria?: string | null
          progression_type: Database["public"]["Enums"]["progression_type"]
          target_exercise_id: string
          transition_requirements?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          difficulty_gap?: number
          estimated_transition_time?: number | null
          exercise_id?: string
          id?: string
          mastery_criteria?: string | null
          progression_type?: Database["public"]["Enums"]["progression_type"]
          target_exercise_id?: string
          transition_requirements?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_progressions_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_progressions_target_exercise_id_fkey"
            columns: ["target_exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          advanced_reps: number[] | null
          advanced_sets: number[] | null
          advanced_time: number[] | null
          aliases: string[] | null
          animation_url: string | null
          beginner_reps: number[] | null
          beginner_sets: number[] | null
          beginner_time: number[] | null
          breathing_pattern: string | null
          category: Database["public"]["Enums"]["exercise_category"]
          coaching_cues: string[] | null
          common_mistakes: string[] | null
          contraindications:
            | Database["public"]["Enums"]["contraindication"][]
            | null
          created_at: string | null
          description: string | null
          description_locale_key: string | null
          difficulty_level: number | null
          execution_instructions: string | null
          exercise_family: string
          force_vector: Database["public"]["Enums"]["force_vector"]
          id: string
          image_url: string | null
          injury_risks: Database["public"]["Enums"]["injury_risk"][] | null
          intermediate_reps: number[] | null
          intermediate_sets: number[] | null
          intermediate_time: number[] | null
          is_active: boolean | null
          is_verified: boolean | null
          joint_actions: Database["public"]["Enums"]["joint_action"][] | null
          movement_pattern: Database["public"]["Enums"]["movement_pattern"]
          name: string
          name_locale_key: string
          parameter_type: Database["public"]["Enums"]["parameter_type"]
          plane_of_motion:
            | Database["public"]["Enums"]["plane_of_motion"][]
            | null
          popularity_score: number | null
          prerequisites: string[] | null
          primary_muscles: Database["public"]["Enums"]["muscle_group"][] | null
          progression_tier: number | null
          safety_level: Database["public"]["Enums"]["safety_level"] | null
          secondary_muscles:
            | Database["public"]["Enums"]["muscle_group"][]
            | null
          setup_instructions: string | null
          space_requirement:
            | Database["public"]["Enums"]["space_requirement"]
            | null
          subcategory: string
          supports_distance: boolean | null
          supports_reps: boolean | null
          supports_time: boolean | null
          surface_types: Database["public"]["Enums"]["surface_type"][] | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          advanced_reps?: number[] | null
          advanced_sets?: number[] | null
          advanced_time?: number[] | null
          aliases?: string[] | null
          animation_url?: string | null
          beginner_reps?: number[] | null
          beginner_sets?: number[] | null
          beginner_time?: number[] | null
          breathing_pattern?: string | null
          category: Database["public"]["Enums"]["exercise_category"]
          coaching_cues?: string[] | null
          common_mistakes?: string[] | null
          contraindications?:
            | Database["public"]["Enums"]["contraindication"][]
            | null
          created_at?: string | null
          description?: string | null
          description_locale_key?: string | null
          difficulty_level?: number | null
          execution_instructions?: string | null
          exercise_family: string
          force_vector?: Database["public"]["Enums"]["force_vector"]
          id?: string
          image_url?: string | null
          injury_risks?: Database["public"]["Enums"]["injury_risk"][] | null
          intermediate_reps?: number[] | null
          intermediate_sets?: number[] | null
          intermediate_time?: number[] | null
          is_active?: boolean | null
          is_verified?: boolean | null
          joint_actions?: Database["public"]["Enums"]["joint_action"][] | null
          movement_pattern: Database["public"]["Enums"]["movement_pattern"]
          name: string
          name_locale_key: string
          parameter_type?: Database["public"]["Enums"]["parameter_type"]
          plane_of_motion?:
            | Database["public"]["Enums"]["plane_of_motion"][]
            | null
          popularity_score?: number | null
          prerequisites?: string[] | null
          primary_muscles?: Database["public"]["Enums"]["muscle_group"][] | null
          progression_tier?: number | null
          safety_level?: Database["public"]["Enums"]["safety_level"] | null
          secondary_muscles?:
            | Database["public"]["Enums"]["muscle_group"][]
            | null
          setup_instructions?: string | null
          space_requirement?:
            | Database["public"]["Enums"]["space_requirement"]
            | null
          subcategory: string
          supports_distance?: boolean | null
          supports_reps?: boolean | null
          supports_time?: boolean | null
          surface_types?: Database["public"]["Enums"]["surface_type"][] | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          advanced_reps?: number[] | null
          advanced_sets?: number[] | null
          advanced_time?: number[] | null
          aliases?: string[] | null
          animation_url?: string | null
          beginner_reps?: number[] | null
          beginner_sets?: number[] | null
          beginner_time?: number[] | null
          breathing_pattern?: string | null
          category?: Database["public"]["Enums"]["exercise_category"]
          coaching_cues?: string[] | null
          common_mistakes?: string[] | null
          contraindications?:
            | Database["public"]["Enums"]["contraindication"][]
            | null
          created_at?: string | null
          description?: string | null
          description_locale_key?: string | null
          difficulty_level?: number | null
          execution_instructions?: string | null
          exercise_family?: string
          force_vector?: Database["public"]["Enums"]["force_vector"]
          id?: string
          image_url?: string | null
          injury_risks?: Database["public"]["Enums"]["injury_risk"][] | null
          intermediate_reps?: number[] | null
          intermediate_sets?: number[] | null
          intermediate_time?: number[] | null
          is_active?: boolean | null
          is_verified?: boolean | null
          joint_actions?: Database["public"]["Enums"]["joint_action"][] | null
          movement_pattern?: Database["public"]["Enums"]["movement_pattern"]
          name?: string
          name_locale_key?: string
          parameter_type?: Database["public"]["Enums"]["parameter_type"]
          plane_of_motion?:
            | Database["public"]["Enums"]["plane_of_motion"][]
            | null
          popularity_score?: number | null
          prerequisites?: string[] | null
          primary_muscles?: Database["public"]["Enums"]["muscle_group"][] | null
          progression_tier?: number | null
          safety_level?: Database["public"]["Enums"]["safety_level"] | null
          secondary_muscles?:
            | Database["public"]["Enums"]["muscle_group"][]
            | null
          setup_instructions?: string | null
          space_requirement?:
            | Database["public"]["Enums"]["space_requirement"]
            | null
          subcategory?: string
          supports_distance?: boolean | null
          supports_reps?: boolean | null
          supports_time?: boolean | null
          surface_types?: Database["public"]["Enums"]["surface_type"][] | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      location_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          location_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          location_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          location_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_comments_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      location_disciplines: {
        Row: {
          added_by: string | null
          created_at: string | null
          discipline_id: string
          id: string
          location_id: string
          notes: string | null
          popularity_score: number | null
          updated_at: string | null
          verified: boolean | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          added_by?: string | null
          created_at?: string | null
          discipline_id: string
          id?: string
          location_id: string
          notes?: string | null
          popularity_score?: number | null
          updated_at?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          added_by?: string | null
          created_at?: string | null
          discipline_id?: string
          id?: string
          location_id?: string
          notes?: string | null
          popularity_score?: number | null
          updated_at?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_disciplines_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_disciplines_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_disciplines_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_disciplines_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      location_equipments: {
        Row: {
          added_by: string | null
          condition: string | null
          created_at: string | null
          equipment_id: string
          id: string
          location_id: string
          notes: string | null
          quantity: number | null
          updated_at: string | null
          verified: boolean | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          added_by?: string | null
          condition?: string | null
          created_at?: string | null
          equipment_id: string
          id?: string
          location_id: string
          notes?: string | null
          quantity?: number | null
          updated_at?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          added_by?: string | null
          condition?: string | null
          created_at?: string | null
          equipment_id?: string
          id?: string
          location_id?: string
          notes?: string | null
          quantity?: number | null
          updated_at?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_equipments_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_equipments_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_equipments_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_equipments_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      location_images: {
        Row: {
          created_at: string | null
          file_size: number | null
          id: string
          image_order: number
          image_path: string
          image_url: string
          location_id: string | null
          mime_type: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          file_size?: number | null
          id?: string
          image_order: number
          image_path: string
          image_url: string
          location_id?: string | null
          mime_type?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          file_size?: number | null
          id?: string
          image_order?: number
          image_path?: string
          image_url?: string
          location_id?: string | null
          mime_type?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_images_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      location_likes: {
        Row: {
          created_at: string | null
          id: string
          location_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_likes_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      location_ratings: {
        Row: {
          created_at: string | null
          id: string
          location_id: string
          rating: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location_id: string
          rating: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location_id?: string
          rating?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_ratings_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          average_rating: number | null
          city: string | null
          contributor: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          external_average_rating: number | null
          external_rating_count: number | null
          id: string
          is_open_24h: boolean | null
          latitude: number | null
          longitude: number | null
          metadata: Json | null
          name: string
          opening_hours: Json | null
          rating: number | null
          rating_count: number | null
          region: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          average_rating?: number | null
          city?: string | null
          contributor?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          external_average_rating?: number | null
          external_rating_count?: number | null
          id?: string
          is_open_24h?: boolean | null
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          name: string
          opening_hours?: Json | null
          rating?: number | null
          rating_count?: number | null
          region?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          average_rating?: number | null
          city?: string | null
          contributor?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          external_average_rating?: number | null
          external_rating_count?: number | null
          id?: string
          is_open_24h?: boolean | null
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          name?: string
          opening_hours?: Json | null
          rating?: number | null
          rating_count?: number | null
          region?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      muscles: {
        Row: {
          anatomy_image_url: string | null
          created_at: string | null
          description: string | null
          id: string
          muscle_group: string
          name: string
          name_locale_key: string
        }
        Insert: {
          anatomy_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          muscle_group: string
          name: string
          name_locale_key: string
        }
        Update: {
          anatomy_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          muscle_group?: string
          name?: string
          name_locale_key?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          comment_likes: boolean | null
          created_at: string
          email_notifications: boolean | null
          event_approvals: boolean | null
          event_created: boolean | null
          event_participants: boolean | null
          event_reminders: boolean | null
          event_updates: boolean | null
          id: string
          membership_requests: boolean | null
          membership_updates: boolean | null
          new_comments: boolean | null
          new_posts: boolean | null
          post_likes: boolean | null
          push_comment_likes: boolean | null
          push_event_approvals: boolean | null
          push_event_created: boolean | null
          push_event_participants: boolean | null
          push_event_reminders: boolean | null
          push_event_updates: boolean | null
          push_membership_requests: boolean | null
          push_membership_updates: boolean | null
          push_mentions: boolean | null
          push_new_comments: boolean | null
          push_new_posts: boolean | null
          push_notifications: boolean | null
          push_post_likes: boolean | null
          push_role_changes: boolean | null
          role_changes: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comment_likes?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          event_approvals?: boolean | null
          event_created?: boolean | null
          event_participants?: boolean | null
          event_reminders?: boolean | null
          event_updates?: boolean | null
          id?: string
          membership_requests?: boolean | null
          membership_updates?: boolean | null
          new_comments?: boolean | null
          new_posts?: boolean | null
          post_likes?: boolean | null
          push_comment_likes?: boolean | null
          push_event_approvals?: boolean | null
          push_event_created?: boolean | null
          push_event_participants?: boolean | null
          push_event_reminders?: boolean | null
          push_event_updates?: boolean | null
          push_membership_requests?: boolean | null
          push_membership_updates?: boolean | null
          push_mentions?: boolean | null
          push_new_comments?: boolean | null
          push_new_posts?: boolean | null
          push_notifications?: boolean | null
          push_post_likes?: boolean | null
          push_role_changes?: boolean | null
          role_changes?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comment_likes?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          event_approvals?: boolean | null
          event_created?: boolean | null
          event_participants?: boolean | null
          event_reminders?: boolean | null
          event_updates?: boolean | null
          id?: string
          membership_requests?: boolean | null
          membership_updates?: boolean | null
          new_comments?: boolean | null
          new_posts?: boolean | null
          post_likes?: boolean | null
          push_comment_likes?: boolean | null
          push_event_approvals?: boolean | null
          push_event_created?: boolean | null
          push_event_participants?: boolean | null
          push_event_reminders?: boolean | null
          push_event_updates?: boolean | null
          push_membership_requests?: boolean | null
          push_membership_updates?: boolean | null
          push_mentions?: boolean | null
          push_new_comments?: boolean | null
          push_new_posts?: boolean | null
          push_notifications?: boolean | null
          push_post_likes?: boolean | null
          push_role_changes?: boolean | null
          role_changes?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          actor_user_id: string | null
          app_version: string | null
          club_id: string | null
          comment_id: string | null
          created_at: string
          event_id: string | null
          event_participant_id: string | null
          id: string
          message: string
          metadata: Json | null
          post_id: string | null
          read_at: string | null
          title: string
          type: string
          update_id: string | null
          user_id: string
        }
        Insert: {
          actor_user_id?: string | null
          app_version?: string | null
          club_id?: string | null
          comment_id?: string | null
          created_at?: string
          event_id?: string | null
          event_participant_id?: string | null
          id?: string
          message: string
          metadata?: Json | null
          post_id?: string | null
          read_at?: string | null
          title: string
          type: string
          update_id?: string | null
          user_id: string
        }
        Update: {
          actor_user_id?: string | null
          app_version?: string | null
          club_id?: string | null
          comment_id?: string | null
          created_at?: string
          event_id?: string | null
          event_participant_id?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          post_id?: string | null
          read_at?: string | null
          title?: string
          type?: string
          update_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "club_post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_event_participant_id_fkey"
            columns: ["event_participant_id"]
            isOneToOne: false
            referencedRelation: "event_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "club_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      program_phases: {
        Row: {
          adaptation_triggers: Json | null
          assessments: Json | null
          created_at: string
          deload_protocol: Json | null
          description: string | null
          duration_weeks: number
          focus_areas: string[] | null
          id: string
          intensity_range: number[] | null
          milestones: Json | null
          name: string
          order_index: number
          phase_type: Database["public"]["Enums"]["program_phase"]
          program_id: string
          progression_rules: Json | null
          recovery_emphasis: Json | null
          start_week: number
          training_emphasis: Json | null
          updated_at: string
          volume_emphasis: string | null
        }
        Insert: {
          adaptation_triggers?: Json | null
          assessments?: Json | null
          created_at?: string
          deload_protocol?: Json | null
          description?: string | null
          duration_weeks: number
          focus_areas?: string[] | null
          id?: string
          intensity_range?: number[] | null
          milestones?: Json | null
          name: string
          order_index: number
          phase_type?: Database["public"]["Enums"]["program_phase"]
          program_id: string
          progression_rules?: Json | null
          recovery_emphasis?: Json | null
          start_week: number
          training_emphasis?: Json | null
          updated_at?: string
          volume_emphasis?: string | null
        }
        Update: {
          adaptation_triggers?: Json | null
          assessments?: Json | null
          created_at?: string
          deload_protocol?: Json | null
          description?: string | null
          duration_weeks?: number
          focus_areas?: string[] | null
          id?: string
          intensity_range?: number[] | null
          milestones?: Json | null
          name?: string
          order_index?: number
          phase_type?: Database["public"]["Enums"]["program_phase"]
          program_id?: string
          progression_rules?: Json | null
          recovery_emphasis?: Json | null
          start_week?: number
          training_emphasis?: Json | null
          updated_at?: string
          volume_emphasis?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_phases_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      program_reviews: {
        Row: {
          created_at: string
          difficulty_rating: number | null
          effectiveness_rating: number | null
          enjoyment_rating: number | null
          enrollment_id: string | null
          id: string
          is_featured: boolean
          is_hidden: boolean
          is_verified: boolean
          not_recommended_for: string[] | null
          program_id: string
          rating: number
          recommended_for: string[] | null
          review_text: string | null
          title: string | null
          updated_at: string
          user_fitness_level: string | null
          user_goals: string[] | null
          user_id: string
          weeks_completed: number | null
          would_recommend: boolean | null
        }
        Insert: {
          created_at?: string
          difficulty_rating?: number | null
          effectiveness_rating?: number | null
          enjoyment_rating?: number | null
          enrollment_id?: string | null
          id?: string
          is_featured?: boolean
          is_hidden?: boolean
          is_verified?: boolean
          not_recommended_for?: string[] | null
          program_id: string
          rating: number
          recommended_for?: string[] | null
          review_text?: string | null
          title?: string | null
          updated_at?: string
          user_fitness_level?: string | null
          user_goals?: string[] | null
          user_id: string
          weeks_completed?: number | null
          would_recommend?: boolean | null
        }
        Update: {
          created_at?: string
          difficulty_rating?: number | null
          effectiveness_rating?: number | null
          enjoyment_rating?: number | null
          enrollment_id?: string | null
          id?: string
          is_featured?: boolean
          is_hidden?: boolean
          is_verified?: boolean
          not_recommended_for?: string[] | null
          program_id?: string
          rating?: number
          recommended_for?: string[] | null
          review_text?: string | null
          title?: string | null
          updated_at?: string
          user_fitness_level?: string | null
          user_goals?: string[] | null
          user_id?: string
          weeks_completed?: number | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "program_reviews_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "user_program_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_reviews_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      program_session_completions: {
        Row: {
          actual_duration: number | null
          completion_date: string
          created_at: string
          difficulty_feedback: string | null
          energy_level: string | null
          enrollment_id: string
          equipment_substitutions: Json | null
          exercise_substitutions: Json | null
          id: string
          modifications_made: Json | null
          motivation_level: string | null
          perceived_exertion: number | null
          post_session_fatigue: number | null
          pre_session_readiness: number | null
          program_workout_id: string
          recovery_rating: number | null
          scheduled_date: string | null
          session_rating: number | null
          status: string
          updated_at: string
          user_notes: string | null
          workout_session_id: string | null
        }
        Insert: {
          actual_duration?: number | null
          completion_date?: string
          created_at?: string
          difficulty_feedback?: string | null
          energy_level?: string | null
          enrollment_id: string
          equipment_substitutions?: Json | null
          exercise_substitutions?: Json | null
          id?: string
          modifications_made?: Json | null
          motivation_level?: string | null
          perceived_exertion?: number | null
          post_session_fatigue?: number | null
          pre_session_readiness?: number | null
          program_workout_id: string
          recovery_rating?: number | null
          scheduled_date?: string | null
          session_rating?: number | null
          status?: string
          updated_at?: string
          user_notes?: string | null
          workout_session_id?: string | null
        }
        Update: {
          actual_duration?: number | null
          completion_date?: string
          created_at?: string
          difficulty_feedback?: string | null
          energy_level?: string | null
          enrollment_id?: string
          equipment_substitutions?: Json | null
          exercise_substitutions?: Json | null
          id?: string
          modifications_made?: Json | null
          motivation_level?: string | null
          perceived_exertion?: number | null
          post_session_fatigue?: number | null
          pre_session_readiness?: number | null
          program_workout_id?: string
          recovery_rating?: number | null
          scheduled_date?: string | null
          session_rating?: number | null
          status?: string
          updated_at?: string
          user_notes?: string | null
          workout_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_session_completions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "user_program_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_session_completions_program_workout_id_fkey"
            columns: ["program_workout_id"]
            isOneToOne: false
            referencedRelation: "program_workouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_session_completions_workout_session_id_fkey"
            columns: ["workout_session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      program_weeks: {
        Row: {
          alternative_options: Json | null
          coaching_notes: string | null
          created_at: string
          description: string | null
          id: string
          intensity_target: number | null
          is_deload_week: boolean
          is_test_week: boolean
          name: string | null
          phase_id: string | null
          planned_sessions: number
          preparation_notes: string | null
          program_id: string
          rest_days: number | null
          scaling_options: Json | null
          updated_at: string
          user_instructions: string | null
          volume_target: string | null
          week_number: number
        }
        Insert: {
          alternative_options?: Json | null
          coaching_notes?: string | null
          created_at?: string
          description?: string | null
          id?: string
          intensity_target?: number | null
          is_deload_week?: boolean
          is_test_week?: boolean
          name?: string | null
          phase_id?: string | null
          planned_sessions: number
          preparation_notes?: string | null
          program_id: string
          rest_days?: number | null
          scaling_options?: Json | null
          updated_at?: string
          user_instructions?: string | null
          volume_target?: string | null
          week_number: number
        }
        Update: {
          alternative_options?: Json | null
          coaching_notes?: string | null
          created_at?: string
          description?: string | null
          id?: string
          intensity_target?: number | null
          is_deload_week?: boolean
          is_test_week?: boolean
          name?: string | null
          phase_id?: string | null
          planned_sessions?: number
          preparation_notes?: string | null
          program_id?: string
          rest_days?: number | null
          scaling_options?: Json | null
          updated_at?: string
          user_instructions?: string | null
          volume_target?: string | null
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "program_weeks_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "program_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_weeks_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      program_workouts: {
        Row: {
          created_at: string
          day_of_week: number
          difficulty_override: number | null
          estimated_duration: number | null
          id: string
          post_session_notes: string | null
          pre_session_notes: string | null
          program_id: string
          recovery_protocols: string | null
          scaling_instructions: string | null
          session_order: number
          session_priority: string
          session_type: string
          substitution_options: Json | null
          updated_at: string
          week_id: string
          workout_id: string | null
          workout_modifications: Json | null
        }
        Insert: {
          created_at?: string
          day_of_week: number
          difficulty_override?: number | null
          estimated_duration?: number | null
          id?: string
          post_session_notes?: string | null
          pre_session_notes?: string | null
          program_id: string
          recovery_protocols?: string | null
          scaling_instructions?: string | null
          session_order?: number
          session_priority?: string
          session_type?: string
          substitution_options?: Json | null
          updated_at?: string
          week_id: string
          workout_id?: string | null
          workout_modifications?: Json | null
        }
        Update: {
          created_at?: string
          day_of_week?: number
          difficulty_override?: number | null
          estimated_duration?: number | null
          id?: string
          post_session_notes?: string | null
          pre_session_notes?: string | null
          program_id?: string
          recovery_protocols?: string | null
          scaling_instructions?: string | null
          session_order?: number
          session_priority?: string
          session_type?: string
          substitution_options?: Json | null
          updated_at?: string
          week_id?: string
          workout_id?: string | null
          workout_modifications?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "program_workouts_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_workouts_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "program_weeks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_workouts_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          ai_model: string | null
          ai_provider: string | null
          archived_at: string | null
          attribution: string | null
          average_rating: number | null
          completion_rate: number | null
          contraindications: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty_level: number
          duration_weeks: number
          equipment_requirements: string[] | null
          estimated_session_duration: number | null
          generation_params: Json | null
          generation_prompt: string | null
          id: string
          is_ai_generated: boolean
          is_public: boolean
          is_template: boolean
          license: string | null
          name: string
          periodization_config: Json | null
          periodization_model: Database["public"]["Enums"]["periodization_model"]
          prerequisites: Json | null
          primary_goals: string[]
          program_type: string
          published_at: string | null
          secondary_goals: string[] | null
          sessions_per_week: number
          space_requirements: string[] | null
          special_considerations: string | null
          summary: string | null
          tags: string[] | null
          target_population: string[] | null
          template_category: string | null
          total_enrollments: number
          updated_at: string
          version: number
        }
        Insert: {
          ai_model?: string | null
          ai_provider?: string | null
          archived_at?: string | null
          attribution?: string | null
          average_rating?: number | null
          completion_rate?: number | null
          contraindications?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: number
          duration_weeks: number
          equipment_requirements?: string[] | null
          estimated_session_duration?: number | null
          generation_params?: Json | null
          generation_prompt?: string | null
          id?: string
          is_ai_generated?: boolean
          is_public?: boolean
          is_template?: boolean
          license?: string | null
          name: string
          periodization_config?: Json | null
          periodization_model?: Database["public"]["Enums"]["periodization_model"]
          prerequisites?: Json | null
          primary_goals?: string[]
          program_type?: string
          published_at?: string | null
          secondary_goals?: string[] | null
          sessions_per_week: number
          space_requirements?: string[] | null
          special_considerations?: string | null
          summary?: string | null
          tags?: string[] | null
          target_population?: string[] | null
          template_category?: string | null
          total_enrollments?: number
          updated_at?: string
          version?: number
        }
        Update: {
          ai_model?: string | null
          ai_provider?: string | null
          archived_at?: string | null
          attribution?: string | null
          average_rating?: number | null
          completion_rate?: number | null
          contraindications?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: number
          duration_weeks?: number
          equipment_requirements?: string[] | null
          estimated_session_duration?: number | null
          generation_params?: Json | null
          generation_prompt?: string | null
          id?: string
          is_ai_generated?: boolean
          is_public?: boolean
          is_template?: boolean
          license?: string | null
          name?: string
          periodization_config?: Json | null
          periodization_model?: Database["public"]["Enums"]["periodization_model"]
          prerequisites?: Json | null
          primary_goals?: string[]
          program_type?: string
          published_at?: string | null
          secondary_goals?: string[] | null
          sessions_per_week?: number
          space_requirements?: string[] | null
          special_considerations?: string | null
          summary?: string | null
          tags?: string[] | null
          target_population?: string[] | null
          template_category?: string | null
          total_enrollments?: number
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "programs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      push_queue: {
        Row: {
          attempts: number | null
          created_at: string | null
          error_details: Json | null
          id: string
          notification_id: string
          sent_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          error_details?: Json | null
          id?: string
          notification_id: string
          sent_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          error_details?: Json | null
          id?: string
          notification_id?: string
          sent_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_queue_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          id: string
          reason: string | null
          reporter_id: string
          target_id: string
          target_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason?: string | null
          reporter_id: string
          target_id: string
          target_type: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string | null
          reporter_id?: string
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      session_exercises: {
        Row: {
          calories_burned: number | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          distance_meters: number | null
          duration_seconds: number | null
          id: string
          max_heart_rate: number | null
          modification_notes: string | null
          modified: boolean | null
          reps_completed: number[] | null
          session_id: string
          sets_completed: number | null
          skipped: boolean | null
          started_at: string | null
          weight_used_kg: number[] | null
          workout_exercise_id: string
        }
        Insert: {
          calories_burned?: number | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          distance_meters?: number | null
          duration_seconds?: number | null
          id?: string
          max_heart_rate?: number | null
          modification_notes?: string | null
          modified?: boolean | null
          reps_completed?: number[] | null
          session_id: string
          sets_completed?: number | null
          skipped?: boolean | null
          started_at?: string | null
          weight_used_kg?: number[] | null
          workout_exercise_id: string
        }
        Update: {
          calories_burned?: number | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          distance_meters?: number | null
          duration_seconds?: number | null
          id?: string
          max_heart_rate?: number | null
          modification_notes?: string | null
          modified?: boolean | null
          reps_completed?: number[] | null
          session_id?: string
          sets_completed?: number | null
          skipped?: boolean | null
          started_at?: string | null
          weight_used_kg?: number[] | null
          workout_exercise_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_exercises_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_exercises_set_exercise_id_fkey"
            columns: ["workout_exercise_id"]
            isOneToOne: false
            referencedRelation: "set_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      set_exercises: {
        Row: {
          cluster_rest: number | null
          coaching_cues: string[] | null
          created_at: string | null
          exercise_id: string
          id: string
          intensity_percentage: number | null
          isometric_holds: Json | null
          modifications: Json | null
          order_in_set: number
          parameter_type: Database["public"]["Enums"]["parameter_type"]
          range_of_motion:
            | Database["public"]["Enums"]["rom_specification"]
            | null
          rest_before: number | null
          set_id: string
          target_range_max: number | null
          target_range_min: number | null
          target_value: number | null
          tempo: string | null
          time_cap: number | null
          updated_at: string | null
        }
        Insert: {
          cluster_rest?: number | null
          coaching_cues?: string[] | null
          created_at?: string | null
          exercise_id: string
          id?: string
          intensity_percentage?: number | null
          isometric_holds?: Json | null
          modifications?: Json | null
          order_in_set: number
          parameter_type: Database["public"]["Enums"]["parameter_type"]
          range_of_motion?:
            | Database["public"]["Enums"]["rom_specification"]
            | null
          rest_before?: number | null
          set_id: string
          target_range_max?: number | null
          target_range_min?: number | null
          target_value?: number | null
          tempo?: string | null
          time_cap?: number | null
          updated_at?: string | null
        }
        Update: {
          cluster_rest?: number | null
          coaching_cues?: string[] | null
          created_at?: string | null
          exercise_id?: string
          id?: string
          intensity_percentage?: number | null
          isometric_holds?: Json | null
          modifications?: Json | null
          order_in_set?: number
          parameter_type?: Database["public"]["Enums"]["parameter_type"]
          range_of_motion?:
            | Database["public"]["Enums"]["rom_specification"]
            | null
          rest_before?: number | null
          set_id?: string
          target_range_max?: number | null
          target_range_min?: number | null
          target_value?: number | null
          tempo?: string | null
          time_cap?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "set_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "set_exercises_set_id_fkey"
            columns: ["set_id"]
            isOneToOne: false
            referencedRelation: "sets"
            referencedColumns: ["id"]
          },
        ]
      }
      sets: {
        Row: {
          coaching_notes: string[] | null
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty_level: number | null
          id: string
          instructions: string | null
          is_template: boolean | null
          name: string | null
          rest_after_set: number | null
          rest_between_exercises: number | null
          rest_between_rounds: number | null
          rounds: number
          score_method: Database["public"]["Enums"]["score_method"] | null
          target_rounds: number | null
          time_domain: number | null
          type: Database["public"]["Enums"]["set_type"]
          updated_at: string | null
        }
        Insert: {
          coaching_notes?: string[] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          id?: string
          instructions?: string | null
          is_template?: boolean | null
          name?: string | null
          rest_after_set?: number | null
          rest_between_exercises?: number | null
          rest_between_rounds?: number | null
          rounds?: number
          score_method?: Database["public"]["Enums"]["score_method"] | null
          target_rounds?: number | null
          time_domain?: number | null
          type: Database["public"]["Enums"]["set_type"]
          updated_at?: string | null
        }
        Update: {
          coaching_notes?: string[] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          id?: string
          instructions?: string | null
          is_template?: boolean | null
          name?: string | null
          rest_after_set?: number | null
          rest_between_exercises?: number | null
          rest_between_rounds?: number | null
          rounds?: number
          score_method?: Database["public"]["Enums"]["score_method"] | null
          target_rounds?: number | null
          time_domain?: number | null
          type?: Database["public"]["Enums"]["set_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      user_disciplines: {
        Row: {
          created_at: string | null
          discipline_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          discipline_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          discipline_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_disciplines_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_disciplines_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_program_enrollments: {
        Row: {
          actual_completion_date: string | null
          adherence_rate: number | null
          coach_notes: string | null
          created_at: string
          current_phase_id: string | null
          current_week: number
          enrollment_date: string
          id: string
          last_paused_at: string | null
          pause_reason: string | null
          personal_modifications: Json | null
          program_id: string
          progression_rate: number | null
          satisfaction_rating: number | null
          sessions_completed: number
          sessions_skipped: number
          start_date: string
          status: Database["public"]["Enums"]["program_status"]
          target_completion_date: string | null
          total_paused_days: number | null
          updated_at: string
          user_goals: Json | null
          user_id: string
          weeks_completed: number
        }
        Insert: {
          actual_completion_date?: string | null
          adherence_rate?: number | null
          coach_notes?: string | null
          created_at?: string
          current_phase_id?: string | null
          current_week?: number
          enrollment_date?: string
          id?: string
          last_paused_at?: string | null
          pause_reason?: string | null
          personal_modifications?: Json | null
          program_id: string
          progression_rate?: number | null
          satisfaction_rating?: number | null
          sessions_completed?: number
          sessions_skipped?: number
          start_date?: string
          status?: Database["public"]["Enums"]["program_status"]
          target_completion_date?: string | null
          total_paused_days?: number | null
          updated_at?: string
          user_goals?: Json | null
          user_id: string
          weeks_completed?: number
        }
        Update: {
          actual_completion_date?: string | null
          adherence_rate?: number | null
          coach_notes?: string | null
          created_at?: string
          current_phase_id?: string | null
          current_week?: number
          enrollment_date?: string
          id?: string
          last_paused_at?: string | null
          pause_reason?: string | null
          personal_modifications?: Json | null
          program_id?: string
          progression_rate?: number | null
          satisfaction_rating?: number | null
          sessions_completed?: number
          sessions_skipped?: number
          start_date?: string
          status?: Database["public"]["Enums"]["program_status"]
          target_completion_date?: string | null
          total_paused_days?: number | null
          updated_at?: string
          user_goals?: Json | null
          user_id?: string
          weeks_completed?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_program_enrollments_current_phase_id_fkey"
            columns: ["current_phase_id"]
            isOneToOne: false
            referencedRelation: "program_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_program_enrollments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_program_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_push_tokens: {
        Row: {
          created_at: string | null
          device_info: Json | null
          expo_push_token: string
          id: string
          last_used_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          expo_push_token: string
          id?: string
          last_used_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          expo_push_token?: string
          id?: string
          last_used_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          ai_generation_reset_date: string | null
          ai_generations_limit: number | null
          ai_generations_used: number | null
          cancelled_at: string | null
          created_at: string | null
          current_period_end: string
          current_period_start: string
          expires_at: string | null
          id: string
          is_trial_used: boolean | null
          platform: string | null
          product_id: string
          revenuecat_customer_id: string | null
          started_at: string
          status: string
          store_transaction_id: string | null
          subscription_tier: string | null
          trial_end: string | null
          trial_start: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_generation_reset_date?: string | null
          ai_generations_limit?: number | null
          ai_generations_used?: number | null
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end: string
          current_period_start: string
          expires_at?: string | null
          id?: string
          is_trial_used?: boolean | null
          platform?: string | null
          product_id: string
          revenuecat_customer_id?: string | null
          started_at: string
          status: string
          store_transaction_id?: string | null
          subscription_tier?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_generation_reset_date?: string | null
          ai_generations_limit?: number | null
          ai_generations_used?: number | null
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end?: string
          current_period_start?: string
          expires_at?: string | null
          id?: string
          is_trial_used?: boolean | null
          platform?: string | null
          product_id?: string
          revenuecat_customer_id?: string | null
          started_at?: string
          status?: string
          store_transaction_id?: string | null
          subscription_tier?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_workout_preferences: {
        Row: {
          created_at: string | null
          excluded_exercises: string[] | null
          excluded_muscle_groups: string[] | null
          fitness_goals: string[] | null
          fitness_level: string | null
          id: string
          injuries: string[] | null
          instruction_detail_level: string | null
          medical_conditions: string[] | null
          mobility_restrictions: Json | null
          preferred_difficulty: number | null
          preferred_equipment: string[] | null
          preferred_workout_days: number[] | null
          preferred_workout_duration: number | null
          preferred_workout_times: string[] | null
          preferred_workout_types: string[] | null
          updated_at: string | null
          user_id: string
          variety_preference: number | null
          workouts_per_week: number | null
        }
        Insert: {
          created_at?: string | null
          excluded_exercises?: string[] | null
          excluded_muscle_groups?: string[] | null
          fitness_goals?: string[] | null
          fitness_level?: string | null
          id?: string
          injuries?: string[] | null
          instruction_detail_level?: string | null
          medical_conditions?: string[] | null
          mobility_restrictions?: Json | null
          preferred_difficulty?: number | null
          preferred_equipment?: string[] | null
          preferred_workout_days?: number[] | null
          preferred_workout_duration?: number | null
          preferred_workout_times?: string[] | null
          preferred_workout_types?: string[] | null
          updated_at?: string | null
          user_id: string
          variety_preference?: number | null
          workouts_per_week?: number | null
        }
        Update: {
          created_at?: string | null
          excluded_exercises?: string[] | null
          excluded_muscle_groups?: string[] | null
          fitness_goals?: string[] | null
          fitness_level?: string | null
          id?: string
          injuries?: string[] | null
          instruction_detail_level?: string | null
          medical_conditions?: string[] | null
          mobility_restrictions?: Json | null
          preferred_difficulty?: number | null
          preferred_equipment?: string[] | null
          preferred_workout_days?: number[] | null
          preferred_workout_duration?: number | null
          preferred_workout_times?: string[] | null
          preferred_workout_types?: string[] | null
          updated_at?: string | null
          user_id?: string
          variety_preference?: number | null
          workouts_per_week?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          bio: string | null
          birth_year: number | null
          city: string | null
          created_at: string | null
          email: string
          fitness_level: string | null
          id: string
          last_notification_read_at: string | null
          marketing_email_opt_in: boolean
          marketing_email_opt_in_at: string | null
          name: string | null
          partner_offers_opt_in: boolean
          partner_offers_opt_in_at: string | null
          profile_picture_url: string | null
          pseudo: string | null
          state: string | null
          terms_accepted_at: string | null
          terms_version: string | null
          unread_notifications_count: number | null
          unsubscribe_token: string
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          birth_year?: number | null
          city?: string | null
          created_at?: string | null
          email: string
          fitness_level?: string | null
          id?: string
          last_notification_read_at?: string | null
          marketing_email_opt_in?: boolean
          marketing_email_opt_in_at?: string | null
          name?: string | null
          partner_offers_opt_in?: boolean
          partner_offers_opt_in_at?: string | null
          profile_picture_url?: string | null
          pseudo?: string | null
          state?: string | null
          terms_accepted_at?: string | null
          terms_version?: string | null
          unread_notifications_count?: number | null
          unsubscribe_token?: string
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          birth_year?: number | null
          city?: string | null
          created_at?: string | null
          email?: string
          fitness_level?: string | null
          id?: string
          last_notification_read_at?: string | null
          marketing_email_opt_in?: boolean
          marketing_email_opt_in_at?: string | null
          name?: string | null
          partner_offers_opt_in?: boolean
          partner_offers_opt_in_at?: string | null
          profile_picture_url?: string | null
          pseudo?: string | null
          state?: string | null
          terms_accepted_at?: string | null
          terms_version?: string | null
          unread_notifications_count?: number | null
          unsubscribe_token?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      website_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      workout_likes: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          workout_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          workout_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          workout_id?: string
        }
        Relationships: []
      }
      workout_sessions: {
        Row: {
          average_heart_rate: number | null
          calories_burned: number | null
          completed_at: string | null
          completion_percentage: number | null
          created_at: string | null
          device_info: Json | null
          difficulty_rating: number | null
          duration_seconds: number | null
          enjoyment_rating: number | null
          id: string
          location_id: string | null
          max_heart_rate: number | null
          notes: string | null
          performed_at_coordinates: unknown
          started_at: string
          status: string
          updated_at: string | null
          user_id: string
          workout_id: string
        }
        Insert: {
          average_heart_rate?: number | null
          calories_burned?: number | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          device_info?: Json | null
          difficulty_rating?: number | null
          duration_seconds?: number | null
          enjoyment_rating?: number | null
          id?: string
          location_id?: string | null
          max_heart_rate?: number | null
          notes?: string | null
          performed_at_coordinates?: unknown
          started_at?: string
          status?: string
          updated_at?: string | null
          user_id: string
          workout_id: string
        }
        Update: {
          average_heart_rate?: number | null
          calories_burned?: number | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          device_info?: Json | null
          difficulty_rating?: number | null
          duration_seconds?: number | null
          enjoyment_rating?: number | null
          id?: string
          location_id?: string | null
          max_heart_rate?: number | null
          notes?: string | null
          performed_at_coordinates?: unknown
          started_at?: string
          status?: string
          updated_at?: string | null
          user_id?: string
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sessions_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sets: {
        Row: {
          created_at: string | null
          id: string
          order_in_phase: number
          phase: Database["public"]["Enums"]["workout_phase"]
          phase_modifications: Json | null
          set_id: string
          transition_notes: string | null
          workout_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_in_phase: number
          phase: Database["public"]["Enums"]["workout_phase"]
          phase_modifications?: Json | null
          set_id: string
          transition_notes?: string | null
          workout_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          order_in_phase?: number
          phase?: Database["public"]["Enums"]["workout_phase"]
          phase_modifications?: Json | null
          set_id?: string
          transition_notes?: string | null
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_sets_set_id_fkey"
            columns: ["set_id"]
            isOneToOne: false
            referencedRelation: "sets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sets_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_shares: {
        Row: {
          allow_copy: boolean | null
          allow_modify: boolean | null
          club_id: string | null
          expires_at: string | null
          id: string
          location_id: string | null
          message: string | null
          share_type: string | null
          shared_at: string | null
          shared_by: string
          workout_id: string
        }
        Insert: {
          allow_copy?: boolean | null
          allow_modify?: boolean | null
          club_id?: string | null
          expires_at?: string | null
          id?: string
          location_id?: string | null
          message?: string | null
          share_type?: string | null
          shared_at?: string | null
          shared_by: string
          workout_id: string
        }
        Update: {
          allow_copy?: boolean | null
          allow_modify?: boolean | null
          club_id?: string | null
          expires_at?: string | null
          id?: string
          location_id?: string | null
          message?: string | null
          share_type?: string | null
          shared_at?: string | null
          shared_by?: string
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_shares_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_shares_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_template_exercises: {
        Row: {
          created_at: string | null
          duration_seconds: number | null
          exercise_id: string | null
          id: string
          notes: string | null
          order_index: number
          reps: number | null
          rest_seconds: number | null
          sets: number | null
          template_id: string | null
        }
        Insert: {
          created_at?: string | null
          duration_seconds?: number | null
          exercise_id?: string | null
          id?: string
          notes?: string | null
          order_index: number
          reps?: number | null
          rest_seconds?: number | null
          sets?: number | null
          template_id?: string | null
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number | null
          exercise_id?: string | null
          id?: string
          notes?: string | null
          order_index?: number
          reps?: number | null
          rest_seconds?: number | null
          sets?: number | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_template_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_template_exercises_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "workout_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_templates: {
        Row: {
          author_id: string | null
          average_rating: number | null
          base_workout_data: Json
          category: string
          created_at: string | null
          customization_options: Json | null
          description: string | null
          id: string
          is_official: boolean | null
          is_premium: boolean | null
          name: string
          tags: string[] | null
          times_used: number | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          average_rating?: number | null
          base_workout_data: Json
          category: string
          created_at?: string | null
          customization_options?: Json | null
          description?: string | null
          id?: string
          is_official?: boolean | null
          is_premium?: boolean | null
          name: string
          tags?: string[] | null
          times_used?: number | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          average_rating?: number | null
          base_workout_data?: Json
          category?: string
          created_at?: string | null
          customization_options?: Json | null
          description?: string | null
          id?: string
          is_official?: boolean | null
          is_premium?: boolean | null
          name?: string
          tags?: string[] | null
          times_used?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      workouts: {
        Row: {
          ai_completion_tokens: number | null
          ai_generation_params: Json | null
          ai_model: string | null
          ai_prompt_tokens: number | null
          ai_provider: string | null
          average_rating: number | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          difficulty_level: number | null
          energy_system: Database["public"]["Enums"]["energy_system"][] | null
          equipment_needed: string[] | null
          estimated_duration: number | null
          focus_areas: Database["public"]["Enums"]["focus_area"][] | null
          id: string
          is_ai_generated: boolean | null
          is_public: boolean | null
          is_template: boolean | null
          likes_count: number | null
          name: string
          primary_adaptations:
            | Database["public"]["Enums"]["adaptation_type"][]
            | null
          share_token: string | null
          space_requirements:
            | Database["public"]["Enums"]["space_requirement"]
            | null
          tags: string[] | null
          times_completed: number | null
          training_style: Database["public"]["Enums"]["training_style"] | null
          type: Database["public"]["Enums"]["workout_type"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_completion_tokens?: number | null
          ai_generation_params?: Json | null
          ai_model?: string | null
          ai_prompt_tokens?: number | null
          ai_provider?: string | null
          average_rating?: number | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          difficulty_level?: number | null
          energy_system?: Database["public"]["Enums"]["energy_system"][] | null
          equipment_needed?: string[] | null
          estimated_duration?: number | null
          focus_areas?: Database["public"]["Enums"]["focus_area"][] | null
          id?: string
          is_ai_generated?: boolean | null
          is_public?: boolean | null
          is_template?: boolean | null
          likes_count?: number | null
          name: string
          primary_adaptations?:
            | Database["public"]["Enums"]["adaptation_type"][]
            | null
          share_token?: string | null
          space_requirements?:
            | Database["public"]["Enums"]["space_requirement"]
            | null
          tags?: string[] | null
          times_completed?: number | null
          training_style?: Database["public"]["Enums"]["training_style"] | null
          type: Database["public"]["Enums"]["workout_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_completion_tokens?: number | null
          ai_generation_params?: Json | null
          ai_model?: string | null
          ai_prompt_tokens?: number | null
          ai_provider?: string | null
          average_rating?: number | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          difficulty_level?: number | null
          energy_system?: Database["public"]["Enums"]["energy_system"][] | null
          equipment_needed?: string[] | null
          estimated_duration?: number | null
          focus_areas?: Database["public"]["Enums"]["focus_area"][] | null
          id?: string
          is_ai_generated?: boolean | null
          is_public?: boolean | null
          is_template?: boolean | null
          likes_count?: number | null
          name?: string
          primary_adaptations?:
            | Database["public"]["Enums"]["adaptation_type"][]
            | null
          share_token?: string | null
          space_requirements?:
            | Database["public"]["Enums"]["space_requirement"]
            | null
          tags?: string[] | null
          times_completed?: number | null
          training_style?: Database["public"]["Enums"]["training_style"] | null
          type?: Database["public"]["Enums"]["workout_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      workouts_backup: {
        Row: {
          ai_model: string | null
          ai_provider: string | null
          average_rating: number | null
          club_id: string | null
          completion_tokens: number | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          difficulty_level: number | null
          estimated_calories: number | null
          estimated_duration: number | null
          generation_params: Json | null
          id: string | null
          is_ai_generated: boolean | null
          is_public: boolean | null
          is_template: boolean | null
          likes_count: number | null
          location_id: string | null
          name: string | null
          prompt_tokens: number | null
          share_token: string | null
          tags: string[] | null
          times_completed: number | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_model?: string | null
          ai_provider?: string | null
          average_rating?: number | null
          club_id?: string | null
          completion_tokens?: number | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          difficulty_level?: number | null
          estimated_calories?: number | null
          estimated_duration?: number | null
          generation_params?: Json | null
          id?: string | null
          is_ai_generated?: boolean | null
          is_public?: boolean | null
          is_template?: boolean | null
          likes_count?: number | null
          location_id?: string | null
          name?: string | null
          prompt_tokens?: number | null
          share_token?: string | null
          tags?: string[] | null
          times_completed?: number | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_model?: string | null
          ai_provider?: string | null
          average_rating?: number | null
          club_id?: string | null
          completion_tokens?: number | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          difficulty_level?: number | null
          estimated_calories?: number | null
          estimated_duration?: number | null
          generation_params?: Json | null
          id?: string | null
          is_ai_generated?: boolean | null
          is_public?: boolean | null
          is_template?: boolean | null
          likes_count?: number | null
          location_id?: string | null
          name?: string | null
          prompt_tokens?: number | null
          share_token?: string | null
          tags?: string[] | null
          times_completed?: number | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      backfill_push_queue: {
        Args: never
        Returns: {
          notifications_processed: number
          queue_items_created: number
        }[]
      }
      calculate_workout_stats: {
        Args: { workout_id_param: string }
        Returns: {
          estimated_volume: number
          muscle_groups_targeted: string[]
          total_exercises: number
        }[]
      }
      cleanup_old_push_tokens: { Args: never; Returns: undefined }
      create_event_approval_request_notification: {
        Args: {
          p_event_id: string
          p_event_participant_id: string
          p_requester_id: string
        }
        Returns: undefined
      }
      create_event_cancelled_notification: {
        Args: { p_canceller_id: string; p_event_id: string }
        Returns: undefined
      }
      create_event_created_notification: {
        Args: { p_creator_id: string; p_event_id: string }
        Returns: undefined
      }
      create_event_participant_joined_notification: {
        Args: {
          p_event_id: string
          p_event_participant_id: string
          p_participant_id: string
        }
        Returns: undefined
      }
      create_event_updated_notification: {
        Args: { p_event_id: string; p_updater_id: string }
        Returns: undefined
      }
      create_membership_request_notification: {
        Args: { p_club_id: string; p_requester_id: string }
        Returns: undefined
      }
      create_membership_status_notification: {
        Args: {
          p_actor_id: string
          p_club_id: string
          p_member_id: string
          p_status: string
        }
        Returns: undefined
      }
      create_new_comment_notification: {
        Args: {
          p_comment_id: string
          p_commenter_id: string
          p_post_id: string
        }
        Returns: undefined
      }
      create_new_post_notification: {
        Args: { p_author_id: string; p_club_id: string; p_post_id: string }
        Returns: undefined
      }
      create_role_change_notification: {
        Args: {
          p_actor_id: string
          p_club_id: string
          p_member_id: string
          p_new_role: string
          p_old_role: string
        }
        Returns: undefined
      }
      create_straight_set: {
        Args: {
          exercise_id_param: string
          reps_target: number
          rest_seconds: number
          set_name: string
          sets_count: number
          user_id: string
        }
        Returns: string
      }
      create_superset: {
        Args: {
          exercise_ids: string[]
          exercise_targets: number[]
          rest_between_exercises: number
          rest_between_rounds: number
          set_name: string
          sets_count: number
          user_id: string
        }
        Returns: string
      }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      extract_club_id_from_path: { Args: { path: string }; Returns: string }
      extract_event_id_from_path: { Args: { path: string }; Returns: string }
      extract_user_id_from_path: { Args: { path: string }; Returns: string }
      find_exercises_by_criteria: {
        Args: {
          category_param?: Database["public"]["Enums"]["exercise_category"]
          difficulty_max?: number
          difficulty_min?: number
          movement_pattern_param?: Database["public"]["Enums"]["movement_pattern"]
          muscle_groups_param?: Database["public"]["Enums"]["muscle_group"][]
        }
        Returns: {
          category: Database["public"]["Enums"]["exercise_category"]
          difficulty_level: number
          exercise_id: string
          movement_pattern: Database["public"]["Enums"]["movement_pattern"]
          name: string
          primary_muscles: Database["public"]["Enums"]["muscle_group"][]
        }[]
      }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_club_image_url: {
        Args: { club_id: string; filename: string }
        Returns: string
      }
      get_discipline_name: {
        Args: { disc_name: string; disc_name_fr: string; locale?: string }
        Returns: string
      }
      get_equipment_name: {
        Args: { eq_name: string; eq_name_fr: string; locale?: string }
        Returns: string
      }
      get_exercise_progressions: {
        Args: {
          exercise_id_param: string
          progression_type_param?: Database["public"]["Enums"]["progression_type"]
        }
        Returns: {
          difficulty_gap: number
          estimated_transition_time: number
          mastery_criteria: string
          progression_id: string
          progression_type: Database["public"]["Enums"]["progression_type"]
          target_exercise_id: string
          target_exercise_name: string
          transition_requirements: string
        }[]
      }
      get_locations_count: { Args: never; Returns: number }
      get_nearby_locations: {
        Args: { limit_count?: number; user_lat: number; user_lng: number }
        Returns: {
          address: string
          average_rating: number
          created_at: string
          created_by: string
          description: string
          distance_km: number
          id: string
          is_open_24h: boolean
          latitude: number
          longitude: number
          metadata: Json
          name: string
          opening_hours: Json
          rating_count: number
          updated_at: string
        }[]
      }
      get_or_create_discipline: {
        Args: { discipline_name: string }
        Returns: string
      }
      get_or_create_equipment: {
        Args: { equipment_name: string }
        Returns: string
      }
      get_post_image_url: {
        Args: { club_id: string; filename: string; post_id: string }
        Returns: string
      }
      get_recommended_exercises_for_level: {
        Args: {
          category_filter?: Database["public"]["Enums"]["exercise_category"]
          limit_count?: number
          user_fitness_level: number
        }
        Returns: {
          category: Database["public"]["Enums"]["exercise_category"]
          description: string
          difficulty_level: number
          exercise_id: string
          name: string
          parameter_type: Database["public"]["Enums"]["parameter_type"]
          popularity_score: number
          primary_muscles: Database["public"]["Enums"]["muscle_group"][]
        }[]
      }
      get_user_avatar_url: {
        Args: { filename: string; user_id: string }
        Returns: string
      }
      get_workout_with_sets: {
        Args: { workout_id_param: string }
        Returns: Json
      }
      gettransactionid: { Args: never; Returns: unknown }
      import_spot: { Args: { spot_data: Json }; Returns: boolean }
      increment_unread_notifications: {
        Args: { user_ids: string[] }
        Returns: undefined
      }
      is_approved_club_member: {
        Args: { p_club_id: string; p_user_id: string }
        Returns: boolean
      }
      is_club_member: {
        Args: { club_id: string; user_id: string }
        Returns: boolean
      }
      is_club_member_secure: {
        Args: { p_club_id: string; p_user_id: string }
        Returns: boolean
      }
      is_club_owner_secure: {
        Args: { p_club_id: string; p_user_id: string }
        Returns: boolean
      }
      is_club_staff: {
        Args: { club_id: string; user_id: string }
        Returns: boolean
      }
      is_club_staff_member: {
        Args: { p_club_id: string; p_user_id: string }
        Returns: boolean
      }
      is_duplicate_location: {
        Args: { p_lat: number; p_lng: number; p_source_id: string }
        Returns: boolean
      }
      is_event_participant: {
        Args: { event_id: string; user_id: string }
        Returns: boolean
      }
      longtransactionsenabled: { Args: never; Returns: boolean }
      migrate_existing_workouts: { Args: never; Returns: number }
      migrate_legacy_ratings: { Args: never; Returns: number }
      normalize_equipment_name: { Args: { name: string }; Returns: string }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      process_staged_imports: {
        Args: never
        Returns: {
          errors: number
          skipped_duplicates: number
          successful_imports: number
          total_processed: number
        }[]
      }
      reset_failed_imports: { Args: never; Returns: number }
      rpc_approve_member: {
        Args: { p_membership_id: string }
        Returns: undefined
      }
      rpc_change_member_role: {
        Args: {
          p_club_id: string
          p_member_user_id: string
          p_new_role: string
        }
        Returns: undefined
      }
      rpc_create_club: {
        Args: {
          p_category: string
          p_cover_image_url?: string
          p_description: string
          p_linked_spot_ids?: string[]
          p_name: string
          p_privacy: string
          p_rules?: string
          p_tags?: string[]
        }
        Returns: string
      }
      rpc_get_club_with_details: {
        Args: { p_club_id: string }
        Returns: {
          category: string
          cover_image_url: string
          created_at: string
          created_by: string
          current_user_role: string
          current_user_status: string
          description: string
          id: string
          linked_locations: Json
          member_count: number
          name: string
          privacy: string
          rules: string
          tags: string[]
          updated_at: string
        }[]
      }
      rpc_kick_member: {
        Args: { p_club_id: string; p_member_user_id: string }
        Returns: undefined
      }
      rpc_leave_club: { Args: { p_club_id: string }; Returns: undefined }
      rpc_reject_member: {
        Args: { p_membership_id: string }
        Returns: undefined
      }
      rpc_request_club_membership: {
        Args: { p_club_id: string }
        Returns: string
      }
      rpc_transfer_ownership: {
        Args: { p_club_id: string; p_new_owner_user_id: string }
        Returns: undefined
      }
      rpc_update_club: {
        Args: {
          p_category?: string
          p_club_id: string
          p_cover_image_url?: string
          p_description?: string
          p_linked_spot_ids?: string[]
          p_name?: string
          p_privacy?: string
          p_rules?: string
          p_tags?: string[]
        }
        Returns: string
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
      unsubscribe_marketing: {
        Args: { p_token: string; p_type?: string }
        Returns: boolean
      }
      update_enrollment_progress_manual: {
        Args: { p_enrollment_id: string }
        Returns: Json
      }
      update_location_rating: {
        Args: { location_id_param: string }
        Returns: undefined
      }
      update_push_token_last_used: {
        Args: { p_token: string }
        Returns: undefined
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
      validate_enrollment_progress: {
        Args: never
        Returns: {
          adherence_rate: number
          current_week: number
          enrollment_id: string
          is_valid: boolean
          issues: string[]
          program_name: string
          sessions_completed: number
          sessions_expected: number
          user_name: string
          weeks_completed: number
        }[]
      }
      validate_set_structure: {
        Args: { set_id_param: string }
        Returns: boolean
      }
      verify_club_storage_setup: {
        Args: never
        Returns: {
          club_members_table_exists: boolean
          is_club_member_function_exists: boolean
          is_club_staff_function_exists: boolean
          storage_policies_count: number
        }[]
      }
    }
    Enums: {
      adaptation_type:
        | "strength"
        | "hypertrophy"
        | "power"
        | "endurance"
        | "flexibility"
        | "skill"
        | "coordination"
      contraindication:
        | "shoulder_injury"
        | "back_injury"
        | "knee_injury"
        | "wrist_injury"
        | "pregnancy"
        | "hypertension"
        | "heart_condition"
      energy_system: "phosphocreatine" | "glycolytic" | "oxidative" | "mixed"
      equipment_requirement_type:
        | "required"
        | "recommended"
        | "optional"
        | "alternative"
      exercise_category:
        | "upper_pulling"
        | "upper_pushing"
        | "core_statics"
        | "lower_body"
        | "dynamics"
        | "cardio"
        | "flexibility"
      focus_area:
        | "upper_push"
        | "upper_pull"
        | "lower_body"
        | "core"
        | "cardio"
        | "skill"
        | "full_body"
        | "flexibility"
      force_vector:
        | "vertical_up"
        | "vertical_down"
        | "horizontal_push"
        | "horizontal_pull"
        | "diagonal"
        | "rotational"
      injury_risk:
        | "shoulder_impingement"
        | "lower_back_strain"
        | "knee_stress"
        | "wrist_strain"
        | "neck_strain"
        | "ankle_sprain"
      joint_action:
        | "flexion"
        | "extension"
        | "abduction"
        | "adduction"
        | "rotation"
        | "circumduction"
        | "stabilization"
      movement_pattern:
        | "push"
        | "pull"
        | "squat"
        | "hinge"
        | "lunge"
        | "carry"
        | "twist"
        | "locomotion"
        | "isometric"
      muscle_group:
        | "chest"
        | "back"
        | "shoulders"
        | "biceps"
        | "triceps"
        | "forearms"
        | "quadriceps"
        | "hamstrings"
        | "glutes"
        | "calves"
        | "abs"
        | "obliques"
        | "lower_back"
        | "upper_back"
      muscle_involvement_type: "primary" | "secondary" | "stabilizer"
      parameter_type: "reps" | "time" | "distance" | "max_effort" | "heart_rate"
      periodization_model:
        | "linear"
        | "undulating"
        | "block"
        | "conjugate"
        | "reverse"
        | "custom"
      plane_of_motion: "sagittal" | "frontal" | "transverse"
      program_phase:
        | "preparation"
        | "build"
        | "intensification"
        | "peak"
        | "recovery"
        | "transition"
        | "custom"
      program_status:
        | "draft"
        | "active"
        | "completed"
        | "paused"
        | "cancelled"
        | "template"
      progression_type: "regression" | "progression" | "variation"
      rom_specification:
        | "full"
        | "partial"
        | "bottom_half"
        | "top_half"
        | "pulse"
      safety_level: "low" | "moderate" | "high" | "expert_only"
      score_method:
        | "total_rounds"
        | "total_reps"
        | "total_time"
        | "average_time"
        | "max_weight"
        | "distance"
      set_type:
        | "straight"
        | "superset"
        | "circuit"
        | "cluster"
        | "rest_pause"
        | "emom"
        | "tabata"
        | "density"
        | "custom"
      space_requirement: "minimal" | "standard" | "large"
      surface_type: "concrete" | "grass" | "sand" | "indoor" | "any"
      training_style:
        | "strength"
        | "hypertrophy"
        | "endurance"
        | "power"
        | "skill"
        | "conditioning"
        | "mobility"
      workout_phase: "warm_up" | "main" | "cool_down"
      workout_type:
        | "strength"
        | "cardio"
        | "flexibility"
        | "skill"
        | "mixed"
        | "recovery"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      adaptation_type: [
        "strength",
        "hypertrophy",
        "power",
        "endurance",
        "flexibility",
        "skill",
        "coordination",
      ],
      contraindication: [
        "shoulder_injury",
        "back_injury",
        "knee_injury",
        "wrist_injury",
        "pregnancy",
        "hypertension",
        "heart_condition",
      ],
      energy_system: ["phosphocreatine", "glycolytic", "oxidative", "mixed"],
      equipment_requirement_type: [
        "required",
        "recommended",
        "optional",
        "alternative",
      ],
      exercise_category: [
        "upper_pulling",
        "upper_pushing",
        "core_statics",
        "lower_body",
        "dynamics",
        "cardio",
        "flexibility",
      ],
      focus_area: [
        "upper_push",
        "upper_pull",
        "lower_body",
        "core",
        "cardio",
        "skill",
        "full_body",
        "flexibility",
      ],
      force_vector: [
        "vertical_up",
        "vertical_down",
        "horizontal_push",
        "horizontal_pull",
        "diagonal",
        "rotational",
      ],
      injury_risk: [
        "shoulder_impingement",
        "lower_back_strain",
        "knee_stress",
        "wrist_strain",
        "neck_strain",
        "ankle_sprain",
      ],
      joint_action: [
        "flexion",
        "extension",
        "abduction",
        "adduction",
        "rotation",
        "circumduction",
        "stabilization",
      ],
      movement_pattern: [
        "push",
        "pull",
        "squat",
        "hinge",
        "lunge",
        "carry",
        "twist",
        "locomotion",
        "isometric",
      ],
      muscle_group: [
        "chest",
        "back",
        "shoulders",
        "biceps",
        "triceps",
        "forearms",
        "quadriceps",
        "hamstrings",
        "glutes",
        "calves",
        "abs",
        "obliques",
        "lower_back",
        "upper_back",
      ],
      muscle_involvement_type: ["primary", "secondary", "stabilizer"],
      parameter_type: ["reps", "time", "distance", "max_effort", "heart_rate"],
      periodization_model: [
        "linear",
        "undulating",
        "block",
        "conjugate",
        "reverse",
        "custom",
      ],
      plane_of_motion: ["sagittal", "frontal", "transverse"],
      program_phase: [
        "preparation",
        "build",
        "intensification",
        "peak",
        "recovery",
        "transition",
        "custom",
      ],
      program_status: [
        "draft",
        "active",
        "completed",
        "paused",
        "cancelled",
        "template",
      ],
      progression_type: ["regression", "progression", "variation"],
      rom_specification: [
        "full",
        "partial",
        "bottom_half",
        "top_half",
        "pulse",
      ],
      safety_level: ["low", "moderate", "high", "expert_only"],
      score_method: [
        "total_rounds",
        "total_reps",
        "total_time",
        "average_time",
        "max_weight",
        "distance",
      ],
      set_type: [
        "straight",
        "superset",
        "circuit",
        "cluster",
        "rest_pause",
        "emom",
        "tabata",
        "density",
        "custom",
      ],
      space_requirement: ["minimal", "standard", "large"],
      surface_type: ["concrete", "grass", "sand", "indoor", "any"],
      training_style: [
        "strength",
        "hypertrophy",
        "endurance",
        "power",
        "skill",
        "conditioning",
        "mobility",
      ],
      workout_phase: ["warm_up", "main", "cool_down"],
      workout_type: [
        "strength",
        "cardio",
        "flexibility",
        "skill",
        "mixed",
        "recovery",
      ],
    },
  },
} as const

