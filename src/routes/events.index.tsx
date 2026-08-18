import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, MapPin } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/ui";
import { EVENTS, formatEventDate } from "@/data/events";

const title = "Upcoming Events | Fountain of Life Church USA";
const description =
  "Conferences, prayer nights and gatherings coming up at Fountain of Life Church USA in Indianapolis.";

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/events" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/events" }],
  }),
  component: EventsIndex,
});

function EventsIndex() {
  const sorted = [...EVENTS].sort((a, b) => (a.start < b.start ? -1 : 1));

  return (
    <>
      <Section tone="deep">
        <SectionHeading
          tone="light"
          eyebrow="Events"
          title="What's coming up"
          intro="Join us in person or online. Click any event for full details and to indicate your interest."
        />
      </Section>

      <Section tone="cream">
        <ul className="grid gap-6 md:grid-cols-2">
          {sorted.map((event) => (
            <li key={event.slug} className="overflow-hidden rounded-3xl border border-border bg-card">
              <Link to="/events/$slug" params={{ slug: event.slug }} className="block">
                <img
                  src={event.flyer}
                  alt={`${event.title} flyer`}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="p-6">
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    {event.type}
                  </span>
                  <h2 className="mt-3 font-display text-xl font-bold">{event.title}</h2>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="size-4 text-primary" aria-hidden="true" />
                    {formatEventDate(event.start)}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4 text-primary" aria-hidden="true" />
                    {event.location}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">{event.summary}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-primary underline underline-offset-4">
                    View event
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
