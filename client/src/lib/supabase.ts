import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hsxolshsxkszrzauwgdu.supabase.co'; // your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzeG9sc2hzeGtzenJ6YXV3Z2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NzExNzgsImV4cCI6MjA2MTI0NzE3OH0.8FN5pN_YvRfwYJitEyeAtTwrLg9PfOpaGnc3BnVKrLo'; // your anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);