export type Verse = {
  number: string;
  text: string;
};

export type Passage = {
  reference: string;
  verses: Verse[];
  selectedVerse: string;
  source: "api" | "placeholder";
};

const PLACEHOLDER_VERSES: Verse[] = [
  { number: "5", text: "I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing." },
];

// Maps the full book names used in the dropdown to the 3-letter codes scripture.api.bible expects
const BOOK_CODES: Record<string, string> = {
  Genesis: "GEN", Exodus: "EXO", Leviticus: "LEV", Numbers: "NUM", Deuteronomy: "DEU",
  Joshua: "JOS", Judges: "JDG", Ruth: "RUT",
  "1 Samuel": "1SA", "2 Samuel": "2SA", "1 Kings": "1KI", "2 Kings": "2KI",
  Psalms: "PSA", Proverbs: "PRO", Ecclesiastes: "ECC", Isaiah: "ISA",
  Jeremiah: "JER", Ezekiel: "EZK", Daniel: "DAN",
  Matthew: "MAT", Mark: "MRK", Luke: "LUK", John: "JHN", Acts: "ACT", Romans: "ROM",
  "1 Corinthians": "1CO", "2 Corinthians": "2CO", Galatians: "GAL", Ephesians: "EPH",
  Philippians: "PHP", Colossians: "COL",
  "1 Thessalonians": "1TH", "2 Thessalonians": "2TH",
  "1 Timothy": "1TI", "2 Timothy": "2TI", Titus: "TIT", Hebrews: "HEB", James: "JAS",
  "1 Peter": "1PE", "2 Peter": "2PE", "1 John": "1JN", Revelation: "REV",
};

/**
 * Fetches a full chapter (so surrounding verses come along), from a reference
 * like "John 15:5", and marks which verse number was originally selected.
 */
export async function fetchPassage(
  reference: string, // e.g. "John 15:5"
  apiKey: string | undefined,
  bibleId: string,
): Promise<Passage> {
  const match = reference.match(/^(.+)\s+(\d+):(\d+)$/);
  const bookName = match?.[1] ?? "John";
  const chapterNum = match?.[2] ?? "15";
  const verseNum = match?.[3] ?? "5";

  if (!apiKey) {
    return { reference, verses: PLACEHOLDER_VERSES, selectedVerse: verseNum, source: "placeholder" };
  }

  const code = BOOK_CODES[bookName];
  if (!code) {
    return { reference, verses: PLACEHOLDER_VERSES, selectedVerse: verseNum, source: "placeholder" };
  }

  const chapterId = `${code}.${chapterNum}`;
  const url = `https://api.scripture.api.bible/v1/bibles/${bibleId}/passages/${chapterId}?content-type=html`;

  try {
    const res = await fetch(url, { headers: { "api-key": apiKey } });
    if (!res.ok) throw new Error(`Bible API ${res.status}`);
    const json = (await res.json()) as { data?: { content?: string } };
    const html = json.data?.content ?? "";

    const verses: Verse[] = [];
    const verseRegex = /<span[^>]*data-number="(\d+)"[^>]*>.*?<\/span>([\s\S]*?)(?=<span[^>]*data-number="|$)/g;
    for (const m of html.matchAll(verseRegex)) {
      const text = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      if (text) verses.push({ number: m[1], text });
    }

    if (verses.length === 0) throw new Error("no verses parsed");
    return { reference: `${bookName} ${chapterNum}`, verses, selectedVerse: verseNum, source: "api" };
  } catch {
    return { reference, verses: PLACEHOLDER_VERSES, selectedVerse: verseNum, source: "placeholder" };
  }
}