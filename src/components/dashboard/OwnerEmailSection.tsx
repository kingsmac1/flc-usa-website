import { Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { PillButton } from "@/components/site/ui";
import { ErrorBanner, LoadingRow } from "./Table";
import type { EmailSettingsRow } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function OwnerEmailSection({
  row,
  isLoading,
  isError,
  error,
  onSave,
}: {
  row: EmailSettingsRow | null;
  isLoading: boolean;
  isError: boolean;
  error: string;
  onSave: (ownerEmails: string[]) => Promise<{ error?: string }>;
}) {
  const [emailsText, setEmailsText] = useState((row?.owner_emails ?? []).join("\n"));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (isLoading) return <LoadingRow message="Loading email settings…" />;
  if (isError) return <ErrorBanner message={error} />;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);

    const emails = [...new Set(emailsText.split(/[,\n]/).map((s) => s.trim()).filter(Boolean))];
    if (emails.length === 0) {
      setSaveError("Add at least one email address.");
      return;
    }
    const invalid = emails.filter((addr) => !EMAIL_PATTERN.test(addr));
    if (invalid.length > 0) {
      setSaveError(`These don't look like valid email addresses: ${invalid.join(", ")}`);
      return;
    }

    setSaveError(null);
    setSaving(true);
    const result = await onSave(emails);
    setSaving(false);
    if (result.error) {
      setSaveError(result.error);
      return;
    }
    setEmailsText(emails.join("\n"));
    setSaved(true);
  };

  return (
    <form onSubmit={(e) => void handleSave(e)} className="max-w-lg rounded-2xl border border-border bg-secondary/40 p-5">
      <label className="block text-sm font-semibold">
        Church inbox(es)
        <textarea
          required
          rows={4}
          value={emailsText}
          onChange={(e) => setEmailsText(e.target.value)}
          placeholder={"info@flcusa.org\npastor@flcusa.org"}
          className="mt-1 w-full resize-none rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
        />
      </label>
      <p className="mt-2 text-xs text-muted-foreground">
        One per line (or comma-separated). Every public form (contact, prayer requests, salvation
        decisions, event interest, membership, newsletter) sends an internal copy of each
        submission to all of these addresses.
      </p>
      <div className="mt-4 flex items-center gap-3">
        <PillButton type="submit" disabled={saving} className="min-w-32">
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
      </div>
    </form>
  );
}
