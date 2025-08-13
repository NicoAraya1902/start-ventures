export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      contact_requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          receiver_id: string
          sender_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          receiver_id: string
          sender_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          receiver_id?: string
          sender_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          receiver_id: string
          sender_id: string
          subject: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          receiver_id: string
          sender_id: string
          subject?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          receiver_id?: string
          sender_id?: string
          subject?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          career: string | null
          created_at: string
          email: string | null
          entrepreneur_type: string | null
          experience_years: number | null
          full_name: string | null
          gender: string | null
          hobbies: string[] | null
          id: string
          interests: string[] | null
          is_technical: boolean | null
          location: string | null
          non_technical_skills: string[] | null
          phone: string | null
          profession: string | null
          project_description: string | null
          project_name: string | null
          project_sector: string | null
          project_stage: string | null
          region: string | null
          seeking_non_technical_skills: string[] | null
          seeking_technical: string | null
          seeking_technical_skills: string[] | null
          support_areas: string[] | null
          team_size: number | null
          team_status: string | null
          technical_skills: string[] | null
          university: string | null
          updated_at: string
          user_id: string
          user_type: string | null
          year: number | null
        }
        Insert: {
          avatar_url?: string | null
          career?: string | null
          created_at?: string
          email?: string | null
          entrepreneur_type?: string | null
          experience_years?: number | null
          full_name?: string | null
          gender?: string | null
          hobbies?: string[] | null
          id?: string
          interests?: string[] | null
          is_technical?: boolean | null
          location?: string | null
          non_technical_skills?: string[] | null
          phone?: string | null
          profession?: string | null
          project_description?: string | null
          project_name?: string | null
          project_sector?: string | null
          project_stage?: string | null
          region?: string | null
          seeking_non_technical_skills?: string[] | null
          seeking_technical?: string | null
          seeking_technical_skills?: string[] | null
          support_areas?: string[] | null
          team_size?: number | null
          team_status?: string | null
          technical_skills?: string[] | null
          university?: string | null
          updated_at?: string
          user_id: string
          user_type?: string | null
          year?: number | null
        }
        Update: {
          avatar_url?: string | null
          career?: string | null
          created_at?: string
          email?: string | null
          entrepreneur_type?: string | null
          experience_years?: number | null
          full_name?: string | null
          gender?: string | null
          hobbies?: string[] | null
          id?: string
          interests?: string[] | null
          is_technical?: boolean | null
          location?: string | null
          non_technical_skills?: string[] | null
          phone?: string | null
          profession?: string | null
          project_description?: string | null
          project_name?: string | null
          project_sector?: string | null
          project_stage?: string | null
          region?: string | null
          seeking_non_technical_skills?: string[] | null
          seeking_technical?: string | null
          seeking_technical_skills?: string[] | null
          support_areas?: string[] | null
          team_size?: number | null
          team_status?: string | null
          technical_skills?: string[] | null
          university?: string | null
          updated_at?: string
          user_id?: string
          user_type?: string | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      profile_discovery: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          entrepreneur_type: string | null
          experience_years: number | null
          hobbies: string[] | null
          interests: string[] | null
          is_technical: boolean | null
          non_technical_skills: string[] | null
          project_description: string | null
          project_name: string | null
          project_sector: string | null
          project_stage: string | null
          seeking_non_technical_skills: string[] | null
          seeking_technical: string | null
          seeking_technical_skills: string[] | null
          support_areas: string[] | null
          team_size: number | null
          team_status: string | null
          technical_skills: string[] | null
          user_id: string | null
          user_type: string | null
          year: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          entrepreneur_type?: string | null
          experience_years?: number | null
          hobbies?: string[] | null
          interests?: string[] | null
          is_technical?: boolean | null
          non_technical_skills?: string[] | null
          project_description?: string | null
          project_name?: string | null
          project_sector?: string | null
          project_stage?: string | null
          seeking_non_technical_skills?: string[] | null
          seeking_technical?: string | null
          seeking_technical_skills?: string[] | null
          support_areas?: string[] | null
          team_size?: number | null
          team_status?: string | null
          technical_skills?: string[] | null
          user_id?: string | null
          user_type?: string | null
          year?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          entrepreneur_type?: string | null
          experience_years?: number | null
          hobbies?: string[] | null
          interests?: string[] | null
          is_technical?: boolean | null
          non_technical_skills?: string[] | null
          project_description?: string | null
          project_name?: string | null
          project_sector?: string | null
          project_stage?: string | null
          seeking_non_technical_skills?: string[] | null
          seeking_technical?: string | null
          seeking_technical_skills?: string[] | null
          support_areas?: string[] | null
          team_size?: number | null
          team_status?: string | null
          technical_skills?: string[] | null
          user_id?: string | null
          user_type?: string | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_connected_profile_details: {
        Args: { target_user_id: string }
        Returns: {
          user_id: string
          full_name: string
          email: string
          phone: string
          location: string
          region: string
          university: string
          career: string
          profession: string
          user_type: string
          avatar_url: string
          project_name: string
          project_description: string
          technical_skills: string[]
          non_technical_skills: string[]
          interests: string[]
          support_areas: string[]
        }[]
      }
      users_are_connected: {
        Args: { user1_id: string; user2_id: string }
        Returns: boolean
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
    Enums: {},
  },
} as const
