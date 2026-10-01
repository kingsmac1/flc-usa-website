import { sendFormNotification } from "./contact.functions";
import type { EmailTemplateKey } from "./contact.server";

export type FormField = { label: string; value: string };
export type { EmailTemplateKey };

/**
 * Notifies the church office and the person who filled out a form: an
 * internal copy of their answers, and a confirmation email addressed to
 * them. The actual subject/heading/body text comes from the matching
 * `templateKey` row in the email_templates table (dashboard → Email
 * Templates), so editing it there changes every future send immediately —
 * nothing here needs to change. Silently does nothing if Resend isn't
 * configured, or if delivery fails — the form's data is already saved in
 * Supabase by the time this runs, so email delivery is a best-effort
 * extra, never a blocker.
 */
export async function notifyFormSubmission(input: {
  formName: string;
  fields: FormField[];
  submitterEmail: string;
  templateKey: EmailTemplateKey;
  variables?: Record<string, string>;
  notifyOwner?: boolean;
}) {
  try {
    await sendFormNotification({ data: input });
  } catch {
    /* email delivery is optional until RESEND_API_KEY is configured */
  }
}
