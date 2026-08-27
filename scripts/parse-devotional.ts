/**
 * DEVOTIONAL PDF PARSER
 * ----------------------
 * Takes a monthly "Awake Daily Devotional" PDF and extracts one structured
 * entry per day, matching the `Devotional` type used in src/data/devotionals.ts.
 *
 * Requires the `pdftotext` command-line tool (part of poppler-utils):
 *   macOS:   brew install poppler
 *   Linux:   sudo apt install poppler-utils
 *
 * Usage:
 *   npx tsx parse-devotional.ts /path/to/devotional.pdf > out.json
 *
 * IMPORTANT: This is a first pass, not a silent auto-publish step. Always
 * review out.json against the PDF before turning it into real content files
 * — see the review notes printed to stderr for anything that looks off.
 */

import { execFileSync } from "child_process";
import { writeFileSync } from "fs";

export type ParsedDevotional = {
  date: string; // YYYY-MM-DD
  title: string;
  scripture: string;
  verse: string;
  body: string[];
  prayer: string;
  readingPlan: string;
  furtherStudies: string;
  author: string;
};

const DAYS = "Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday";
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_PATTERN = MONTHS.join("|");
const DATE_RE = new RegExp(`(${DAYS}), (${MONTH_PATTERN}) (\\d{1,2}), (\\d{4})`);

const HEADER_WORDS = new Set(["FURTHER", "STUDIES", "DAILY", "BIBLE", "READING", "PLAN"]);

function extractLayoutText(pdfPath: string): string {
  return execFileSync("pdftotext", ["-layout", pdfPath, "-"], {
    maxBuffer: 1024 * 1024 * 50,
  }).toString("utf-8");
}

function fixDropCap(lines: string[]): string[] {
  const out = [...lines];
  for (let i = 0; i < out.length; i++) {
    if (out[i].trim() && /^[A-Z]$/.test(out[i].trim())) {
      let j = i + 1;
      while (j < out.length && !out[j].trim()) j++;
      if (j < out.length) {
        out[j] = out[i].trim() + out[j].replace(/^\s+/, "");
        out[i] = "";
      }
      break;
    }
  }
  return out;
}

function parseDay(chunk: string): ParsedDevotional | null {
  const m = DATE_RE.exec(chunk);
  if (!m) return null;

  const [, , monthName, dayNum, year] = m;
  const monthIndex = MONTHS.indexOf(monthName) + 1;
  const date = `${year}-${String(monthIndex).padStart(2, "0")}-${String(Number(dayNum)).padStart(2, "0")}`;

  const pre = chunk.slice(0, m.index);
  const title = pre.split("\n").map((l) => l.trim()).filter(Boolean).join(" ");

  const rest = chunk.slice(m.index + m[0].length);

  // Scripture quote + reference. Handles the normal case (closing curly quote,
  // dash, reference) and PDFs with a missing/typo'd closing quote mark.
  let verse = "";
  let scripture = "";
  let bodyStart = 0;

  const normalMatch = /[“"]([\s\S]*?)[”“"]\s*[—-]\s*(.+)/.exec(rest);
  if (normalMatch) {
    verse = normalMatch[1].replace(/\s+/g, " ").trim();
    scripture = normalMatch[2].trim();
    bodyStart = normalMatch.index + normalMatch[0].length;
  } else {
    const openMatch = /[“"]/.exec(rest);
    if (openMatch) {
      const afterOpen = rest.slice(openMatch.index + 1);
      const refMatch = /\n\s*[—-]\s*([A-Z][^\n]{0,60}?\d+:\d+[^\n]{0,20})\s*\n/.exec(afterOpen);
      if (refMatch) {
        verse = afterOpen.slice(0, refMatch.index).replace(/\s+/g, " ").trim();
        scripture = refMatch[1].trim();
        bodyStart = openMatch.index + 1 + refMatch.index + refMatch[0].length;
      }
    }
  }

  const bodyAndRest = rest.slice(bodyStart);
  const [bodyRaw, ...afterPrayerParts] = bodyAndRest.split(/PRAYER\s*\/\s*DECLARATION/);
  const afterPrayer = afterPrayerParts.join("PRAYER / DECLARATION");

  // Clean body text: strip page numbers, footer contact line, repeated
  // headers, and the drop-cap artifact; then group into paragraphs.
  let bodyLines = bodyRaw.split("\n");
  bodyLines = fixDropCap(bodyLines);
  const cleaned: string[] = [];
  for (const raw of bodyLines) {
    const s = raw.trim();
    if (!s) {
      cleaned.push("");
      continue;
    }
    if (/^\d{1,3}$/.test(s)) continue;
    if (s.includes("awakedaily@flcusa.org") || s.startsWith("Å")) continue;
    if (s === "AWAKE" || /DA ?ILY DE ?VOTIONA ?L/.test(s)) continue;
    if (s === title || DATE_RE.test(s)) continue;
    cleaned.push(s);
  }
  const body = cleaned
    .join("\n")
    .split("\n\n")
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  // Prayer text: up to "FURTHER STUDIES"
  const [prayerRaw, ...furtherParts] = afterPrayer.split("FURTHER STUDIES");
  const further = furtherParts.join("FURTHER STUDIES");
  const prayer = prayerRaw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.includes("awakedaily@flcusa.org") && !l.startsWith("Å") && !/^\d{1,3}$/.test(l))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  // Further studies / reading plan — two columns separated by wide gaps.
  const furtherStudiesParts: string[] = [];
  const readingPlanParts: string[] = [];
  for (const raw of further.split("\n")) {
    if (!raw.trim()) continue;
    if (raw.includes("awakedaily@flcusa.org") || raw.trim().startsWith("Å")) break;
    const norm = raw.trim().replace(/\s+/g, " ");
    const words = new Set(norm.toUpperCase().split(" "));
    let isHeaderOnly = words.size > 0;
    for (const w of words) if (!HEADER_WORDS.has(w)) isHeaderOnly = false;
    if (isHeaderOnly) continue;
    const cols = raw.trim().split(/\s{3,}/);
    if (cols.length >= 2) {
      furtherStudiesParts.push(cols[0].trim());
      readingPlanParts.push(cols[cols.length - 1].trim());
    } else if (cols.length === 1) {
      furtherStudiesParts.push(cols[0].trim());
    }
  }

  return {
    date,
    title,
    scripture,
    verse,
    body,
    prayer,
    readingPlan: readingPlanParts.join(" ").trim(),
    furtherStudies: furtherStudiesParts.join(" ").trim(),
    author: "Apostle Chuks",
  };
}

function parseDevotionalPdf(pdfPath: string): ParsedDevotional[] {
  const text = extractLayoutText(pdfPath);
  const chunks = text.split(/\n\s*AWAKE\s*\n\s*DA ?ILY DE ?VOTIONA ?L\s*\n/);

  const results: ParsedDevotional[] = [];
  for (const chunk of chunks) {
    const parsed = parseDay(chunk);
    if (parsed) results.push(parsed);
  }

  // Review notes — printed to stderr, never silently swallowed.
  for (const d of results) {
    const problems: string[] = [];
    if (!d.scripture) problems.push("missing scripture reference");
    if (!d.verse) problems.push("missing verse text");
    if (!d.prayer) problems.push("missing prayer text");
    if (!d.readingPlan) problems.push("missing reading plan");
    if (d.body.length === 0) problems.push("missing body");
    if (problems.length) {
      console.error(`⚠ ${d.date} (${d.title}): ${problems.join(", ")} — check manually`);
    }
  }

  return results;
}

// ---- CLI entry point ----
const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: npx tsx parse-devotional.ts /path/to/devotional.pdf [output.json]");
  process.exit(1);
}
const outputPath = process.argv[3];

const parsed = parseDevotionalPdf(inputPath);
console.error(`Parsed ${parsed.length} day(s) from ${inputPath}`);

const json = JSON.stringify(parsed, null, 2);
if (outputPath) {
  writeFileSync(outputPath, json, "utf-8");
  console.error(`Wrote ${outputPath}`);
} else {
  console.log(json);
}
