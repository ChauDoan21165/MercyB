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
          {
            foreignKeyName: "access_code_redemptions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions_with_age"
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
          {
            foreignKeyName: "access_codes_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements"
            referencedColumns: ["tier_id"]
          },
          {
            foreignKeyName: "access_codes_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements_v"
            referencedColumns: ["tier_id"]
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
      admin_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          app_id: string
          created_at: string
          id: number
          payload: Json | null
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          app_id?: string
          created_at?: string
          id?: number
          payload?: Json | null
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          app_id?: string
          created_at?: string
          id?: number
          payload?: Json | null
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_log_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_logs: {
        Row: {
          action: string
          actor_admin_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          new_level: number | null
          old_level: number | null
          target_admin_id: string | null
        }
        Insert: {
          action: string
          actor_admin_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          new_level?: number | null
          old_level?: number | null
          target_admin_id?: string | null
        }
        Update: {
          action?: string
          actor_admin_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          new_level?: number | null
          old_level?: number | null
          target_admin_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_logs_actor_admin_id_fkey"
            columns: ["actor_admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_logs_target_admin_id_fkey"
            columns: ["target_admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
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
      admin_users: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          id: string
          level: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          level: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          level?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_price_catalog: {
        Row: {
          billing_interval: string
          created_at: string
          is_active: boolean
          price_id: string
          product_id: string
          recognized_monthly_revenue_vnd: number
          updated_at: string
        }
        Insert: {
          billing_interval: string
          created_at?: string
          is_active?: boolean
          price_id: string
          product_id: string
          recognized_monthly_revenue_vnd: number
          updated_at?: string
        }
        Update: {
          billing_interval?: string
          created_at?: string
          is_active?: boolean
          price_id?: string
          product_id?: string
          recognized_monthly_revenue_vnd?: number
          updated_at?: string
        }
        Relationships: []
      }
      ai_product_catalog: {
        Row: {
          billing_interval: string
          created_at: string
          is_active: boolean
          product_id: string
          recognized_monthly_revenue_vnd: number
          updated_at: string
        }
        Insert: {
          billing_interval: string
          created_at?: string
          is_active?: boolean
          product_id: string
          recognized_monthly_revenue_vnd: number
          updated_at?: string
        }
        Update: {
          billing_interval?: string
          created_at?: string
          is_active?: boolean
          product_id?: string
          recognized_monthly_revenue_vnd?: number
          updated_at?: string
        }
        Relationships: []
      }
      ai_settings: {
        Row: {
          created_at: string
          id: string
          is_ai_enabled: boolean
          monthly_budget_usd: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_ai_enabled?: boolean
          monthly_budget_usd?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_ai_enabled?: boolean
          monthly_budget_usd?: number
          updated_at?: string
        }
        Relationships: []
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
      ai_usage_daily: {
        Row: {
          date: string
          last_request_at: string | null
          messages_used: number
          minute_window_count: number
          minute_window_start: string | null
          user_id: string
        }
        Insert: {
          date: string
          last_request_at?: string | null
          messages_used?: number
          minute_window_count?: number
          minute_window_start?: string | null
          user_id: string
        }
        Update: {
          date?: string
          last_request_at?: string | null
          messages_used?: number
          minute_window_count?: number
          minute_window_start?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_usage_daily_v2: {
        Row: {
          day: string
          total_requests: number
          total_tokens: number
          user_id: string
        }
        Insert: {
          day: string
          total_requests?: number
          total_tokens?: number
          user_id: string
        }
        Update: {
          day?: string
          total_requests?: number
          total_tokens?: number
          user_id?: string
        }
        Relationships: []
      }
      ai_usage_events: {
        Row: {
          cost_usd: number
          created_at: string
          endpoint: string | null
          id: string
          model: string
          tokens_input: number
          tokens_output: number
          user_id: string | null
        }
        Insert: {
          cost_usd?: number
          created_at?: string
          endpoint?: string | null
          id?: string
          model: string
          tokens_input?: number
          tokens_output?: number
          user_id?: string | null
        }
        Update: {
          cost_usd?: number
          created_at?: string
          endpoint?: string | null
          id?: string
          model?: string
          tokens_input?: number
          tokens_output?: number
          user_id?: string | null
        }
        Relationships: []
      }
      ai_usage_logs: {
        Row: {
          created_at: string
          estimated_cost_vnd: number
          feature: string
          id: string
          input_tokens: number
          meta: Json
          model: string
          output_tokens: number
          request_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          estimated_cost_vnd?: number
          feature: string
          id?: string
          input_tokens?: number
          meta?: Json
          model: string
          output_tokens?: number
          request_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          estimated_cost_vnd?: number
          feature?: string
          id?: string
          input_tokens?: number
          meta?: Json
          model?: string
          output_tokens?: number
          request_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      app_feedback: {
        Row: {
          created_at: string
          id: string
          message: string
          room_id: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          room_id?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          room_id?: string | null
          user_email?: string | null
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
      app_tier_ranks: {
        Row: {
          product_key: string
          tier_id: string
          vip_rank: number
        }
        Insert: {
          product_key: string
          tier_id: string
          vip_rank: number
        }
        Update: {
          product_key?: string
          tier_id?: string
          vip_rank?: number
        }
        Relationships: [
          {
            foreignKeyName: "app_tier_ranks_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_tier_ranks_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements"
            referencedColumns: ["tier_id"]
          },
          {
            foreignKeyName: "app_tier_ranks_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements_v"
            referencedColumns: ["tier_id"]
          },
        ]
      }
      apple_iap_events: {
        Row: {
          created_at: string
          dedupe_key: string
          event_source: string
          id: number
          notification_uuid: string | null
          original_transaction_id: string | null
          processed_at: string | null
          provider: string
          raw_payload: Json
          signed_date: string | null
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          dedupe_key: string
          event_source: string
          id?: number
          notification_uuid?: string | null
          original_transaction_id?: string | null
          processed_at?: string | null
          provider?: string
          raw_payload: Json
          signed_date?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          dedupe_key?: string
          event_source?: string
          id?: number
          notification_uuid?: string | null
          original_transaction_id?: string | null
          processed_at?: string | null
          provider?: string
          raw_payload?: Json
          signed_date?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      apps: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      audio_audit_room: {
        Row: {
          last_checked: string
          missing_en: number
          missing_vi: number
          orphan_count: number
          room_id: string
        }
        Insert: {
          last_checked?: string
          missing_en?: number
          missing_vi?: number
          orphan_count?: number
          room_id: string
        }
        Update: {
          last_checked?: string
          missing_en?: number
          missing_vi?: number
          orphan_count?: number
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audio_audit_room_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "room_entries_integrity"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "audio_audit_room_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "room_health_view"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "audio_audit_room_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "room_health_view"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "audio_audit_room_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audio_audit_room_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "rooms_migration_status"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "audio_audit_room_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "rooms_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audio_audit_room_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id_text"]
          },
          {
            foreignKeyName: "audio_audit_room_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audio_audit_room_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "rooms_tier_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audio_audit_room_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "v_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      audio_governance_reviews: {
        Row: {
          after_filename: string | null
          before_filename: string | null
          confidence: number
          created_at: string
          cycle_id: string
          id: string
          notes: string | null
          operation_type: string
          reason: string | null
          review_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          room_id: string
          status: string
          updated_at: string
        }
        Insert: {
          after_filename?: string | null
          before_filename?: string | null
          confidence?: number
          created_at?: string
          cycle_id: string
          id?: string
          notes?: string | null
          operation_type: string
          reason?: string | null
          review_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          room_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          after_filename?: string | null
          before_filename?: string | null
          confidence?: number
          created_at?: string
          cycle_id?: string
          id?: string
          notes?: string | null
          operation_type?: string
          reason?: string | null
          review_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          room_id?: string
          status?: string
          updated_at?: string
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
      bad_rooms: {
        Row: {
          created_at: string
          issue_type: string
          kw_count: number
          leaf_count: number
          path: string
        }
        Insert: {
          created_at?: string
          issue_type: string
          kw_count?: number
          leaf_count?: number
          path: string
        }
        Update: {
          created_at?: string
          issue_type?: string
          kw_count?: number
          leaf_count?: number
          path?: string
        }
        Relationships: []
      }
      bank_payment_requests: {
        Row: {
          admin_note: string | null
          amount: number
          approved_at: string | null
          created_at: string | null
          id: string
          screenshot_url: string
          status: string
          tier: string
          transfer_note: string | null
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          amount: number
          approved_at?: string | null
          created_at?: string | null
          id?: string
          screenshot_url: string
          status?: string
          tier: string
          transfer_note?: string | null
          user_id: string
        }
        Update: {
          admin_note?: string | null
          amount?: number
          approved_at?: string | null
          created_at?: string | null
          id?: string
          screenshot_url?: string
          status?: string
          tier?: string
          transfer_note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bank_transfer_orders: {
        Row: {
          amount_vnd: number
          approved_at: string | null
          approved_by_admin_id: string | null
          created_at: string
          id: string
          rejection_reason: string | null
          screenshot_url: string | null
          status: string
          tier: string
          transfer_note: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_vnd: number
          approved_at?: string | null
          approved_by_admin_id?: string | null
          created_at?: string
          id?: string
          rejection_reason?: string | null
          screenshot_url?: string | null
          status?: string
          tier: string
          transfer_note: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_vnd?: number
          approved_at?: string | null
          approved_by_admin_id?: string | null
          created_at?: string
          id?: string
          rejection_reason?: string | null
          screenshot_url?: string | null
          status?: string
          tier?: string
          transfer_note?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_transfer_orders_approved_by_admin_id_fkey"
            columns: ["approved_by_admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_customers: {
        Row: {
          app_id: string
          created_at: string
          customer_id: string
          email: string | null
          id: string
          provider: Database["public"]["Enums"]["billing_provider"]
          updated_at: string
          user_id: string
        }
        Insert: {
          app_id: string
          created_at?: string
          customer_id: string
          email?: string | null
          id?: string
          provider?: Database["public"]["Enums"]["billing_provider"]
          updated_at?: string
          user_id: string
        }
        Update: {
          app_id?: string
          created_at?: string
          customer_id?: string
          email?: string | null
          id?: string
          provider?: Database["public"]["Enums"]["billing_provider"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      billing_entitlement_events: {
        Row: {
          action: string
          created_at: string
          effective_at: string
          entitlement_key: string
          environment: string
          id: string
          metadata: Json
          period_end_at: string | null
          period_start_at: string | null
          provider: string
          reason: string | null
          source_event_key: string | null
          source_provider_event_id: string | null
          subject_id: string
          subscription_ref: string | null
          updated_at: string
        }
        Insert: {
          action: string
          created_at?: string
          effective_at: string
          entitlement_key: string
          environment?: string
          id?: string
          metadata?: Json
          period_end_at?: string | null
          period_start_at?: string | null
          provider: string
          reason?: string | null
          source_event_key?: string | null
          source_provider_event_id?: string | null
          subject_id: string
          subscription_ref?: string | null
          updated_at?: string
        }
        Update: {
          action?: string
          created_at?: string
          effective_at?: string
          entitlement_key?: string
          environment?: string
          id?: string
          metadata?: Json
          period_end_at?: string | null
          period_start_at?: string | null
          provider?: string
          reason?: string | null
          source_event_key?: string | null
          source_provider_event_id?: string | null
          subject_id?: string
          subscription_ref?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      billing_provider_events: {
        Row: {
          created_at: string
          delivery_count: number
          environment: string
          event_created_at: string | null
          event_key: string
          event_type: string | null
          first_seen_at: string
          headers: Json
          id: string
          last_seen_at: string
          metadata: Json
          payload: Json
          process_status: string
          processed_at: string | null
          processing_error: string | null
          provider: string
          provider_event_id: string | null
          received_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery_count?: number
          environment?: string
          event_created_at?: string | null
          event_key: string
          event_type?: string | null
          first_seen_at?: string
          headers?: Json
          id?: string
          last_seen_at?: string
          metadata?: Json
          payload?: Json
          process_status?: string
          processed_at?: string | null
          processing_error?: string | null
          provider: string
          provider_event_id?: string | null
          received_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery_count?: number
          environment?: string
          event_created_at?: string | null
          event_key?: string
          event_type?: string | null
          first_seen_at?: string
          headers?: Json
          id?: string
          last_seen_at?: string
          metadata?: Json
          payload?: Json
          process_status?: string
          processed_at?: string | null
          processing_error?: string | null
          provider?: string
          provider_event_id?: string | null
          received_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          room_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          room_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          room_id?: string
          user_id?: string
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
      email_campaigns: {
        Row: {
          audience_type: string
          body_html: string
          created_at: string
          created_by: string
          error_message: string | null
          id: string
          manual_emails: string[] | null
          sent_at: string | null
          sent_count: number
          status: string
          subject: string
          total_recipients: number
        }
        Insert: {
          audience_type: string
          body_html: string
          created_at?: string
          created_by: string
          error_message?: string | null
          id?: string
          manual_emails?: string[] | null
          sent_at?: string | null
          sent_count?: number
          status?: string
          subject: string
          total_recipients?: number
        }
        Update: {
          audience_type?: string
          body_html?: string
          created_at?: string
          created_by?: string
          error_message?: string | null
          id?: string
          manual_emails?: string[] | null
          sent_at?: string | null
          sent_count?: number
          status?: string
          subject?: string
          total_recipients?: number
        }
        Relationships: []
      }
      email_config: {
        Row: {
          from_email: string | null
          from_name: string | null
          id: string
          is_enabled: boolean
          provider: string
          reply_to: string | null
          updated_at: string
        }
        Insert: {
          from_email?: string | null
          from_name?: string | null
          id?: string
          is_enabled?: boolean
          provider?: string
          reply_to?: string | null
          updated_at?: string
        }
        Update: {
          from_email?: string | null
          from_name?: string | null
          id?: string
          is_enabled?: boolean
          provider?: string
          reply_to?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_events: {
        Row: {
          campaign_id: string | null
          created_at: string
          email: string
          error_message: string | null
          id: string
          status: string
          tier: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          email: string
          error_message?: string | null
          id?: string
          status: string
          tier?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          email?: string
          error_message?: string | null
          id?: string
          status?: string
          tier?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_events_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      email_outbox: {
        Row: {
          app_key: string | null
          attempts: number
          correlation_id: string | null
          created_at: string
          error_message: string | null
          id: string
          last_error: string | null
          provider: string | null
          sent_at: string | null
          status: string
          template_key: string
          to_email: string
          updated_at: string | null
          variables: Json
        }
        Insert: {
          app_key?: string | null
          attempts?: number
          correlation_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          last_error?: string | null
          provider?: string | null
          sent_at?: string | null
          status?: string
          template_key: string
          to_email: string
          updated_at?: string | null
          variables?: Json
        }
        Update: {
          app_key?: string | null
          attempts?: number
          correlation_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          last_error?: string | null
          provider?: string | null
          sent_at?: string | null
          status?: string
          template_key?: string
          to_email?: string
          updated_at?: string | null
          variables?: Json
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body_html: string | null
          body_text: string
          is_active: boolean
          key: string
          subject: string
          updated_at: string
        }
        Insert: {
          body_html?: string | null
          body_text: string
          is_active?: boolean
          key: string
          subject: string
          updated_at?: string
        }
        Update: {
          body_html?: string | null
          body_text?: string
          is_active?: boolean
          key?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      entitlement_events: {
        Row: {
          created_at: string
          event_id: string
          event_type: string
          id: string
          payload: Json | null
          provider: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_id: string
          event_type: string
          id?: string
          payload?: Json | null
          provider: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string
          event_type?: string
          id?: string
          payload?: Json | null
          provider?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entitlement_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mb_user_effective_rank"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "entitlement_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entitlement_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entitlement_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_profiles_self"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entitlement_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "viewer_access"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "entitlement_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vip3_public_profiles"
            referencedColumns: ["id"]
          },
        ]
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
          created_by: string | null
          id: string
          message: string
          priority: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          message: string
          priority?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          message?: string
          priority?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mb_user_effective_rank"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_profiles_self"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "viewer_access"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vip3_public_profiles"
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
          used_by_email: string | null
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
          used_by_email?: string | null
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
          used_by_email?: string | null
        }
        Relationships: []
      }
      kids_entries: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id?: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
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
      mb_ai_quality_events: {
        Row: {
          ask_back_present: boolean
          completion_tokens: number
          confidence: number | null
          created_at: string
          emotion_intensity: number | null
          emotion_label: string | null
          error_code: string | null
          failure_streak: number | null
          has_next_action: boolean
          id: number
          intent_match: boolean
          json_valid: boolean
          mode: string
          model: string | null
          notes: string | null
          prompt_tokens: number
          quality_score: number | null
          request_id: string
          room_id: string | null
          stage: string | null
          total_tokens: number
          user_id: string
          vip_rank: number
        }
        Insert: {
          ask_back_present?: boolean
          completion_tokens?: number
          confidence?: number | null
          created_at?: string
          emotion_intensity?: number | null
          emotion_label?: string | null
          error_code?: string | null
          failure_streak?: number | null
          has_next_action?: boolean
          id?: number
          intent_match?: boolean
          json_valid?: boolean
          mode: string
          model?: string | null
          notes?: string | null
          prompt_tokens?: number
          quality_score?: number | null
          request_id: string
          room_id?: string | null
          stage?: string | null
          total_tokens?: number
          user_id: string
          vip_rank?: number
        }
        Update: {
          ask_back_present?: boolean
          completion_tokens?: number
          confidence?: number | null
          created_at?: string
          emotion_intensity?: number | null
          emotion_label?: string | null
          error_code?: string | null
          failure_streak?: number | null
          has_next_action?: boolean
          id?: number
          intent_match?: boolean
          json_valid?: boolean
          mode?: string
          model?: string | null
          notes?: string | null
          prompt_tokens?: number
          quality_score?: number | null
          request_id?: string
          room_id?: string | null
          stage?: string | null
          total_tokens?: number
          user_id?: string
          vip_rank?: number
        }
        Relationships: []
      }
      mb_ai_usage_logs: {
        Row: {
          completion_tokens: number | null
          created_at: string | null
          id: string
          prompt_tokens: number | null
          total_tokens: number | null
          user_id: string | null
          vip_rank: number | null
        }
        Insert: {
          completion_tokens?: number | null
          created_at?: string | null
          id?: string
          prompt_tokens?: number | null
          total_tokens?: number | null
          user_id?: string | null
          vip_rank?: number | null
        }
        Update: {
          completion_tokens?: number | null
          created_at?: string | null
          id?: string
          prompt_tokens?: number | null
          total_tokens?: number | null
          user_id?: string | null
          vip_rank?: number | null
        }
        Relationships: []
      }
      mb_cron_runs: {
        Row: {
          attempts_rows: number
          error: string | null
          id: number
          job_name: string
          narratives_upserts: number
          quality_rows: number
          run_at: string
          snapshots_upserts: number
          status: string
          week_start: string
        }
        Insert: {
          attempts_rows?: number
          error?: string | null
          id?: number
          job_name: string
          narratives_upserts?: number
          quality_rows?: number
          run_at?: string
          snapshots_upserts?: number
          status?: string
          week_start: string
        }
        Update: {
          attempts_rows?: number
          error?: string | null
          id?: number
          job_name?: string
          narratives_upserts?: number
          quality_rows?: number
          run_at?: string
          snapshots_upserts?: number
          status?: string
          week_start?: string
        }
        Relationships: []
      }
      mb_progress_narratives: {
        Row: {
          created_at: string
          id: string
          metrics: Json
          narrative_text: string
          updated_at: string
          user_id: string
          week_end: string | null
          week_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          metrics?: Json
          narrative_text: string
          updated_at?: string
          user_id: string
          week_end?: string | null
          week_start: string
        }
        Update: {
          created_at?: string
          id?: string
          metrics?: Json
          narrative_text?: string
          updated_at?: string
          user_id?: string
          week_end?: string | null
          week_start?: string
        }
        Relationships: []
      }
      mb_pronunciation_attempts: {
        Row: {
          corrections_count: number | null
          created_at: string | null
          id: string
          improvement_score: number | null
          org_id: string | null
          overall_score: number | null
          phoneme_accuracy: Json | null
          prompt_text: string | null
          room_id: string | null
          sentence: string | null
          user_id: string | null
        }
        Insert: {
          corrections_count?: number | null
          created_at?: string | null
          id?: string
          improvement_score?: number | null
          org_id?: string | null
          overall_score?: number | null
          phoneme_accuracy?: Json | null
          prompt_text?: string | null
          room_id?: string | null
          sentence?: string | null
          user_id?: string | null
        }
        Update: {
          corrections_count?: number | null
          created_at?: string | null
          id?: string
          improvement_score?: number | null
          org_id?: string | null
          overall_score?: number | null
          phoneme_accuracy?: Json | null
          prompt_text?: string | null
          room_id?: string | null
          sentence?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      mb_system_weekly_rollups: {
        Row: {
          created_at: string
          totals: Json
          week_end: string
          week_start: string
        }
        Insert: {
          created_at?: string
          totals: Json
          week_end: string
          week_start: string
        }
        Update: {
          created_at?: string
          totals?: Json
          week_end?: string
          week_start?: string
        }
        Relationships: []
      }
      mb_teacher_quality_scores: {
        Row: {
          ad: number
          created_at: string
          et: number
          id: string
          iq: number
          mode: string
          model: string | null
          notes: string | null
          om: number
          room_id: string | null
          tqs: number
          user_id: string
        }
        Insert: {
          ad: number
          created_at?: string
          et: number
          id?: string
          iq: number
          mode: string
          model?: string | null
          notes?: string | null
          om: number
          room_id?: string | null
          tqs: number
          user_id: string
        }
        Update: {
          ad?: number
          created_at?: string
          et?: number
          id?: string
          iq?: number
          mode?: string
          model?: string | null
          notes?: string | null
          om?: number
          room_id?: string | null
          tqs?: number
          user_id?: string
        }
        Relationships: []
      }
      mb_user_learning_history: {
        Row: {
          attempts: number | null
          completed: boolean | null
          entry_id: string
          last_practiced: string | null
          room_id: string
          user_id: string
        }
        Insert: {
          attempts?: number | null
          completed?: boolean | null
          entry_id: string
          last_practiced?: string | null
          room_id: string
          user_id: string
        }
        Update: {
          attempts?: number | null
          completed?: boolean | null
          entry_id?: string
          last_practiced?: string | null
          room_id?: string
          user_id?: string
        }
        Relationships: []
      }
      mb_user_learning_metrics: {
        Row: {
          avg_pronunciation_score: number | null
          created_at: string | null
          last_active: string | null
          strongest_category: string | null
          total_pronunciation_attempts: number | null
          total_sessions: number | null
          user_id: string
          vip_rank: number | null
          weakest_category: string | null
        }
        Insert: {
          avg_pronunciation_score?: number | null
          created_at?: string | null
          last_active?: string | null
          strongest_category?: string | null
          total_pronunciation_attempts?: number | null
          total_sessions?: number | null
          user_id: string
          vip_rank?: number | null
          weakest_category?: string | null
        }
        Update: {
          avg_pronunciation_score?: number | null
          created_at?: string | null
          last_active?: string | null
          strongest_category?: string | null
          total_pronunciation_attempts?: number | null
          total_sessions?: number | null
          user_id?: string
          vip_rank?: number | null
          weakest_category?: string | null
        }
        Relationships: []
      }
      mb_user_personality_memory: {
        Row: {
          frustration_score: number | null
          last_updated: string | null
          learning_style: string | null
          motivation_level: number | null
          preferred_feedback_style: string | null
          user_id: string
        }
        Insert: {
          frustration_score?: number | null
          last_updated?: string | null
          learning_style?: string | null
          motivation_level?: number | null
          preferred_feedback_style?: string | null
          user_id: string
        }
        Update: {
          frustration_score?: number | null
          last_updated?: string | null
          learning_style?: string | null
          motivation_level?: number | null
          preferred_feedback_style?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mb_user_progress_narratives: {
        Row: {
          body: string
          created_at: string
          evidence: Json
          id: number
          narrative_type: string
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          evidence?: Json
          id?: number
          narrative_type: string
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          evidence?: Json
          id?: number
          narrative_type?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      mb_user_progress_snapshots: {
        Row: {
          created_at: string
          id: number
          metrics: Json
          mode: string
          user_id: string
          window_end: string
          window_start: string
        }
        Insert: {
          created_at?: string
          id?: number
          metrics?: Json
          mode?: string
          user_id: string
          window_end: string
          window_start: string
        }
        Update: {
          created_at?: string
          id?: number
          metrics?: Json
          mode?: string
          user_id?: string
          window_end?: string
          window_start?: string
        }
        Relationships: []
      }
      mb_user_room_weekly_pronunciation: {
        Row: {
          avg_overall_score: number | null
          computed_at: string
          corrections_avg: number | null
          pronunciation_attempts: number | null
          room_id: string
          user_id: string
          week_end: string
          week_start: string
        }
        Insert: {
          avg_overall_score?: number | null
          computed_at?: string
          corrections_avg?: number | null
          pronunciation_attempts?: number | null
          room_id: string
          user_id: string
          week_end: string
          week_start: string
        }
        Update: {
          avg_overall_score?: number | null
          computed_at?: string
          corrections_avg?: number | null
          pronunciation_attempts?: number | null
          room_id?: string
          user_id?: string
          week_end?: string
          week_start?: string
        }
        Relationships: []
      }
      mb_user_weakness_events: {
        Row: {
          category: string
          created_at: string
          id: string
          key_pattern: string
          request_id: string | null
          room_id: string | null
          user_id: string
          weight: number
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          key_pattern: string
          request_id?: string | null
          room_id?: string | null
          user_id: string
          weight?: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          key_pattern?: string
          request_id?: string | null
          room_id?: string | null
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      mb_user_weakness_profile: {
        Row: {
          category: string
          frequency: number | null
          key_pattern: string
          last_seen: string | null
          mastery_level: number | null
          severity_score: number | null
          user_id: string
        }
        Insert: {
          category: string
          frequency?: number | null
          key_pattern: string
          last_seen?: string | null
          mastery_level?: number | null
          severity_score?: number | null
          user_id: string
        }
        Update: {
          category?: string
          frequency?: number | null
          key_pattern?: string
          last_seen?: string | null
          mastery_level?: number | null
          severity_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      mb_user_weakness_snapshots: {
        Row: {
          category: string
          created_at: string
          frequency: number
          id: number
          key_pattern: string
          last_seen: string | null
          snapshot_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          frequency: number
          id?: number
          key_pattern: string
          last_seen?: string | null
          snapshot_at: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          frequency?: number
          id?: number
          key_pattern?: string
          last_seen?: string | null
          snapshot_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mb_user_weekly_ai_snapshots: {
        Row: {
          ask_back_rate: number | null
          attempts_count: number | null
          avg_confidence: number | null
          avg_quality_score: number | null
          computed_at: string | null
          id: string
          intent_match_rate: number | null
          json_valid_rate: number | null
          next_action_rate: number | null
          updated_at: string | null
          user_id: string
          vip_rank: number | null
          week_end: string
          week_start: string
        }
        Insert: {
          ask_back_rate?: number | null
          attempts_count?: number | null
          avg_confidence?: number | null
          avg_quality_score?: number | null
          computed_at?: string | null
          id?: string
          intent_match_rate?: number | null
          json_valid_rate?: number | null
          next_action_rate?: number | null
          updated_at?: string | null
          user_id: string
          vip_rank?: number | null
          week_end: string
          week_start: string
        }
        Update: {
          ask_back_rate?: number | null
          attempts_count?: number | null
          avg_confidence?: number | null
          avg_quality_score?: number | null
          computed_at?: string | null
          id?: string
          intent_match_rate?: number | null
          json_valid_rate?: number | null
          next_action_rate?: number | null
          updated_at?: string | null
          user_id?: string
          vip_rank?: number | null
          week_end?: string
          week_start?: string
        }
        Relationships: []
      }
      mb_user_weekly_snapshots: {
        Row: {
          avg_overall_score: number | null
          confidence_avg: number | null
          corrections_avg: number | null
          created_at: string
          emotion_mix: Json
          id: number
          narrative: string | null
          pronunciation_attempts: number
          top_weaknesses: Json
          trust_avg: number | null
          user_id: string
          vip_rank: number | null
          week_end: string
          week_start: string
        }
        Insert: {
          avg_overall_score?: number | null
          confidence_avg?: number | null
          corrections_avg?: number | null
          created_at?: string
          emotion_mix?: Json
          id?: number
          narrative?: string | null
          pronunciation_attempts?: number
          top_weaknesses?: Json
          trust_avg?: number | null
          user_id: string
          vip_rank?: number | null
          week_end: string
          week_start: string
        }
        Update: {
          avg_overall_score?: number | null
          confidence_avg?: number | null
          corrections_avg?: number | null
          created_at?: string
          emotion_mix?: Json
          id?: number
          narrative?: string | null
          pronunciation_attempts?: number
          top_weaknesses?: Json
          trust_avg?: number | null
          user_id?: string
          vip_rank?: number | null
          week_end?: string
          week_start?: string
        }
        Relationships: []
      }
      mb_weekly_snapshots: {
        Row: {
          ask_back_rate: number | null
          attempts_count: number
          avg_confidence: number | null
          avg_corrections: number | null
          avg_overall_score: number | null
          avg_quality_score: number | null
          computed_at: string | null
          created_at: string
          deltas: Json
          focus_areas: Json
          id: string
          intent_match_rate: number | null
          json_valid_rate: number | null
          metrics: Json | null
          narrative_text: string | null
          next_action_rate: number | null
          notes: string | null
          pronunciation_attempts: number | null
          room_id: string | null
          trust_components: Json | null
          trust_score: number | null
          updated_at: string
          user_id: string
          vip_rank: number
          week_end: string
          week_start: string
        }
        Insert: {
          ask_back_rate?: number | null
          attempts_count?: number
          avg_confidence?: number | null
          avg_corrections?: number | null
          avg_overall_score?: number | null
          avg_quality_score?: number | null
          computed_at?: string | null
          created_at?: string
          deltas?: Json
          focus_areas?: Json
          id?: string
          intent_match_rate?: number | null
          json_valid_rate?: number | null
          metrics?: Json | null
          narrative_text?: string | null
          next_action_rate?: number | null
          notes?: string | null
          pronunciation_attempts?: number | null
          room_id?: string | null
          trust_components?: Json | null
          trust_score?: number | null
          updated_at?: string
          user_id: string
          vip_rank?: number
          week_end: string
          week_start: string
        }
        Update: {
          ask_back_rate?: number | null
          attempts_count?: number
          avg_confidence?: number | null
          avg_corrections?: number | null
          avg_overall_score?: number | null
          avg_quality_score?: number | null
          computed_at?: string | null
          created_at?: string
          deltas?: Json
          focus_areas?: Json
          id?: string
          intent_match_rate?: number | null
          json_valid_rate?: number | null
          metrics?: Json | null
          narrative_text?: string | null
          next_action_rate?: number | null
          notes?: string | null
          pronunciation_attempts?: number | null
          room_id?: string | null
          trust_components?: Json | null
          trust_score?: number | null
          updated_at?: string
          user_id?: string
          vip_rank?: number
          week_end?: string
          week_start?: string
        }
        Relationships: []
      }
      mercy_feedback_daily_rollups: {
        Row: {
          conversation_id: string | null
          created_at: string
          day: string
          downvotes: number
          id: number
          model_name: string | null
          prompt_version: string | null
          response_id: string | null
          total: number
          upvotes: number
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          day: string
          downvotes?: number
          id?: number
          model_name?: string | null
          prompt_version?: string | null
          response_id?: string | null
          total?: number
          upvotes?: number
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          day?: string
          downvotes?: number
          id?: number
          model_name?: string | null
          prompt_version?: string | null
          response_id?: string | null
          total?: number
          upvotes?: number
        }
        Relationships: []
      }
      mercy_feedback_events: {
        Row: {
          actor_anon_id: string | null
          answer_text_snapshot: string | null
          auth_user_id: string | null
          client_build_time: string | null
          client_locale: string | null
          client_platform: string | null
          client_tz_offset_min: number | null
          client_version: string | null
          context_line: string | null
          context_mode: string | null
          context_page_path: string | null
          conversation_id: string | null
          created_at: string
          feedback_reason: string | null
          id: number
          item_app_key: string | null
          item_ts: number | null
          item_v: number | null
          lang: string | null
          mode: string | null
          model_name: string | null
          msg_id: string | null
          path: string | null
          prompt_version: string | null
          raw_item: Json | null
          request_app_key: string | null
          response_id: string | null
          schema_name: string | null
          session_id: string | null
          tier: string | null
          vote: string | null
        }
        Insert: {
          actor_anon_id?: string | null
          answer_text_snapshot?: string | null
          auth_user_id?: string | null
          client_build_time?: string | null
          client_locale?: string | null
          client_platform?: string | null
          client_tz_offset_min?: number | null
          client_version?: string | null
          context_line?: string | null
          context_mode?: string | null
          context_page_path?: string | null
          conversation_id?: string | null
          created_at?: string
          feedback_reason?: string | null
          id?: number
          item_app_key?: string | null
          item_ts?: number | null
          item_v?: number | null
          lang?: string | null
          mode?: string | null
          model_name?: string | null
          msg_id?: string | null
          path?: string | null
          prompt_version?: string | null
          raw_item?: Json | null
          request_app_key?: string | null
          response_id?: string | null
          schema_name?: string | null
          session_id?: string | null
          tier?: string | null
          vote?: string | null
        }
        Update: {
          actor_anon_id?: string | null
          answer_text_snapshot?: string | null
          auth_user_id?: string | null
          client_build_time?: string | null
          client_locale?: string | null
          client_platform?: string | null
          client_tz_offset_min?: number | null
          client_version?: string | null
          context_line?: string | null
          context_mode?: string | null
          context_page_path?: string | null
          conversation_id?: string | null
          created_at?: string
          feedback_reason?: string | null
          id?: number
          item_app_key?: string | null
          item_ts?: number | null
          item_v?: number | null
          lang?: string | null
          mode?: string | null
          model_name?: string | null
          msg_id?: string | null
          path?: string | null
          prompt_version?: string | null
          raw_item?: Json | null
          request_app_key?: string | null
          response_id?: string | null
          schema_name?: string | null
          session_id?: string | null
          tier?: string | null
          vote?: string | null
        }
        Relationships: []
      }
      mercy_host_notes: {
        Row: {
          app_key: string
          category: string
          client_version: string | null
          created_at: string
          details: Json
          entry_id: string | null
          fault_code: string | null
          id: string
          keyword: string | null
          message: string | null
          meta: Json | null
          note_type: string
          page_path: string | null
          resolution_note: string | null
          resolved_at: string | null
          resolved_by: string | null
          room_id: string | null
          severity: number
          title: string | null
          type: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          app_key?: string
          category: string
          client_version?: string | null
          created_at?: string
          details?: Json
          entry_id?: string | null
          fault_code?: string | null
          id?: string
          keyword?: string | null
          message?: string | null
          meta?: Json | null
          note_type?: string
          page_path?: string | null
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          room_id?: string | null
          severity?: number
          title?: string | null
          type: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          app_key?: string
          category?: string
          client_version?: string | null
          created_at?: string
          details?: Json
          entry_id?: string | null
          fault_code?: string | null
          id?: string
          keyword?: string | null
          message?: string | null
          meta?: Json | null
          note_type?: string
          page_path?: string | null
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          room_id?: string | null
          severity?: number
          title?: string | null
          type?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      mercy_worst_answers_daily: {
        Row: {
          answer_text_snapshot: string | null
          conversation_id: string | null
          created_at: string
          day: string
          downvote_rate_pct: number | null
          downvotes: number
          feedback_reason: string | null
          id: number
          model_name: string | null
          prompt_version: string | null
          response_id: string | null
          total_votes: number
          upvotes: number
        }
        Insert: {
          answer_text_snapshot?: string | null
          conversation_id?: string | null
          created_at?: string
          day: string
          downvote_rate_pct?: number | null
          downvotes?: number
          feedback_reason?: string | null
          id?: number
          model_name?: string | null
          prompt_version?: string | null
          response_id?: string | null
          total_votes?: number
          upvotes?: number
        }
        Update: {
          answer_text_snapshot?: string | null
          conversation_id?: string | null
          created_at?: string
          day?: string
          downvote_rate_pct?: number | null
          downvotes?: number
          feedback_reason?: string | null
          id?: number
          model_name?: string | null
          prompt_version?: string | null
          response_id?: string | null
          total_votes?: number
          upvotes?: number
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
      organization_users: {
        Row: {
          org_id: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          org_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          org_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          plan: string
          seat_limit: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          plan: string
          seat_limit?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          plan?: string
          seat_limit?: number | null
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
      payment_event_resolutions: {
        Row: {
          created_at: string
          resolution_reason: string | null
          resolution_status: string
          resolved_at: string | null
          stripe_event_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          resolution_reason?: string | null
          resolution_status?: string
          resolved_at?: string | null
          stripe_event_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          resolution_reason?: string | null
          resolution_status?: string
          resolved_at?: string | null
          stripe_event_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "per_fk_event"
            columns: ["stripe_event_id"]
            isOneToOne: true
            referencedRelation: "payment_events"
            referencedColumns: ["stripe_event_id"]
          },
          {
            foreignKeyName: "per_fk_event"
            columns: ["stripe_event_id"]
            isOneToOne: true
            referencedRelation: "payment_events_canonical"
            referencedColumns: ["stripe_event_id"]
          },
          {
            foreignKeyName: "per_fk_event"
            columns: ["stripe_event_id"]
            isOneToOne: true
            referencedRelation: "v_payment_events_with_resolution"
            referencedColumns: ["stripe_event_id"]
          },
        ]
      }
      payment_events: {
        Row: {
          created_at: string
          event_type: string
          external_reference: string | null
          id: string
          payload: Json
          product_code: string
          provider: string
          stripe_customer_id: string | null
          stripe_event_id: string | null
          stripe_session_id: string | null
          stripe_subscription_id: string | null
          tier_id: string | null
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          external_reference?: string | null
          id?: string
          payload?: Json
          product_code?: string
          provider?: string
          stripe_customer_id?: string | null
          stripe_event_id?: string | null
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          tier_id?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          external_reference?: string | null
          id?: string
          payload?: Json
          product_code?: string
          provider?: string
          stripe_customer_id?: string | null
          stripe_event_id?: string | null
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          tier_id?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_events_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_events_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements"
            referencedColumns: ["tier_id"]
          },
          {
            foreignKeyName: "payment_events_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements_v"
            referencedColumns: ["tier_id"]
          },
          {
            foreignKeyName: "payment_events_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_events_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions_with_age"
            referencedColumns: ["id"]
          },
        ]
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
          {
            foreignKeyName: "payment_proof_submissions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements"
            referencedColumns: ["tier_id"]
          },
          {
            foreignKeyName: "payment_proof_submissions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements_v"
            referencedColumns: ["tier_id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          external_reference: string | null
          id: string
          metadata: Json | null
          payment_method: string
          period_days: number
          product_code: string
          status: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          stripe_subscription_id: string | null
          tier_id: string | null
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          external_reference?: string | null
          id?: string
          metadata?: Json | null
          payment_method: string
          period_days?: number
          product_code?: string
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          tier_id?: string | null
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          external_reference?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string
          period_days?: number
          product_code?: string
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
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
          {
            foreignKeyName: "payment_transactions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements"
            referencedColumns: ["tier_id"]
          },
          {
            foreignKeyName: "payment_transactions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements_v"
            referencedColumns: ["tier_id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_total: number | null
          app_id: string
          created_at: string
          currency: string | null
          customer_id: string | null
          id: string
          invoice_id: string | null
          paid_at: string | null
          payment_intent_id: string | null
          price_id: string | null
          product_id: string | null
          provider: Database["public"]["Enums"]["billing_provider"]
          raw: Json
          status: Database["public"]["Enums"]["billing_payment_status"]
          subscription_id: string | null
          tier: string | null
          user_id: string
        }
        Insert: {
          amount_total?: number | null
          app_id: string
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          id?: string
          invoice_id?: string | null
          paid_at?: string | null
          payment_intent_id?: string | null
          price_id?: string | null
          product_id?: string | null
          provider?: Database["public"]["Enums"]["billing_provider"]
          raw?: Json
          status: Database["public"]["Enums"]["billing_payment_status"]
          subscription_id?: string | null
          tier?: string | null
          user_id: string
        }
        Update: {
          amount_total?: number | null
          app_id?: string
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          id?: string
          invoice_id?: string | null
          paid_at?: string | null
          payment_intent_id?: string | null
          price_id?: string | null
          product_id?: string | null
          provider?: Database["public"]["Enums"]["billing_provider"]
          raw?: Json
          status?: Database["public"]["Enums"]["billing_payment_status"]
          subscription_id?: string | null
          tier?: string | null
          user_id?: string
        }
        Relationships: []
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
      presence_sessions: {
        Row: {
          anon_id: string | null
          app_id: string
          id: number
          ip_hash: string | null
          last_seen_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          anon_id?: string | null
          app_id: string
          id?: number
          ip_hash?: string | null
          last_seen_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          anon_id?: string | null
          app_id?: string
          id?: number
          ip_hash?: string | null
          last_seen_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "presence_sessions_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
        ]
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
          access_expires_at: string | null
          admin_level: number
          ai_enabled: boolean
          app_id: string
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          full_name: string | null
          id: string
          is_admin: boolean
          is_adult_confirmed: boolean
          last_seen_at: string | null
          phone: string | null
          plan_type: string | null
          premium_expires_at: string | null
          premium_source: string | null
          premium_status: string
          role: string
          stripe_customer_id: string | null
          tier: string
          trial_started_at: string | null
          updated_at: string | null
          user_id: string | null
          username: string | null
          vip_rank: number
        }
        Insert: {
          access_expires_at?: string | null
          admin_level?: number
          ai_enabled?: boolean
          app_id?: string
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean
          is_adult_confirmed?: boolean
          last_seen_at?: string | null
          phone?: string | null
          plan_type?: string | null
          premium_expires_at?: string | null
          premium_source?: string | null
          premium_status?: string
          role?: string
          stripe_customer_id?: string | null
          tier?: string
          trial_started_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
          vip_rank?: number
        }
        Update: {
          access_expires_at?: string | null
          admin_level?: number
          ai_enabled?: boolean
          app_id?: string
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean
          is_adult_confirmed?: boolean
          last_seen_at?: string | null
          phone?: string | null
          plan_type?: string | null
          premium_expires_at?: string | null
          premium_source?: string | null
          premium_status?: string
          role?: string
          stripe_customer_id?: string | null
          tier?: string
          trial_started_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
          vip_rank?: number
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
      pronunciation_evaluations: {
        Row: {
          created_at: string
          id: string
          pronunciation: number | null
          raw: Json | null
          room_id: string | null
          scores: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pronunciation?: number | null
          raw?: Json | null
          room_id?: string | null
          scores: Json
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          pronunciation?: number | null
          raw?: Json | null
          room_id?: string | null
          scores?: Json
          user_id?: string
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
            referencedRelation: "room_entries_integrity"
            referencedColumns: ["room_id"]
          },
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
          {
            foreignKeyName: "responses_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_migration_status"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "responses_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id_text"]
          },
          {
            foreignKeyName: "responses_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_tier_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "v_rooms"
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
            referencedRelation: "room_entries_integrity"
            referencedColumns: ["room_id"]
          },
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
          {
            foreignKeyName: "room_assignments_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_migration_status"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_assignments_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_assignments_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id_text"]
          },
          {
            foreignKeyName: "room_assignments_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_assignments_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_tier_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_assignments_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "v_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_chat_messages: {
        Row: {
          admin_note: string | null
          created_at: string
          id: number
          importance_reason: string | null
          is_important: boolean
          message: string
          room_id: string
          status: string
          user_email: string | null
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          id?: number
          importance_reason?: string | null
          is_important?: boolean
          message: string
          room_id: string
          status?: string
          user_email?: string | null
          user_id: string
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          id?: number
          importance_reason?: string | null
          is_important?: boolean
          message?: string
          room_id?: string
          status?: string
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      room_entries: {
        Row: {
          audio: string | null
          copy_en: string
          copy_vi: string
          created_at: string
          id: string
          index: number
          metadata: Json | null
          required_rank: number
          required_vip_rank: number
          room_id: string
          severity: number | null
          slug: string
          sort_order: number | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          audio?: string | null
          copy_en?: string
          copy_vi?: string
          created_at?: string
          id?: string
          index?: number
          metadata?: Json | null
          required_rank?: number
          required_vip_rank?: number
          room_id: string
          severity?: number | null
          slug: string
          sort_order?: number | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          audio?: string | null
          copy_en?: string
          copy_vi?: string
          created_at?: string
          id?: string
          index?: number
          metadata?: Json | null
          required_rank?: number
          required_vip_rank?: number
          room_id?: string
          severity?: number | null
          slug?: string
          sort_order?: number | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_entries_integrity"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_migration_status"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id_text"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_tier_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "v_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_feedback: {
        Row: {
          admin_note: string | null
          app_key: string
          created_at: string
          entry_id: string | null
          id: string
          is_important: boolean
          keyword: string | null
          kind: string
          message: string
          meta: Json
          room_id: string | null
          severity: number
          status: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          admin_note?: string | null
          app_key?: string
          created_at?: string
          entry_id?: string | null
          id?: string
          is_important?: boolean
          keyword?: string | null
          kind: string
          message: string
          meta?: Json
          room_id?: string | null
          severity?: number
          status?: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          admin_note?: string | null
          app_key?: string
          created_at?: string
          entry_id?: string | null
          id?: string
          is_important?: boolean
          keyword?: string | null
          kind?: string
          message?: string
          meta?: Json
          room_id?: string | null
          severity?: number
          status?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      room_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          room_id: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          room_id: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          room_id?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
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
            referencedRelation: "room_entries_integrity"
            referencedColumns: ["room_id"]
          },
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
          {
            foreignKeyName: "room_pins_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "rooms_migration_status"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_pins_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "rooms_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_pins_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id_text"]
          },
          {
            foreignKeyName: "room_pins_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_pins_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "rooms_tier_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_pins_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "v_rooms"
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
          app_key: string | null
          content_audio: string | null
          content_en: string | null
          content_vi: string | null
          created_at: string
          domain: string | null
          id: string
          is_active: boolean
          is_locked: boolean | null
          keywords: string[] | null
          metadata: Json | null
          required_rank: number | null
          required_tier_level: number | null
          required_vip_rank: number
          room_essay_en: string | null
          room_essay_vi: string | null
          slug: string | null
          sort_order: number
          status: string | null
          subtitle: string | null
          tier: string
          title: string | null
          title_en: string
          title_vi: string
          track: string | null
          updated_at: string
        }
        Insert: {
          app_key?: string | null
          content_audio?: string | null
          content_en?: string | null
          content_vi?: string | null
          created_at?: string
          domain?: string | null
          id: string
          is_active?: boolean
          is_locked?: boolean | null
          keywords?: string[] | null
          metadata?: Json | null
          required_rank?: number | null
          required_tier_level?: number | null
          required_vip_rank?: number
          room_essay_en?: string | null
          room_essay_vi?: string | null
          slug?: string | null
          sort_order?: number
          status?: string | null
          subtitle?: string | null
          tier?: string
          title?: string | null
          title_en?: string
          title_vi?: string
          track?: string | null
          updated_at?: string
        }
        Update: {
          app_key?: string | null
          content_audio?: string | null
          content_en?: string | null
          content_vi?: string | null
          created_at?: string
          domain?: string | null
          id?: string
          is_active?: boolean
          is_locked?: boolean | null
          keywords?: string[] | null
          metadata?: Json | null
          required_rank?: number | null
          required_tier_level?: number | null
          required_vip_rank?: number
          room_essay_en?: string | null
          room_essay_vi?: string | null
          slug?: string | null
          sort_order?: number
          status?: string | null
          subtitle?: string | null
          tier?: string
          title?: string | null
          title_en?: string
          title_vi?: string
          track?: string | null
          updated_at?: string
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
      speaking_evaluations: {
        Row: {
          attempt_id: number | null
          confidence_score: number
          created_at: string
          feedback_json: Json
          fluency_score: number
          grammar_score: number
          id: number
          pronunciation_score: number
          user_id: string
        }
        Insert: {
          attempt_id?: number | null
          confidence_score?: number
          created_at?: string
          feedback_json?: Json
          fluency_score?: number
          grammar_score?: number
          id?: number
          pronunciation_score?: number
          user_id: string
        }
        Update: {
          attempt_id?: number | null
          confidence_score?: number
          created_at?: string
          feedback_json?: Json
          fluency_score?: number
          grammar_score?: number
          id?: number
          pronunciation_score?: number
          user_id?: string
        }
        Relationships: []
      }
      speech_attempts: {
        Row: {
          audio_path: string | null
          created_at: string
          error_code: string | null
          extra_words: string[] | null
          feedback_message: string | null
          id: string
          line_id: string
          match_score: number | null
          missing_words: string[] | null
          normalized_target: string | null
          normalized_transcript: string | null
          room_id: string
          target_text: string
          tier_level: string | null
          transcript: string | null
          user_id: string
          user_origin: string | null
        }
        Insert: {
          audio_path?: string | null
          created_at?: string
          error_code?: string | null
          extra_words?: string[] | null
          feedback_message?: string | null
          id?: string
          line_id: string
          match_score?: number | null
          missing_words?: string[] | null
          normalized_target?: string | null
          normalized_transcript?: string | null
          room_id: string
          target_text: string
          tier_level?: string | null
          transcript?: string | null
          user_id: string
          user_origin?: string | null
        }
        Update: {
          audio_path?: string | null
          created_at?: string
          error_code?: string | null
          extra_words?: string[] | null
          feedback_message?: string | null
          id?: string
          line_id?: string
          match_score?: number | null
          missing_words?: string[] | null
          normalized_target?: string | null
          normalized_transcript?: string | null
          room_id?: string
          target_text?: string
          tier_level?: string | null
          transcript?: string | null
          user_id?: string
          user_origin?: string | null
        }
        Relationships: []
      }
      stripe_events: {
        Row: {
          event_id: string
          event_type: string
          id: string
          processed_at: string
        }
        Insert: {
          event_id: string
          event_type: string
          id?: string
          processed_at?: string
        }
        Update: {
          event_id?: string
          event_type?: string
          id?: string
          processed_at?: string
        }
        Relationships: []
      }
      stripe_webhook_events: {
        Row: {
          created_at: string
          error: string | null
          event_id: string
          livemode: boolean
          processed_at: string | null
          type: string
        }
        Insert: {
          created_at?: string
          error?: string | null
          event_id: string
          livemode?: boolean
          processed_at?: string | null
          type: string
        }
        Update: {
          created_at?: string
          error?: string | null
          event_id?: string
          livemode?: boolean
          processed_at?: string | null
          type?: string
        }
        Relationships: []
      }
      study_events: {
        Row: {
          app_id: string
          created_at: string
          entry_id: string | null
          event_type: string
          id: string
          payload: Json
          room_id: string | null
          user_id: string
        }
        Insert: {
          app_id: string
          created_at?: string
          entry_id?: string | null
          event_type: string
          id?: string
          payload?: Json
          room_id?: string | null
          user_id: string
        }
        Update: {
          app_id?: string
          created_at?: string
          entry_id?: string | null
          event_type?: string
          id?: string
          payload?: Json
          room_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      study_log: {
        Row: {
          app_id: string
          client_event_id: string | null
          created_at: string | null
          date: string
          day_index: number | null
          entry_id: string | null
          event_type: string | null
          id: string
          minutes: number | null
          mood_after: string | null
          mood_before: string | null
          path_slug: string | null
          payload: Json
          room_id: string | null
          topic_en: string | null
          topic_vi: string | null
          user_id: string
        }
        Insert: {
          app_id?: string
          client_event_id?: string | null
          created_at?: string | null
          date?: string
          day_index?: number | null
          entry_id?: string | null
          event_type?: string | null
          id?: string
          minutes?: number | null
          mood_after?: string | null
          mood_before?: string | null
          path_slug?: string | null
          payload?: Json
          room_id?: string | null
          topic_en?: string | null
          topic_vi?: string | null
          user_id: string
        }
        Update: {
          app_id?: string
          client_event_id?: string | null
          created_at?: string | null
          date?: string
          day_index?: number | null
          entry_id?: string | null
          event_type?: string | null
          id?: string
          minutes?: number | null
          mood_after?: string | null
          mood_before?: string | null
          path_slug?: string | null
          payload?: Json
          room_id?: string | null
          topic_en?: string | null
          topic_vi?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscription_products: {
        Row: {
          is_active: boolean
          product_id: string
          product_key: string
          vip_tier: number
        }
        Insert: {
          is_active?: boolean
          product_id: string
          product_key: string
          vip_tier: number
        }
        Update: {
          is_active?: boolean
          product_id?: string
          product_key?: string
          vip_tier?: number
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
          rank: number | null
          recognized_monthly_revenue_vnd: number | null
          required_rank: number
          room_access_per_day: number | null
          stripe_price_id: string | null
          title: string | null
          updated_at: string | null
          vip_key: Database["public"]["Enums"]["vip_key"] | null
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
          rank?: number | null
          recognized_monthly_revenue_vnd?: number | null
          required_rank?: number
          room_access_per_day?: number | null
          stripe_price_id?: string | null
          title?: string | null
          updated_at?: string | null
          vip_key?: Database["public"]["Enums"]["vip_key"] | null
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
          rank?: number | null
          recognized_monthly_revenue_vnd?: number | null
          required_rank?: number
          room_access_per_day?: number | null
          stripe_price_id?: string | null
          title?: string | null
          updated_at?: string | null
          vip_key?: Database["public"]["Enums"]["vip_key"] | null
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
      subscriptions: {
        Row: {
          app_id: string
          billing_interval: string | null
          billing_interval_count: number | null
          cancel_at: string | null
          cancel_at_period_end: boolean
          canceled_at: string | null
          created_at: string
          currency_code: string | null
          current_period_end: string | null
          current_period_end_at: string | null
          current_period_start: string | null
          current_period_start_at: string | null
          customer_id: string
          ended_at: string | null
          environment: string
          id: string
          metadata: Json
          price_id: string | null
          product_id: string | null
          provider: Database["public"]["Enums"]["billing_provider"]
          provider_customer_id: string | null
          provider_metadata: Json
          provider_original_transaction_id: string | null
          provider_price_id: string | null
          provider_product_id: string | null
          provider_subscription_id: string | null
          provider_transaction_id: string | null
          quantity: number
          raw_payload: Json | null
          status: Database["public"]["Enums"]["billing_subscription_status"]
          subscription_id: string
          tier: string | null
          trial_end: string | null
          trial_ends_at: string | null
          trial_start: string | null
          trial_started_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          app_id: string
          billing_interval?: string | null
          billing_interval_count?: number | null
          cancel_at?: string | null
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          currency_code?: string | null
          current_period_end?: string | null
          current_period_end_at?: string | null
          current_period_start?: string | null
          current_period_start_at?: string | null
          customer_id: string
          ended_at?: string | null
          environment?: string
          id?: string
          metadata?: Json
          price_id?: string | null
          product_id?: string | null
          provider?: Database["public"]["Enums"]["billing_provider"]
          provider_customer_id?: string | null
          provider_metadata?: Json
          provider_original_transaction_id?: string | null
          provider_price_id?: string | null
          provider_product_id?: string | null
          provider_subscription_id?: string | null
          provider_transaction_id?: string | null
          quantity?: number
          raw_payload?: Json | null
          status: Database["public"]["Enums"]["billing_subscription_status"]
          subscription_id: string
          tier?: string | null
          trial_end?: string | null
          trial_ends_at?: string | null
          trial_start?: string | null
          trial_started_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          app_id?: string
          billing_interval?: string | null
          billing_interval_count?: number | null
          cancel_at?: string | null
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          currency_code?: string | null
          current_period_end?: string | null
          current_period_end_at?: string | null
          current_period_start?: string | null
          current_period_start_at?: string | null
          customer_id?: string
          ended_at?: string | null
          environment?: string
          id?: string
          metadata?: Json
          price_id?: string | null
          product_id?: string | null
          provider?: Database["public"]["Enums"]["billing_provider"]
          provider_customer_id?: string | null
          provider_metadata?: Json
          provider_original_transaction_id?: string | null
          provider_price_id?: string | null
          provider_product_id?: string | null
          provider_subscription_id?: string | null
          provider_transaction_id?: string | null
          quantity?: number
          raw_payload?: Json | null
          status?: Database["public"]["Enums"]["billing_subscription_status"]
          subscription_id?: string
          tier?: string | null
          trial_end?: string | null
          trial_ends_at?: string | null
          trial_start?: string | null
          trial_started_at?: string | null
          updated_at?: string
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
      tier_maps: {
        Row: {
          created_at: string
          id: string
          key: string
          layout_json: Json | null
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          layout_json?: Json | null
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          layout_json?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      tier_memberships: {
        Row: {
          app_id: string
          expires_at: string | null
          source: string
          tier: Database["public"]["Enums"]["tier_id"]
          user_id: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          app_id: string
          expires_at?: string | null
          source?: string
          tier?: Database["public"]["Enums"]["tier_id"]
          user_id: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          app_id?: string
          expires_at?: string | null
          source?: string
          tier?: Database["public"]["Enums"]["tier_id"]
          user_id?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tier_memberships_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
        ]
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
      user_entitlements_raw: {
        Row: {
          features: Json
          updated_at: string
          user_id: string
          vip_rank: number
          vip_tier: string
        }
        Insert: {
          features?: Json
          updated_at?: string
          user_id: string
          vip_rank?: number
          vip_tier?: string
        }
        Update: {
          features?: Json
          updated_at?: string
          user_id?: string
          vip_rank?: number
          vip_tier?: string
        }
        Relationships: []
      }
      user_entitlements_raw_20260301_181303: {
        Row: {
          features: Json
          updated_at: string
          user_id: string
          vip_rank: number
          vip_tier: string
        }
        Insert: {
          features?: Json
          updated_at?: string
          user_id: string
          vip_rank?: number
          vip_tier?: string
        }
        Update: {
          features?: Json
          updated_at?: string
          user_id?: string
          vip_rank?: number
          vip_tier?: string
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          admin_note: string | null
          app_id: string
          created_at: string | null
          email: string | null
          id: string
          is_public: boolean | null
          message: string
          priority: number | null
          room_id: string | null
          source: string | null
          status: Database["public"]["Enums"]["feedback_status"]
          subject: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          admin_note?: string | null
          app_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_public?: boolean | null
          message: string
          priority?: number | null
          room_id?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["feedback_status"]
          subject?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          admin_note?: string | null
          app_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_public?: boolean | null
          message?: string
          priority?: number | null
          room_id?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["feedback_status"]
          subject?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_feedback_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mb_user_effective_rank"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_profiles_self"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "viewer_access"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vip3_public_profiles"
            referencedColumns: ["id"]
          },
        ]
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
          app_id: string
          completed_days: Json
          created_at: string
          current_day: number
          entry_id: string | null
          id: string
          keyword_en: string | null
          last_seen_at: string | null
          path_id: string
          progress_pct: number
          repeat_count: number
          room_id: string | null
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          app_id?: string
          completed_days?: Json
          created_at?: string
          current_day?: number
          entry_id?: string | null
          id?: string
          keyword_en?: string | null
          last_seen_at?: string | null
          path_id: string
          progress_pct?: number
          repeat_count?: number
          room_id?: string | null
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          app_id?: string
          completed_days?: Json
          created_at?: string
          current_day?: number
          entry_id?: string | null
          id?: string
          keyword_en?: string | null
          last_seen_at?: string | null
          path_id?: string
          progress_pct?: number
          repeat_count?: number
          room_id?: string | null
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
      user_presence: {
        Row: {
          client: string | null
          last_ping_at: string
          page: string | null
          user_id: string
        }
        Insert: {
          client?: string | null
          last_ping_at: string
          page?: string | null
          user_id: string
        }
        Update: {
          client?: string | null
          last_ping_at?: string
          page?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_presence_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "mb_user_effective_rank"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_presence_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_presence_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "v_admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_presence_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "v_profiles_self"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_presence_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "viewer_access"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_presence_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "vip3_public_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      user_role_audit: {
        Row: {
          action: string
          actor_email: string | null
          actor_jwt_role: string | null
          actor_user_id: string | null
          created_at: string
          id: string
          target_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_jwt_role?: string | null
          actor_user_id?: string | null
          created_at?: string
          id?: string
          target_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_jwt_role?: string | null
          actor_user_id?: string | null
          created_at?: string
          id?: string
          target_role?: Database["public"]["Enums"]["app_role"]
          target_user_id?: string
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
      user_room_progress: {
        Row: {
          app_id: string
          created_at: string
          id: string
          last_entry_id: string | null
          last_keyword_en: string | null
          last_seen_at: string | null
          progress_pct: number
          repeat_count: number
          room_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          app_id: string
          created_at?: string
          id?: string
          last_entry_id?: string | null
          last_keyword_en?: string | null
          last_seen_at?: string | null
          progress_pct?: number
          repeat_count?: number
          room_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          app_id?: string
          created_at?: string
          id?: string
          last_entry_id?: string | null
          last_keyword_en?: string | null
          last_seen_at?: string | null
          progress_pct?: number
          repeat_count?: number
          room_id?: string
          updated_at?: string
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
          app_id: string | null
          created_at: string
          current_room_id: string | null
          device_info: Json | null
          device_type: Database["public"]["Enums"]["device_type"]
          ended_at: string | null
          id: string
          last_activity: string
          last_seen_at: string | null
          session_id: string
          started_at: string | null
          user_id: string
        }
        Insert: {
          app_id?: string | null
          created_at?: string
          current_room_id?: string | null
          device_info?: Json | null
          device_type: Database["public"]["Enums"]["device_type"]
          ended_at?: string | null
          id?: string
          last_activity?: string
          last_seen_at?: string | null
          session_id: string
          started_at?: string | null
          user_id: string
        }
        Update: {
          app_id?: string | null
          created_at?: string
          current_room_id?: string | null
          device_info?: Json | null
          device_type?: Database["public"]["Enums"]["device_type"]
          ended_at?: string | null
          id?: string
          last_activity?: string
          last_seen_at?: string | null
          session_id?: string
          started_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_subscription_state: {
        Row: {
          current_period_end: string | null
          current_period_start: string | null
          extra_ai_budget_vnd: number
          plan_name: string
          recognized_monthly_revenue_vnd: number
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          current_period_end?: string | null
          current_period_start?: string | null
          extra_ai_budget_vnd?: number
          plan_name: string
          recognized_monthly_revenue_vnd?: number
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          current_period_end?: string | null
          current_period_start?: string | null
          extra_ai_budget_vnd?: number
          plan_name?: string
          recognized_monthly_revenue_vnd?: number
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscription_state_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscription_state_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements"
            referencedColumns: ["tier_id"]
          },
          {
            foreignKeyName: "user_subscription_state_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements_v"
            referencedColumns: ["tier_id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          environment: string
          id: string
          last_synced_at: string | null
          period: string
          product_key: string
          provider: string
          provider_customer_id: string | null
          provider_transaction_id: string | null
          raw_provider_status: string | null
          revoked_at: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier_id: string
          updated_at: string | null
          user_id: string
          vip_rank: number
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          last_synced_at?: string | null
          period?: string
          product_key?: string
          provider?: string
          provider_customer_id?: string | null
          provider_transaction_id?: string | null
          raw_provider_status?: string | null
          revoked_at?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier_id: string
          updated_at?: string | null
          user_id: string
          vip_rank?: number
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          last_synced_at?: string | null
          period?: string
          product_key?: string
          provider?: string
          provider_customer_id?: string | null
          provider_transaction_id?: string | null
          raw_provider_status?: string | null
          revoked_at?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier_id?: string
          updated_at?: string | null
          user_id?: string
          vip_rank?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements"
            referencedColumns: ["tier_id"]
          },
          {
            foreignKeyName: "user_subscriptions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements_v"
            referencedColumns: ["tier_id"]
          },
        ]
      }
      user_tiers: {
        Row: {
          tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          tier?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      version_indicator: {
        Row: {
          created_at: string
          id: number
          version: string
        }
        Insert: {
          created_at?: string
          id?: number
          version: string
        }
        Update: {
          created_at?: string
          id?: number
          version?: string
        }
        Relationships: []
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
      webhook_events: {
        Row: {
          api_version: string | null
          app_id: string | null
          customer_id: string | null
          error: string | null
          event_id: string
          event_type: string
          id: string
          invoice_id: string | null
          livemode: boolean
          payload: Json
          payment_intent_id: string | null
          processed_at: string | null
          provider: Database["public"]["Enums"]["billing_provider"]
          received_at: string
          signature_valid: boolean
          status: Database["public"]["Enums"]["billing_event_status"]
          subscription_id: string | null
          tier: string | null
          user_id: string | null
          verified_at: string | null
        }
        Insert: {
          api_version?: string | null
          app_id?: string | null
          customer_id?: string | null
          error?: string | null
          event_id: string
          event_type: string
          id?: string
          invoice_id?: string | null
          livemode?: boolean
          payload?: Json
          payment_intent_id?: string | null
          processed_at?: string | null
          provider?: Database["public"]["Enums"]["billing_provider"]
          received_at?: string
          signature_valid?: boolean
          status?: Database["public"]["Enums"]["billing_event_status"]
          subscription_id?: string | null
          tier?: string | null
          user_id?: string | null
          verified_at?: string | null
        }
        Update: {
          api_version?: string | null
          app_id?: string | null
          customer_id?: string | null
          error?: string | null
          event_id?: string
          event_type?: string
          id?: string
          invoice_id?: string | null
          livemode?: boolean
          payload?: Json
          payment_intent_id?: string | null
          processed_at?: string | null
          provider?: Database["public"]["Enums"]["billing_provider"]
          received_at?: string
          signature_valid?: boolean
          status?: Database["public"]["Enums"]["billing_event_status"]
          subscription_id?: string | null
          tier?: string | null
          user_id?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      account_summary_v: {
        Row: {
          admin_level: number | null
          ai_enabled: boolean | null
          app_id: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          is_admin: boolean | null
          last_seen_at: string | null
          plan_key: string | null
          rank: number | null
          role: string | null
          status: string | null
          stripe_customer_id: string | null
          tier_text: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_level?: number | null
          ai_enabled?: boolean | null
          app_id?: string | null
          created_at?: string | null
          display_name?: never
          email?: string | null
          is_admin?: boolean | null
          last_seen_at?: string | null
          plan_key?: never
          rank?: never
          role?: string | null
          status?: never
          stripe_customer_id?: string | null
          tier_text?: string | null
          updated_at?: string | null
          user_id?: never
        }
        Update: {
          admin_level?: number | null
          ai_enabled?: boolean | null
          app_id?: string | null
          created_at?: string | null
          display_name?: never
          email?: string | null
          is_admin?: boolean | null
          last_seen_at?: string | null
          plan_key?: never
          rank?: never
          role?: string | null
          status?: never
          stripe_customer_id?: string | null
          tier_text?: string | null
          updated_at?: string | null
          user_id?: never
        }
        Relationships: []
      }
      admin_inbox: {
        Row: {
          admin_note: string | null
          app_key: string | null
          created_at: string | null
          entry_id: string | null
          importance_reason: string | null
          inbox_id: string | null
          is_important: boolean | null
          keyword: string | null
          kind: string | null
          message: string | null
          meta: Json | null
          room_id: string | null
          severity: number | null
          source: string | null
          status: string | null
          user_email: string | null
          user_id: string | null
        }
        Relationships: []
      }
      admin_mrr_snapshot: {
        Row: {
          active_subscriptions: number | null
          monthly_subscriptions: number | null
          mrr_vnd: number | null
          scheduled_cancellations: number | null
          yearly_subscriptions: number | null
        }
        Relationships: []
      }
      admin_revenue_risk_snapshot: {
        Row: {
          cancellations_next_30d: number | null
          renewals_next_30d: number | null
        }
        Relationships: []
      }
      current_user_vip: {
        Row: {
          rank: number | null
          user_id: string | null
          vip_key: Database["public"]["Enums"]["vip_key"] | null
        }
        Relationships: []
      }
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
      mb_user_effective_rank: {
        Row: {
          user_id: string | null
          vip_rank: number | null
        }
        Relationships: []
      }
      mb_user_pron_growth: {
        Row: {
          attempts: number | null
          avg_corrections: number | null
          user_id: string | null
          week: string | null
        }
        Relationships: []
      }
      mb_v_cost_efficiency: {
        Row: {
          mode: string | null
          successes: number | null
          tokens_per_success: number | null
          total_tokens: number | null
        }
        Relationships: []
      }
      mb_v_pron_attempts_week: {
        Row: {
          attempts: number | null
          avg_corrections_count: number | null
          avg_overall_score: number | null
          user_id: string | null
          week_start: string | null
        }
        Relationships: []
      }
      mb_v_pronunciation_failures_by_user: {
        Row: {
          failures: number | null
          last_event_at: string | null
          total_events: number | null
          user_id: string | null
        }
        Relationships: []
      }
      mb_v_pronunciation_improvement_core: {
        Row: {
          category: string | null
          freq_latest: number | null
          improvement_delta: number | null
          improvement_pct: number | null
          key_pattern: string | null
          prev_freq: number | null
          user_id: string | null
          week_start: string | null
        }
        Relationships: []
      }
      mb_v_quality_daily: {
        Row: {
          ask_back_rate: number | null
          avg_completion_tokens: number | null
          avg_prompt_tokens: number | null
          avg_total_tokens: number | null
          day: string | null
          error_count: number | null
          events: number | null
          intent_match_rate: number | null
          json_valid_rate: number | null
          mode: string | null
          next_action_rate: number | null
        }
        Relationships: []
      }
      mb_v_quality_errors: {
        Row: {
          error_code: string | null
          last_seen: string | null
          mode: string | null
          occurrences: number | null
        }
        Relationships: []
      }
      mb_v_quality_events_week: {
        Row: {
          ask_back_rate: number | null
          has_next_action_rate: number | null
          intent_match_rate: number | null
          json_valid_rate: number | null
          total_events: number | null
          total_tokens: number | null
          user_id: string | null
          week_start: string | null
        }
        Relationships: []
      }
      mb_v_trust_score: {
        Row: {
          ask_back_present: boolean | null
          completion_tokens: number | null
          created_at: string | null
          error_code: string | null
          failure_streak: number | null
          has_next_action: boolean | null
          id: number | null
          intent_match: boolean | null
          json_valid: boolean | null
          mode: string | null
          model: string | null
          notes: string | null
          prompt_tokens: number | null
          request_id: string | null
          room_id: string | null
          total_tokens: number | null
          trust_score: number | null
          user_id: string | null
          vip_rank: number | null
        }
        Insert: {
          ask_back_present?: boolean | null
          completion_tokens?: number | null
          created_at?: string | null
          error_code?: string | null
          failure_streak?: never
          has_next_action?: boolean | null
          id?: number | null
          intent_match?: boolean | null
          json_valid?: boolean | null
          mode?: string | null
          model?: string | null
          notes?: string | null
          prompt_tokens?: number | null
          request_id?: string | null
          room_id?: string | null
          total_tokens?: number | null
          trust_score?: never
          user_id?: string | null
          vip_rank?: number | null
        }
        Update: {
          ask_back_present?: boolean | null
          completion_tokens?: number | null
          created_at?: string | null
          error_code?: string | null
          failure_streak?: never
          has_next_action?: boolean | null
          id?: number | null
          intent_match?: boolean | null
          json_valid?: boolean | null
          mode?: string | null
          model?: string | null
          notes?: string | null
          prompt_tokens?: number | null
          request_id?: string | null
          room_id?: string | null
          total_tokens?: number | null
          trust_score?: never
          user_id?: string | null
          vip_rank?: number | null
        }
        Relationships: []
      }
      mb_v_usage_week: {
        Row: {
          completion_tokens: number | null
          prompt_tokens: number | null
          total_tokens: number | null
          user_id: string | null
          week_start: string | null
        }
        Relationships: []
      }
      mb_v_weakness_improvement_week: {
        Row: {
          category: string | null
          freq_latest: number | null
          improvement_delta: number | null
          improvement_pct: number | null
          key_pattern: string | null
          prev_freq: number | null
          user_id: string | null
          week_start: string | null
        }
        Relationships: []
      }
      mb_v_weakness_week: {
        Row: {
          category: string | null
          freq_latest: number | null
          key_pattern: string | null
          user_id: string | null
          week_start: string | null
        }
        Relationships: []
      }
      mercy_feedback_insights: {
        Row: {
          answer_text_snapshot: string | null
          context_mode: string | null
          context_page_path: string | null
          conversation_id: string | null
          day: string | null
          downvote_rate_pct: number | null
          downvotes: number | null
          feedback_reason: string | null
          model_name: string | null
          prompt_version: string | null
          response_id: string | null
          total_votes: number | null
          upvote_rate_pct: number | null
          upvotes: number | null
        }
        Relationships: []
      }
      mercy_feedback_prompt_summary: {
        Row: {
          downvote_rate_pct: number | null
          downvotes: number | null
          feedback_reason: string | null
          model_name: string | null
          prompt_version: string | null
          total_votes: number | null
          upvote_rate_pct: number | null
          upvotes: number | null
        }
        Relationships: []
      }
      my_entitlements: {
        Row: {
          features: Json | null
          updated_at: string | null
          user_id: string | null
          vip_rank: number | null
          vip_tier: string | null
        }
        Insert: {
          features?: Json | null
          updated_at?: string | null
          user_id?: string | null
          vip_rank?: number | null
          vip_tier?: string | null
        }
        Update: {
          features?: Json | null
          updated_at?: string | null
          user_id?: string | null
          vip_rank?: number | null
          vip_tier?: string | null
        }
        Relationships: []
      }
      my_entitlements_v1: {
        Row: {
          builder_jobs_per_day: number | null
          can_access_vip_rooms: boolean | null
          can_pronunciation_check: boolean | null
          features: Json | null
          updated_at: string | null
          user_id: string | null
          vip_rank: number | null
          vip_tier: string | null
        }
        Insert: {
          builder_jobs_per_day?: never
          can_access_vip_rooms?: never
          can_pronunciation_check?: never
          features?: Json | null
          updated_at?: string | null
          user_id?: string | null
          vip_rank?: number | null
          vip_tier?: string | null
        }
        Update: {
          builder_jobs_per_day?: never
          can_access_vip_rooms?: never
          can_pronunciation_check?: never
          features?: Json | null
          updated_at?: string | null
          user_id?: string | null
          vip_rank?: number | null
          vip_tier?: string | null
        }
        Relationships: []
      }
      payment_events_canonical: {
        Row: {
          created_at: string | null
          payment_event_id: string | null
          resolution_reason: string | null
          resolution_status: string | null
          resolution_updated_at: string | null
          resolved_at: string | null
          stripe_event_id: string | null
          tier_id: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_events_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_events_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements"
            referencedColumns: ["tier_id"]
          },
          {
            foreignKeyName: "payment_events_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements_v"
            referencedColumns: ["tier_id"]
          },
        ]
      }
      payment_transactions_with_age: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          derived_status: string | null
          external_reference: string | null
          id: string | null
          metadata: Json | null
          payment_method: string | null
          period_days: number | null
          status: string | null
          tier_id: string | null
          transaction_type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          derived_status?: never
          external_reference?: string | null
          id?: string | null
          metadata?: Json | null
          payment_method?: string | null
          period_days?: number | null
          status?: string | null
          tier_id?: string | null
          transaction_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          derived_status?: never
          external_reference?: string | null
          id?: string | null
          metadata?: Json | null
          payment_method?: string | null
          period_days?: number | null
          status?: string | null
          tier_id?: string | null
          transaction_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements"
            referencedColumns: ["tier_id"]
          },
          {
            foreignKeyName: "payment_transactions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements_v"
            referencedColumns: ["tier_id"]
          },
        ]
      }
      room_bilingual_integrity: {
        Row: {
          has_en: number | null
          has_vi: number | null
          missing_en: number | null
          missing_vi: number | null
          room_id: string | null
          total_entries: number | null
        }
        Relationships: [
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_entries_integrity"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_migration_status"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id_text"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_tier_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "v_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_bilingual_integrity_issues: {
        Row: {
          has_en: number | null
          has_vi: number | null
          missing_en: number | null
          missing_vi: number | null
          room_id: string | null
          total_entries: number | null
        }
        Relationships: [
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_entries_integrity"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_migration_status"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id_text"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_tier_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "v_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_bilingual_integrity_v1: {
        Row: {
          has_en: number | null
          has_vi: number | null
          missing_en: number | null
          missing_vi: number | null
          pct_en: number | null
          pct_vi: number | null
          room_id: string | null
          total_entries: number | null
        }
        Relationships: [
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_entries_integrity"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_migration_status"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id_text"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_tier_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "v_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_bilingual_integrity_v2: {
        Row: {
          audio_only_entries: number | null
          effective_missing_en: number | null
          effective_missing_total: number | null
          effective_missing_vi: number | null
          has_en: number | null
          has_vi: number | null
          is_audio_only_room: boolean | null
          missing_en: number | null
          missing_vi: number | null
          room_id: string | null
          total_entries: number | null
        }
        Relationships: [
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_entries_integrity"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_migration_status"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id_text"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_tier_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "v_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_entries_bilingual_drilldown: {
        Row: {
          en_preview: string | null
          id: string | null
          index: number | null
          room_id: string | null
          slug: string | null
          status: string | null
          verdict: string | null
          vi_preview: string | null
        }
        Insert: {
          en_preview?: never
          id?: string | null
          index?: number | null
          room_id?: string | null
          slug?: string | null
          status?: never
          verdict?: never
          vi_preview?: never
        }
        Update: {
          en_preview?: never
          id?: string | null
          index?: number | null
          room_id?: string | null
          slug?: string | null
          status?: never
          verdict?: never
          vi_preview?: never
        }
        Relationships: [
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_entries_integrity"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_migration_status"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id_text"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_tier_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "v_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_entries_bilingual_health: {
        Row: {
          check_rows: number | null
          health: string | null
          meaning: string | null
          non_blocking_rows: number | null
          pass_rows: number | null
          room_id: string | null
          total_entries: number | null
        }
        Relationships: [
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_entries_integrity"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_migration_status"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id_text"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_tier_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "v_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_entries_bilingual_integrity: {
        Row: {
          copy_en: string | null
          copy_vi: string | null
          has_en: boolean | null
          has_vi: boolean | null
          id: string | null
          index: number | null
          room_id: string | null
          slug: string | null
          status: string | null
        }
        Insert: {
          copy_en?: string | null
          copy_vi?: string | null
          has_en?: never
          has_vi?: never
          id?: string | null
          index?: number | null
          room_id?: string | null
          slug?: string | null
          status?: never
        }
        Update: {
          copy_en?: string | null
          copy_vi?: string | null
          has_en?: never
          has_vi?: never
          id?: string | null
          index?: number | null
          room_id?: string | null
          slug?: string | null
          status?: never
        }
        Relationships: [
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_entries_integrity"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_migration_status"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id_text"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_tier_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "v_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_entries_bilingual_report: {
        Row: {
          has_en: number | null
          has_vi: number | null
          missing_en: number | null
          missing_vi: number | null
          required_vip_rank: number | null
          room_id: string | null
          total_entries: number | null
        }
        Relationships: [
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_entries_integrity"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_migration_status"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id_text"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_tier_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "v_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_entries_bilingual_room_summary: {
        Row: {
          check_rows: number | null
          non_blocking_rows: number | null
          pass_rows: number | null
          room_id: string | null
          total_entries: number | null
        }
        Relationships: [
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_entries_integrity"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_migration_status"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id_text"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_tier_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "v_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_entries_bilingual_verdict: {
        Row: {
          copy_en: string | null
          copy_vi: string | null
          has_en: boolean | null
          has_vi: boolean | null
          id: string | null
          index: number | null
          room_id: string | null
          slug: string | null
          status: string | null
          verdict: string | null
        }
        Insert: {
          copy_en?: string | null
          copy_vi?: string | null
          has_en?: never
          has_vi?: never
          id?: string | null
          index?: number | null
          room_id?: string | null
          slug?: string | null
          status?: never
          verdict?: never
        }
        Update: {
          copy_en?: string | null
          copy_vi?: string | null
          has_en?: never
          has_vi?: never
          id?: string | null
          index?: number | null
          room_id?: string | null
          slug?: string | null
          status?: never
          verdict?: never
        }
        Relationships: [
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_entries_integrity"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_migration_status"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id_text"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_tier_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "v_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_entries_integrity: {
        Row: {
          entry_count: number | null
          room_id: string | null
          title_en: string | null
          title_vi: string | null
        }
        Relationships: []
      }
      room_entries_preview: {
        Row: {
          id: string | null
          required_rank: number | null
          slug: string | null
        }
        Insert: {
          id?: string | null
          required_rank?: number | null
          slug?: string | null
        }
        Update: {
          id?: string | null
          required_rank?: number | null
          slug?: string | null
        }
        Relationships: []
      }
      room_entries_visible: {
        Row: {
          audio: string | null
          copy_en: string | null
          copy_vi: string | null
          created_at: string | null
          id: string | null
          index: number | null
          metadata: Json | null
          required_rank: number | null
          required_vip_rank: number | null
          room_id: string | null
          severity: number | null
          slug: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          audio?: string | null
          copy_en?: string | null
          copy_vi?: string | null
          created_at?: string | null
          id?: string | null
          index?: number | null
          metadata?: Json | null
          required_rank?: number | null
          required_vip_rank?: number | null
          room_id?: string | null
          severity?: number | null
          slug?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          audio?: string | null
          copy_en?: string | null
          copy_vi?: string | null
          created_at?: string | null
          id?: string | null
          index?: number | null
          metadata?: Json | null
          required_rank?: number | null
          required_vip_rank?: number | null
          room_id?: string | null
          severity?: number | null
          slug?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_entries_integrity"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_migration_status"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id_text"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_tier_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "v_rooms"
            referencedColumns: ["id"]
          },
        ]
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
      rooms_migration_status: {
        Row: {
          entries_count: number | null
          migration_status: string | null
          room_id: string | null
          room_slug: string | null
          tier: string | null
        }
        Relationships: []
      }
      rooms_normalized: {
        Row: {
          content_audio: string | null
          content_en: string | null
          content_vi: string | null
          created_at: string | null
          domain: string | null
          id: string | null
          is_active: boolean | null
          is_locked: boolean | null
          keywords: string[] | null
          metadata: Json | null
          room_essay_en: string | null
          room_essay_vi: string | null
          slug: string | null
          tier: string | null
          tier_canonical: string | null
          title_en: string | null
          title_vi: string | null
          track: string | null
          updated_at: string | null
        }
        Insert: {
          content_audio?: string | null
          content_en?: string | null
          content_vi?: string | null
          created_at?: string | null
          domain?: string | null
          id?: string | null
          is_active?: boolean | null
          is_locked?: boolean | null
          keywords?: string[] | null
          metadata?: Json | null
          room_essay_en?: string | null
          room_essay_vi?: string | null
          slug?: string | null
          tier?: string | null
          tier_canonical?: never
          title_en?: string | null
          title_vi?: string | null
          track?: string | null
          updated_at?: string | null
        }
        Update: {
          content_audio?: string | null
          content_en?: string | null
          content_vi?: string | null
          created_at?: string | null
          domain?: string | null
          id?: string | null
          is_active?: boolean | null
          is_locked?: boolean | null
          keywords?: string[] | null
          metadata?: Json | null
          room_essay_en?: string | null
          room_essay_vi?: string | null
          slug?: string | null
          tier?: string | null
          tier_canonical?: never
          title_en?: string | null
          title_vi?: string | null
          track?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rooms_ranked: {
        Row: {
          content_audio: string | null
          content_en: string | null
          content_vi: string | null
          created_at: string | null
          domain: string | null
          id: string | null
          id_text: string | null
          is_active: boolean | null
          is_locked: boolean | null
          keywords: string[] | null
          metadata: Json | null
          required_rank: number | null
          required_vip_rank: number | null
          room_essay_en: string | null
          room_essay_vi: string | null
          slug: string | null
          sort_order: number | null
          tier: string | null
          title_en: string | null
          title_vi: string | null
          track: string | null
          updated_at: string | null
        }
        Insert: {
          content_audio?: string | null
          content_en?: string | null
          content_vi?: string | null
          created_at?: string | null
          domain?: string | null
          id?: string | null
          id_text?: string | null
          is_active?: boolean | null
          is_locked?: boolean | null
          keywords?: string[] | null
          metadata?: Json | null
          required_rank?: never
          required_vip_rank?: number | null
          room_essay_en?: string | null
          room_essay_vi?: string | null
          slug?: string | null
          sort_order?: number | null
          tier?: string | null
          title_en?: string | null
          title_vi?: string | null
          track?: string | null
          updated_at?: string | null
        }
        Update: {
          content_audio?: string | null
          content_en?: string | null
          content_vi?: string | null
          created_at?: string | null
          domain?: string | null
          id?: string | null
          id_text?: string | null
          is_active?: boolean | null
          is_locked?: boolean | null
          keywords?: string[] | null
          metadata?: Json | null
          required_rank?: never
          required_vip_rank?: number | null
          room_essay_en?: string | null
          room_essay_vi?: string | null
          slug?: string | null
          sort_order?: number | null
          tier?: string | null
          title_en?: string | null
          title_vi?: string | null
          track?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rooms_tier_normalized: {
        Row: {
          content_audio: string | null
          content_en: string | null
          content_vi: string | null
          created_at: string | null
          domain: string | null
          id: string | null
          is_active: boolean | null
          is_locked: boolean | null
          keywords: string[] | null
          metadata: Json | null
          room_essay_en: string | null
          room_essay_vi: string | null
          slug: string | null
          tier: string | null
          tier_canonical: string | null
          title_en: string | null
          title_vi: string | null
          track: string | null
          updated_at: string | null
        }
        Insert: {
          content_audio?: string | null
          content_en?: string | null
          content_vi?: string | null
          created_at?: string | null
          domain?: string | null
          id?: string | null
          is_active?: boolean | null
          is_locked?: boolean | null
          keywords?: string[] | null
          metadata?: Json | null
          room_essay_en?: string | null
          room_essay_vi?: string | null
          slug?: string | null
          tier?: string | null
          tier_canonical?: never
          title_en?: string | null
          title_vi?: string | null
          track?: string | null
          updated_at?: string | null
        }
        Update: {
          content_audio?: string | null
          content_en?: string | null
          content_vi?: string | null
          created_at?: string | null
          domain?: string | null
          id?: string | null
          is_active?: boolean | null
          is_locked?: boolean | null
          keywords?: string[] | null
          metadata?: Json | null
          room_essay_en?: string | null
          room_essay_vi?: string | null
          slug?: string | null
          tier?: string | null
          tier_canonical?: never
          title_en?: string | null
          title_vi?: string | null
          track?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_counts_by_tier: {
        Row: {
          tier: string | null
          total_users: number | null
        }
        Relationships: []
      }
      user_entitlements: {
        Row: {
          granted_at: string | null
          tier_id: string | null
          tier_name: string | null
          user_id: string | null
          vip_rank: number | null
        }
        Relationships: []
      }
      user_entitlements_v: {
        Row: {
          granted_at: string | null
          tier_id: string | null
          tier_name: string | null
          user_id: string | null
          vip_rank: number | null
        }
        Relationships: []
      }
      v_admin_profiles: {
        Row: {
          admin_level: number | null
          ai_enabled: boolean | null
          app_id: string | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          full_name: string | null
          id: string | null
          is_admin: boolean | null
          last_seen_at: string | null
          phone: string | null
          role: string | null
          stripe_customer_id: string | null
          tier: string | null
          updated_at: string | null
          user_id: string | null
          username: string | null
          vip_rank: number | null
        }
        Insert: {
          admin_level?: number | null
          ai_enabled?: boolean | null
          app_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          is_admin?: boolean | null
          last_seen_at?: string | null
          phone?: string | null
          role?: string | null
          stripe_customer_id?: string | null
          tier?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
          vip_rank?: number | null
        }
        Update: {
          admin_level?: number | null
          ai_enabled?: boolean | null
          app_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          is_admin?: boolean | null
          last_seen_at?: string | null
          phone?: string | null
          role?: string | null
          stripe_customer_id?: string | null
          tier?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
          vip_rank?: number | null
        }
        Relationships: []
      }
      v_community_messages: {
        Row: {
          created_at: string | null
          id: string | null
          message: string | null
          room_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          message?: string | null
          room_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          message?: string | null
          room_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      v_feedback_inbox: {
        Row: {
          app_id: string | null
          created_at: string | null
          id: string | null
          message: string | null
          status: Database["public"]["Enums"]["feedback_status"] | null
          subject: string | null
          tier: string | null
          user_id: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_feedback_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mb_user_effective_rank"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_profiles_self"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "viewer_access"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vip3_public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      v_mb_ai_quality_incidents_daily: {
        Row: {
          avg_confidence: number | null
          avg_failure_streak: number | null
          avg_quality: number | null
          day_utc: string | null
          errors: number | null
          total: number | null
        }
        Relationships: []
      }
      v_mb_cron_health: {
        Row: {
          attempts_rows: number | null
          job_name: string | null
          last_error: string | null
          last_run_at: string | null
          last_run_had_zero_rows: boolean | null
          last_status: string | null
          last_week_start: string | null
          narratives_upserts: number | null
          quality_rows: number | null
          snapshots_upserts: number | null
          time_since_last_run: string | null
        }
        Relationships: []
      }
      v_mb_mercy_overview_daily: {
        Row: {
          ask_back_rate: number | null
          avg_confidence: number | null
          avg_quality_score: number | null
          day: string | null
          error_events: number | null
          events: number | null
          intent_match_rate: number | null
          json_valid_rate: number | null
          next_action_rate: number | null
        }
        Relationships: []
      }
      v_mb_mercy_pron_attempts_weekly: {
        Row: {
          attempts: number | null
          avg_corrections: number | null
          total_corrections: number | null
          user_id: string | null
          week_start: string | null
        }
        Relationships: []
      }
      v_mb_mercy_pron_fail_tail: {
        Row: {
          last10: number | null
          last10_failures: number | null
          user_id: string | null
        }
        Relationships: []
      }
      v_mb_mercy_quality_7d: {
        Row: {
          ask_back_rate_7d: number | null
          avg_confidence_7d: number | null
          avg_quality_score_7d: number | null
          events_7d: number | null
          intent_match_rate_7d: number | null
          json_valid_rate_7d: number | null
          mode: string | null
          next_action_rate_7d: number | null
        }
        Relationships: []
      }
      v_mb_mercy_quality_daily: {
        Row: {
          ask_back_rate: number | null
          avg_confidence: number | null
          avg_quality_score: number | null
          day: string | null
          error_events: number | null
          events: number | null
          intent_match_rate: number | null
          json_valid_rate: number | null
          mode: string | null
          next_action_rate: number | null
          vip_rank: number | null
        }
        Relationships: []
      }
      v_mb_mercy_tokens_daily: {
        Row: {
          avg_tokens_per_call: number | null
          completion_tokens: number | null
          day: string | null
          prompt_tokens: number | null
          rows: number | null
          total_tokens: number | null
          vip_rank: number | null
        }
        Relationships: []
      }
      v_mb_mercy_weakness_current: {
        Row: {
          category: string | null
          frequency: number | null
          key_pattern: string | null
          last_seen: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          frequency?: number | null
          key_pattern?: string | null
          last_seen?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          frequency?: number | null
          key_pattern?: string | null
          last_seen?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      v_mb_quality_daily_mode: {
        Row: {
          ask_back_rate: number | null
          day: string | null
          intent_match_rate: number | null
          json_valid_rate: number | null
          mode: string | null
          n: number | null
          next_action_rate: number | null
          no_error_rate: number | null
          total_tokens: number | null
        }
        Relationships: []
      }
      v_mb_recent_failures: {
        Row: {
          last_event_at: string | null
          mode: string | null
          recent_failures_10: number | null
          user_id: string | null
        }
        Relationships: []
      }
      v_mb_sound_improvement_score_weekly: {
        Row: {
          eth_improved: number | null
          stress_improved: number | null
          theta_improved: number | null
          user_id: string | null
          week_start: string | null
        }
        Relationships: []
      }
      v_mb_system_weekly_rollup: {
        Row: {
          totals: Json | null
          week_end: string | null
          week_start: string | null
        }
        Relationships: []
      }
      v_mb_telemetry_staleness: {
        Row: {
          time_since_last_attempt: string | null
          time_since_last_quality: string | null
        }
        Relationships: []
      }
      v_mb_tokens_daily_vip: {
        Row: {
          avg_tokens_per_req: number | null
          completion_tokens: number | null
          day: string | null
          mode: string | null
          n: number | null
          prompt_tokens: number | null
          total_tokens: number | null
          vip_rank: number | null
        }
        Relationships: []
      }
      v_mb_trust_daily_user: {
        Row: {
          avg_confidence: number | null
          avg_quality_score: number | null
          day: string | null
          mode: string | null
          n: number | null
          user_id: string | null
        }
        Relationships: []
      }
      v_mb_trust_rank_week: {
        Row: {
          trust_rank: number | null
          trust_score: number | null
          user_id: string | null
          week_start: string | null
        }
        Relationships: []
      }
      v_mb_user_phoneme_bottom_week: {
        Row: {
          avg_score: number | null
          phoneme: string | null
          user_id: string | null
          week_start: string | null
        }
        Relationships: []
      }
      v_mb_user_room_counts_week: {
        Row: {
          attempts_in_room: number | null
          room_id: string | null
          user_id: string | null
          week_start: string | null
        }
        Relationships: []
      }
      v_mb_weakness_improvement_weekly: {
        Row: {
          delta_errors: number | null
          freq: number | null
          improvement_amount: number | null
          key_pattern: string | null
          prev_freq: number | null
          user_id: string | null
          week_start: string | null
        }
        Relationships: []
      }
      v_mb_weakness_improving_now: {
        Row: {
          days_since_last_seen: number | null
          frequency: number | null
          key_pattern: string | null
          last_seen: string | null
          likely_improving: boolean | null
          user_id: string | null
        }
        Insert: {
          days_since_last_seen?: never
          frequency?: number | null
          key_pattern?: string | null
          last_seen?: string | null
          likely_improving?: never
          user_id?: string | null
        }
        Update: {
          days_since_last_seen?: never
          frequency?: number | null
          key_pattern?: string | null
          last_seen?: string | null
          likely_improving?: never
          user_id?: string | null
        }
        Relationships: []
      }
      v_mb_weekly_leaderboard: {
        Row: {
          global_rank: number | null
          trust_score: number | null
          user_id: string | null
          week_start: string | null
        }
        Relationships: []
      }
      v_mb_weekly_most_improved: {
        Row: {
          improvement_rank: number | null
          trust_delta: number | null
          trust_score: number | null
          user_id: string | null
          week_start: string | null
        }
        Relationships: []
      }
      v_mb_weekly_rank_by_org: {
        Row: {
          metrics: Json | null
          org_id: string | null
          trust_score: number | null
          user_id: string | null
          week_start: string | null
        }
        Relationships: []
      }
      v_mb_weekly_rank_global: {
        Row: {
          deltas: Json | null
          metrics: Json | null
          trust_components: Json | null
          trust_score: number | null
          user_id: string | null
          week_start: string | null
        }
        Insert: {
          deltas?: Json | null
          metrics?: Json | null
          trust_components?: Json | null
          trust_score?: number | null
          user_id?: string | null
          week_start?: string | null
        }
        Update: {
          deltas?: Json | null
          metrics?: Json | null
          trust_components?: Json | null
          trust_score?: number | null
          user_id?: string | null
          week_start?: string | null
        }
        Relationships: []
      }
      v_online_counts: {
        Row: {
          app_id: string | null
          online_users: number | null
        }
        Relationships: []
      }
      v_payment_events_with_resolution: {
        Row: {
          created_at: string | null
          event_type: string | null
          external_reference: string | null
          id: string | null
          payload: Json | null
          product_code: string | null
          provider: string | null
          resolution_reason: string | null
          resolution_status: string | null
          resolved_at: string | null
          stripe_customer_id: string | null
          stripe_event_id: string | null
          stripe_session_id: string | null
          stripe_subscription_id: string | null
          tier_id: string | null
          transaction_id: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_events_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_events_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements"
            referencedColumns: ["tier_id"]
          },
          {
            foreignKeyName: "payment_events_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements_v"
            referencedColumns: ["tier_id"]
          },
          {
            foreignKeyName: "payment_events_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_events_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions_with_age"
            referencedColumns: ["id"]
          },
        ]
      }
      v_profiles_self: {
        Row: {
          admin_level: number | null
          ai_enabled: boolean | null
          app_id: string | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          full_name: string | null
          id: string | null
          is_admin: boolean | null
          last_seen_at: string | null
          phone: string | null
          role: string | null
          tier: string | null
          updated_at: string | null
          user_id: string | null
          username: string | null
          vip_rank: number | null
        }
        Insert: {
          admin_level?: number | null
          ai_enabled?: boolean | null
          app_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          is_admin?: boolean | null
          last_seen_at?: string | null
          phone?: string | null
          role?: string | null
          tier?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
          vip_rank?: number | null
        }
        Update: {
          admin_level?: number | null
          ai_enabled?: boolean | null
          app_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          is_admin?: boolean | null
          last_seen_at?: string | null
          phone?: string | null
          role?: string | null
          tier?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
          vip_rank?: number | null
        }
        Relationships: []
      }
      v_room_bilingual_integrity: {
        Row: {
          both_empty: boolean | null
          copy_en_trim: string | null
          copy_vi_trim: string | null
          has_en: boolean | null
          has_vi: boolean | null
          id: string | null
          required_vip_rank: number | null
          room_id: string | null
        }
        Insert: {
          both_empty?: never
          copy_en_trim?: never
          copy_vi_trim?: never
          has_en?: never
          has_vi?: never
          id?: string | null
          required_vip_rank?: number | null
          room_id?: string | null
        }
        Update: {
          both_empty?: never
          copy_en_trim?: never
          copy_vi_trim?: never
          has_en?: never
          has_vi?: never
          id?: string | null
          required_vip_rank?: number | null
          room_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_entries_integrity"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_migration_status"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id_text"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_tier_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "v_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      v_room_bilingual_integrity_summary: {
        Row: {
          both_empty: number | null
          has_en: number | null
          has_vi: number | null
          missing_en: number | null
          missing_vi: number | null
          required_vip_rank: number | null
          room_id: string | null
          total_entries: number | null
        }
        Relationships: [
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_entries_integrity"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_migration_status"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id_text"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_tier_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "v_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      v_room_entries: {
        Row: {
          audio: string | null
          copy_en: string | null
          copy_vi: string | null
          created_at: string | null
          id: string | null
          index: number | null
          metadata: Json | null
          required_rank: number | null
          required_vip_rank: number | null
          room_id: string | null
          severity: number | null
          slug: string | null
          sort_order: number | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          audio?: string | null
          copy_en?: string | null
          copy_vi?: string | null
          created_at?: string | null
          id?: string | null
          index?: number | null
          metadata?: Json | null
          required_rank?: number | null
          required_vip_rank?: number | null
          room_id?: string | null
          severity?: number | null
          slug?: string | null
          sort_order?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          audio?: string | null
          copy_en?: string | null
          copy_vi?: string | null
          created_at?: string | null
          id?: string | null
          index?: number | null
          metadata?: Json | null
          required_rank?: number | null
          required_vip_rank?: number | null
          room_id?: string | null
          severity?: number | null
          slug?: string | null
          sort_order?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_entries_integrity"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_migration_status"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id_text"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_tier_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "v_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      v_room_entries_bilingual_integrity: {
        Row: {
          both_empty: boolean | null
          copy_en: string | null
          copy_vi: string | null
          created_at: string | null
          en_trim: string | null
          has_en: boolean | null
          has_vi: boolean | null
          id: string | null
          missing_en: boolean | null
          missing_vi: boolean | null
          required_vip_rank: number | null
          room_id: string | null
          updated_at: string | null
          vi_trim: string | null
        }
        Insert: {
          both_empty?: never
          copy_en?: string | null
          copy_vi?: string | null
          created_at?: string | null
          en_trim?: never
          has_en?: never
          has_vi?: never
          id?: string | null
          missing_en?: never
          missing_vi?: never
          required_vip_rank?: number | null
          room_id?: string | null
          updated_at?: string | null
          vi_trim?: never
        }
        Update: {
          both_empty?: never
          copy_en?: string | null
          copy_vi?: string | null
          created_at?: string | null
          en_trim?: never
          has_en?: never
          has_vi?: never
          id?: string | null
          missing_en?: never
          missing_vi?: never
          required_vip_rank?: number | null
          room_id?: string | null
          updated_at?: string | null
          vi_trim?: never
        }
        Relationships: [
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_entries_integrity"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_health_view"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_migration_status"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id_text"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_ranked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_tier_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "v_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      v_rooms: {
        Row: {
          app_key: string | null
          content_audio: string | null
          content_en: string | null
          content_vi: string | null
          created_at: string | null
          domain: string | null
          id: string | null
          is_active: boolean | null
          is_locked: boolean | null
          keywords: string[] | null
          metadata: Json | null
          required_rank: number | null
          required_vip_rank: number | null
          room_essay_en: string | null
          room_essay_vi: string | null
          slug: string | null
          sort_order: number | null
          status: string | null
          subtitle: string | null
          tier: string | null
          title: string | null
          title_en: string | null
          title_vi: string | null
          track: string | null
          updated_at: string | null
        }
        Insert: {
          app_key?: string | null
          content_audio?: string | null
          content_en?: string | null
          content_vi?: string | null
          created_at?: string | null
          domain?: string | null
          id?: string | null
          is_active?: boolean | null
          is_locked?: boolean | null
          keywords?: string[] | null
          metadata?: Json | null
          required_rank?: number | null
          required_vip_rank?: number | null
          room_essay_en?: string | null
          room_essay_vi?: string | null
          slug?: string | null
          sort_order?: number | null
          status?: string | null
          subtitle?: string | null
          tier?: string | null
          title?: string | null
          title_en?: string | null
          title_vi?: string | null
          track?: string | null
          updated_at?: string | null
        }
        Update: {
          app_key?: string | null
          content_audio?: string | null
          content_en?: string | null
          content_vi?: string | null
          created_at?: string | null
          domain?: string | null
          id?: string | null
          is_active?: boolean | null
          is_locked?: boolean | null
          keywords?: string[] | null
          metadata?: Json | null
          required_rank?: number | null
          required_vip_rank?: number | null
          room_essay_en?: string | null
          room_essay_vi?: string | null
          slug?: string | null
          sort_order?: number | null
          status?: string | null
          subtitle?: string | null
          tier?: string | null
          title?: string | null
          title_en?: string | null
          title_vi?: string | null
          track?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      v_tier_counts: {
        Row: {
          app_id: string | null
          tier: string | null
          users: number | null
        }
        Relationships: []
      }
      v_user_ai_monthly_meter: {
        Row: {
          ai_cost_vnd: number | null
          cutoff_vnd: number | null
          extra_ai_budget_vnd: number | null
          plan_name: string | null
          recognized_monthly_revenue_vnd: number | null
          remaining_vnd: number | null
          reset_at: string | null
          status: string | null
          tier_id: string | null
          usage_ratio: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscription_state_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscription_state_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements"
            referencedColumns: ["tier_id"]
          },
          {
            foreignKeyName: "user_subscription_state_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "user_entitlements_v"
            referencedColumns: ["tier_id"]
          },
        ]
      }
      v_user_progress_current: {
        Row: {
          days_active_30d: number | null
          last_study_at: string | null
          streak_days: number | null
          user_id: string | null
        }
        Relationships: []
      }
      v_user_streak_summary: {
        Row: {
          days_active_30d: number | null
          last_study_at_vn: string | null
          streak_days: number | null
        }
        Relationships: []
      }
      v_user_streak_vn: {
        Row: {
          app_id: string | null
          streak_days: number | null
          user_id: string | null
        }
        Relationships: []
      }
      v_user_vip_access_active: {
        Row: {
          current_period_end: string | null
          current_period_start: string | null
          is_active: boolean | null
          product_id: string | null
          status:
            | Database["public"]["Enums"]["billing_subscription_status"]
            | null
          user_id: string | null
        }
        Insert: {
          current_period_end?: string | null
          current_period_start?: string | null
          is_active?: never
          product_id?: string | null
          status?:
            | Database["public"]["Enums"]["billing_subscription_status"]
            | null
          user_id?: string | null
        }
        Update: {
          current_period_end?: string | null
          current_period_start?: string | null
          is_active?: never
          product_id?: string | null
          status?:
            | Database["public"]["Enums"]["billing_subscription_status"]
            | null
          user_id?: string | null
        }
        Relationships: []
      }
      v_user_vip_tier: {
        Row: {
          current_period_end: string | null
          is_active: boolean | null
          product_key: string | null
          status:
            | Database["public"]["Enums"]["billing_subscription_status"]
            | null
          user_id: string | null
          vip_tier: number | null
        }
        Relationships: []
      }
      viewer_access: {
        Row: {
          admin_level: number | null
          is_admin: boolean | null
          user_id: string | null
          vip_rank: number | null
        }
        Relationships: []
      }
      vip3_public_profiles: {
        Row: {
          avatar_url: string | null
          id: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      webhook_events_pending: {
        Row: {
          api_version: string | null
          app_id: string | null
          customer_id: string | null
          error: string | null
          event_id: string | null
          event_type: string | null
          id: string | null
          invoice_id: string | null
          livemode: boolean | null
          payload: Json | null
          payment_intent_id: string | null
          processed_at: string | null
          provider: Database["public"]["Enums"]["billing_provider"] | null
          received_at: string | null
          signature_valid: boolean | null
          status: Database["public"]["Enums"]["billing_event_status"] | null
          subscription_id: string | null
          tier: string | null
          user_id: string | null
          verified_at: string | null
        }
        Insert: {
          api_version?: string | null
          app_id?: string | null
          customer_id?: string | null
          error?: string | null
          event_id?: string | null
          event_type?: string | null
          id?: string | null
          invoice_id?: string | null
          livemode?: boolean | null
          payload?: Json | null
          payment_intent_id?: string | null
          processed_at?: string | null
          provider?: Database["public"]["Enums"]["billing_provider"] | null
          received_at?: string | null
          signature_valid?: boolean | null
          status?: Database["public"]["Enums"]["billing_event_status"] | null
          subscription_id?: string | null
          tier?: string | null
          user_id?: string | null
          verified_at?: string | null
        }
        Update: {
          api_version?: string | null
          app_id?: string | null
          customer_id?: string | null
          error?: string | null
          event_id?: string | null
          event_type?: string | null
          id?: string | null
          invoice_id?: string | null
          livemode?: boolean | null
          payload?: Json | null
          payment_intent_id?: string | null
          processed_at?: string | null
          provider?: Database["public"]["Enums"]["billing_provider"] | null
          received_at?: string | null
          signature_valid?: boolean | null
          status?: Database["public"]["Enums"]["billing_event_status"] | null
          subscription_id?: string | null
          tier?: string | null
          user_id?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _col_exists: {
        Args: { _col: string; _schema: string; _table: string }
        Returns: boolean
      }
      admin_grant_vip: {
        Args: { p_period?: string; p_tier_id: string; p_user_id: string }
        Returns: undefined
      }
      admin_revoke_vip: { Args: { p_user_id: string }; Returns: undefined }
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
      can_access_vip_rank: {
        Args: { p_required_rank: number; p_uid: string }
        Returns: boolean
      }
      can_edit_system: { Args: { _user_id: string }; Returns: boolean }
      can_manage_admin: {
        Args: { _requestor_id: string; _target_level: number }
        Returns: boolean
      }
      check_ai_budget: {
        Args: { p_request_reserve_vnd?: number; p_user_id: string }
        Returns: {
          allowed: boolean
          message: string
          reset_at: string
          usage_ratio: number
        }[]
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
      claim_email_jobs: {
        Args: { limit_count?: number }
        Returns: {
          app_key: string | null
          attempts: number
          correlation_id: string | null
          created_at: string
          error_message: string | null
          id: string
          last_error: string | null
          provider: string | null
          sent_at: string | null
          status: string
          template_key: string
          to_email: string
          updated_at: string | null
          variables: Json
        }[]
        SetofOptions: {
          from: "*"
          to: "email_outbox"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      clean_expired_responses: { Args: never; Returns: undefined }
      cleanup_rate_limits: { Args: never; Returns: undefined }
      current_user_vip_tier: { Args: never; Returns: number }
      current_vip_rank: { Args: never; Returns: number }
      generate_referral_code: { Args: never; Returns: string }
      get_admin_level:
        | { Args: never; Returns: number }
        | { Args: { _user_id: string }; Returns: number }
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
      get_effective_vip_rank: { Args: { p_user_id?: string }; Returns: number }
      get_user_tier: {
        Args: { user_uuid: string }
        Returns: {
          custom_topics_allowed: number
          priority_support: boolean
          room_access_per_day: number
          tier_name: string
        }[]
      }
      grant_admin_by_email: { Args: { p_email: string }; Returns: undefined }
      has_feature: { Args: { feature_key: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_vip_rank:
        | { Args: { required_rank: number }; Returns: boolean }
        | {
            Args: { p_product_key: string; required_rank: number }
            Returns: boolean
          }
      heartbeat: {
        Args: {
          p_app_id: string
          p_path?: string
          p_room_id?: string
          p_session_id: string
        }
        Returns: undefined
      }
      is_admin:
        | { Args: never; Returns: boolean }
        | { Args: { p_app_id: string }; Returns: boolean }
      is_admin_user: { Args: never; Returns: boolean }
      is_high_admin_user: { Args: never; Returns: boolean }
      is_user_blocked: { Args: { user_email: string }; Returns: boolean }
      is_vip: {
        Args: { p_required_rank?: number; p_uid: string }
        Returns: boolean
      }
      is_vip3_user: { Args: { user_uuid: string }; Returns: boolean }
      log_admin_access: {
        Args: {
          _accessed_record_id?: string
          _accessed_table: string
          _action?: string
          _metadata?: Json
        }
        Returns: undefined
      }
      log_billing_entitlement_event: {
        Args: {
          p_action: string
          p_effective_at?: string
          p_entitlement_key: string
          p_environment: string
          p_metadata?: Json
          p_period_end_at?: string
          p_period_start_at?: string
          p_provider: string
          p_reason?: string
          p_source_event_key?: string
          p_source_provider_event_id?: string
          p_subject_id: string
          p_subscription_ref: string
        }
        Returns: string
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
      mb_clamp: { Args: { hi: number; lo: number; x: number }; Returns: number }
      mb_compute_vip_rank: { Args: { p_user_id: string }; Returns: number }
      mb_generate_weekly_snapshots: {
        Args: { p_week_start: string }
        Returns: undefined
      }
      mb_inc_weakness: {
        Args: {
          p_category: string
          p_inc: number
          p_key_pattern: string
          p_severity?: number
          p_user_id: string
        }
        Returns: undefined
      }
      mb_is_admin: { Args: never; Returns: boolean }
      mb_is_high_admin: { Args: never; Returns: boolean }
      mb_json_num: {
        Args: { default_val?: number; js: Json; path: string[] }
        Returns: number
      }
      mb_metrics_delta: { Args: { curr: Json; prev: Json }; Returns: Json }
      mb_norm01: { Args: { x: number }; Returns: number }
      mb_refresh_system_weekly_rollup: {
        Args: { wk_start: string }
        Returns: undefined
      }
      mb_safe_num: {
        Args: { fallback?: number; j: Json; path: string[] }
        Returns: number
      }
      mb_sql: { Args: { params?: Json; sql: string }; Returns: Json }
      mb_trust_score: { Args: { metrics: Json }; Returns: number }
      mb_week_end: { Args: { ts: string }; Returns: string }
      mb_week_start: { Args: { ts: string }; Returns: string }
      mercy_weekly_snapshot_job: {
        Args: { p_now?: string }
        Returns: undefined
      }
      normalize_overall_score: { Args: { x: number }; Returns: number }
      purge_old_payment_proofs: { Args: never; Returns: undefined }
      refresh_mercy_feedback_daily_rollups: {
        Args: { target_day?: string }
        Returns: undefined
      }
      refresh_mercy_worst_answers_daily: {
        Args: { target_day?: string }
        Returns: undefined
      }
      register_billing_provider_event: {
        Args: {
          p_environment: string
          p_event_created_at?: string
          p_event_key: string
          p_event_type?: string
          p_headers?: Json
          p_metadata?: Json
          p_payload?: Json
          p_provider: string
          p_provider_event_id?: string
        }
        Returns: {
          delivery_count: number
          id: string
          is_new: boolean
          process_status: string
        }[]
      }
      remove_room_pin: {
        Args: { _pin: string; _room_id: string }
        Returns: undefined
      }
      set_room_pin: {
        Args: { _pin: string; _room_id: string }
        Returns: undefined
      }
      set_user_entitlements: {
        Args: {
          p_features: Json
          p_user_id: string
          p_vip_rank: number
          p_vip_tier: string
        }
        Returns: {
          features: Json
          updated_at: string
          user_id: string
          vip_rank: number
          vip_tier: string
        }
        SetofOptions: {
          from: "*"
          to: "user_entitlements_raw_20260301_181303"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      setup_admin_user: { Args: never; Returns: undefined }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      sync_profile_tier_from_latest_payment: {
        Args: { p_user_id: string }
        Returns: string
      }
      toggle_room_lock: {
        Args: { lock_state: boolean; room_id_param: string }
        Returns: undefined
      }
      user_vip_rank: { Args: { p_uid: string }; Returns: number }
      validate_promo_code: { Args: { code_input: string }; Returns: Json }
      validate_room_pin: {
        Args: { _pin: string; _room_id: string }
        Returns: boolean
      }
      vip_rank: { Args: { p_uid: string }; Returns: number }
    }
    Enums: {
      app_role: "admin" | "user" | "vip"
      billing_event_status: "received" | "verified" | "processed" | "failed"
      billing_payment_status:
        | "requires_payment_method"
        | "requires_confirmation"
        | "requires_action"
        | "processing"
        | "requires_capture"
        | "canceled"
        | "succeeded"
        | "failed"
        | "refunded"
      billing_provider: "stripe" | "apple" | "google"
      billing_subscription_status:
        | "incomplete"
        | "incomplete_expired"
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "paused"
      device_type: "desktop" | "mobile"
      feedback_priority: "low" | "normal" | "high"
      feedback_status: "new" | "open" | "resolved" | "archived"
      tier_id:
        | "level0"
        | "level1"
        | "level2"
        | "level3"
        | "level4"
        | "level5"
        | "level6"
        | "level7"
        | "level8"
        | "level9"
      vip_key: "level0" | "level1" | "level3" | "level9"
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
      app_role: ["admin", "user", "vip"],
      billing_event_status: ["received", "verified", "processed", "failed"],
      billing_payment_status: [
        "requires_payment_method",
        "requires_confirmation",
        "requires_action",
        "processing",
        "requires_capture",
        "canceled",
        "succeeded",
        "failed",
        "refunded",
      ],
      billing_provider: ["stripe", "apple", "google"],
      billing_subscription_status: [
        "incomplete",
        "incomplete_expired",
        "trialing",
        "active",
        "past_due",
        "canceled",
        "unpaid",
        "paused",
      ],
      device_type: ["desktop", "mobile"],
      feedback_priority: ["low", "normal", "high"],
      feedback_status: ["new", "open", "resolved", "archived"],
      tier_id: [
        "level0",
        "level1",
        "level2",
        "level3",
        "level4",
        "level5",
        "level6",
        "level7",
        "level8",
        "level9",
      ],
      vip_key: ["level0", "level1", "level3", "level9"],
    },
  },
} as const
