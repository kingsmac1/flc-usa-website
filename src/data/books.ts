/**
 * BOOK STORE
 * ----------
 * Real books live as individual Markdown files in content/books/ (one file
 * per book), managed either by hand or through the Sveltia CMS "Book Store"
 * collection at /admin. This file loads them all at build time.
 *
 * To add a book by hand: copy an existing content/books/*.md file and edit
 * it.
 *   cover        A direct image URL (or an uploaded path once media
 *                storage is wired up)
 *   buyUrl       Amazon (or any external store) product link
 */
import { load as parseYaml } from "js-yaml";

function frontmatter(raw: string): Record<string, unknown> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw.trim());
  if (!match) return {};
  return (parseYaml(match[1] ?? "") as Record<string, unknown>) ?? {};
}

export type Book = {
  id: string;
  title: string;
  author: string;
  price: string;
  category: string;
  description: string;
  cover: string;
  buyUrl: string;
};

export const BOOK_CATEGORIES = ["All", "Purpose", "Family", "Discipleship", "Devotional"] as const;

const bookFiles = import.meta.glob("/content/books/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const BOOKS: Book[] = Object.values(bookFiles).map(
  (raw) => frontmatter(raw) as unknown as Book,
);
