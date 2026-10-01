import { SITE } from "@/data/site";

/**
 * The publicly reachable site URL used to build absolute links/images inside
 * outgoing emails (the logo, the "Open the dashboard" button). SITE.domain
 * is flcusa.org, but PUBLIC_SITE_URL overrides this if the site is ever
 * served from somewhere else (e.g. the Cloudflare Pages preview URL) so
 * email images don't 404.
 */
export function publicSiteUrl() {
  return process.env["PUBLIC_SITE_URL"] || "https://flcusa.pages.dev";
}

/** Replaces `{{key}}` placeholders in a template string with `vars[key]` (blank if missing). */
export function interpolate(text: string, vars: Record<string, string>) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? "");
}

/** Shared palette for outgoing emails — hex, not oklch, since email clients need plain colors. */
export const EMAIL_COLORS = {
  deep: "#12162a",
  deepForeground: "#f7f6fa",
  accent: "#e4b24e",
  cream: "#f7f2e8",
  card: "#ffffff",
  border: "#e7e2d6",
  muted: "#6b6f7d",
  text: "#22242f",
};

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Wraps email body content in the church's branded template: a dark header
 * with the logo mark and name, a white card for the content, and a footer
 * with the address/contact details. Table-based layout with inline styles
 * throughout, since most email clients (Outlook, Gmail) strip <style>
 * blocks and don't support modern CSS.
 */
export function brandedEmail({
  preheader,
  heading,
  bodyHtml,
  cta,
}: {
  /** Short hidden preview text shown next to the subject line in inboxes. */
  preheader?: string;
  heading: string;
  bodyHtml: string;
  cta?: { label: string; url: string };
}) {
  const c = EMAIL_COLORS;
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(SITE.name)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${c.cream};font-family:Georgia,'Times New Roman',serif;">
    ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>` : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${c.cream};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${c.card};border-radius:20px;overflow:hidden;border:1px solid ${c.border};">
            <tr>
              <td style="background-color:${c.deep};padding:28px 32px;text-align:center;">
                <img
                  src="${publicSiteUrl()}/favicon.png"
                  width="40"
                  height="40"
                  alt="${escapeHtml(SITE.short)}"
                  style="border-radius:10px;display:block;margin:0 auto 10px;"
                />
                <span style="color:${c.deepForeground};font-size:18px;font-weight:700;letter-spacing:0.01em;font-family:Georgia,'Times New Roman',serif;">
                  ${escapeHtml(SITE.name)}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px 8px;">
                <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:${c.text};">${escapeHtml(heading)}</h1>
                <div style="font-size:15px;line-height:1.65;color:${c.text};font-family:Arial,sans-serif;">${bodyHtml}</div>
              </td>
            </tr>
            ${
              cta
                ? `<tr>
              <td style="padding:8px 32px 32px;">
                <a
                  href="${cta.url}"
                  style="display:inline-block;background-color:${c.accent};color:${c.deep};font-family:Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:999px;"
                >
                  ${escapeHtml(cta.label)}
                </a>
              </td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding:24px 32px 32px;">
                <div style="height:1px;background-color:${c.border};margin-bottom:20px;"></div>
                <p style="margin:0;font-size:12px;line-height:1.6;color:${c.muted};font-family:Arial,sans-serif;">
                  ${escapeHtml(SITE.address)}<br />
                  ${escapeHtml(SITE.phone)} · <a href="mailto:${SITE.email}" style="color:${c.accent};text-decoration:none;">${escapeHtml(SITE.email)}</a>
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
