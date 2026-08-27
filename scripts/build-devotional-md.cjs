/**
 * BUILD DEVOTIONAL MARKDOWN FILES
 * --------------------------------
 * Converts the JSON produced by parse-devotional.ts into individual
 * Markdown files, sorted into content/devotionals/<year>/<month>/ folders,
 * matching exactly what the site's devotionals.ts loader and the Sveltia
 * CMS "Daily Devotionals" collection both expect.
 *
 * Requires: npm install js-yaml (skip if already installed — it's already
 * a dependency of devotionals.ts, so it likely is).
 *
 * Usage:
 *   node scripts/build-devotional-md.cjs output.json
 *
 * This creates/overwrites files like:
 *   content/devotionals/2026/08/2026-08-01.md
 *   content/devotionals/2026/08/2026-08-02.md
 *   ...
 */
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node scripts/build-devotional-md.cjs <path-to-output.json>");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
const projectRoot = path.join(__dirname, ".."); // scripts/ -> project root
let written = 0;

for (const d of data) {
  if (!d.date) {
    console.warn("⚠ Skipping an entry with no date:", JSON.stringify(d).slice(0, 100));
    continue;
  }
  const [year, month] = d.date.split("-");
  const outDir = path.join(projectRoot, "content", "devotionals", year, month);
  fs.mkdirSync(outDir, { recursive: true });

  const frontmatter = {
    date: d.date,
    title: d.title,
    scripture: d.scripture,
    verse: d.verse,
    body: d.body,
    prayer: d.prayer,
    furtherStudies: d.furtherStudies,
    readingPlan: d.readingPlan,
    author: d.author,
  };

  const yamlStr = yaml.dump(frontmatter, { lineWidth: -1, noRefs: true, quotingType: '"' });
  const filePath = path.join(outDir, `${d.date}.md`);
  fs.writeFileSync(filePath, `---\n${yamlStr}---\n`, "utf-8");
  written += 1;
}

console.log(`Wrote ${written} file(s) into content/devotionals/<year>/<month>/`);
