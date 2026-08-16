import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/ui";
import { PLACEHOLDER } from "@/data/site";
import { cn } from "@/lib/utils";

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
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/books" }],
  }),
  component: BooksPage,
});

type Book = { id: string; title: string; author: string; price: string; category: string };

const BOOKS: Book[] = [
  { id: "1", title: "Discovering Your Purpose", author: "Pastor Chukwuemeka Nwankwo", price: "$14.99", category: "Purpose" },
  { id: "2", title: "The Praying Household", author: "Pastor Mrs. Nwankwo", price: "$12.50", category: "Family" },
  { id: "3", title: "Foundations of Faith", author: "FLC USA Teaching Team", price: "$9.99", category: "Discipleship" },
  { id: "4", title: "Daily Fountain: 90 Devotions", author: "FLC USA", price: "$18.00", category: "Devotional" },
  { id: "5", title: "Walking in Inheritance", author: "Pastor Chukwuemeka Nwankwo", price: "$16.25", category: "Purpose" },
  { id: "6", title: "Raising Kingdom Children", author: "Pastor Mrs. Nwankwo", price: "$13.75", category: "Family" },
];

const CATEGORIES = ["All", "Purpose", "Family", "Discipleship", "Devotional"] as const;

function BooksPage() {
  const [category, setCategory] = useState<string>("All");
  const [cart, setCart] = useState<string[]>([]);

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
          intro="Titles and prices are placeholders. Checkout is enabled in Phase 2."
        />
      </Section>

      <Section tone="cream">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter books by category">
            {CATEGORIES.map((c) => (
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
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <ShoppingCart className="size-4" aria-hidden="true" />
            Cart: {cart.length} item{cart.length === 1 ? "" : "s"}
          </p>
        </div>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((book) => (
            <li key={book.id} className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
              <img
                src={PLACEHOLDER.book}
                alt={`Cover of ${book.title}`}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">{book.category}</p>
                <h2 className="mt-2 font-display text-lg font-bold">{book.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{book.author}</p>
                <p className="mt-3 font-display text-xl font-black text-primary">{book.price}</p>
                <button
                  type="button"
                  onClick={() => setCart((c) => [...c, book.id])}
                  className="mt-auto inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 pt-3 pb-3 text-sm font-semibold text-accent-foreground hover:brightness-95"
                >
                  Add to cart
                </button>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-muted-foreground">
          The cart is a UI preview only — no payment is processed at this stage.
        </p>
      </Section>
    </>
  );
}