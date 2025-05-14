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
        Relationships: [
          {
            foreignKeyName: "categories_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "tasks_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [];
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
