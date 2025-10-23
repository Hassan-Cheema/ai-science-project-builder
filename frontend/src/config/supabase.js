import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

let supabase;

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.warn('Supabase initialization failed:', error.message);
  supabase = null;
}

export { supabase };

