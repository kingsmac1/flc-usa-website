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

/**
 * Reads a markdown file with YAML frontmatter, returning both the
 * frontmatter data and the markdown content below it. A field literally
 * named "body" gets written as the file's actual Markdown content by the
 * CMS instead of into frontmatter — see the matching note in devotionals.ts.
 */
function parseFile(raw: string): { data: Record<string, unknown>; content: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw.trim());
  if (!match) return { data: {}, content: raw.trim() };
  const data = (parseYaml(match[1] ?? "") as Record<string, unknown>) ?? {};
  return { data, content: (match[2] ?? "").trim() };
}

/**
 * Normalizes "body" into a flat array of paragraphs — checks frontmatter
 * first (older array-shaped entries), then falls back to the file's actual
 * Markdown content (newer entries from the CMS's plain-text Body field).
 */
function normalizeBody(frontmatterValue: unknown, markdownContent: string): string[] {
  if (Array.isArray(frontmatterValue)) {
    const fromArray = frontmatterValue.map((item) => String(item ?? "")).filter(Boolean);
    if (fromArray.length) return fromArray;
  }
  if (typeof frontmatterValue === "string" && frontmatterValue.trim()) {
    return frontmatterValue.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean);
  }
  if (markdownContent.trim()) {
    return markdownContent.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean);
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
  const { data, content } = parseFile(raw);
  return { ...data, body: normalizeBody(data.body, content) } as BlogPost;
});

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}