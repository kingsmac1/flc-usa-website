// Dispatch dashboard messaging campaigns — both on a schedule and on demand.
//
// Two callers:
//   1. pg_cron, once a minute (see supabase/02-upgrade-schema.sql, section 11)
//      with an empty body, authenticated as the service role — processes
//      every "scheduled" campaign whose time has arrived.
//   2. The dashboard itself, right after a "Send now" click, with
//      { campaign_id } in the body, authenticated as the signed-in
//      staff/pastor user — processes just that one campaign immediately.
//      (The dashboard calls this over a plain fetch(), not a TanStack Start
//      server function — useServerFn from a second route was found to
//      break the site's build entirely, so all real sending, immediate or
//      scheduled, goes through this one already-isolated function instead.)
//
// Either way, this resolves the same audience logic (present/absent/all/
// individual/event_interest/newsletter), sends through Resend, and marks
// the row "sent" or "failed".

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Campaign = {
  id: string;
  subject: string;
  body: string;
  service_date: string;
  audience: "present" | "absent" | "all" | "individual" | "event_interest" | "newsletter";
  recipient_emails: string[] | null;
  event_slug: string | null;
};

type Recipient = { email: string; name?: string | null };

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resendFrom = Deno.env.get("RESEND_FROM") ?? "Fountain of Life Church USA <onboarding@resend.dev>";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function resolveRecipients(campaign: Campaign): Promise<Recipient[]> {
  if (campaign.audience === "individual") {
    return (campaign.recipient_emails ?? []).map((email) => ({ email }));
  }

  if (campaign.audience === "event_interest") {
    const { data } = await supabase
      .from("event_interest")
      .select("email, name")
      .eq("event_slug", campaign.event_slug ?? "");
    const seen = new Set<string>();
    const out: Recipient[] = [];
    for (const r of data ?? []) {
      if (seen.has(r.email)) continue;
      seen.add(r.email);
      out.push({ email: r.email, name: r.name });
    }
    return out;
  }

  if (campaign.audience === "newsletter") {
    const { data } = await supabase.from("newsletter_subscribers").select("email");
    return (data ?? []).map((r) => ({ email: r.email }));
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .not("email", "is", null);
  const list = profiles ?? [];

  if (campaign.audience === "all") {
    return list.map((p) => ({ email: p.email, name: p.full_name }));
  }

  // present / absent — scoped to the campaign's own service date.
  const { data: checkIns } = await supabase
    .from("check_ins")
    .select("member_id")
    .eq("service_date", campaign.service_date);
  const presentIds = new Set((checkIns ?? []).map((c) => c.member_id));
  return list
    .filter((p) => (campaign.audience === "present" ? presentIds.has(p.id) : !presentIds.has(p.id)))
    .map((p) => ({ email: p.email, name: p.full_name }));
}

// Same palette/layout as the public site's forms (src/lib/emailTemplate.ts) —
// duplicated here rather than imported since this Deno edge function deploys
// independently from the Vite app and can't share local TS modules with it.
const EMAIL_COLORS = {
  deep: "#12162a",
  deepForeground: "#f7f6fa",
  accent: "#e4b24e",
  cream: "#f7f2e8",
  card: "#ffffff",
  border: "#e7e2d6",
  muted: "#6b6f7d",
  text: "#22242f",
};

// `body` is already HTML by the time it gets here — the Messaging composer's
// Visual mode (a contentEditable editor) and HTML mode (a raw-markup
// textarea) both produce real markup now, not plain text, so it's used
// as-is rather than escaped. Trusted content: only staff/pastor accounts
// can create a campaign at all (see email_campaigns' RLS policy).
function brandedEmailHtml(subject: string, body: string) {
  const c = EMAIL_COLORS;
  const bodyHtml = body;
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Fountain of Life Church USA</title>
  </head>
  <body style="margin:0;padding:0;background-color:${c.cream};font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${c.cream};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${c.card};border-radius:20px;overflow:hidden;border:1px solid ${c.border};">
            <tr>
              <td style="background-color:${c.deep};padding:28px 32px;text-align:center;">
                <span style="color:${c.deepForeground};font-size:18px;font-weight:700;letter-spacing:0.01em;font-family:Georgia,'Times New Roman',serif;">
                  Fountain of Life Church USA
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px;">
                <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:${c.text};">${escapeHtml(subject)}</h1>
                <div style="font-size:15px;line-height:1.65;color:${c.text};font-family:Arial,sans-serif;">${bodyHtml}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;">
                <div style="height:1px;background-color:${c.border};margin-bottom:20px;"></div>
                <p style="margin:0;font-size:12px;line-height:1.6;color:${c.muted};font-family:Arial,sans-serif;">
                  2415 Directors Row, Indianapolis, IN 46241 (Suite H)<br />
                  +1 (463) 336-6108 · <a href="mailto:info@flcusa.org" style="color:${c.accent};text-decoration:none;">info@flcusa.org</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function sendViaResend(subject: string, body: string, recipients: Recipient[]) {
  if (!resendApiKey) return { delivered: 0, failed: recipients.length };
  const html = brandedEmailHtml(subject, body);

  let delivered = 0;
  let failed = 0;
  for (let i = 0; i < recipients.length; i += 100) {
    const chunk = recipients.slice(i, i + 100);
    try {
      const res = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(chunk.map((r) => ({ from: resendFrom, to: [r.email], subject, html }))),
      });
      if (res.ok) delivered += chunk.length;
      else failed += chunk.length;
    } catch {
      failed += chunk.length;
    }
  }
  return { delivered, failed };
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function callerIsStaffOrPastor(req: Request): Promise<boolean> {
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return false;

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  return profile?.role === "staff" || profile?.role === "pastor";
}

// The dashboard now calls this over a plain browser fetch() (see the big
// comment above), which means the browser sends a CORS preflight first —
// without these headers it never gets past that to make the real request.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  let campaignId: string | null = null;
  if (req.method === "POST") {
    try {
      const body = await req.json();
      if (typeof body?.campaign_id === "string") campaignId = body.campaign_id;
    } catch {
      // empty/non-JSON body — treat as the cron's "process everything due" call
    }
  }

  // An on-demand single-campaign call must prove the caller is signed in
  // as staff/pastor — the cron's empty-body call is already authenticated
  // at the platform level via the service-role JWT in its Authorization
  // header, so it skips this (parallel to how every other dashboard action
  // is gated by is_admin() at the database level).
  if (campaignId && !(await callerIsStaffOrPastor(req))) {
    return new Response(JSON.stringify({ error: "Not authorized." }), {
      status: 403,
      headers: corsHeaders,
    });
  }

  const query = supabase
    .from("email_campaigns")
    .select("id, subject, body, service_date, audience, recipient_emails, event_slug");

  const { data: due, error } = campaignId
    ? await query.eq("id", campaignId)
    : await query.eq("status", "scheduled").lte("scheduled_for", new Date().toISOString());

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  const results = [];
  for (const campaign of (due ?? []) as Campaign[]) {
    const recipients = await resolveRecipients(campaign);

    if (recipients.length === 0) {
      await supabase.from("email_campaigns").update({ status: "failed" }).eq("id", campaign.id);
      results.push({ id: campaign.id, outcome: "failed", reason: "no recipients" });
      continue;
    }

    const { delivered, failed } = await sendViaResend(campaign.subject, campaign.body, recipients);

    if (delivered === 0) {
      await supabase.from("email_campaigns").update({ status: "failed" }).eq("id", campaign.id);
      results.push({ id: campaign.id, outcome: "failed", delivered, failed });
    } else {
      await supabase
        .from("email_campaigns")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", campaign.id);
      results.push({ id: campaign.id, outcome: "sent", delivered, failed });
    }
  }

  return new Response(JSON.stringify({ checked: due?.length ?? 0, results }), {
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
});
