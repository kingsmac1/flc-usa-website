/**
 * DEVOTIONAL / ARTICLE CONTENT STORE
 * ----------------------------------
 * Real devotionals live as individual Markdown files in
 * content/devotionals/YYYY/MM/YYYY-MM-DD.md (one file per day, organized
 * into year/month subfolders), managed either by hand or through the
 * Sveltia CMS "Daily Devotionals" collection at /admin. This file loads
 * them all at build time — it no longer holds the data itself.
 *
 * Any date with a real .md file overrides the auto-generated placeholder
 * for that same date.
 *
 * Field guide (matches each .md file's YAML frontmatter):
 *   date       "YYYY-MM-DD" — the day the devotional is for (URL: /devotional/2026-08-17)
 *   title      Topic / headline
 *   scripture  Reference, e.g. "John 15:5"
 *   verse      The verse text
 *   body       Array of paragraphs — one string per paragraph
 *   prayer     Closing prayer
 *   declarations  Optional array of confessions/declarations
 *   furtherStudies Optional related scripture references for deeper study
 *   readingPlan   Optional Bible reading plan line
 *   author     Optional writer name
 */

import { load as parseYaml } from "js-yaml";

/**
 * Reads a markdown file with YAML frontmatter, returning both the
 * frontmatter data and the markdown content below it.
 *
 * Important: CMSs built on this pattern treat a field literally named
 * "body" specially — instead of writing it into the frontmatter block,
 * they write it as the file's actual Markdown body (the text below the
 * closing `---`). That's intentional CMS behavior, not a bug, but it means
 * this loader has to check both places for the body content.
 */
function parseFile(raw: string): { data: Record<string, unknown>; content: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw.trim());
  if (!match) return { data: {}, content: raw.trim() };
  const data = (parseYaml(match[1] ?? "") as Record<string, unknown>) ?? {};
  return { data, content: (match[2] ?? "").trim() };
}

/** Reads only the YAML frontmatter block (kept for anything that doesn't need the body/content). */
function frontmatter(raw: string): Record<string, unknown> {
  return parseFile(raw).data;
}

/**
 * Normalizes a "date" value that came back from YAML parsing.
 * Unquoted dates in frontmatter (e.g. `date: 2026-08-21`, written by some
 * CMS saves) get auto-parsed by YAML into a native JS Date object instead
 * of staying a plain string — which silently breaks every place in this
 * file that compares dates as strings. This converts either shape back to
 * a plain "YYYY-MM-DD" string.
 */
function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value ?? "");
}

/**
 * Normalizes a "body" value into a flat array of paragraphs.
 * Checks the frontmatter's `body` property first (older entries, or an
 * array); if that's empty, falls back to the file's actual Markdown
 * content (newer entries saved via the CMS's plain-text Body field, which
 * writes there instead of into frontmatter — see parseFile() above).
 */
function normalizeBody(frontmatterValue: unknown, markdownContent: string): string[] {
  if (Array.isArray(frontmatterValue)) {
    const fromArray = frontmatterValue
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "paragraph" in item) {
          return String((item as { paragraph: unknown }).paragraph ?? "");
        }
        return "";
      })
      .filter(Boolean);
    if (fromArray.length) return fromArray;
  }
  if (typeof frontmatterValue === "string" && frontmatterValue.trim()) {
    return frontmatterValue
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  if (markdownContent.trim()) {
    return markdownContent
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * Normalizes a "declarations" value the same way as body, but splitting on
 * single newlines (one declaration per line) instead of blank-line
 * paragraphs, since declarations are short one-liners.
 */
function normalizeDeclarations(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    return value.map((item) => String(item ?? "")).filter(Boolean);
  }
  if (typeof value === "string") {
    const lines = value
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    return lines.length ? lines : undefined;
  }
  return undefined;
}

export type Devotional = {
  date: string;
  title: string;
  scripture: string;
  verse: string;
  body: string[];
  prayer: string;
  declarations?: string[];
  furtherStudies?: string;
  readingPlan?: string;
  author?: string;
};

/**
 * Loads every devotional from content/devotionals/**\/*.md at build time
 * (the ** matches the year/month subfolders). Each file's YAML frontmatter
 * is parsed into a Devotional object — add, edit, or remove entries by
 * adding/editing/removing .md files in that folder (this is exactly what
 * Sveltia CMS's "Daily Devotionals" collection manages for you).
 */
const devotionalFiles = import.meta.glob("/content/devotionals/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const DEVOTIONALS: Devotional[] = Object.values(devotionalFiles).map((raw) => {
  const { data, content } = parseFile(raw);
  return {
    ...data,
    date: normalizeDate(data.date),
    body: normalizeBody(data.body, content),
    declarations: normalizeDeclarations(data.declarations),
  } as Devotional;
});

/* -------------------------------------------------------------------------
 * PLACEHOLDER LIBRARY
 * Auto-generates one devotional per day for the year below so the archive is
 * populated. Delete or shrink this once real content fills the array above.
 * ---------------------------------------------------------------------- */
export const DEVOTIONAL_YEAR = 2026;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TEMPLATES = [
  {
    title: "The Word Settles It",
    scripture: "Psalm 119:89",
    verse: "For ever, O LORD, thy word is settled in heaven.",
    theme: "Let the Word, not your circumstances, define what is true about your day.",
  },
  {
    title: "Grace for Today",
    scripture: "2 Corinthians 12:9",
    verse: "My grace is sufficient for thee: for my strength is made perfect in weakness.",
    theme: "God's supply always matches the demand of the day He has given you.",
  },
  {
    title: "Walking in Purpose",
    scripture: "Ephesians 2:10",
    verse: "For we are his workmanship, created in Christ Jesus unto good works.",
    theme: "You were prepared for the works God prepared for you — nothing about you is accidental.",
  },
  {
    title: "The Discipline of Prayer",
    scripture: "1 Thessalonians 5:17",
    verse: "Pray without ceasing.",
    theme: "Prayer is not an interruption of your day; it is the thread that holds it together.",
  },
  {
    title: "Rest for the Weary",
    scripture: "Matthew 11:28",
    verse: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
    theme: "Rest is not the reward for finishing; it is the place from which you work.",
  },
  {
    title: "Guarding Your Heart",
    scripture: "Proverbs 4:23",
    verse: "Keep thy heart with all diligence; for out of it are the issues of life.",
    theme: "What you allow into your heart eventually shapes the direction of your life.",
  },
  {
    title: "Your Inheritance in Christ",
    scripture: "Colossians 1:12",
    verse: "Giving thanks unto the Father, which hath made us meet to be partakers of the inheritance.",
    theme: "You do not beg for what has already been handed to you — you take hold of it.",
  },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function generated(): Devotional[] {
  const out: Devotional[] = [];
  for (let m = 1; m <= 12; m += 1) {
    const days = new Date(Date.UTC(DEVOTIONAL_YEAR, m, 0)).getUTCDate();
    for (let d = 1; d <= days; d += 1) {
      const t = TEMPLATES[(m + d) % TEMPLATES.length]!;
      out.push({
        date: `${DEVOTIONAL_YEAR}-${pad(m)}-${pad(d)}`,
        title: t.title,
        scripture: t.scripture,
        verse: t.verse,
        body: [
          t.theme,
          "Take a few quiet minutes this morning to read the passage slowly. Ask the Holy Spirit to show you one sentence to carry through the day.",
          "Then act on it. Truth that is not obeyed quickly becomes truth that is forgotten.",
        ],
        prayer:
          "Father, thank You for Your Word today. Help me to believe it, obey it and walk in it. In Jesus' name, amen.",
        declarations: [
          "I am led by the Spirit of God today.",
          "The Word of God is working mightily in me.",
        ],
        readingPlan: `Psalm ${((m + d) % 150) + 1}`,
        author: "FLC USA",
      });
    }
  }
  return out;
}

/** Every devotional available on the site — real entries override placeholders. */
export const ALL_DEVOTIONALS: Devotional[] = (() => {
  const map = new Map<string, Devotional>();
  for (const d of generated()) map.set(d.date, d);
  for (const d of DEVOTIONALS) map.set(d.date, d);
  return [...map.values()].sort((a, b) => (a.date < b.date ? 1 : -1));
})();

/**
 * MONTHLY PDF ARCHIVE
 * Upload the PDF into `public/devotional-pdfs/` using the filename below,
 * then add its month to AVAILABLE_PDF_MONTHS so the download link activates.
 *
 * Filename format: Awake-Devotional-<Month>-<Year>.pdf
 *   e.g. Awake-Devotional-June-2026.pdf, Awake-Devotional-July-2026.pdf
 */
export type DevotionalPdf = { month: string; label: string; file: string; available: boolean };

/** Months that currently have a real PDF uploaded to public/devotional-pdfs/. */
const AVAILABLE_PDF_MONTHS = new Set<string>(["2026-06", "2026-08"]);

/** Years offered in the PDF archive year dropdown. */
export const ARCHIVE_YEARS = [2024, 2025, 2026, 2027] as const;

function pdfsFor(year: number): DevotionalPdf[] {
  return Array.from({ length: 12 }, (_, i) => {
    const month = `${year}-${pad(i + 1)}`;
    const monthName = MONTH_NAMES[i];
    return {
      month,
      label: new Date(Date.UTC(year, i, 1)).toLocaleDateString("en-US", {
        timeZone: "UTC",
        month: "long",
        year: "numeric",
      }),
      file: `/devotional-pdfs/Awake-Devotional-${monthName}-${year}.pdf`,
      available: AVAILABLE_PDF_MONTHS.has(month),
    };
  });
}

export function pdfsForYear(year: number): DevotionalPdf[] {
  return pdfsFor(year);
}

export const DEVOTIONAL_PDFS: DevotionalPdf[] = ARCHIVE_YEARS.flatMap((y) => pdfsFor(y));

/** Previous / next devotional relative to a date (chronological order). */
export function adjacentDevotionals(date: string): { prev?: Devotional | undefined; next?: Devotional | undefined } {
  const sorted = [...ALL_DEVOTIONALS].sort((a, b) => (a.date < b.date ? -1 : 1));
  const i = sorted.findIndex((d) => d.date === date);
  if (i === -1) return {};
  return { prev: sorted[i - 1], next: sorted[i + 1] };
}

/** The devotional for a date, falling back to the most recent one available. */
export function getDevotional(date: string): Devotional {
  const exact = ALL_DEVOTIONALS.find((d) => d.date === date);
  if (exact) return exact;
  const previous = (ALL_DEVOTIONALS.find((d) => d.date <= date) ?? ALL_DEVOTIONALS[0]) as Devotional;
  return { ...previous, date };
}

export function getPdfForDate(date: string): DevotionalPdf | undefined {
  return DEVOTIONAL_PDFS.find((p) => p.month === date.slice(0, 7));
}

/** All devotionals in a given "YYYY-MM", oldest first. */
export function devotionalsForMonth(month: string): Devotional[] {
  return ALL_DEVOTIONALS.filter((d) => d.date.startsWith(month)).sort((a, b) =>
    a.date < b.date ? -1 : 1,
  );
}

export function monthLabel(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y ?? 2026, (m ?? 1) - 1, 1)).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  });
}

export function formatDevotionalDate(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}