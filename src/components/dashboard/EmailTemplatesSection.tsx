import { ChevronDown, Loader2, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { PillButton } from "@/components/site/ui";
import { ErrorBanner, LoadingRow } from "./Table";
import { RichTextEditor } from "./RichTextEditor";
import { formatDateTime } from "./shared";
import type { EmailTemplateKey, EmailTemplateRow } from "./types";

const TEMPLATE_META: Record<EmailTemplateKey, { label: string; hint: string; placeholders: string[] }> = {
  contact_confirmation: {
    label: "Contact form",
    hint: "Sent to whoever fills in the Contact page form.",
    placeholders: ["{{name}}"],
  },
  prayer_confirmation: {
    label: "Prayer request",
    hint: "Sent after a prayer request is submitted.",
    placeholders: ["{{name}}"],
  },
  salvation_confirmation: {
    label: "Salvation decision",
    hint: "Sent after someone submits a salvation decision.",
    placeholders: ["{{name}}"],
  },
  event_interest_confirmation: {
    label: "Event interest",
    hint: "Sent after registering interest in an event.",
    placeholders: ["{{name}}", "{{event}}"],
  },
  membership_confirmation: {
    label: "Membership application",
    hint: "Sent after the membership form is completed.",
    placeholders: ["{{name}}"],
  },
  newsletter_confirmation: {
    label: "Newsletter signup",
    hint: "Sent after subscribing via the site footer.",
    placeholders: [],
  },
  checkin_confirmation: {
    label: "Service check-in",
    hint: "Sent to a member after they check themselves in.",
    placeholders: ["{{name}}"],
  },
  owner_notification: {
    label: "Internal notification",
    hint: "Sent to the church inbox for every submission above — the intro text shown before the submitted details.",
    placeholders: ["{{form_name}}"],
  },
};

export function EmailTemplatesSection({
  rows,
  isLoading,
  isError,
  error,
  onSave,
}: {
  rows: EmailTemplateRow[];
  isLoading: boolean;
  isError: boolean;
  error: string;
  onSave: (
    key: EmailTemplateKey,
    patch: Pick<EmailTemplateRow, "subject" | "heading" | "body" | "mode">,
  ) => Promise<{ error?: string }>;
}) {
  const [openKey, setOpenKey] = useState<EmailTemplateKey | null>(null);

  if (isLoading) return <LoadingRow message="Loading email templates…" />;
  if (isError) return <ErrorBanner message={error} />;

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <TemplateCard
          key={row.key}
          row={row}
          open={openKey === row.key}
          onToggle={() => setOpenKey((k) => (k === row.key ? null : row.key))}
          onSave={onSave}
        />
      ))}
    </div>
  );
}

function TemplateCard({
  row,
  open,
  onToggle,
  onSave,
}: {
  row: EmailTemplateRow;
  open: boolean;
  onToggle: () => void;
  onSave: (
    key: EmailTemplateKey,
    patch: Pick<EmailTemplateRow, "subject" | "heading" | "body" | "mode">,
  ) => Promise<{ error?: string }>;
}) {
  const meta = TEMPLATE_META[row.key];
  const [subject, setSubject] = useState(row.subject);
  const [heading, setHeading] = useState(row.heading);
  const [body, setBody] = useState(row.body);
  const [mode, setMode] = useState<"visual" | "html">(row.mode);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    const result = await onSave(row.key, { subject, heading, body, mode });
    setSaving(false);
    if (result.error) {
      setSaveError(result.error);
      return;
    }
    setSaved(true);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
            <Mail className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{meta.label}</p>
            <p className="text-xs text-muted-foreground">{meta.hint}</p>
          </div>
        </div>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="border-t border-border p-5">
          {meta.placeholders.length > 0 && (
            <p className="mb-4 text-xs text-muted-foreground">
              Placeholders you can use:{" "}
              {meta.placeholders.map((p, i) => (
                <span key={p}>
                  <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px]">{p}</code>
                  {i < meta.placeholders.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Subject
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-border bg-secondary px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
              />
            </label>
            <label className="block text-sm font-semibold">
              Heading
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-border bg-secondary px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
              />
            </label>
          </div>

          <div className="mt-4">
            <p className="text-sm font-semibold">Body</p>
            <RichTextEditor mode={mode} onModeChange={setMode} value={body} onChange={setBody} minHeightClassName="min-h-28" />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <PillButton type="button" onClick={() => void handleSave()} disabled={saving} className="min-w-32">
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Saving…
                </>
              ) : (
                "Save changes"
              )}
            </PillButton>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                <ShieldCheck className="size-4" aria-hidden="true" /> Saved
              </span>
            )}
            {saveError && (
              <span role="alert" className="text-sm text-destructive">
                {saveError}
              </span>
            )}
            <span className="ml-auto text-xs text-muted-foreground">
              Last updated {formatDateTime(row.updated_at)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
