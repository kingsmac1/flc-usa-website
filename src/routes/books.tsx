import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/ui";
import { BOOKS, BOOK_CATEGORIES } from "@/data/books";
import { cn } from "@/lib/utils";
import { CtaBand } from "@/components/site/CtaBand";

const title = "Book Store | Fountain of Life Church USA";
const description =
  "Browse books, devotionals and study guides from the ministry of Fountain of Life Church USA.";

export const Route = createFileRoute("/books")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/books" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/books" }],
  }),
  component: BooksPage,
});

function BooksPage() {
  const [category, setCategory] = useState<string>("All");

  const visible = useMemo(
    () => (category === "All" ? BOOKS : BOOKS.filter((b) => b.category === category)),
    [category],
  );

  return (
    <>
      <Section tone="deep">
        <SectionHeading
          tone="light"
          eyebrow="Book store"
          title="Resources for the journey"
          intro="Every title opens in our external store, where your order is processed and shipped."
        />
      </Section>

      <Section tone="cream">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter books by category">
          {BOOK_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                "min-h-11 rounded-full border px-5 text-sm font-semibold transition-colors",
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-secondary",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((book) => (
            <li key={book.id} className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
              <img
                src={book.cover}
                alt={`Cover of ${book.title}`}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">{book.category}</p>
                <h2 className="mt-2 font-display text-lg font-bold">{book.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{book.author}</p>
                <p className="mt-2 text-sm text-muted-foreground">{book.description}</p>
                <p className="mt-3 font-display text-xl font-black text-primary">{book.price}</p>
                <a
                  href={book.buyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 pt-3 pb-3 text-sm font-semibold text-accent-foreground hover:brightness-95"
                >
                  Buy now
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand items={["give", "prayer"]} tone="white" />
    </>
  );
}
