import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (import.meta.env as any).VITE_SUPABASE_ANO;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Helper to standardise error handling for Supabase operations.
 */
export function handleSupabaseError(error: any, operation: string, context?: any) {
  console.error(`Supabase Error during [${operation}]:`, error);
  const errMsg = error?.message || String(error);
  toastError(`${operation} failed: ${errMsg}`);
  throw error;
}

function toastError(msg: string) {
  // We can dynamically trigger toast if importable, or let component handle it.
  // We'll log to console and let the calling code use UI-specific notification.
}
