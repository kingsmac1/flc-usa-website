/**
 * BLOG
 * ----
 * Real blog posts live as individual Markdown files in content/blog/ (one
 * file per post), managed either by hand or through the Sveltia CMS "Blog"
 * collection at /admin. This file loads them all at build time.
 *
 * To add a post by hand: copy an existing content/blog/*.md file and edit
 * it. `body` is an array of paragraphs.
 */
import { load as parseYaml } from "js-yaml";

function frontmatter(raw: string): Record<string, unknown> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw.trim());
  if (!match) return {};
  return (parseYaml(match[1] ?? "") as Record<string, unknown>) ?? {};
}

/**
 * Normalizes "body" — a plain multi-line text field in the CMS
 * (paragraphs separated by a blank line) rather than a list widget; also
 * accepts the older array shape for backward compatibility.
 */
function normalizeBody(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item ?? "")).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return [];
}

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

const blogFiles = import.meta.glob("/content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const BLOG_POSTS: BlogPost[] = Object.values(blogFiles).map((raw) => {
  const data = frontmatter(raw) as Record<string, unknown>;
  return { ...data, body: normalizeBody(data.body) } as BlogPost;
});

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
