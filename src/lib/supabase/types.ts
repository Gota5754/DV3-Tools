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

export type TradeOfferStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "completed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          ign: string | null;
          discord: string | null;
          uid: string | null;
          server: "europe" | "america" | "asia" | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          ign?: string | null;
          discord?: string | null;
          uid?: string | null;
          server?: "europe" | "america" | "asia" | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          ign?: string | null;
          discord?: string | null;
          uid?: string | null;
          server?: "europe" | "america" | "asia" | null;
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
      trade_offers: {
        Row: {
          id: string;
          from_user: string;
          to_user: string;
          offered_sticker_ids: number[];
          requested_sticker_ids: number[];
          status: TradeOfferStatus;
          from_confirmed: boolean;
          to_confirmed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          from_user: string;
          to_user: string;
          offered_sticker_ids: number[];
          requested_sticker_ids: number[];
          status?: TradeOfferStatus;
          from_confirmed?: boolean;
          to_confirmed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: TradeOfferStatus;
          from_confirmed?: boolean;
          to_confirmed?: boolean;
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
          partner_discord: string | null;
          partner_uid: string | null;
          partner_server: "europe" | "america" | "asia" | null;
          they_have: number[];
          they_need: number[];
        }[];
      };
      get_my_trade_offers: {
        Args: Record<string, never>;
        Returns: {
          id: string;
          i_am_sender: boolean;
          partner_id: string;
          partner_ign: string | null;
          partner_discord: string | null;
          partner_uid: string | null;
          offered_ids: number[];
          requested_ids: number[];
          status: TradeOfferStatus;
          from_confirmed: boolean;
          to_confirmed: boolean;
          created_at: string;
        }[];
      };
      respond_to_trade: {
        Args: { p_offer_id: string; p_accept: boolean };
        Returns: string;
      };
      cancel_trade: {
        Args: { p_offer_id: string };
        Returns: string;
      };
      confirm_trade: {
        Args: { p_offer_id: string };
        Returns: string;
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
export type TradeMatch = Database["public"]["Functions"]["get_trade_matches"]["Returns"][number];
export type TradeOffer = Database["public"]["Tables"]["trade_offers"]["Row"];
export type MyTradeOffer = Database["public"]["Functions"]["get_my_trade_offers"]["Returns"][number];
