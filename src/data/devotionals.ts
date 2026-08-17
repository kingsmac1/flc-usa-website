/**
 * DEVOTIONAL / ARTICLE CONTENT STORE
 * ----------------------------------
 * Paste new devotionals into the `DEVOTIONALS` array below. Nothing else needs
 * to change — the website reads every entry from here.
 *
 * Field guide:
 *   date       "YYYY-MM-DD" — the day the devotional is for (used in the URL: /devotional/2026-08-17)
 *   title      Topic / headline
 *   scripture  Reference, e.g. "John 15:5"
 *   verse      The verse text
 *   body       Array of paragraphs — one string per paragraph
 *   prayer     Closing prayer
 *   declarations  Optional array of confessions/declarations
 *   readingPlan   Optional Bible reading plan line, e.g. "Genesis 1-3; Matthew 1"
 *   author     Optional writer name
 */

export type Devotional = {
  date: string;
  title: string;
  scripture: string;
  verse: string;
  body: string[];
  prayer: string;
  declarations?: string[];
  readingPlan?: string;
  author?: string;
};

export const DEVOTIONALS: Devotional[] = [
  {
    date: "2026-08-17",
    title: "Rooted and Bearing Fruit",
    scripture: "John 15:5",
    verse:
      "I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.",
    body: [
      "Fruitfulness is never the product of striving; it is the product of abiding. The branch does not labour to produce grapes — it simply stays connected to the vine and life flows through it.",
      "Today, resist the pressure to prove yourself. Return to the place of quiet fellowship with the Lord, and let His life produce in you what effort never could.",
      "Ask yourself: what am I holding onto that is pulling me away from the vine? Surrender it, and watch how quickly grace does the work.",
    ],
    prayer:
      "Father, teach me to abide. Keep my heart connected to You so that my life bears lasting fruit for Your glory. In Jesus' name, amen.",
    declarations: [
      "I am joined to Christ, and His life flows through me.",
      "Every assignment on my life will bear lasting fruit.",
    ],
    readingPlan: "Psalm 1; John 15",
    author: "Pastor Chukz",
  },
];

/**
 * MONTHLY PDF ARCHIVE
 * Upload the PDF into `public/devotional-pdfs/` then add one line here.
 */
export type DevotionalPdf = { month: string; label: string; file: string };

export const DEVOTIONAL_PDFS: DevotionalPdf[] = [
  // { month: "2026-08", label: "August 2026", file: "/devotional-pdfs/2026-08.pdf" },
];

/** The devotional for a date, falling back to the most recent one available. */
export function getDevotional(date: string): Devotional {
  const exact = DEVOTIONALS.find((d) => d.date === date);
  if (exact) return exact;
  const sorted = [...DEVOTIONALS].sort((a, b) => (a.date < b.date ? 1 : -1));
  const previous = sorted.find((d) => d.date <= date) ?? sorted[0];
  return { ...previous, date };
}

export function getPdfForDate(date: string): DevotionalPdf | undefined {
  return DEVOTIONAL_PDFS.find((p) => p.month === date.slice(0, 7));
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
