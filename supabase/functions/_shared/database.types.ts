// Re-export Database type for edge functions
// This is synced from src/integrations/supabase/types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          type?: string
          user_id?: string | null
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
      subscription_tiers: {
        Row: {
          id: string
          name: string
          name_vi: string
          price_monthly: number
          price_yearly: number | null
          description_en: string | null
          description_vi: string | null
          room_access_per_day: number | null
          custom_topics_allowed: number | null
          priority_support: boolean | null
          is_active: boolean | null
          display_order: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          name_vi: string
          price_monthly: number
          price_yearly?: number | null
          description_en?: string | null
          description_vi?: string | null
          room_access_per_day?: number | null
          custom_topics_allowed?: number | null
          priority_support?: boolean | null
          is_active?: boolean | null
          display_order: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          name_vi?: string
          price_monthly?: number
          price_yearly?: number | null
          description_en?: string | null
          description_vi?: string | null
          room_access_per_day?: number | null
          custom_topics_allowed?: number | null
          priority_support?: boolean | null
          is_active?: boolean | null
          display_order?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          tier_id: string
          status: string
          current_period_start: string | null
          current_period_end: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          tier_id: string
          status?: string
          current_period_start?: string | null
          current_period_end?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          tier_id?: string
          status?: string
          current_period_start?: string | null
          current_period_end?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          created_at?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          id: string
          user_id: string
          category: string | null
          message: string
          priority: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          category?: string | null
          message: string
          priority?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          category?: string | null
          message?: string
          priority?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: string
          _user_id: string
        }
        Returns: boolean
      }
      check_endpoint_rate_limit: {
        Args: {
          endpoint_name: string
          user_uuid: string
        }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          _user_id: string
          _event_type: string
          _severity: string
          _metadata: Json
        }
        Returns: string
      }
    }
    Enums: {
      app_role: 'admin' | 'moderator' | 'user'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
