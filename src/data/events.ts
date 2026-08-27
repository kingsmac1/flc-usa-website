/**
 * UPCOMING EVENTS
 * ---------------
 * Real events live as individual Markdown files in content/events/ (one
 * file per event), managed either by hand or through the Sveltia CMS
 * "Events" collection at /admin. This file loads them all at build time.
 *
 * To add an event by hand: copy an existing content/events/*.md file and
 * edit it.
 *   start/end    ISO datetime, e.g. "2026-09-12T18:00:00"
 *   flyer        A direct image URL (or an uploaded path once media
 *                storage is wired up)
 */
import { load as parseYaml } from "js-yaml";

function frontmatter(raw: string): Record<string, unknown> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw.trim());
  if (!match) return {};
  return (parseYaml(match[1] ?? "") as Record<string, unknown>) ?? {};
}

/**
 * Normalizes "details" — a plain multi-line text field in the CMS (one
 * point per line) rather than a list widget; also accepts the older array
 * shape for backward compatibility.
 */
function normalizeDetails(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item ?? "")).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
  }
  return [];
}

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

const eventFiles = import.meta.glob("/content/events/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const EVENTS: ChurchEvent[] = Object.values(eventFiles).map((raw) => {
  const data = frontmatter(raw) as Record<string, unknown>;
  return { ...data, details: normalizeDetails(data.details) } as ChurchEvent;
});

export function getEvent(slug: string) {
  return EVENTS.find((e) => e.slug === slug);
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
 * Determines the next upcoming service/event to count down to.
 *
 * Looks at all future events and picks the closest one — but only up to
 * the next Sunday Celebration Service. If no event falls before the next
 * Sunday, it falls back to the normal Sunday Celebration Service at 10:00 AM.
 */
export function nextUpcomingService(): { target: Date; title: string; type: string } {
  const nextServiceDate = nextSundayAt(10);
  const now = new Date();

  const upcomingEvents = EVENTS
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
