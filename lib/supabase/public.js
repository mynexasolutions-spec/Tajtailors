import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-free, anon-key client for public read-only data (categories, hero
 * slides, announcements, site settings). Safe to call inside `unstable_cache`
 * since it never touches `cookies()`/`headers()`.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
