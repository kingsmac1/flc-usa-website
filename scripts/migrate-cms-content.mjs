// One-off migration: reads the existing content/*.md files (previously
// edited via Sveltia CMS) and inserts them into the new cms_* Supabase
// tables that back the in-dashboard CMS sections. Existing image URLs are
// copied as-is — no re-upload needed for this migration.
//
// Requires SUPABASE_SERVICE_ROLE_KEY and VITE_SUPABASE_URL in .env (service
// role bypasses RLS — this script is meant to be run locally only, never
// shipped or run from client code).
//
// Usage: node scripts/migrate-cms-content.mjs

import { createClient } from "@supabase/supabase-js";
import { load as parseYaml } from "js-yaml";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "..", ".env");
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ||= m[2];
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const CONTENT_DIR = path.resolve(__dirname, "..", "content");

function readContentFiles(subdir) {
  const dir = path.join(CONTENT_DIR, subdir);
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readFileSync(path.join(dir, f), "utf8"));
}

/** Splits a file into its YAML frontmatter and the Markdown body below it. */
function parseFile(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw.trim());
  if (!match) return { data: {}, content: raw.trim() };
  const data = parseYaml(match[1] ?? "") ?? {};
  return { data, content: (match[2] ?? "").trim() };
}

function normalizeDetails(value) {
  if (Array.isArray(value)) return value.map((v) => String(v ?? "")).filter(Boolean);
  if (typeof value === "string") {
    return value.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  }
  return [];
}

async function migrateBooks() {
  const rows = readContentFiles("books").map((raw) => {
    const { data } = parseFile(raw);
    return {
      slug: data.id,
      title: data.title,
      author: data.author,
      price: data.price,
      category: data.category,
      description: data.description,
      cover_url: data.cover,
      buy_url: data.buyUrl,
    };
  });
  const { error } = await db.from("cms_books").upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`books: ${error.message}`);
  console.log(`Migrated ${rows.length} books.`);
}

async function migrateEvents() {
  const rows = readContentFiles("events").map((raw) => {
    const { data } = parseFile(raw);
    return {
      slug: data.slug,
      title: data.title,
      type: data.type,
      start: data.start,
      end: data.end || null,
      location: data.location,
      flyer_url: data.flyer,
      summary: data.summary,
      details: normalizeDetails(data.details),
      registration: data.registration ?? true,
    };
  });
  const { error } = await db.from("cms_events").upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`events: ${error.message}`);
  console.log(`Migrated ${rows.length} events.`);
}

async function migrateTeachings() {
  const files = readContentFiles("teachings");
  let itemCount = 0;
  for (const raw of files) {
    const { data } = parseFile(raw);
    const { data: series, error: seriesError } = await db
      .from("cms_teachings")
      .upsert(
        { slug: data.slug, title: data.title, summary: data.summary, image_url: data.image },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (seriesError) throw new Error(`teachings (${data.slug}): ${seriesError.message}`);

    // Clear out any previously-migrated items for this series so re-running
    // the script doesn't duplicate them, then re-insert in order.
    const { error: deleteError } = await db.from("cms_teaching_items").delete().eq("series_id", series.id);
    if (deleteError) throw new Error(`teaching_items delete (${data.slug}): ${deleteError.message}`);

    const items = (data.items ?? []).map((item, i) => ({
      series_id: series.id,
      title: item.title,
      speaker: item.speaker,
      date: item.date,
      duration: item.duration,
      youtube: item.youtube,
      image_url: item.image || null,
      summary: item.summary || null,
      sort_order: i,
    }));
    if (items.length > 0) {
      const { error: itemsError } = await db.from("cms_teaching_items").insert(items);
      if (itemsError) throw new Error(`teaching_items insert (${data.slug}): ${itemsError.message}`);
    }
    itemCount += items.length;
  }
  console.log(`Migrated ${files.length} teaching series (${itemCount} items).`);
}

async function migrateBlog() {
  const rows = readContentFiles("blog").map((raw) => {
    const { data, content } = parseFile(raw);
    const body = typeof data.body === "string" && data.body.trim() ? data.body.trim() : content;
    return {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      date: data.date,
      author: data.author,
      category: data.category,
      image_url: data.image,
      body,
    };
  });
  const { error } = await db.from("cms_blog_posts").upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`blog: ${error.message}`);
  console.log(`Migrated ${rows.length} blog posts.`);
}

await migrateBooks();
await migrateEvents();
await migrateTeachings();
await migrateBlog();
console.log("Done.");
