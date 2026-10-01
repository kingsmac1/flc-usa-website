/**
 * BLOG
 * ----
 * Real blog posts live in the `cms_blog_posts` Supabase table, managed
 * from the in-dashboard CMS. This file fetches them on each request (via
 * a route loader) instead of bundling them at build time.
 */
import { supabase } from "@/lib/supabase";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image: string;
  body: string[];
};

type BlogDbRow = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image_url: string;
  body: string;
};

function mapPost(row: BlogDbRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    date: row.date,
    author: row.author,
    category: row.category,
    image: row.image_url,
    body: row.body
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean),
  };
}

export async function getPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase.from("cms_blog_posts").select("*").order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapPost);
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const { data, error } = await supabase.from("cms_blog_posts").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapPost(data) : undefined;
}

/** Previous / next blog post relative to a date (chronological order). */
export function adjacentPosts(posts: BlogPost[], slug: string): { prev?: BlogPost | undefined; next?: BlogPost | undefined } {
  const sorted = [...posts].sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
  const i = sorted.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  return { prev: sorted[i - 1], next: sorted[i + 1] };
}

/** Related blog posts excluding the current one, sorted by date descending. */
export function getRelatedPosts(posts: BlogPost[], excludeSlug: string, limit = 3): BlogPost[] {
  const others = posts.filter((p) => p.slug !== excludeSlug);
  const sorted = [...others].sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
  return sorted.slice(0, limit);
}
