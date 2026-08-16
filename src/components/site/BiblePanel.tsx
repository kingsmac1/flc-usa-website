import { useState } from "react";
import { BookOpen } from "lucide-react";

const BOOKS = ["Genesis", "Psalms", "Proverbs", "Isaiah", "Matthew", "John", "Romans", "Ephesians"];

/** Mocked scripture reader. Wire to a Bible API in Phase 2. */
export function BiblePanel() {
  const [book, setBook] = useState("John");
  const [chapter, setChapter] = useState("15");
  const [verse, setVerse] = useState("5");

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
          <select id="bible-book" className={selectClass} value={book} onChange={(e) => setBook(e.target.value)}>
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
            onChange={(e) => setChapter(e.target.value)}
          >
            {Array.from({ length: 21 }, (_, i) => String(i + 1)).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-muted-foreground" htmlFor="bible-verse">
            Verse
          </label>
          <select id="bible-verse" className={selectClass} value={verse} onChange={(e) => setVerse(e.target.value)}>
            {Array.from({ length: 27 }, (_, i) => String(i + 1)).map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-secondary p-5">
        <p className="text-xs font-semibold uppercase text-muted-foreground">
          {book} {chapter}:{verse}
        </p>
        <blockquote className="mt-2 text-base leading-relaxed">
          “I am the vine; you are the branches. If you remain in me and I in you, you will bear much
          fruit; apart from me you can do nothing.”
        </blockquote>
        <p className="mt-3 text-xs text-muted-foreground">
          Placeholder passage — live scripture text arrives with the Bible API integration.
        </p>
      </div>
    </aside>
  );
}