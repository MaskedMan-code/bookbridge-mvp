import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ibaqcojegmfxtwjmjgjk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliYXFjb2plZ21meHR3am1qZ2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NDA5NTEsImV4cCI6MjA5ODMxNjk1MX0.-jMKo_bpYYQTUw-Ls42BMRkpI9TO6L5-KtBCRpaKLko';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Supabase connected!");
