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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          cited_episode_ids: string[] | null
          content: string
          created_at: string | null
          helpful: boolean | null
          id: string
          role: string | null
          user_id: string
        }
        Insert: {
          cited_episode_ids?: string[] | null
          content: string
          created_at?: string | null
          helpful?: boolean | null
          id?: string
          role?: string | null
          user_id?: string
        }
        Update: {
          cited_episode_ids?: string[] | null
          content?: string
          created_at?: string | null
          helpful?: boolean | null
          id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      community_audit: {
        Row: {
          action: string
          actor_id: string
          created_at: string
          id: number
          report_id: string | null
          story_id: string | null
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string
          id?: never
          report_id?: string | null
          story_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string
          id?: never
          report_id?: string | null
          story_id?: string | null
        }
        Relationships: []
      }
      community_published: {
        Row: {
          body: string
          content_warnings: string[]
          pseudonym: string
          published_at: string
          story_id: string
          theme: string
          title: string
        }
        Insert: {
          body: string
          content_warnings?: string[]
          pseudonym: string
          published_at?: string
          story_id: string
          theme: string
          title: string
        }
        Update: {
          body?: string
          content_warnings?: string[]
          pseudonym?: string
          published_at?: string
          story_id?: string
          theme?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_published_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: true
            referencedRelation: "community_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      community_reactions: {
        Row: {
          created_at: string
          kind: string
          story_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          kind: string
          story_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          kind?: string
          story_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_reactions_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "community_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      community_reports: {
        Row: {
          created_at: string
          details: string | null
          id: string
          reason: string
          reporter_id: string
          resolution_note: string | null
          reviewed_at: string | null
          status: string
          story_id: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          reason: string
          reporter_id?: string
          resolution_note?: string | null
          reviewed_at?: string | null
          status?: string
          story_id: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          reason?: string
          reporter_id?: string
          resolution_note?: string | null
          reviewed_at?: string | null
          status?: string
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_reports_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "community_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      community_roles: {
        Row: {
          created_at: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      community_stories: {
        Row: {
          author_id: string
          body: string
          consent_at: string | null
          content_warnings: string[]
          created_at: string
          id: string
          moderator_note: string | null
          pseudonym: string
          published_at: string | null
          rules_version: string | null
          status: string
          submitted_at: string | null
          theme: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string
          body: string
          consent_at?: string | null
          content_warnings?: string[]
          created_at?: string
          id?: string
          moderator_note?: string | null
          pseudonym: string
          published_at?: string | null
          rules_version?: string | null
          status?: string
          submitted_at?: string | null
          theme: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          consent_at?: string | null
          content_warnings?: string[]
          created_at?: string
          id?: string
          moderator_note?: string | null
          pseudonym?: string
          published_at?: string | null
          rules_version?: string | null
          status?: string
          submitted_at?: string | null
          theme?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      decision_letters: {
        Row: {
          future_goals: string | null
          id: string
          updated_at: string | null
          user_id: string
          why_text: string | null
        }
        Insert: {
          future_goals?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          why_text?: string | null
        }
        Update: {
          future_goals?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          why_text?: string | null
        }
        Relationships: []
      }
      episodes: {
        Row: {
          almost_did: string | null
          created_at: string | null
          embedding: string | null
          how_felt: string | null
          id: string
          intensity: number | null
          occurred_on: string | null
          tags: string[] | null
          user_id: string
          what_happened: string
        }
        Insert: {
          almost_did?: string | null
          created_at?: string | null
          embedding?: string | null
          how_felt?: string | null
          id?: string
          intensity?: number | null
          occurred_on?: string | null
          tags?: string[] | null
          user_id?: string
          what_happened: string
        }
        Update: {
          almost_did?: string | null
          created_at?: string | null
          embedding?: string | null
          how_felt?: string | null
          id?: string
          intensity?: number | null
          occurred_on?: string | null
          tags?: string[] | null
          user_id?: string
          what_happened?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          id?: string
        }
        Relationships: []
      }
      relapse_events: {
        Row: {
          created_at: string | null
          feeling: string | null
          id: string
          outcome: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          feeling?: string | null
          id?: string
          outcome?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          feeling?: string | null
          id?: string
          outcome?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _community_validate: {
        Args: {
          p_body: string
          p_pseudonym: string
          p_theme: string
          p_title: string
          p_warnings: string[]
        }
        Returns: undefined
      }
      community_delete_draft: { Args: { p_id: string }; Returns: undefined }
      community_enabled: { Args: { _uid: string }; Returns: boolean }
      community_moderate: {
        Args: { p_action: string; p_id: string; p_note: string }
        Returns: undefined
      }
      community_report: {
        Args: { p_details: string; p_reason: string; p_story: string }
        Returns: undefined
      }
      community_review_report: {
        Args: { p_note: string; p_report: string }
        Returns: undefined
      }
      community_save_story: {
        Args: {
          p_body: string
          p_id: string
          p_pseudonym: string
          p_theme: string
          p_title: string
          p_warnings: string[]
        }
        Returns: string
      }
      community_submit_story: {
        Args: {
          p_accept_display: boolean
          p_accept_moderation: boolean
          p_accept_rules: boolean
          p_id: string
          p_rules_version: string
        }
        Returns: undefined
      }
      community_toggle_reaction: {
        Args: { p_kind: string; p_story: string }
        Returns: boolean
      }
      community_withdraw_story: { Args: { p_id: string }; Returns: undefined }
      has_community_role: {
        Args: { _role: string; _uid: string }
        Returns: boolean
      }
      match_episodes: {
        Args: { match_count?: number; query_embedding: string }
        Returns: {
          how_felt: string
          id: string
          intensity: number
          occurred_on: string
          similarity: number
          what_happened: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
