import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * SUPABASE CLIENT
 * ----------------
 * These two values are safe to expose publicly — the anon key relies on
 * Row Level Security policies (see supabase/schema.sql) for actual
 * protection, not on being secret. That's why they're read from VITE_
 * prefixed env vars (embedded into the browser bundle at build time),
 * unlike BIBLE_API_KEY/YOUTUBE_API_KEY/STRIPE_SECRET_KEY which are
 * server-only secrets read via process.env.
 *
 * Set these in the Cloudflare dashboard → Pages project → Settings →
 * Environment Variables, same place as the other integration secrets:
 *   VITE_SUPABASE_URL       — Project Settings → API → Project URL
 *   VITE_SUPABASE_ANON_KEY  — Project Settings → API → anon/public key
 *
 * For local dev, add both to a .dev.vars or .env.local file (whichever
 * your local setup already uses for the other VITE_ vars, if any).
 */
const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const supabaseAnonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined;

/** True when both env vars are configured. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    "Supabase env vars are missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). " +
      "Sign-in, comments, and membership will not work until these are configured.",
  );
}

/**
 * Supabase client — only created when env vars are present.
 * Components using it should guard with `isSupabaseConfigured` when needed.
 */
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : ({} as SupabaseClient);
