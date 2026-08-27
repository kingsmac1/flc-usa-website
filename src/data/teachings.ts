/**
 * TEACHINGS LIBRARY
 * -----------------
 * Real teaching series live as individual Markdown files in
 * content/teachings/ (one file per series, each containing a list of
 * video items), managed either by hand or through the Sveltia CMS
 * "Teachings" collection at /admin. This file loads them all at build time.
 *
 * To add a series by hand: copy an existing content/teachings/*.md file
 * and edit it. Every teaching is a YouTube video — paste any YouTube link
 * format (watch?v=, youtu.be/, /live/) into the youtube field.
 */
import { PLACEHOLDER } from "./site";
import { load as parseYaml } from "js-yaml";

function frontmatter(raw: string): Record<string, unknown> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw.trim());
  if (!match) return {};
  return (parseYaml(match[1] ?? "") as Record<string, unknown>) ?? {};
}

export type Teaching = {
  title: string;
  speaker: string;
  date: string;
  duration: string;
  /** Full YouTube link of the already-uploaded video. */
  youtube: string;
  /** Optional featured image. Falls back to the YouTube thumbnail. */
  image?: string;
  summary?: string;
};

export type Series = {
  slug: string;
  title: string;
  summary: string;
  image: string;
  items: Teaching[];
};

const DEFAULT_THUMB = PLACEHOLDER.worship;

/** Extracts the video id from any YouTube URL format. */
export function youtubeId(url: string): string {
  const m = url.match(/(?:v=|youtu\.be\/|\/live\/|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{6,})/);
  return m?.[1] ?? "";
}

export function youtubeThumb(url: string) {
  const id = youtubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : DEFAULT_THUMB;
}

const teachingFiles = import.meta.glob("/content/teachings/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const SERIES: Series[] = Object.values(teachingFiles).map(
  (raw) => frontmatter(raw) as unknown as Series,
);

export function getSeries(slug: string) {
  return SERIES.find((s) => s.slug === slug);
}

/** Previous / next teaching series relative to a series (sorted by first item date). */
export function adjacentSeries(slug: string): { prev?: Series | undefined; next?: Series | undefined } {
  const sorted = [...SERIES].sort(
    (a, b) => new Date(b.items[0]?.date ?? "").valueOf() - new Date(a.items[0]?.date ?? "").valueOf(),
  );
  const i = sorted.findIndex((s) => s.slug === slug);
  if (i === -1) return {};
  return { prev: sorted[i - 1], next: sorted[i + 1] };
}

/** Related teaching series excluding the current one, sorted by first item date descending. */
export function getRelatedSeries(excludeSlug: string, limit = 3): Series[] {
  const others = SERIES.filter((s) => s.slug !== excludeSlug);
  const sorted = [...others].sort(
    (a, b) => new Date(b.items[0]?.date ?? "").valueOf() - new Date(a.items[0]?.date ?? "").valueOf(),
  );
  return sorted.slice(0, limit);
}
