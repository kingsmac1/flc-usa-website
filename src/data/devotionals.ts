/**
 * DEVOTIONAL / ARTICLE CONTENT STORE
 * ----------------------------------
 * Paste real devotionals into the `DEVOTIONALS` array below. Any date you add
 * here replaces the auto-generated placeholder for that same date.
 *
 * Field guide:
 *   date       "YYYY-MM-DD" — the day the devotional is for (URL: /devotional/2026-08-17)
 *   title      Topic / headline
 *   scripture  Reference, e.g. "John 15:5"
 *   verse      The verse text
 *   body       Array of paragraphs — one string per paragraph
 *   prayer     Closing prayer
 *   declarations  Optional array of confessions/declarations
 *   readingPlan   Optional Bible reading plan line
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

/** ==== PASTE REAL DEVOTIONALS HERE ==== */
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
    author: "Apostle Chuks",
  },
];

/* -------------------------------------------------------------------------
 * PLACEHOLDER LIBRARY
 * Auto-generates one devotional per day for the year below so the archive is
 * populated. Delete or shrink this once real content fills the array above.
 * ---------------------------------------------------------------------- */
export const DEVOTIONAL_YEAR = 2026;

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
 * then set `available: true` so the download link activates.
 */
export type DevotionalPdf = { month: string; label: string; file: string; available: boolean };

export const DEVOTIONAL_PDFS: DevotionalPdf[] = Array.from({ length: 12 }, (_, i) => {
  const month = `${DEVOTIONAL_YEAR}-${pad(i + 1)}`;
  return {
    month,
    label: new Date(Date.UTC(DEVOTIONAL_YEAR, i, 1)).toLocaleDateString("en-US", {
      timeZone: "UTC",
      month: "long",
      year: "numeric",
    }),
    file: `/devotional-pdfs/${month}.pdf`,
    available: false,
  };
});

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
