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
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
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
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
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
          entries: Json | null
          id: string
          keywords: string[] | null
          room_essay_en: string | null
          room_essay_vi: string | null
          safety_disclaimer_en: string | null
          safety_disclaimer_vi: string | null
          schema_id: string
          tier: string | null
          title_en: string
          title_vi: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          crisis_footer_en?: string | null
          crisis_footer_vi?: string | null
          entries?: Json | null
          id: string
          keywords?: string[] | null
          room_essay_en?: string | null
          room_essay_vi?: string | null
          safety_disclaimer_en?: string | null
          safety_disclaimer_vi?: string | null
          schema_id: string
          tier?: string | null
          title_en: string
          title_vi: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          crisis_footer_en?: string | null
          crisis_footer_vi?: string | null
          entries?: Json | null
          id?: string
          keywords?: string[] | null
          room_essay_en?: string | null
          room_essay_vi?: string | null
          safety_disclaimer_en?: string | null
          safety_disclaimer_vi?: string | null
          schema_id?: string
          tier?: string | null
          title_en?: string
          title_vi?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_tiers: {
        Row: {
          created_at: string | null
          custom_topics_allowed: number | null
          display_order: number
          id: string
          is_active: boolean | null
          name: string
          name_vi: string
          price_monthly: number
          priority_support: boolean | null
          room_access_per_day: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_topics_allowed?: number | null
          display_order: number
          id?: string
          is_active?: boolean | null
          name: string
          name_vi: string
          price_monthly: number
          priority_support?: boolean | null
          room_access_per_day?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_topics_allowed?: number | null
          display_order?: number
          id?: string
          is_active?: boolean | null
          name?: string
          name_vi?: string
          price_monthly?: number
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
          traits: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_topics?: Json | null
          id?: string
          interests?: Json | null
          knowledge_areas?: Json | null
          traits?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_topics?: Json | null
          id?: string
          interests?: Json | null
          knowledge_areas?: Json | null
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
      check_usage_limit: {
        Args: { limit_type: string; user_uuid: string }
        Returns: boolean
      }
      clean_expired_responses: { Args: never; Returns: undefined }
      get_user_tier: {
        Args: { user_uuid: string }
        Returns: {
          custom_topics_allowed: number
          priority_support: boolean
          room_access_per_day: number
          tier_name: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      purge_old_payment_proofs: { Args: never; Returns: undefined }
      setup_admin_user: { Args: never; Returns: undefined }
      validate_promo_code: { Args: { code_input: string }; Returns: Json }
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
