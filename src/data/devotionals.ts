export type Devotional = {
  date: string;
  title: string;
  scripture: string;
  verse: string;
  body: string[];
  prayer: string;
};

/** Mocked devotional source. Replace with Supabase data in Phase 2. */
export function getDevotional(date: string): Devotional {
  return {
    date,
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
  };
}

export function formatDevotionalDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}