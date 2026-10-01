import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { PillButton, PillLink, Section } from "@/components/site/ui";
import { formatEventDate, getEvent } from "@/data/events";
import { Reveal, HeroReveal } from "@/components/site/motion";
import { CtaBand } from "@/components/site/CtaBand";
import { ShareButtons } from "@/components/site/ShareButtons";
import { SITE } from "@/data/site";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { SuccessModal } from "@/components/site/SuccessModal";
import { notifyFormSubmission } from "@/lib/forms";

export const Route = createFileRoute("/events/$slug")({
  loader: async ({ params }) => {
    const event = await getEvent(params.slug);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Event not found | Fountain of Life Church USA" }, { name: "robots", content: "noindex" }] };
    }
    const { event } = loaderData;
    const title = `${event.title} | Fountain of Life Church USA`;
    return {
      meta: [
        { title },
        { name: "description", content: event.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: event.summary },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/events/${event.slug}` },
        { property: "og:image", content: event.flyer },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: event.summary },
        { name: "twitter:image", content: event.flyer },
      ],
      links: [{ rel: "canonical", href: `/events/${event.slug}` }],
    };
  },
  notFoundComponent: EventNotFound,
  component: EventDetail,
});

const fieldClass =
  "mt-2 w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-accent";

function EventNotFound() {
  return (
    <Section tone="cream">
      <h1 className="text-3xl font-bold">Event not found</h1>
      <p className="mt-3 text-muted-foreground">That event isn't on the calendar.</p>
      <PillLink to="/events" className="mt-6">
        See all events
      </PillLink>
    </Section>
  );
}

function EventDetail() {
  const { event } = Route.useLoaderData();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!isSupabaseConfigured) {
      setError("Sorry, registrations can't be submitted right now — please email us directly.");
      return;
    }
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const guests = Number(data.get("guests")) || 1;
    const mode = String(data.get("mode") ?? "In person");
    const notes = String(data.get("notes") ?? "").trim();
    setSubmitting(true);
    const { error: supabaseError } = await supabase.from("event_interest").insert({
      event_slug: event.slug,
      event_title: event.title,
      name,
      email,
      phone: phone || null,
      guests,
      mode,
      notes: notes || null,
    });
    setSubmitting(false);
    if (supabaseError) {
      setError("Something went wrong registering your interest. Please try again.");
      return;
    }
    void notifyFormSubmission({
      formName: `event interest — ${event.title}`,
      fields: [
        { label: "Event", value: event.title },
        { label: "Name", value: name },
        { label: "Email", value: email },
        { label: "Phone", value: phone },
        { label: "Guests", value: String(guests) },
        { label: "Attending", value: mode },
        { label: "Notes", value: notes },
      ],
      submitterEmail: email,
      templateKey: "event_interest_confirmation",
      variables: { name, event: event.title },
    });
    form.reset();
    setSent(true);
    setShowSuccess(true);
  }

  return (
    <>
      <Section tone="deep">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <HeroReveal
              eyebrow={
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  {event.type}
                </span>
              }
              heading={<h1 className="mt-4 max-w-3xl text-3xl font-bold sm:text-5xl">{event.title}</h1>}
              body={<p className="mt-4 max-w-2xl text-sm text-deep-foreground/75">{event.summary}</p>}
            />
          </div>
          <ShareButtons url={`${SITE.domain}/events/${event.slug}`} title={event.title} description={event.summary} />
        </div>
      </Section>

      <Section tone="cream">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
          <div>
            <img
              src={event.flyer}
              alt={`${event.title} flyer`}
              className="mx-auto max-h-[640px] w-auto max-w-full rounded-3xl object-contain"
            />
            <div className="mt-6 grid gap-3 rounded-3xl border border-border bg-card p-6 text-sm">
              <p className="inline-flex items-center gap-2">
                <CalendarDays className="size-4 text-primary" aria-hidden="true" />
                <span>
                  {formatEventDate(event.start)}
                  {event.end ? ` — ${formatEventDate(event.end)}` : ""}
                </span>
              </p>
              <p className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                {event.location}
              </p>
            </div>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground/90">
              {event.details.map((d) => (
                <p key={d.slice(0, 24)}>{d}</p>
              ))}
            </div>
          </div>
          </Reveal>

          <Reveal delay={0.1}>
          <form
            className="h-fit rounded-3xl border border-border bg-card p-7"
            onSubmit={handleSubmit}
            aria-label={`Interest form for ${event.title}`}
          >
            <h2 className="font-display text-xl font-bold">I'm interested</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Let us know you are coming so we can prepare for you.
            </p>
            <label className="mt-5 block text-sm font-semibold">
              Full name
              <input required name="name" type="text" autoComplete="name" className={fieldClass} />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              Email
              <input required name="email" type="email" autoComplete="email" className={fieldClass} />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              Phone (optional)
              <input name="phone" type="tel" autoComplete="tel" className={fieldClass} />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              Number attending
              <input name="guests" type="number" min="1" defaultValue={1} className={fieldClass} />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              How will you attend?
              <select name="mode" className={fieldClass}>
                <option>In person</option>
                <option>Online</option>
              </select>
            </label>
            <label className="mt-4 block text-sm font-semibold">
              Anything we should know? (optional)
              <textarea name="notes" rows={4} className={fieldClass} />
            </label>
            <PillButton type="submit" variant="accent" className="mt-6 w-full" disabled={submitting}>
              {submitting ? "Sending…" : "Register my interest"}
            </PillButton>
            <p aria-live="polite" className="mt-3 text-xs text-muted-foreground">
              {sent
                ? "Thank you! We've noted your interest and will send you a reminder closer to the date."
                : "We'll only use your details to contact you about this event."}
            </p>
            {error && (
              <p role="alert" className="mt-2 text-xs text-destructive">
                {error}
              </p>
            )}
          </form>
          </Reveal>
        </div>
      </Section>

      <CtaBand items={["salvation", "prayer"]} tone="white" />

      <SuccessModal
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title="You're registered!"
        message="We've noted your interest and will send you a reminder closer to the date."
      />
    </>
  );
}
