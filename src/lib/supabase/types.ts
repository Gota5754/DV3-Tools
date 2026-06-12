// Hand-written database types matching supabase/migrations/0001_initial_schema.sql.
// Once the Supabase project exists, regenerate with:
//   npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts

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
      profiles: {
        Row: {
          id: string;
          ign: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          ign?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          ign?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      collections: {
        Row: {
          id: number;
          slug: string;
          name_en: string;
          name_fr: string;
          sort_order: number;
        };
        Insert: {
          id: number;
          slug: string;
          name_en: string;
          name_fr: string;
          sort_order: number;
        };
        Update: {
          id?: number;
          slug?: string;
          name_en?: string;
          name_fr?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      stickers: {
        Row: {
          id: number;
          collection_id: number;
          position: number;
          name_en: string | null;
          name_fr: string | null;
        };
        Insert: {
          id: number;
          collection_id: number;
          position: number;
          name_en?: string | null;
          name_fr?: string | null;
        };
        Update: {
          id?: number;
          collection_id?: number;
          position?: number;
          name_en?: string | null;
          name_fr?: string | null;
        };
        Relationships: [];
      };
      user_stickers: {
        Row: {
          user_id: string;
          sticker_id: number;
          owned: boolean;
          duplicates: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          sticker_id: number;
          owned?: boolean;
          duplicates?: number;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          sticker_id?: number;
          owned?: boolean;
          duplicates?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_trade_matches: {
        Args: Record<string, never>;
        Returns: {
          partner_id: string;
          partner_ign: string;
          they_have: number[];
          they_need: number[];
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Collection = Database["public"]["Tables"]["collections"]["Row"];
export type Sticker = Database["public"]["Tables"]["stickers"]["Row"];
export type UserSticker = Database["public"]["Tables"]["user_stickers"]["Row"];
export type TradeMatch =
  Database["public"]["Functions"]["get_trade_matches"]["Returns"][number];
