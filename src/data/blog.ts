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

export const BLOG_POSTS: BlogPost[] = Object.values(blogFiles).map(
  (raw) => frontmatter(raw) as unknown as BlogPost,
);

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
