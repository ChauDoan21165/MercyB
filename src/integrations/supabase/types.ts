export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      access_code_redemptions: {
        Row: {
          code_id: string
          id: string
          redeemed_at: string
          subscription_id: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          code_id: string
          id?: string
          redeemed_at?: string
          subscription_id?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          code_id?: string
          id?: string
          redeemed_at?: string
          subscription_id?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_code_redemptions_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "access_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_code_redemptions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_code_redemptions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      access_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string
          days: number
          expires_at: string | null
          for_user_id: string | null
          id: string
          is_active: boolean
          max_uses: number
          notes: string | null
          tier_id: string
          updated_at: string
          used_count: number
        }
        Insert: {
          code: string
          created_at?: string
          created_by: string
          days: number
          expires_at?: string | null
          for_user_id?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number
          notes?: string | null
          tier_id: string
          updated_at?: string
          used_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string
          days?: number
          expires_at?: string | null
          for_user_id?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number
          notes?: string | null
          tier_id?: string
          updated_at?: string
          used_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "access_codes_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_access_audit: {
        Row: {
          accessed_record_id: string | null
          accessed_table: string
          action: string
          admin_user_id: string
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
        }
        Insert: {
          accessed_record_id?: string | null
          accessed_table: string
          action: string
          admin_user_id: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
        }
        Update: {
          accessed_record_id?: string | null
          accessed_table?: string
          action?: string
          admin_user_id?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_notification_preferences: {
        Row: {
          admin_user_id: string
          created_at: string
          feedback_notifications_enabled: boolean
          id: string
          updated_at: string
        }
        Insert: {
          admin_user_id: string
          created_at?: string
          feedback_notifications_enabled?: boolean
          id?: string
          updated_at?: string
        }
        Update: {
          admin_user_id?: string
          created_at?: string
          feedback_notifications_enabled?: boolean
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_notification_settings: {
        Row: {
          admin_user_id: string
          alert_tone: string | null
          created_at: string | null
          id: string
          sound_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          admin_user_id: string
          alert_tone?: string | null
          created_at?: string | null
          id?: string
          sound_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          admin_user_id?: string
          alert_tone?: string | null
          created_at?: string | null
          id?: string
          sound_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          admin_user_id: string
          created_at: string
          feedback_id: string
          id: string
          is_read: boolean
        }
        Insert: {
          admin_user_id: string
          created_at?: string
          feedback_id: string
          id?: string
          is_read?: boolean
        }
        Update: {
          admin_user_id?: string
          created_at?: string
          feedback_id?: string
          id?: string
          is_read?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "admin_notifications_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_usage: {
        Row: {
          cost_usd: number | null
          created_at: string | null
          endpoint: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          model: string
          request_duration_ms: number | null
          status: string | null
          tokens_input: number | null
          tokens_output: number | null
          user_id: string | null
        }
        Insert: {
          cost_usd?: number | null
          created_at?: string | null
          endpoint?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          model: string
          request_duration_ms?: number | null
          status?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          user_id?: string | null
        }
        Update: {
          cost_usd?: number | null
          created_at?: string | null
          endpoint?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          model?: string
          request_duration_ms?: number | null
          status?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          target_id: string | null
          target_type: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      companion_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          room_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          room_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          room_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      companion_state: {
        Row: {
          emotional_tags: Json | null
          english_level: string | null
          last_active_at: string | null
          last_english_activity: string | null
          last_mood: string | null
          last_room: string | null
          learning_goal: string | null
          path_progress: Json | null
          preferred_name: string | null
          reflection_history: Json | null
          user_id: string
        }
        Insert: {
          emotional_tags?: Json | null
          english_level?: string | null
          last_active_at?: string | null
          last_english_activity?: string | null
          last_mood?: string | null
          last_room?: string | null
          learning_goal?: string | null
          path_progress?: Json | null
          preferred_name?: string | null
          reflection_history?: Json | null
          user_id: string
        }
        Update: {
          emotional_tags?: Json | null
          english_level?: string | null
          last_active_at?: string | null
          last_english_activity?: string | null
          last_mood?: string | null
          last_room?: string | null
          learning_goal?: string | null
          path_progress?: Json | null
          preferred_name?: string | null
          reflection_history?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      favorite_rooms: {
        Row: {
          created_at: string
          id: string
          room_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          room_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          room_id?: string
          user_id?: string
        }
        Relationships: []
      }
      favorite_tracks: {
        Row: {
          created_at: string
          id: string
          track_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          track_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_tracks_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "user_music_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          created_at: string | null
          description: string | null
          flag_key: string
          id: string
          is_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          flag_key: string
          id?: string
          is_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          flag_key?: string
          id?: string
          is_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          message: string
          priority: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          message: string
          priority?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          message?: string
          priority?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_codes: {
        Row: {
          code: string
          code_expires_at: string | null
          created_at: string
          created_by: string
          id: string
          is_active: boolean
          notes: string | null
          tier: string
          updated_at: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          code_expires_at?: string | null
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean
          notes?: string | null
          tier: string
          updated_at?: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          code_expires_at?: string | null
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          tier?: string
          updated_at?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      github_sync_config: {
        Row: {
          base_path: string
          branch: string
          created_at: string
          id: string
          is_enabled: boolean
          last_sync_at: string | null
          last_sync_status: string | null
          repository_url: string
          sync_interval_minutes: number
          updated_at: string
        }
        Insert: {
          base_path?: string
          branch?: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          last_sync_at?: string | null
          last_sync_status?: string | null
          repository_url: string
          sync_interval_minutes?: number
          updated_at?: string
        }
        Update: {
          base_path?: string
          branch?: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          last_sync_at?: string | null
          last_sync_status?: string | null
          repository_url?: string
          sync_interval_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      github_sync_logs: {
        Row: {
          config_id: string | null
          created_at: string
          details: Json | null
          error_message: string | null
          files_checked: number
          files_downloaded: number
          files_failed: number
          id: string
          status: string
          sync_completed_at: string | null
          sync_started_at: string
        }
        Insert: {
          config_id?: string | null
          created_at?: string
          details?: Json | null
          error_message?: string | null
          files_checked?: number
          files_downloaded?: number
          files_failed?: number
          id?: string
          status?: string
          sync_completed_at?: string | null
          sync_started_at?: string
        }
        Update: {
          config_id?: string | null
          created_at?: string
          details?: Json | null
          error_message?: string | null
          files_checked?: number
          files_downloaded?: number
          files_failed?: number
          id?: string
          status?: string
          sync_completed_at?: string | null
          sync_started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "github_sync_logs_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "github_sync_config"
            referencedColumns: ["id"]
          },
        ]
      }
      kids_entries: {
        Row: {
          audio_url: string | null
          content_en: string
          content_vi: string
          created_at: string | null
          display_order: number
          id: string
          is_active: boolean | null
          room_id: string
          updated_at: string | null
        }
        Insert: {
          audio_url?: string | null
          content_en: string
          content_vi: string
          created_at?: string | null
          display_order: number
          id: string
          is_active?: boolean | null
          room_id: string
          updated_at?: string | null
        }
        Update: {
          audio_url?: string | null
          content_en?: string
          content_vi?: string
          created_at?: string | null
          display_order?: number
          id?: string
          is_active?: boolean | null
          room_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kids_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "kids_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      kids_levels: {
        Row: {
          age_range: string
          color_theme: string
          created_at: string | null
          description_en: string | null
          description_vi: string | null
          display_order: number
          id: string
          is_active: boolean | null
          name_en: string
          name_vi: string
          price_monthly: number
          updated_at: string | null
        }
        Insert: {
          age_range: string
          color_theme: string
          created_at?: string | null
          description_en?: string | null
          description_vi?: string | null
          display_order: number
          id: string
          is_active?: boolean | null
          name_en: string
          name_vi: string
          price_monthly: number
          updated_at?: string | null
        }
        Update: {
          age_range?: string
          color_theme?: string
          created_at?: string | null
          description_en?: string | null
          description_vi?: string | null
          display_order?: number
          id?: string
          is_active?: boolean | null
          name_en?: string
          name_vi?: string
          price_monthly?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      kids_rooms: {
        Row: {
          created_at: string | null
          description_en: string | null
          description_vi: string | null
          display_order: number
          icon: string | null
          id: string
          is_active: boolean | null
          level_id: string
          title_en: string
          title_vi: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description_en?: string | null
          description_vi?: string | null
          display_order: number
          icon?: string | null
          id: string
          is_active?: boolean | null
          level_id: string
          title_en: string
          title_vi: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description_en?: string | null
          description_vi?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean | null
          level_id?: string
          title_en?: string
          title_vi?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kids_rooms_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "kids_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      kids_subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string
          current_period_start: string
          id: string
          level_id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end: string
          current_period_start?: string
          id?: string
          level_id: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string
          current_period_start?: string
          id?: string
          level_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kids_subscriptions_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "kids_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      login_attempts: {
        Row: {
          created_at: string
          email: string
          failure_reason: string | null
          id: string
          ip_address: string | null
          success: boolean
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          email: string
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
        }
        Relationships: []
      }
      matchmaking_preferences: {
        Row: {
          availability: Json | null
          communication_style: string | null
          created_at: string | null
          goals: Json | null
          id: string
          looking_for: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          availability?: Json | null
          communication_style?: string | null
          created_at?: string | null
          goals?: Json | null
          id?: string
          looking_for?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          availability?: Json | null
          communication_style?: string | null
          created_at?: string | null
          goals?: Json | null
          id?: string
          looking_for?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      matchmaking_suggestions: {
        Row: {
          common_interests: string[] | null
          complementary_traits: string[] | null
          created_at: string | null
          expires_at: string | null
          id: string
          match_reason: Json | null
          match_score: number | null
          status: string | null
          suggested_user_id: string
          user_id: string
        }
        Insert: {
          common_interests?: string[] | null
          complementary_traits?: string[] | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          match_reason?: Json | null
          match_score?: number | null
          status?: string | null
          suggested_user_id: string
          user_id: string
        }
        Update: {
          common_interests?: string[] | null
          complementary_traits?: string[] | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          match_reason?: Json | null
          match_score?: number | null
          status?: string | null
          suggested_user_id?: string
          user_id?: string
        }
        Relationships: []
      }
      metrics_history: {
        Row: {
          active_subscriptions: number
          concurrent_users: number
          created_at: string
          id: string
          moderation_queue_length: number
          rooms_by_tier: Json | null
          timestamp: string
          total_entries: number
          total_rooms: number
          total_storage_objects: number
          total_tts_calls: number
          total_users: number
        }
        Insert: {
          active_subscriptions?: number
          concurrent_users?: number
          created_at?: string
          id?: string
          moderation_queue_length?: number
          rooms_by_tier?: Json | null
          timestamp?: string
          total_entries?: number
          total_rooms?: number
          total_storage_objects?: number
          total_tts_calls?: number
          total_users?: number
        }
        Update: {
          active_subscriptions?: number
          concurrent_users?: number
          created_at?: string
          id?: string
          moderation_queue_length?: number
          rooms_by_tier?: Json | null
          timestamp?: string
          total_entries?: number
          total_rooms?: number
          total_storage_objects?: number
          total_tts_calls?: number
          total_users?: number
        }
        Relationships: []
      }
      path_days: {
        Row: {
          audio_content_en: string | null
          audio_content_vi: string | null
          audio_dare_en: string | null
          audio_dare_vi: string | null
          audio_intro_en: string | null
          audio_intro_vi: string | null
          audio_reflection_en: string | null
          audio_reflection_vi: string | null
          content_en: string
          content_vi: string
          created_at: string
          dare_en: string
          dare_vi: string
          day_index: number
          id: string
          path_id: string
          reflection_en: string
          reflection_vi: string
          title_en: string
          title_vi: string
          updated_at: string
        }
        Insert: {
          audio_content_en?: string | null
          audio_content_vi?: string | null
          audio_dare_en?: string | null
          audio_dare_vi?: string | null
          audio_intro_en?: string | null
          audio_intro_vi?: string | null
          audio_reflection_en?: string | null
          audio_reflection_vi?: string | null
          content_en: string
          content_vi: string
          created_at?: string
          dare_en: string
          dare_vi: string
          day_index: number
          id?: string
          path_id: string
          reflection_en: string
          reflection_vi: string
          title_en: string
          title_vi: string
          updated_at?: string
        }
        Update: {
          audio_content_en?: string | null
          audio_content_vi?: string | null
          audio_dare_en?: string | null
          audio_dare_vi?: string | null
          audio_intro_en?: string | null
          audio_intro_vi?: string | null
          audio_reflection_en?: string | null
          audio_reflection_vi?: string | null
          content_en?: string
          content_vi?: string
          created_at?: string
          dare_en?: string
          dare_vi?: string
          day_index?: number
          id?: string
          path_id?: string
          reflection_en?: string
          reflection_vi?: string
          title_en?: string
          title_vi?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "path_days_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "paths"
            referencedColumns: ["id"]
          },
        ]
      }
      paths: {
        Row: {
          cover_image: string | null
          created_at: string
          description_en: string
          description_vi: string
          id: string
          slug: string
          title_en: string
          title_vi: string
          total_days: number
          updated_at: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description_en: string
          description_vi: string
          id?: string
          slug: string
          title_en: string
          title_vi: string
          total_days?: number
          updated_at?: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description_en?: string
          description_vi?: string
          id?: string
          slug?: string
          title_en?: string
          title_vi?: string
          total_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      payment_proof_audit_log: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          id: string
          submission_id: string
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          id?: string
          submission_id: string
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          id?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_proof_audit_log_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "payment_proof_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_proof_submissions: {
        Row: {
          admin_notes: string | null
          created_at: string
          extracted_amount: number | null
          extracted_date: string | null
          extracted_email: string | null
          extracted_transaction_id: string | null
          id: string
          ocr_confidence: number | null
          payment_method: string
          screenshot_url: string
          status: string
          tier_id: string
          updated_at: string
          user_id: string
          username: string
          verification_method: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          extracted_amount?: number | null
          extracted_date?: string | null
          extracted_email?: string | null
          extracted_transaction_id?: string | null
          id?: string
          ocr_confidence?: number | null
          payment_method?: string
          screenshot_url: string
          status?: string
          tier_id: string
          updated_at?: string
          user_id: string
          username: string
          verification_method?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          extracted_amount?: number | null
          extracted_date?: string | null
          extracted_email?: string | null
          extracted_transaction_id?: string | null
          id?: string
          ocr_confidence?: number | null
          payment_method?: string
          screenshot_url?: string
          status?: string
          tier_id?: string
          updated_at?: string
          user_id?: string
          username?: string
          verification_method?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_proof_submissions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          external_reference: string | null
          id: string
          metadata: Json | null
          payment_method: string
          period_days: number
          status: string
          tier_id: string | null
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          external_reference?: string | null
          id?: string
          metadata?: Json | null
          payment_method: string
          period_days?: number
          status?: string
          tier_id?: string | null
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          external_reference?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string
          period_days?: number
          status?: string
          tier_id?: string | null
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      point_transactions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          points: number
          room_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          points: number
          room_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          points?: number
          room_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      private_chat_requests: {
        Row: {
          created_at: string | null
          id: string
          receiver_id: string
          room_id: string
          sender_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          receiver_id: string
          room_id: string
          sender_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          receiver_id?: string
          room_id?: string
          sender_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      private_messages: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          receiver_id: string
          request_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          receiver_id: string
          request_id: string
          sender_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          receiver_id?: string
          request_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "private_messages_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "private_chat_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          current_redemptions: number
          daily_question_limit: number
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          max_redemptions: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          current_redemptions?: number
          daily_question_limit?: number
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_redemptions?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          current_redemptions?: number
          daily_question_limit?: number
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_redemptions?: number
          updated_at?: string
        }
        Relationships: []
      }
      rate_limit_config: {
        Row: {
          created_at: string | null
          description: string | null
          endpoint: string
          id: string
          max_requests: number
          updated_at: string | null
          window_seconds: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          endpoint: string
          id?: string
          max_requests: number
          updated_at?: string | null
          window_seconds: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          endpoint?: string
          id?: string
          max_requests?: number
          updated_at?: string | null
          window_seconds?: number
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          count: number
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
        }
        Insert: {
          count?: number
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
        }
        Update: {
          count?: number
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      responses: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          query: string
          response_en: string
          response_vi: string
          room_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          query: string
          response_en: string
          response_vi: string
          room_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          query?: string
          response_en?: string
          response_vi?: string
          room_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "responses_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "responses_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "responses_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_assignments: {
        Row: {
          assigned_date: string | null
          created_at: string | null
          id: string
          is_full_access: boolean | null
          room_id: string | null
          user_id: string
        }
        Insert: {
          assigned_date?: string | null
          created_at?: string | null
          id?: string
          is_full_access?: boolean | null
          room_id?: string | null
          user_id: string
        }
        Update: {
          assigned_date?: string | null
          created_at?: string | null
          id?: string
          is_full_access?: boolean | null
          room_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_assignments_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_assignments_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "room_assignments_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_pins: {
        Row: {
          created_at: string
          id: string
          pin_hash: string
          room_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          pin_hash: string
          room_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          pin_hash?: string
          room_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_pins_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "room_health_view"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_pins_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "room_health_view"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "room_pins_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_specification_assignments: {
        Row: {
          applied_by: string | null
          created_at: string | null
          id: string
          scope: string
          specification_id: string | null
          target_id: string | null
        }
        Insert: {
          applied_by?: string | null
          created_at?: string | null
          id?: string
          scope: string
          specification_id?: string | null
          target_id?: string | null
        }
        Update: {
          applied_by?: string | null
          created_at?: string | null
          id?: string
          scope?: string
          specification_id?: string | null
          target_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_specification_assignments_specification_id_fkey"
            columns: ["specification_id"]
            isOneToOne: false
            referencedRelation: "room_specifications"
            referencedColumns: ["id"]
          },
        ]
      }
      room_specifications: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
          use_color_theme: boolean
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
          use_color_theme?: boolean
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          use_color_theme?: boolean
        }
        Relationships: []
      }
      room_usage_analytics: {
        Row: {
          completed_room: boolean | null
          created_at: string
          id: string
          messages_sent: number | null
          room_id: string
          session_end: string | null
          session_start: string
          time_spent_seconds: number | null
          user_id: string
        }
        Insert: {
          completed_room?: boolean | null
          created_at?: string
          id?: string
          messages_sent?: number | null
          room_id: string
          session_end?: string | null
          session_start?: string
          time_spent_seconds?: number | null
          user_id: string
        }
        Update: {
          completed_room?: boolean | null
          created_at?: string
          id?: string
          messages_sent?: number | null
          room_id?: string
          session_end?: string | null
          session_start?: string
          time_spent_seconds?: number | null
          user_id?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          created_at: string | null
          crisis_footer_en: string | null
          crisis_footer_vi: string | null
          domain: string | null
          entries: Json | null
          id: string
          is_demo: boolean
          is_locked: boolean | null
          keywords: string[] | null
          room_essay_en: string | null
          room_essay_vi: string | null
          safety_disclaimer_en: string | null
          safety_disclaimer_vi: string | null
          schema_id: string
          tier: string | null
          title_en: string
          title_vi: string
          track: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          crisis_footer_en?: string | null
          crisis_footer_vi?: string | null
          domain?: string | null
          entries?: Json | null
          id: string
          is_demo?: boolean
          is_locked?: boolean | null
          keywords?: string[] | null
          room_essay_en?: string | null
          room_essay_vi?: string | null
          safety_disclaimer_en?: string | null
          safety_disclaimer_vi?: string | null
          schema_id: string
          tier?: string | null
          title_en: string
          title_vi: string
          track?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          crisis_footer_en?: string | null
          crisis_footer_vi?: string | null
          domain?: string | null
          entries?: Json | null
          id?: string
          is_demo?: boolean
          is_locked?: boolean | null
          keywords?: string[] | null
          room_essay_en?: string | null
          room_essay_vi?: string | null
          safety_disclaimer_en?: string | null
          safety_disclaimer_vi?: string | null
          schema_id?: string
          tier?: string | null
          title_en?: string
          title_vi?: string
          track?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          severity: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_incidents: {
        Row: {
          created_at: string | null
          description: string
          id: string
          incident_type: string
          metadata: Json | null
          resolved: boolean | null
          resolved_at: string | null
          severity: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          incident_type: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          incident_type?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: string
        }
        Relationships: []
      }
      security_monitoring_config: {
        Row: {
          alert_email: string | null
          attack_mode_enabled: boolean | null
          created_at: string | null
          discord_webhook_url: string | null
          id: string
          updated_at: string | null
          uptime_check_enabled: boolean | null
        }
        Insert: {
          alert_email?: string | null
          attack_mode_enabled?: boolean | null
          created_at?: string | null
          discord_webhook_url?: string | null
          id?: string
          updated_at?: string | null
          uptime_check_enabled?: boolean | null
        }
        Update: {
          alert_email?: string | null
          attack_mode_enabled?: boolean | null
          created_at?: string | null
          discord_webhook_url?: string | null
          id?: string
          updated_at?: string | null
          uptime_check_enabled?: boolean | null
        }
        Relationships: []
      }
      subscription_tiers: {
        Row: {
          created_at: string | null
          custom_topics_allowed: number | null
          description_en: string | null
          description_vi: string | null
          display_order: number
          id: string
          is_active: boolean | null
          name: string
          name_vi: string
          price_monthly: number
          price_yearly: number | null
          priority_support: boolean | null
          room_access_per_day: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_topics_allowed?: number | null
          description_en?: string | null
          description_vi?: string | null
          display_order: number
          id?: string
          is_active?: boolean | null
          name: string
          name_vi: string
          price_monthly: number
          price_yearly?: number | null
          priority_support?: boolean | null
          room_access_per_day?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_topics_allowed?: number | null
          description_en?: string | null
          description_vi?: string | null
          display_order?: number
          id?: string
          is_active?: boolean | null
          name?: string
          name_vi?: string
          price_monthly?: number
          price_yearly?: number | null
          priority_support?: boolean | null
          room_access_per_day?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_usage: {
        Row: {
          created_at: string | null
          custom_topics_requested: number | null
          id: string
          rooms_accessed: number | null
          usage_date: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          custom_topics_requested?: number | null
          id?: string
          rooms_accessed?: number | null
          usage_date?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          custom_topics_requested?: number | null
          id?: string
          rooms_accessed?: number | null
          usage_date?: string
          user_id?: string
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          created_at: string
          id: string
          level: string
          message: string
          metadata: Json | null
          route: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          level: string
          message: string
          metadata?: Json | null
          route?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          level?: string
          message?: string
          metadata?: Json | null
          route?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          content_en: string
          content_vi: string
          created_at: string | null
          display_order: number | null
          id: string
          is_featured: boolean | null
          rating: number | null
          tier: string | null
          updated_at: string | null
          user_name: string
          user_title: string | null
        }
        Insert: {
          avatar_url?: string | null
          content_en: string
          content_vi: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          rating?: number | null
          tier?: string | null
          updated_at?: string | null
          user_name: string
          user_title?: string | null
        }
        Update: {
          avatar_url?: string | null
          content_en?: string
          content_vi?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          rating?: number | null
          tier?: string | null
          updated_at?: string | null
          user_name?: string
          user_title?: string | null
        }
        Relationships: []
      }
      tts_usage_log: {
        Row: {
          created_at: string
          id: string
          text_length: number
          user_id: string
          voice: string
        }
        Insert: {
          created_at?: string
          id?: string
          text_length: number
          user_id: string
          voice: string
        }
        Update: {
          created_at?: string
          id?: string
          text_length?: number
          user_id?: string
          voice?: string
        }
        Relationships: []
      }
      ui_health_issues: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          issue_type: string
          path: string
          room_id: string | null
          severity: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          issue_type: string
          path: string
          room_id?: string | null
          severity?: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          issue_type?: string
          path?: string
          room_id?: string | null
          severity?: string
        }
        Relationships: []
      }
      uptime_checks: {
        Row: {
          checked_at: string | null
          error_message: string | null
          id: string
          is_up: boolean | null
          response_time_ms: number | null
          status_code: number | null
          url: string
        }
        Insert: {
          checked_at?: string | null
          error_message?: string | null
          id?: string
          is_up?: boolean | null
          response_time_ms?: number | null
          status_code?: number | null
          url: string
        }
        Update: {
          checked_at?: string | null
          error_message?: string | null
          id?: string
          is_up?: boolean | null
          response_time_ms?: number | null
          status_code?: number | null
          url?: string
        }
        Relationships: []
      }
      user_behavior_tracking: {
        Row: {
          created_at: string | null
          id: string
          interaction_data: Json | null
          interaction_type: string
          room_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_data?: Json | null
          interaction_type: string
          room_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_data?: Json | null
          interaction_type?: string
          room_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_knowledge_profile: {
        Row: {
          completed_topics: Json | null
          id: string
          interests: Json | null
          knowledge_areas: Json | null
          profile_visibility: string | null
          traits: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_topics?: Json | null
          id?: string
          interests?: Json | null
          knowledge_areas?: Json | null
          profile_visibility?: string | null
          traits?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_topics?: Json | null
          id?: string
          interests?: Json | null
          knowledge_areas?: Json | null
          profile_visibility?: string | null
          traits?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_moderation_status: {
        Row: {
          id: string
          is_muted: boolean
          is_suspended: boolean
          last_violation_at: string | null
          muted_until: string | null
          total_violations: number
          updated_at: string
          user_id: string
          violation_score: number
        }
        Insert: {
          id?: string
          is_muted?: boolean
          is_suspended?: boolean
          last_violation_at?: string | null
          muted_until?: string | null
          total_violations?: number
          updated_at?: string
          user_id: string
          violation_score?: number
        }
        Update: {
          id?: string
          is_muted?: boolean
          is_suspended?: boolean
          last_violation_at?: string | null
          muted_until?: string | null
          total_violations?: number
          updated_at?: string
          user_id?: string
          violation_score?: number
        }
        Relationships: []
      }
      user_moderation_violations: {
        Row: {
          action_taken: string
          created_at: string
          id: string
          message_content: string | null
          room_id: string | null
          severity_level: number
          user_id: string
          violation_type: string
        }
        Insert: {
          action_taken: string
          created_at?: string
          id?: string
          message_content?: string | null
          room_id?: string | null
          severity_level: number
          user_id: string
          violation_type: string
        }
        Update: {
          action_taken?: string
          created_at?: string
          id?: string
          message_content?: string | null
          room_id?: string | null
          severity_level?: number
          user_id?: string
          violation_type?: string
        }
        Relationships: []
      }
      user_music_uploads: {
        Row: {
          admin_notes: string | null
          approved_at: string | null
          approved_by: string | null
          artist: string | null
          created_at: string
          duration_seconds: number | null
          file_size_bytes: number | null
          file_url: string
          id: string
          title: string
          updated_at: string
          upload_status: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          artist?: string | null
          created_at?: string
          duration_seconds?: number | null
          file_size_bytes?: number | null
          file_url: string
          id?: string
          title: string
          updated_at?: string
          upload_status?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          artist?: string | null
          created_at?: string
          duration_seconds?: number | null
          file_size_bytes?: number | null
          file_url?: string
          id?: string
          title?: string
          updated_at?: string
          upload_status?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notes: {
        Row: {
          admin_id: string
          created_at: string
          id: string
          note: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          id?: string
          note: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          id?: string
          note?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_path_progress: {
        Row: {
          completed_days: Json
          current_day: number
          id: string
          path_id: string
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_days?: Json
          current_day?: number
          id?: string
          path_id: string
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_days?: Json
          current_day?: number
          id?: string
          path_id?: string
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_path_progress_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "paths"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          created_at: string
          id: string
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_promo_redemptions: {
        Row: {
          daily_question_limit: number
          expires_at: string | null
          id: string
          promo_code_id: string
          redeemed_at: string
          total_question_limit: number | null
          total_questions_used: number | null
          user_id: string
        }
        Insert: {
          daily_question_limit: number
          expires_at?: string | null
          id?: string
          promo_code_id: string
          redeemed_at?: string
          total_question_limit?: number | null
          total_questions_used?: number | null
          user_id: string
        }
        Update: {
          daily_question_limit?: number
          expires_at?: string | null
          id?: string
          promo_code_id?: string
          redeemed_at?: string
          total_question_limit?: number | null
          total_questions_used?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_promo_redemptions_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quotas: {
        Row: {
          created_at: string | null
          id: string
          questions_used: number | null
          quota_date: string | null
          rooms_accessed: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          questions_used?: number | null
          quota_date?: string | null
          rooms_accessed?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          questions_used?: number | null
          quota_date?: string | null
          rooms_accessed?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_referrals: {
        Row: {
          created_at: string | null
          id: string
          referral_code: string
          referred_at: string | null
          referred_user_id: string | null
          referrer_user_id: string
          reward_granted: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referral_code: string
          referred_at?: string | null
          referred_user_id?: string | null
          referrer_user_id: string
          reward_granted?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_at?: string | null
          referred_user_id?: string | null
          referrer_user_id?: string
          reward_granted?: boolean | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_security_status: {
        Row: {
          blocked_at: string | null
          blocked_by: string | null
          blocked_reason: string | null
          created_at: string
          failed_login_count: number
          id: string
          is_blocked: boolean
          last_failed_login: string | null
          last_suspicious_activity: string | null
          suspicious_activity_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          blocked_at?: string | null
          blocked_by?: string | null
          blocked_reason?: string | null
          created_at?: string
          failed_login_count?: number
          id?: string
          is_blocked?: boolean
          last_failed_login?: string | null
          last_suspicious_activity?: string | null
          suspicious_activity_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          blocked_at?: string | null
          blocked_by?: string | null
          blocked_reason?: string | null
          created_at?: string
          failed_login_count?: number
          id?: string
          is_blocked?: boolean
          last_failed_login?: string | null
          last_suspicious_activity?: string | null
          suspicious_activity_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          device_info: Json | null
          device_type: Database["public"]["Enums"]["device_type"]
          id: string
          last_activity: string
          session_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          device_type: Database["public"]["Enums"]["device_type"]
          id?: string
          last_activity?: string
          session_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          device_type?: Database["public"]["Enums"]["device_type"]
          id?: string
          last_activity?: string
          session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      vip_room_requests: {
        Row: {
          admin_notes: string | null
          completed_at: string | null
          created_at: string
          description: string
          id: string
          room_id: string | null
          status: string | null
          topic_name: string
          topic_name_vi: string | null
          updated_at: string
          urgency: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          completed_at?: string | null
          created_at?: string
          description: string
          id?: string
          room_id?: string | null
          status?: string | null
          topic_name: string
          topic_name_vi?: string | null
          updated_at?: string
          urgency?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string
          id?: string
          room_id?: string | null
          status?: string | null
          topic_name?: string
          topic_name_vi?: string | null
          updated_at?: string
          urgency?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vip_topic_requests_detailed: {
        Row: {
          additional_notes: string | null
          admin_response: string | null
          created_at: string
          id: string
          specific_goals: string | null
          status: string | null
          target_audience: string | null
          tier: string
          topic_description: string
          topic_title: string
          updated_at: string
          urgency: string | null
          user_id: string
        }
        Insert: {
          additional_notes?: string | null
          admin_response?: string | null
          created_at?: string
          id?: string
          specific_goals?: string | null
          status?: string | null
          target_audience?: string | null
          tier: string
          topic_description: string
          topic_title: string
          updated_at?: string
          urgency?: string | null
          user_id: string
        }
        Update: {
          additional_notes?: string | null
          admin_response?: string | null
          created_at?: string
          id?: string
          specific_goals?: string | null
          status?: string | null
          target_audience?: string | null
          tier?: string
          topic_description?: string
          topic_title?: string
          updated_at?: string
          urgency?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      daily_feedback_summary: {
        Row: {
          feedback_date: string | null
          high_priority: number | null
          low_priority: number | null
          new_feedback: number | null
          normal_priority: number | null
          total_feedback: number | null
        }
        Relationships: []
      }
      room_health_view: {
        Row: {
          audio_coverage: number | null
          has_zero_audio: boolean | null
          health_score: number | null
          is_low_health: boolean | null
          room_id: string | null
          slug: string | null
          tier: string | null
          title_en: string | null
          title_vi: string | null
        }
        Insert: {
          audio_coverage?: never
          has_zero_audio?: never
          health_score?: never
          is_low_health?: never
          room_id?: string | null
          slug?: string | null
          tier?: string | null
          title_en?: string | null
          title_vi?: string | null
        }
        Update: {
          audio_coverage?: never
          has_zero_audio?: never
          health_score?: never
          is_low_health?: never
          room_id?: string | null
          slug?: string | null
          tier?: string | null
          title_en?: string | null
          title_vi?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      award_points: {
        Args: {
          _description?: string
          _points: number
          _room_id?: string
          _transaction_type: string
          _user_id: string
        }
        Returns: undefined
      }
      check_endpoint_rate_limit: {
        Args: { endpoint_name: string; user_uuid: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          check_email: string
          check_ip: string
          max_attempts?: number
          time_window_minutes?: number
        }
        Returns: boolean
      }
      check_usage_limit: {
        Args: { limit_type: string; user_uuid: string }
        Returns: boolean
      }
      clean_expired_responses: { Args: never; Returns: undefined }
      cleanup_rate_limits: { Args: never; Returns: undefined }
      generate_referral_code: { Args: never; Returns: string }
      get_ai_usage_summary: {
        Args: { end_date?: string; start_date?: string }
        Returns: {
          avg_cost: number
          avg_tokens: number
          total_cost: number
          total_requests: number
          total_tokens: number
        }[]
      }
      get_audit_summary: {
        Args: { days_back?: number }
        Returns: {
          action: string
          action_count: number
          unique_admins: number
        }[]
      }
      get_room_tier_level: { Args: { tier_name: string }; Returns: number }
      get_user_tier: {
        Args: { user_uuid: string }
        Returns: {
          custom_topics_allowed: number
          priority_support: boolean
          room_access_per_day: number
          tier_name: string
        }[]
      }
      get_user_tier_level: { Args: { user_uuid: string }; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_user_blocked: { Args: { user_email: string }; Returns: boolean }
      log_admin_access: {
        Args: {
          _accessed_record_id?: string
          _accessed_table: string
          _action?: string
          _metadata?: Json
        }
        Returns: undefined
      }
      log_security_event: {
        Args: {
          _event_type: string
          _ip_address?: string
          _metadata?: Json
          _severity: string
          _user_agent?: string
          _user_id: string
        }
        Returns: string
      }
      log_security_event_v2: {
        Args: {
          _event_type: string
          _ip_address?: string
          _metadata?: Json
          _severity: string
          _user_agent?: string
          _user_id?: string
        }
        Returns: string
      }
      purge_old_payment_proofs: { Args: never; Returns: undefined }
      remove_room_pin: {
        Args: { _pin: string; _room_id: string }
        Returns: undefined
      }
      set_room_pin: {
        Args: { _pin: string; _room_id: string }
        Returns: undefined
      }
      setup_admin_user: { Args: never; Returns: undefined }
      toggle_room_lock: {
        Args: { lock_state: boolean; room_id_param: string }
        Returns: undefined
      }
      validate_promo_code: { Args: { code_input: string }; Returns: Json }
      validate_room_pin: {
        Args: { _pin: string; _room_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      device_type: "desktop" | "mobile"
    }
    CompositeTypes: {
      [_ in never]: never
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
  public: {
    Enums: {
      app_role: ["admin", "user"],
      device_type: ["desktop", "mobile"],
    },
  },
} as const
