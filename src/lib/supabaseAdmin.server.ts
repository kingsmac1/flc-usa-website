import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * SERVICE-ROLE SUPABASE CLIENT — SERVER ONLY
 * -------------------------------------------
 * Used by form email delivery (contact.server.ts) to read the
 * dashboard-editable email_templates / email_settings tables before a
 * public form's confirmation is sent. Those tables are RLS-gated to
 * staff/pastor accounts (see supabase/02-upgrade-schema.sql), but an
 * anonymous site visitor submitting a form has no session at all — so
 * this reads through the service role key instead, exactly like
 * supabase/functions/dispatch-scheduled-campaigns already does for the
 * Messaging feature. Never import this from client code.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (Project Settings → API → service_role)
 * alongside the existing VITE_SUPABASE_URL. Falls back to null when either
 * is missing, so callers can degrade to hardcoded defaults instead of
 * throwing during local dev before secrets are configured.
 */
let cached: SupabaseClient | null | undefined;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env["VITE_SUPABASE_URL"];
  const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];

  cached = url && serviceRoleKey ? createClient(url, serviceRoleKey) : null;
  return cached;
}
