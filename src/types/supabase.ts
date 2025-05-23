export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          color: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          is_complete: boolean;
          category_id: string | null;
          user_id: string;
          created_at: string;
          due_date: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          is_complete?: boolean;
          category_id?: string | null;
          user_id: string;
          created_at?: string;
          due_date?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          is_complete?: boolean;
          category_id?: string | null;
          user_id?: string;
          created_at?: string;
          due_date?: string | null;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          display_name: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          display_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          display_name?: string | null;
          avatar_url?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
