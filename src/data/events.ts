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
