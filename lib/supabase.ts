// Supabase client initialization
import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Initialize Supabase client for client-side usage
export const supabase = env.supabaseUrl && env.supabaseAnonKey
  ? createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Initialize Supabase client for server-side usage (with service role key)
export const supabaseAdmin = env.supabaseUrl && env.supabaseServiceRoleKey
  ? createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Database types (you'll need to generate these from your Supabase schema)
export interface Database {
  public: {
    Tables: {
      user_history: {
        Row: {
          id: string;
          user_id: string;
          tool_name: string;
          input_data: Record<string, unknown>;
          output_data: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tool_name: string;
          input_data: Record<string, unknown>;
          output_data: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tool_name?: string;
          input_data?: Record<string, unknown>;
          output_data?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      saved_content: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          tool_name: string;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          tool_name: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          tool_name?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

