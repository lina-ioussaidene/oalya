import { createClient } from '@supabase/supabase-js';

// On ajoute "as string" pour certifier à TypeScript que ce sont bien des textes
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);