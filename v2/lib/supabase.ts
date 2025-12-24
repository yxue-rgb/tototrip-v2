import { createClient } from '@supabase/supabase-js';

// Supabase client for client-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          preferred_language: string;
          home_country: string | null;
          currency_preference: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      trips: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          destination_city: string | null;
          destination_country: string;
          start_date: string | null;
          end_date: string | null;
          total_budget: number | null;
          currency: string;
          travelers_count: number;
          status: 'planning' | 'booked' | 'ongoing' | 'completed' | 'cancelled';
          is_public: boolean;
          cover_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['trips']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['trips']['Insert']>;
      };
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          trip_id: string | null;
          title: string | null;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['chat_sessions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['chat_sessions']['Insert']>;
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          locations: any | null;
          metadata: any | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['chat_messages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['chat_messages']['Insert']>;
      };
      saved_locations: {
        Row: {
          id: string;
          user_id: string;
          trip_id: string | null;
          name: string;
          description: string | null;
          category: 'attraction' | 'restaurant' | 'hotel' | 'shopping' | 'transport' | 'other';
          address: string | null;
          city: string | null;
          latitude: number | null;
          longitude: number | null;
          rating: number | null;
          review_count: number | null;
          price_level: number | null;
          estimated_cost: number | null;
          currency: string;
          visit_duration: string | null;
          best_time_to_visit: string | null;
          opening_hours: string | null;
          image_url: string | null;
          images: any | null;
          website_url: string | null;
          booking_url: string | null;
          phone: string | null;
          tags: string[] | null;
          notes: string | null;
          visited: boolean;
          visit_date: string | null;
          user_rating: number | null;
          amap_id: string | null;
          google_place_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['saved_locations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['saved_locations']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
