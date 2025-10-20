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
      feedback: {
        Row: {
          category: string | null
          created_at: string | null
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
          id?: string
          message?: string
          priority?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
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
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
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
      setup_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    },
  },
} as const
