/**
 * RESEND EMAIL DELIVERY
 * ---------------------
 * To turn on email delivery for every form on the site, add these secrets:
 *   RESEND_API_KEY   your Resend API key (re_...)
 *   RESEND_FROM      verified sender, e.g. "FLC USA <no-reply@flcusa.org>"
 *   RESEND_TO        inbox that receives submissions (defaults to info@flcusa.org)
 * Nothing else needs to change — forms pick it up automatically.
 */
export type FormField = { label: string; value: string };

export async function sendViaResend(
  subject: string,
  fields: FormField[],
): Promise<{ delivered: boolean; message: string }> {
  const apiKey = process.env["RESEND_API_KEY"];
  const from = process.env["RESEND_FROM"] ?? "FLC USA <onboarding@resend.dev>";
  const to = process.env["RESEND_TO"] ?? "info@flcusa.org";

  if (!apiKey) {
    return { delivered: false, message: "Email delivery is not configured yet." };
  }

  const rows = fields
    .filter((f) => f.value?.trim())
    .map(
      (f) =>
        `<tr><td style="padding:6px 12px;font-weight:600">${escapeHtml(f.label)}</td><td style="padding:6px 12px">${escapeHtml(f.value)}</td></tr>`,
    )
    .join("");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `${subject} — flcusa.org`,
        html: `<h2>${escapeHtml(subject)}</h2><table>${rows}</table>`,
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}`);
    return { delivered: true, message: "Message sent." };
  } catch {
    return { delivered: false, message: "Email delivery failed." };
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
