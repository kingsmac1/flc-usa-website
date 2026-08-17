export type Passage = {
  reference: string;
  text: string;
  source: "api" | "placeholder";
};

const PLACEHOLDER_TEXT =
  "\u201CI am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.\u201D \u2014 placeholder text. Add a Bible API key to load the live passage.";

/**
 * Fetches a passage from api.scripture.api.bible when BIBLE_API_KEY is set.
 * Falls back to placeholder text so the UI always renders.
 */
export async function fetchPassage(
  reference: string,
  apiKey: string | undefined,
  bibleId: string,
): Promise<Passage> {
  if (!apiKey) return { reference, text: PLACEHOLDER_TEXT, source: "placeholder" };

  const url = `https://api.scripture.api.bible/v1/bibles/${bibleId}/search?query=${encodeURIComponent(
    reference,
  )}&limit=1`;

  try {
    const res = await fetch(url, { headers: { "api-key": apiKey } });
    if (!res.ok) throw new Error(`Bible API ${res.status}`);
    const json = (await res.json()) as {
      data?: { passages?: { content?: string; reference?: string }[] };
    };
    const passage = json.data?.passages?.[0];
    const text = (passage?.content ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (!text) throw new Error("empty passage");
    return { reference: passage?.reference ?? reference, text, source: "api" };
  } catch {
    return { reference, text: PLACEHOLDER_TEXT, source: "placeholder" };
  }
}
