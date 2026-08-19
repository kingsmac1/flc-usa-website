import { sendChurchMessage } from "./contact.functions";

/**
 * FORM DELIVERY
 * -------------
 * Every form on the site does two things when submitted:
 *   1. Opens WhatsApp with a pre-filled message to the church number.
 *   2. Attempts an email delivery through Resend (see src/lib/contact.server.ts).
 *      If RESEND_API_KEY is not configured yet, the email step is skipped
 *      silently and WhatsApp still works.
 */

/** Church WhatsApp number in international format, digits only. */
export const WHATSAPP_NUMBER = "14633366108";

export type FormField = { label: string; value: string };

export function buildWhatsAppMessage(subject: string, fields: FormField[]) {
  const lines = [`*${subject}* — flcusa.org`, ""];
  for (const f of fields) {
    if (f.value?.trim()) lines.push(`${f.label}: ${f.value.trim()}`);
  }
  return lines.join("\n");
}

export function whatsappUrl(subject: string, fields: FormField[]) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    buildWhatsAppMessage(subject, fields),
  )}`;
}

/** Reads a form element into label/value pairs using each control's name. */
export function fieldsFromForm(form: HTMLFormElement, labels: Record<string, string>): FormField[] {
  const data = new FormData(form);
  return Object.entries(labels).map(([name, label]) => {
    const raw = data.get(name);
    return { label, value: typeof raw === "string" ? raw : raw ? "Yes" : "" };
  });
}

/** Submits a form: emails through Resend when configured, then opens WhatsApp. */
export async function submitChurchForm(subject: string, fields: FormField[]) {
  const url = whatsappUrl(subject, fields);
  try {
    await sendChurchMessage({ data: { subject, fields } });
  } catch {
    /* email delivery is optional until RESEND_API_KEY is configured */
  }
  if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
  return url;
}
