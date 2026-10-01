import { Ban, CalendarClock, Loader2, Send, ShieldCheck } from "lucide-react";
import { PillButton } from "@/components/site/ui";
import { Badge, ConfirmButton, EmptyState } from "./Primitives";
import { RichTextEditor } from "./RichTextEditor";
import { ErrorBanner, LoadingRow, TableShell, Td, Th } from "./Table";
import { formatDate, formatDateTime } from "./shared";
import type { EmailCampaignRow } from "./types";

function audienceLabel(r: EmailCampaignRow): string {
  switch (r.audience) {
    case "present":
      return "Checked in";
    case "absent":
      return "Not checked in";
    case "all":
      return "All members";
    case "individual": {
      const emails = r.recipient_emails ?? [];
      if (emails.length <= 1) return emails[0] ?? "1 recipient";
      return `${emails.length} recipients`;
    }
    case "event_interest":
      return r.event_title ? `Interested: ${r.event_title}` : "Event interest";
    case "newsletter":
      return "Newsletter subscribers";
  }
}

const STATUS_TONE: Record<EmailCampaignRow["status"], "light" | "accent" | "danger"> = {
  draft: "light",
  scheduled: "accent",
  sent: "accent",
  failed: "danger",
  cancelled: "light",
};

type Props = {
  rows: EmailCampaignRow[];
  isLoading: boolean;
  isError: boolean;
  error: string;

  subject: string;
  setSubject: (v: string) => void;
  body: string;
  setBody: (v: string) => void;
  bodyMode: "visual" | "html";
  setBodyMode: (v: "visual" | "html") => void;
  serviceDate: string;
  setServiceDate: (v: string) => void;
  audience: EmailCampaignRow["audience"];
  setAudience: (v: EmailCampaignRow["audience"]) => void;
  recipientEmailsText: string;
  setRecipientEmailsText: (v: string) => void;
  events: { slug: string; title: string; count: number }[];
  eventSlug: string;
  setEventSlug: (v: string) => void;
  sendMode: "now" | "schedule";
  setSendMode: (v: "now" | "schedule") => void;
  scheduledFor: string;
  setScheduledFor: (v: string) => void;

  submitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
  onSubmit: (e: React.FormEvent) => void;

  onCancelScheduled: (id: string) => Promise<void>;
};

export function MessagingSection(props: Props) {
  const {
    rows, isLoading, isError, error,
    subject, setSubject, body, setBody, bodyMode, setBodyMode,
    serviceDate, setServiceDate,
    audience, setAudience,
    recipientEmailsText, setRecipientEmailsText,
    events, eventSlug, setEventSlug,
    sendMode, setSendMode,
    scheduledFor, setScheduledFor,
    submitting, submitError, submitSuccess,
    onSubmit,
    onCancelScheduled,
  } = props;

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-secondary/40 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold sm:col-span-2">
            Subject
            <input
              required
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. We missed you this Sunday!"
              className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
            />
          </label>
          <div className="sm:col-span-2">
            <p className="block text-sm font-semibold">Message</p>
            <RichTextEditor mode={bodyMode} onModeChange={setBodyMode} value={body} onChange={setBody} />
          </div>
          <label className="block text-sm font-semibold">
            Service date
            <input
              required
              type="date"
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
            />
          </label>
          <label className="block text-sm font-semibold">
            Audience
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value as EmailCampaignRow["audience"])}
              className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
            >
              <option value="all">All members</option>
              <option value="present">Checked in</option>
              <option value="absent">Not checked in</option>
              <option value="individual">Specific email(s)</option>
              <option value="event_interest">Event interest</option>
              <option value="newsletter">Newsletter subscribers</option>
            </select>
          </label>
        </div>

        {audience === "individual" && (
          <label className="mt-4 block text-sm font-semibold">
            Recipient email(s)
            <textarea
              required
              rows={3}
              value={recipientEmailsText}
              onChange={(e) => setRecipientEmailsText(e.target.value)}
              placeholder="one@example.com, another@example.com&#10;or one per line"
              className="mt-1 w-full resize-none rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
            />
          </label>
        )}

        {audience === "event_interest" && (
          <label className="mt-4 block text-sm font-semibold">
            Event
            {events.length === 0 ? (
              <p className="mt-1 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground">
                No event interest submissions yet — nothing to message.
              </p>
            ) : (
              <select
                required
                value={eventSlug}
                onChange={(e) => setEventSlug(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
              >
                <option value="">Select an event…</option>
                {events.map((ev) => (
                  <option key={ev.slug} value={ev.slug}>
                    {ev.title} ({ev.count} interested)
                  </option>
                ))}
              </select>
            )}
          </label>
        )}

        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-semibold text-foreground">When</p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="send-mode"
                checked={sendMode === "now"}
                onChange={() => setSendMode("now")}
                className="size-4 accent-accent"
              />
              Send now
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="send-mode"
                checked={sendMode === "schedule"}
                onChange={() => setSendMode("schedule")}
                className="size-4 accent-accent"
              />
              Schedule for later
            </label>
            {sendMode === "schedule" && (
              <input
                required
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="rounded-2xl border border-border bg-secondary px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-accent"
              />
            )}
          </div>
          {sendMode === "schedule" && (
            <p className="mt-3 text-xs text-muted-foreground">
              This will send itself automatically at the time you pick — you don't need to be signed
              in or do anything else when it goes out.
            </p>
          )}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <PillButton type="submit" disabled={submitting} className="min-w-36">
            {submitting ? (
              <><Loader2 className="size-4 animate-spin" aria-hidden="true" /> Sending…</>
            ) : (
              <><Send className="size-4" aria-hidden="true" /> {sendMode === "now" ? "Send message" : "Schedule message"}</>
            )}
          </PillButton>
          {submitSuccess && (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <ShieldCheck className="size-4" aria-hidden="true" />
              {sendMode === "now" ? "Sent" : "Scheduled"}
            </span>
          )}
          {submitError && (
            <span role="alert" className="text-sm text-destructive">{submitError}</span>
          )}
        </div>
      </form>

      {isLoading ? (
        <LoadingRow message="Loading campaigns…" />
      ) : isError ? (
        <ErrorBanner message={error} />
      ) : rows.length === 0 ? (
        <EmptyState message="No email campaigns yet." />
      ) : (
        <TableShell>
          <thead>
            <tr className="border-b border-border">
              <Th>Subject</Th>
              <Th>Audience</Th>
              <Th>Service date</Th>
              <Th>Status</Th>
              <Th>Sent / scheduled</Th>
              <Th>Created by</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.id}>
                <Td>
                  <p className="font-semibold text-foreground">{r.subject}</p>
                  <p className="mt-0.5 max-w-md truncate text-xs text-muted-foreground">
                    {r.body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}
                  </p>
                </Td>
                <Td>
                  <span title={r.audience === "individual" ? (r.recipient_emails ?? []).join(", ") : undefined}>
                    {audienceLabel(r)}
                  </span>
                </Td>
                <Td>{formatDate(r.service_date)}</Td>
                <Td>
                  <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                </Td>
                <Td>
                  {r.status === "scheduled" ? (
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <CalendarClock className="size-3.5 text-accent" aria-hidden="true" />
                      {formatDateTime(r.scheduled_for)}
                    </span>
                  ) : r.sent_at ? (
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <Send className="size-3.5 text-muted-foreground" aria-hidden="true" />
                      {formatDateTime(r.sent_at)}
                    </span>
                  ) : (
                    "—"
                  )}
                </Td>
                <Td>{r.profiles?.full_name ?? "—"}</Td>
                <Td align="right">
                  {r.status === "scheduled" ? (
                    <ConfirmButton
                      label="Cancel"
                      icon={<Ban className="size-3.5" aria-hidden="true" />}
                      confirmLabel="Confirm"
                      variant="destructive"
                      onConfirm={() => onCancelScheduled(r.id)}
                    />
                  ) : (
                    "—"
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      )}
    </div>
  );
}
