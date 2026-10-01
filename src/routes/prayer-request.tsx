import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HeartHandshake } from "lucide-react";
import { PillButton, Section, SectionHeading } from "@/components/site/ui";
import { SITE } from "@/data/site";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { SuccessModal } from "@/components/site/SuccessModal";
import { notifyFormSubmission } from "@/lib/forms";

const title = "Prayer Request | Fountain of Life Church USA";
const description =
  "Send your prayer request to the intercessory team at Fountain of Life Church USA. We will stand with you in prayer.";

export const Route = createFileRoute("/prayer-request")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/prayer-request" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/prayer-request" }],
  }),
  component: PrayerRequestPage,
});

const fieldClass =
  "mt-2 w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-accent";

export const PRAYER_CATEGORIES = [
  "Salvation",
  "Healing",
  "Family & Marriage",
  "Finances & Provision",
  "Career & Business",
  "Deliverance",
  "Thanksgiving",
  "Other",
];

export function PrayerRequestForm({ compact = false }: { compact?: boolean }) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!isSupabaseConfigured) {
      setError("Sorry, requests can't be submitted right now — please email us directly.");
      return;
    }
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const category = String(data.get("category") ?? PRAYER_CATEGORIES[0]);
    const request = String(data.get("request") ?? "").trim();
    const confidential = data.get("confidential") === "on";
    setSubmitting(true);
    const { error: supabaseError } = await supabase.from("prayer_requests").insert({
      name,
      email,
      phone: phone || null,
      category,
      request,
      confidential,
    });
    setSubmitting(false);
    if (supabaseError) {
      setError("Something went wrong submitting your request. Please try again.");
      return;
    }
    void notifyFormSubmission({
      formName: "prayer request",
      fields: [
        { label: "Name", value: name },
        { label: "Email", value: email },
        { label: "Phone", value: phone },
        { label: "Category", value: category },
        { label: "Request", value: request },
        { label: "Confidential", value: confidential ? "Yes" : "No" },
      ],
      submitterEmail: email,
      templateKey: "prayer_confirmation",
      variables: { name },
    });
    form.reset();
    setSent(true);
    setShowSuccess(true);
  }

  return (
    <form
      className={compact ? "" : "rounded-3xl border border-border bg-card p-7"}
      onSubmit={handleSubmit}
      aria-label="Prayer request form"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Full name
          <input required name="name" type="text" autoComplete="name" className={fieldClass} />
        </label>
        <label className="text-sm font-semibold">
          Email
          <input required name="email" type="email" autoComplete="email" className={fieldClass} />
        </label>
        <label className="text-sm font-semibold">
          Phone (optional)
          <input name="phone" type="tel" autoComplete="tel" className={fieldClass} />
        </label>
        <label className="text-sm font-semibold">
          Prayer category
          <select name="category" className={fieldClass}>
            {PRAYER_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="mt-5 block text-sm font-semibold">
        Your prayer request
        <textarea required name="request" rows={6} className={fieldClass} />
      </label>
      <label className="mt-4 flex items-center gap-3 text-sm">
        <input type="checkbox" name="confidential" className="size-4 rounded border-border" />
        Please keep my request confidential to the pastoral team
      </label>
      <PillButton type="submit" className="mt-6" disabled={submitting}>
        {submitting ? "Sending…" : "Submit prayer request"}
      </PillButton>
      <p aria-live="polite" className="mt-3 text-xs text-muted-foreground">
        {sent
          ? "Thank you — your request has been received and our intercessors will pray with you."
          : `You can also email us directly at ${SITE.email}.`}
      </p>
      {error && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      )}

      <SuccessModal
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title="Prayer request received"
        message="Thank you — our intercessors will pray with you."
      />
    </form>
  );
}

function PrayerRequestPage() {
  return (
    <>
      <Section tone="deep">
        <SectionHeading
          tone="light"
          eyebrow="Prayer"
          title="Let us pray with you"
          intro="Share what you are believing God for. Our intercessory team prays over every request received."
        />
      </Section>

      <Section tone="cream">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <PrayerRequestForm />
          <div className="grid gap-6">
            <div className="rounded-3xl border border-border bg-card p-7">
              <HeartHandshake className="size-6 text-primary" aria-hidden="true" />
              <h2 className="mt-3 font-display text-lg font-bold">You are not alone</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Every request is treated with care and prayed over by our intercessors. If your need
                is urgent, please call {SITE.phone}.
              </p>
            </div>
            <div className="rounded-3xl bg-deep p-7 text-deep-foreground">
              <h2 className="font-display text-lg font-bold">Prayer meetings</h2>
              <ul className="mt-3 space-y-2 text-sm text-deep-foreground/80">
                <li>Tuesday Prayer Line — 6:00 AM (ET)</li>
                <li>Wednesday Midweek Service — 7:00 PM (ET)</li>
                <li>Night of Intercession — last Friday, 10:00 PM (ET)</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
