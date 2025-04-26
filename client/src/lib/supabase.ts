import { createClient } from '@supabase/supabase-js';

// We'll initialize these later when we have the credentials
let supabaseUrl = '';
let supabaseAnonKey = '';
let supabaseClient: ReturnType<typeof createClient> | null = null;

// Function to initialize Supabase with credentials from our API
export async function initSupabase() {
  try {
    // Fetch config from our API
    const response = await fetch('/api/config');
    if (!response.ok) {
      throw new Error('Failed to fetch Supabase configuration');
    }
    
    const config = await response.json();
    
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      throw new Error('Supabase credentials not found in server config');
    }
    
    supabaseUrl = config.supabaseUrl;
    supabaseAnonKey = config.supabaseAnonKey;
    
    // Create the client
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('Supabase client initialized successfully');
    return supabaseClient;
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    throw error;
  }
}

// Function to get the Supabase client (initializes if needed)
export async function getSupabase() {
  if (!supabaseClient) {
    return await initSupabase();
  }
  return supabaseClient;
}