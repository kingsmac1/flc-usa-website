import { brandedEmail, EMAIL_COLORS, escapeHtml, interpolate, publicSiteUrl } from "./emailTemplate";
import { getSupabaseAdmin } from "./supabaseAdmin.server";

/**
 * RESEND EMAIL DELIVERY
 * ---------------------
 * Every public form on the site emails two people on submission, both
 * through the same branded template (see emailTemplate.ts): the church
 * office (an internal copy of the answers, to one or more addresses) and
 * the person who submitted it (a short confirmation). The subject/heading/
 * body of every template below, and the office inbox address(es), are
 * editable from the dashboard's Email Templates and Owner Email sections
 * (supabase/02-upgrade-schema.sql, sections 10-11) — DEFAULT_TEMPLATES here
 * is only the fallback used before those rows exist or when the
 * service-role key isn't configured yet. Configure these secrets to turn
 * on delivery at all:
 *   RESEND_API_KEY   your Resend API key (re_...)
 *   RESEND_FROM      verified sender, e.g. "FLC USA <no-reply@flcusa.org>"
 *   RESEND_TO        fallback inbox, used only until a pastor sets one in the dashboard
 * If the key isn't set, both emails are skipped silently; Supabase already has the data.
 */
export type FormField = { label: string; value: string };

export type EmailTemplateKey =
  | "contact_confirmation"
  | "prayer_confirmation"
  | "salvation_confirmation"
  | "event_interest_confirmation"
  | "membership_confirmation"
  | "newsletter_confirmation"
  | "checkin_confirmation"
  | "owner_notification";

type Template = { subject: string; heading: string; body: string };

/** Mirrors the seed data in supabase/02-upgrade-schema.sql, section 10. */
const DEFAULT_TEMPLATES: Record<EmailTemplateKey, Template> = {
  contact_confirmation: {
    subject: "We received your message — Fountain of Life Church USA",
    heading: "Message sent!",
    body: "Hi {{name}}, thanks for reaching out to Fountain of Life Church USA. We've received your message and our team will get back to you shortly.",
  },
  prayer_confirmation: {
    subject: "We received your prayer request — Fountain of Life Church USA",
    heading: "Prayer request received",
    body: "Hi {{name}}, thank you for sharing your prayer request with us. Our intercessory team will be praying with you.",
  },
  salvation_confirmation: {
    subject: "Welcome to the family! — Fountain of Life Church USA",
    heading: "Welcome to the family!",
    body: "Hi {{name}}, welcome to the family! Someone from our team will reach out to you shortly to help you take your next steps.",
  },
  event_interest_confirmation: {
    subject: "You're registered for {{event}} — Fountain of Life Church USA",
    heading: "You're registered!",
    body: "Hi {{name}}, thanks for registering your interest in {{event}}. We'll send you a reminder closer to the date.",
  },
  membership_confirmation: {
    subject: "Welcome to Fountain of Life Church USA!",
    heading: "Welcome to Fountain of Life Church USA!",
    body: "Hi {{name}}, thank you for joining our family! Someone from our team will be in touch with you shortly.",
  },
  newsletter_confirmation: {
    subject: "You're on the list! — Fountain of Life Church USA",
    heading: "You're on the list!",
    body: "Thanks for subscribing to our newsletter — you'll hear from us soon with updates from Fountain of Life Church USA.",
  },
  checkin_confirmation: {
    subject: "You're checked in ✓ — Fountain of Life Church USA",
    heading: "You're checked in ✓",
    body: "Hi {{name}}, you're checked in for today's service. Thanks for being here!",
  },
  owner_notification: {
    subject: "New {{form_name}} — flcusa.org",
    heading: "New {{form_name}}",
    body: "You've received a new submission from the website. Details are below:",
  },
};

type SendFormEmailsInput = {
  formName: string;
  fields: FormField[];
  submitterEmail: string;
  templateKey: EmailTemplateKey;
  /** Values substituted into `{{key}}` placeholders — `form_name` is added automatically. */
  variables?: Record<string, string> | undefined;
  /** Set to false to skip the internal copy (e.g. high-frequency forms like check-in). */
  notifyOwner?: boolean | undefined;
};

export async function sendFormEmails(
  input: SendFormEmailsInput,
): Promise<{ delivered: boolean }> {
  const apiKey = process.env["RESEND_API_KEY"];
  const from = process.env["RESEND_FROM"] ?? "Fountain of Life Church USA <onboarding@resend.dev>";

  if (!apiKey) return { delivered: false };

  const keys: EmailTemplateKey[] =
    input.notifyOwner !== false ? [input.templateKey, "owner_notification"] : [input.templateKey];
  const { templates, ownerEmails } = await loadTemplatesAndOwnerEmails(keys);
  const vars = { form_name: input.formName, ...input.variables };

  const sends: Promise<void>[] = [];

  if (input.notifyOwner !== false && ownerEmails.length > 0) {
    const t = templates.owner_notification;
    sends.push(
      sendOne(
        apiKey,
        from,
        ownerEmails,
        interpolate(t.subject, vars),
        brandedEmail({
          preheader: `New ${input.formName} submitted on the website.`,
          heading: interpolate(t.heading, vars),
          bodyHtml: asBodyHtml(interpolate(t.body, vars)) + fieldsTable(input.fields),
          cta: { label: "Open the dashboard", url: `${publicSiteUrl()}/dashboard` },
        }),
      ),
    );
  }

  if (input.submitterEmail) {
    const t = templates[input.templateKey];
    const subject = interpolate(t.subject, vars);
    sends.push(
      sendOne(
        apiKey,
        from,
        input.submitterEmail,
        subject,
        brandedEmail({
          preheader: interpolate(t.body, vars).replace(/<[^>]+>/g, ""),
          heading: interpolate(t.heading, vars),
          bodyHtml: asBodyHtml(interpolate(t.body, vars)),
        }),
      ),
    );
  }

  const results = await Promise.allSettled(sends);
  return { delivered: results.some((r) => r.status === "fulfilled") };
}

async function loadTemplatesAndOwnerEmails(keys: EmailTemplateKey[]) {
  const templates: Record<EmailTemplateKey, Template> = { ...DEFAULT_TEMPLATES };
  let ownerEmails = [process.env["RESEND_TO"] ?? "info@flcusa.org"];

  const admin = getSupabaseAdmin();
  if (!admin) return { templates, ownerEmails };

  const [templatesRes, settingsRes] = await Promise.all([
    admin.from("email_templates").select("key, subject, heading, body").in("key", keys),
    admin.from("email_settings").select("owner_emails").eq("id", true).maybeSingle(),
  ]);

  for (const row of templatesRes.data ?? []) {
    templates[row.key as EmailTemplateKey] = {
      subject: row.subject,
      heading: row.heading,
      body: row.body,
    };
  }
  if (settingsRes.data?.owner_emails?.length) ownerEmails = settingsRes.data.owner_emails;

  return { templates, ownerEmails };
}

/** Dashboard-edited copy may already be HTML (pasted/typed in HTML mode) — only paragraph-wrap plain text. */
function asBodyHtml(text: string) {
  return text.trim().startsWith("<") ? text : `<p style="margin:0;">${escapeHtml(text)}</p>`;
}

function fieldsTable(fields: FormField[]) {
  const rows = fields
    .filter((f) => f.value?.trim())
    .map(
      (f) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid ${EMAIL_COLORS.border};font-size:13px;font-weight:700;color:${EMAIL_COLORS.muted};width:150px;vertical-align:top;white-space:nowrap;">${escapeHtml(f.label)}</td>
        <td style="padding:10px 0 10px 16px;border-bottom:1px solid ${EMAIL_COLORS.border};font-size:14px;color:${EMAIL_COLORS.text};">${escapeHtml(f.value).replace(/\n/g, "<br />")}</td>
      </tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">${rows}</table>`;
}

async function sendOne(apiKey: string, from: string, to: string | string[], subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: Array.isArray(to) ? to : [to], subject, html }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}`);
}
