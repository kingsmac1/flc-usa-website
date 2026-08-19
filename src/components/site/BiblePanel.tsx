import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, Loader2 } from "lucide-react";
import { getPassage } from "@/lib/bible.functions";
import { chapterCount, verseCount } from "@/data/bible-structure";

const BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "Psalms", "Proverbs", "Ecclesiastes", "Isaiah",
  "Jeremiah", "Ezekiel", "Daniel", "Matthew", "Mark", "Luke", "John", "Acts", "Romans",
  "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians",
  "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Hebrews", "James",
  "1 Peter", "2 Peter", "1 John", "Revelation",
];

export function BiblePanel() {
  const [book, setBook] = useState("John");
  const [chapter, setChapter] = useState("15");
  const [verse, setVerse] = useState("5");
  const reference = `${book} ${chapter}:${verse}`;

  const totalChapters = chapterCount(book);
  const totalVerses = verseCount(book, Number(chapter));

  // If the book changes and the current chapter no longer exists in it, clamp to the last valid chapter.
  useEffect(() => {
    if (Number(chapter) > totalChapters) {
      setChapter(String(totalChapters));
    }
  }, [book, totalChapters, chapter]);

  // If the chapter changes and the current verse no longer exists in it, clamp to the last valid verse.
  useEffect(() => {
    if (Number(verse) > totalVerses) {
      setVerse(String(totalVerses));
    }
  }, [chapter, totalVerses, verse]);

  const fetchPassage = useServerFn(getPassage);
  const { data, isFetching } = useQuery({
    queryKey: ["passage", reference],
    queryFn: () => fetchPassage({ data: { reference } }),
    staleTime: 5 * 60 * 1000,
  });

  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [data]);

  const selectClass =
    "min-h-11 w-full rounded-full border border-border bg-card px-4 text-sm focus-visible:outline-2 focus-visible:outline-accent";

  return (
    <aside className="rounded-3xl border border-border bg-card p-6" aria-label="Bible reader">
      <h2 className="inline-flex items-center gap-2 font-display text-lg font-bold">
        <BookOpen className="size-5 text-primary" aria-hidden="true" />
        Follow the scripture
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div>
          <label className="text-xs font-semibold uppercase text-muted-foreground" htmlFor="bible-book">
            Book
          </label>
          <select
            id="bible-book"
            className={selectClass}
            value={book}
            onChange={(e) => {
              setBook(e.target.value);
              setChapter("1");
              setVerse("1");
            }}
          >
            {BOOKS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-muted-foreground" htmlFor="bible-chapter">
            Chapter
          </label>
          <select
            id="bible-chapter"
            className={selectClass}
            value={chapter}
            onChange={(e) => {
              setChapter(e.target.value);
              setVerse("1");
            }}
          >
            {Array.from({ length: totalChapters }, (_, i) => String(i + 1)).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-muted-foreground" htmlFor="bible-verse">
            Verse
          </label>
          <select id="bible-verse" className={selectClass} value={verse} onChange={(e) => setVerse(e.target.value)}>
            {Array.from({ length: totalVerses }, (_, i) => String(i + 1)).map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-secondary p-5">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
          {data?.reference ?? reference}
          {isFetching ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : null}
        </p>

        <div className="mt-2 max-h-[420px] overflow-y-auto pr-1 space-y-2" aria-live="polite">
          {data ? (
            data.verses.map((v) => (
              <p
                key={v.number}
                ref={v.number === data.selectedVerse ? selectedRef : undefined}
                className={
                  v.number === data.selectedVerse
                    ? "rounded-xl bg-primary/10 p-2 text-base leading-relaxed font-medium"
                    : "p-2 text-base leading-relaxed text-muted-foreground"
                }
              >
                <span className="mr-1 text-xs font-semibold align-super">{v.number}</span>
                {v.text}
              </p>
            ))
          ) : (
            <p className="text-base leading-relaxed">Loading passage…</p>
          )}
        </div>
      </div>
    </aside>
  );
}