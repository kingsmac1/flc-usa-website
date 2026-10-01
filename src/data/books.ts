/**
 * BOOK STORE
 * ----------
 * Real books live in the `cms_books` Supabase table, managed from the
 * in-dashboard CMS. This file fetches them on each request (via a route
 * loader) instead of bundling them at build time.
 */
import { supabase } from "@/lib/supabase";

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

export async function getBooks(): Promise<Book[]> {
  const { data, error } = await supabase.from("cms_books").select("*").order("title");
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.slug,
    title: row.title,
    author: row.author,
    price: row.price,
    category: row.category,
    description: row.description,
    cover: row.cover_url,
    buyUrl: row.buy_url,
  }));
}
