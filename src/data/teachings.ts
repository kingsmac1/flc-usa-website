/**
 * TEACHINGS LIBRARY
 * -----------------
 * Real teaching series live in the `cms_teachings` (+ `cms_teaching_items`)
 * Supabase tables, managed from the in-dashboard CMS. This file fetches
 * them on each request (via a route loader) instead of bundling them at
 * build time.
 *
 * Every teaching is a YouTube video — paste any YouTube link format
 * (watch?v=, youtu.be/, /live/) into the youtube field.
 */
import { supabase } from "@/lib/supabase";
import { PLACEHOLDER } from "./site";

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

type TeachingItemRow = {
  title: string;
  speaker: string;
  date: string;
  duration: string;
  youtube: string;
  image_url: string | null;
  summary: string | null;
};

function mapSeries(row: {
  slug: string;
  title: string;
  summary: string;
  image_url: string;
  cms_teaching_items: TeachingItemRow[];
}): Series {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    image: row.image_url,
    items: (row.cms_teaching_items ?? []).map((item) => ({
      title: item.title,
      speaker: item.speaker,
      date: item.date,
      duration: item.duration,
      youtube: item.youtube,
      ...(item.image_url ? { image: item.image_url } : {}),
      ...(item.summary ? { summary: item.summary } : {}),
    })),
  };
}

const SERIES_SELECT =
  "slug, title, summary, image_url, cms_teaching_items(title, speaker, date, duration, youtube, image_url, summary, sort_order)";

export async function getSeriesList(): Promise<Series[]> {
  const { data, error } = await supabase
    .from("cms_teachings")
    .select(SERIES_SELECT)
    .order("sort_order", { referencedTable: "cms_teaching_items" });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as Parameters<typeof mapSeries>[0][]).map(mapSeries);
}

export async function getSeries(slug: string): Promise<Series | undefined> {
  const { data, error } = await supabase
    .from("cms_teachings")
    .select(SERIES_SELECT)
    .eq("slug", slug)
    .order("sort_order", { referencedTable: "cms_teaching_items" })
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapSeries(data as unknown as Parameters<typeof mapSeries>[0]) : undefined;
}

/** Previous / next teaching series relative to a series (sorted by first item date). */
export function adjacentSeries(
  allSeries: Series[],
  slug: string,
): { prev?: Series | undefined; next?: Series | undefined } {
  const sorted = [...allSeries].sort(
    (a, b) => new Date(b.items[0]?.date ?? "").valueOf() - new Date(a.items[0]?.date ?? "").valueOf(),
  );
  const i = sorted.findIndex((s) => s.slug === slug);
  if (i === -1) return {};
  return { prev: sorted[i - 1], next: sorted[i + 1] };
}

/** Related teaching series excluding the current one, sorted by first item date descending. */
export function getRelatedSeries(allSeries: Series[], excludeSlug: string, limit = 3): Series[] {
  const others = allSeries.filter((s) => s.slug !== excludeSlug);
  const sorted = [...others].sort(
    (a, b) => new Date(b.items[0]?.date ?? "").valueOf() - new Date(a.items[0]?.date ?? "").valueOf(),
  );
  return sorted.slice(0, limit);
}
