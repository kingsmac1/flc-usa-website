/**
 * UPCOMING EVENTS
 * ---------------
 * Real events live in the `cms_events` Supabase table, managed from the
 * in-dashboard CMS. This file fetches them on each request (via a route
 * loader) instead of bundling them at build time.
 */
import { supabase } from "@/lib/supabase";

export type ChurchEvent = {
  slug: string;
  title: string;
  type: string;
  start: string;
  end?: string;
  location: string;
  flyer: string;
  summary: string;
  details: string[];
  registration?: boolean;
};

type EventDbRow = {
  slug: string;
  title: string;
  type: string;
  start: string;
  end: string | null;
  location: string;
  flyer_url: string;
  summary: string;
  details: string[] | null;
  registration: boolean;
};

function mapEvent(row: EventDbRow): ChurchEvent {
  return {
    slug: row.slug,
    title: row.title,
    type: row.type,
    start: row.start,
    ...(row.end ? { end: row.end } : {}),
    location: row.location,
    flyer: row.flyer_url,
    summary: row.summary,
    details: row.details ?? [],
    registration: row.registration,
  };
}

export async function getEvents(): Promise<ChurchEvent[]> {
  const { data, error } = await supabase.from("cms_events").select("*").order("start");
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapEvent);
}

export async function getEvent(slug: string): Promise<ChurchEvent | undefined> {
  const { data, error } = await supabase.from("cms_events").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapEvent(data) : undefined;
}

/**
 * The instant an event is considered "over" for upcoming/past purposes —
 * its `end` time if it has one (e.g. a multi-day event stays "upcoming"
 * until its last day, not just its first), falling back to `start` for
 * single-instant events.
 */
export function eventEndsAt(event: Pick<ChurchEvent, "start" | "end">): Date {
  return new Date(event.end ?? event.start);
}

export function formatEventDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Next Sunday at the given hour (falls back to following Sunday if today is Sunday). */
function nextSundayAt(hour: number) {
  const d = new Date();
  d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7));
  d.setHours(hour, 0, 0, 0);
  return d;
}

/**
 * Determines the next upcoming service/event to count down to, given the
 * full list of events (fetched by the caller's route loader).
 *
 * Looks at all future events and picks the closest one — but only up to
 * the next Sunday Celebration Service. If no event falls before the next
 * Sunday, it falls back to the normal Sunday Celebration Service at 10:00 AM.
 */
export function nextUpcomingService(events: ChurchEvent[]): { target: Date; title: string; type: string } {
  const nextServiceDate = nextSundayAt(10);
  const now = new Date();

  const upcomingEvents = events
    .filter((e) => new Date(e.start) > now)
    .sort((a, b) => new Date(a.start).valueOf() - new Date(b.start).valueOf());

  const closestEvent = upcomingEvents.find((e) => new Date(e.start) <= nextServiceDate);

  if (closestEvent) {
    return {
      target: new Date(closestEvent.start),
      title: closestEvent.title,
      type: closestEvent.type,
    };
  }

  return {
    target: nextServiceDate,
    title: "Sunday Celebration Service",
    type: "Weekly Service",
  };
}
