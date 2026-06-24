// Hand-written Database types matching db.sql schema.
// Replace with `supabase gen types typescript` output once Supabase CLI access lands.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [k: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          pseudo: string | null
          birth_year: number | null
          created_at: string | null
          updated_at: string | null
          bio: string | null
          city: string | null
          state: string | null
          name: string | null
          profile_picture_url: string | null
          fitness_level: string | null
          unread_notifications_count: number | null
          last_notification_read_at: string | null
        }
        Insert: {
          id?: string
          email: string
          pseudo?: string | null
          birth_year?: number | null
          created_at?: string | null
          updated_at?: string | null
          bio?: string | null
          city?: string | null
          state?: string | null
          name?: string | null
          profile_picture_url?: string | null
          fitness_level?: string | null
          unread_notifications_count?: number | null
          last_notification_read_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          pseudo?: string | null
          birth_year?: number | null
          created_at?: string | null
          updated_at?: string | null
          bio?: string | null
          city?: string | null
          state?: string | null
          name?: string | null
          profile_picture_url?: string | null
          fitness_level?: string | null
          unread_notifications_count?: number | null
          last_notification_read_at?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          id: string
          name: string
          description: string | null
          latitude: number | null
          longitude: number | null
          opening_hours: Json | null
          is_open_24h: boolean | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
          address: string | null
          contributor: string | null
          rating: number | null
          city: string | null
          region: string | null
          country: string | null
          metadata: Json | null
          average_rating: number | null
          rating_count: number | null
          external_rating_count: number | null
          external_average_rating: number | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          latitude?: number | null
          longitude?: number | null
          opening_hours?: Json | null
          is_open_24h?: boolean | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
          address?: string | null
          contributor?: string | null
          rating?: number | null
          city?: string | null
          region?: string | null
          country?: string | null
          metadata?: Json | null
          average_rating?: number | null
          rating_count?: number | null
          external_rating_count?: number | null
          external_average_rating?: number | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          latitude?: number | null
          longitude?: number | null
          opening_hours?: Json | null
          is_open_24h?: boolean | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
          address?: string | null
          contributor?: string | null
          rating?: number | null
          city?: string | null
          region?: string | null
          country?: string | null
          metadata?: Json | null
          average_rating?: number | null
          rating_count?: number | null
          external_rating_count?: number | null
          external_average_rating?: number | null
        }
        Relationships: []
      }
      location_images: {
        Row: {
          id: string
          location_id: string | null
          image_url: string
          image_path: string
          image_order: number
          file_size: number | null
          mime_type: string | null
          created_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          id?: string
          location_id?: string | null
          image_url: string
          image_path: string
          image_order: number
          file_size?: number | null
          mime_type?: string | null
          created_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          id?: string
          location_id?: string | null
          image_url?: string
          image_path?: string
          image_order?: number
          file_size?: number | null
          mime_type?: string | null
          created_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      location_likes: {
        Row: {
          id: string
          location_id: string | null
          user_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          location_id?: string | null
          user_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          location_id?: string | null
          user_id?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      location_comments: {
        Row: {
          id: string
          location_id: string | null
          user_id: string | null
          content: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          location_id?: string | null
          user_id?: string | null
          content: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          location_id?: string | null
          user_id?: string | null
          content?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      equipments: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          icon_name: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
          equipment_locale_key: string
          description_locale_key: string | null
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          icon_name?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          equipment_locale_key: string
          description_locale_key?: string | null
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          icon_name?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          equipment_locale_key?: string
          description_locale_key?: string | null
        }
        Relationships: []
      }
      location_equipments: {
        Row: {
          id: string
          location_id: string
          equipment_id: string
          quantity: number | null
          condition: string | null
          notes: string | null
          added_by: string | null
          verified: boolean | null
          verified_by: string | null
          verified_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          location_id: string
          equipment_id: string
          quantity?: number | null
          condition?: string | null
          notes?: string | null
          added_by?: string | null
          verified?: boolean | null
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          location_id?: string
          equipment_id?: string
          quantity?: number | null
          condition?: string | null
          notes?: string | null
          added_by?: string | null
          verified?: boolean | null
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      disciplines: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          icon_name: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
          discipline_locale_key: string
          description_locale_key: string | null
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          icon_name?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          discipline_locale_key: string
          description_locale_key?: string | null
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          icon_name?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          discipline_locale_key?: string
          description_locale_key?: string | null
        }
        Relationships: []
      }
      location_disciplines: {
        Row: {
          id: string
          location_id: string
          discipline_id: string
          popularity_score: number | null
          notes: string | null
          added_by: string | null
          verified: boolean | null
          verified_by: string | null
          verified_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          location_id: string
          discipline_id: string
          popularity_score?: number | null
          notes?: string | null
          added_by?: string | null
          verified?: boolean | null
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          location_id?: string
          discipline_id?: string
          popularity_score?: number | null
          notes?: string | null
          added_by?: string | null
          verified?: boolean | null
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      // TODO(db-access): confirm exact columns + average_rating trigger
      location_ratings: {
        Row: {
          id: string
          location_id: string | null
          user_id: string | null
          rating: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          location_id?: string | null
          user_id?: string | null
          rating: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          location_id?: string | null
          user_id?: string | null
          rating?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
