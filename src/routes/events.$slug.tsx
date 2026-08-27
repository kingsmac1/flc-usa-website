import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { PillButton, PillLink, Section } from "@/components/site/ui";
import { formatEventDate, getEvent } from "@/data/events";
import { Reveal } from "@/components/site/motion";
import { CtaBand } from "@/components/site/CtaBand";

export const Route = createFileRoute("/events/$slug")({
  loader: ({ params }) => {
    const event = getEvent(params.slug);
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

  return (
    <>
      <Section tone="deep">
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          {event.type}
        </span>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold sm:text-5xl">{event.title}</h1>
        <p className="mt-4 max-w-2xl text-sm text-deep-foreground/75">{event.summary}</p>
      </Section>

      <Section tone="cream">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
          <div>
            <img
              src={event.flyer}
              alt={`${event.title} flyer`}
              className="aspect-[16/10] w-full rounded-3xl object-cover"
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
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
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
            <PillButton type="submit" variant="accent" className="mt-6 w-full">
              Register my interest
            </PillButton>
            <p aria-live="polite" className="mt-3 text-xs text-muted-foreground">
              {sent
                ? "Thank you! We've noted your interest and will send you a reminder closer to the date."
                : "We'll only use your details to contact you about this event."}
            </p>
          </form>
          </Reveal>
        </div>
      </Section>

      <CtaBand items={["salvation", "prayer"]} tone="white" />
    </>
  );
}
