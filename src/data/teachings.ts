import { PLACEHOLDER } from "./site";

/**
 * TEACHINGS LIBRARY
 * -----------------
 * Every teaching is a YouTube video. To add one:
 *   1. Copy the YouTube link (any format works — watch?v=, youtu.be/, /live/).
 *   2. Add an item to the `items` array of a series below, or create a new series.
 *   3. Optionally set `image` for custom artwork; otherwise the YouTube thumbnail is used.
 */
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

/** Extracts the video id from any YouTube URL format. */
export function youtubeId(url: string): string {
  const m = url.match(/(?:v=|youtu\.be\/|\/live\/|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{6,})/);
  return m?.[1] ?? "";
}

export function youtubeThumb(url: string) {
  const id = youtubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : PLACEHOLDER.worship;
}

export const SERIES: Series[] = [
  {
    slug: "foundations-of-faith",
    title: "Foundations of Faith",
    summary: "Six messages on the bedrock truths every believer must stand on.",
    image: PLACEHOLDER.bible,
    items: [
      {
        title: "The Word as Final Authority",
        speaker: "Apostle Chuks",
        date: "2026-06-07",
        duration: "48 min",
        youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        summary: "Why the Word settles every matter in the life of a believer.",
      },
      {
        title: "Faith That Produces",
        speaker: "Apostle Chuks",
        date: "2026-06-14",
        duration: "52 min",
        youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        title: "Repentance and New Life",
        speaker: "Evang. Josephine Akuma",
        date: "2026-06-21",
        duration: "41 min",
        youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
    ],
  },
  {
    slug: "purpose-and-destiny",
    title: "Purpose & Destiny",
    summary: "Discovering the assignment God wrote over your life before you were born.",
    image: PLACEHOLDER.congregation,
    items: [
      {
        title: "Created for a Reason",
        speaker: "Apostle Chuks",
        date: "2026-05-03",
        duration: "45 min",
        youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        title: "Awakening Your Destiny",
        speaker: "Apostle Chuks",
        date: "2026-05-10",
        duration: "50 min",
        youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
    ],
  },
  {
    slug: "the-praying-church",
    title: "The Praying Church",
    summary: "Building a lifestyle of prayer and intercession, personally and as a family.",
    image: PLACEHOLDER.prayer,
    items: [
      {
        title: "Prayer as a Lifestyle",
        speaker: "Evang. Josephine Akuma",
        date: "2026-04-05",
        duration: "39 min",
        youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        title: "Standing in the Gap",
        speaker: "Evang. Josephine Akuma",
        date: "2026-04-12",
        duration: "44 min",
        youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
    ],
  },
  {
    slug: "family-and-the-home",
    title: "Family & The Home",
    summary: "Kingdom principles for marriages, parenting and building a godly household.",
    image: PLACEHOLDER.youth,
    items: [
      {
        title: "A Home Built on the Rock",
        speaker: "Apostle Chuks",
        date: "2026-03-01",
        duration: "47 min",
        youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
    ],
  },
];

export function getSeries(slug: string) {
  return SERIES.find((s) => s.slug === slug);
}
