import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Posts a comment on behalf of someone who is NOT signed in — the only
 * place a guest comment can be created. It requires a valid Cloudflare
 * Turnstile token, verified here against Cloudflare's own servers before
 * anything gets written.
 *
 * This closes the hole a direct-from-browser insert would have: a bot
 * can fake a request to this server function, but it cannot fake a
 * Turnstile token without actually solving a real challenge, since the
 * verification happens here, against Cloudflare, not in the browser.
 *
 * Requires these as Cloudflare Pages secrets (server-only):
 *   TURNSTILE_SECRET_KEY       — from the Cloudflare Turnstile dashboard
 *   SUPABASE_URL                — same value as VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   — bypasses RLS; never expose to the client
 */
export const postGuestComment = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        contentType: z.enum(["livestream", "devotional"]),
        contentId: z.string().min(1),
        displayName: z.string().trim().min(1).max(60),
        body: z.string().trim().min(1).max(1000),
        turnstileToken: z.string().min(1),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const turnstileSecret = process.env["TURNSTILE_SECRET_KEY"];
    const supabaseUrl = process.env["SUPABASE_URL"];
    const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];

    if (!turnstileSecret || !supabaseUrl || !serviceRoleKey) {
      return { error: "Comments are not fully configured yet." };
    }

    // 1. Verify the Turnstile token against Cloudflare's own servers.
    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: turnstileSecret,
        response: data.turnstileToken,
      }),
    });
    const verifyResult = (await verifyRes.json()) as { success: boolean; "error-codes"?: string[] };

    if (!verifyResult.success) {
      return { error: "We couldn't verify you're human. Please try again." };
    }

    // 2. Only after verification succeeds, insert the comment — using the
    // service role key, which bypasses RLS. This is the only path a guest
    // comment can be created through; there is no RLS policy that allows
    // an anonymous insert directly.
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/comments`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author_id: null,
        display_name: data.displayName,
        content_type: data.contentType,
        content_id: data.contentId,
        body: data.body,
      }),
    });

    if (!insertRes.ok) {
      const text = await insertRes.text().catch(() => "");
      return { error: `Failed to post comment: ${text}` };
    }

    return { error: null };
  });
