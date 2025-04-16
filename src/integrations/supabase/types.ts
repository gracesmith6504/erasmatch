export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      city_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          forum_id: string
          id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          forum_id: string
          id?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          forum_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "city_comments_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "city_forums"
            referencedColumns: ["id"]
          },
        ]
      }
      city_forums: {
        Row: {
          author_id: string
          city: string
          content: string
          created_at: string
          id: string
          title: string
        }
        Insert: {
          author_id: string
          city: string
          content: string
          created_at?: string
          id?: string
          title: string
        }
        Update: {
          author_id?: string
          city?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      city_messages: {
        Row: {
          city_name: string
          content: string
          created_at: string
          id: string
          sender_id: string
        }
        Insert: {
          city_name: string
          content: string
          created_at?: string
          id?: string
          sender_id: string
        }
        Update: {
          city_name?: string
          content?: string
          created_at?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "city_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string | null
          id: string
          is_active: boolean | null
          joined_at: string | null
          notifications_enabled: boolean | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          notifications_enabled?: boolean | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          notifications_enabled?: boolean | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          sender_id: string
          university_name: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          sender_id: string
          university_name: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          sender_id?: string
          university_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string | null
          creator_id: string | null
          description: string | null
          id: string
          name: string
          slug: string
          type: string
          visibility: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          type: string
          visibility?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          type?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          city: string | null
          created_at: string
          id: string
          image_url: string | null
          platform: string | null
          price: string | null
          room_type: string | null
          source_url: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          platform?: string | null
          price?: string | null
          room_type?: string | null
          source_url?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          platform?: string | null
          price?: string | null
          room_type?: string | null
          source_url?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          course: string | null
          created_at: string
          deleted_at: string | null
          email: string | null
          home_university: string | null
          id: string
          invited_by: string | null
          last_active_at: string | null
          name: string | null
          personality_tags: string[] | null
          ref_code: string | null
          semester: string | null
          university: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          course?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          home_university?: string | null
          id: string
          invited_by?: string | null
          last_active_at?: string | null
          name?: string | null
          personality_tags?: string[] | null
          ref_code?: string | null
          semester?: string | null
          university?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          course?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          home_university?: string | null
          id?: string
          invited_by?: string | null
          last_active_at?: string | null
          name?: string | null
          personality_tags?: string[] | null
          ref_code?: string | null
          semester?: string | null
          university?: string | null
        }
        Relationships: []
      }
      prompt_logs: {
        Row: {
          created_at: string
          id: string
          prompt_text: string
          receiver_id: string
          sender_id: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          prompt_text: string
          receiver_id: string
          sender_id: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          prompt_text?: string
          receiver_id?: string
          sender_id?: string
          type?: string
        }
        Relationships: []
      }
      universities: {
        Row: {
          accommodation_info: string | null
          city: string | null
          country: string | null
          erasmus_tips: string | null
          id: number
          image_url: string | null
          links: Json | null
          name: string
          overview: string | null
          popular_courses: string | null
        }
        Insert: {
          accommodation_info?: string | null
          city?: string | null
          country?: string | null
          erasmus_tips?: string | null
          id?: number
          image_url?: string | null
          links?: Json | null
          name: string
          overview?: string | null
          popular_courses?: string | null
        }
        Update: {
          accommodation_info?: string | null
          city?: string | null
          country?: string | null
          erasmus_tips?: string | null
          id?: number
          image_url?: string | null
          links?: Json | null
          name?: string
          overview?: string | null
          popular_courses?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      join_group_by_slug: {
        Args: { p_user_id: string; group_slug: string }
        Returns: undefined
      }
      slugify: {
        Args: { input: string }
        Returns: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
