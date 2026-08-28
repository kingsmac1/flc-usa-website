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

// The "DAILY DEVOTIONAL" header text is letter-spaced inconsistently across
// different months' PDFs (e.g. "DA ILY DE VOTIONA L" in some,
// "DA ILY DE VO TIO NA L" in others) — likely different design-tool
// exports. Matching letter-by-letter with \s* between each one handles any
// spacing variant rather than hardcoding a specific gap pattern.
const FLEX_DAILY_DEVOTIONAL = "D\\s*A\\s*I\\s*L\\s*Y\\s*D\\s*E\\s*V\\s*O\\s*T\\s*I\\s*O\\s*N\\s*A\\s*L";
const FLEX_DAILY_DEVOTIONAL_TEST = new RegExp(FLEX_DAILY_DEVOTIONAL);

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

  // Scripture quote + reference. Looks at the first paragraph after the
  // date line for a "<verse text> <dash> <Book Chapter:Verse (TRANSLATION)>"
  // pattern. Deliberately dash-agnostic (em dash, en dash, or plain hyphen
  // all work) and quote-agnostic (works whether or not the verse text is
  // actually wrapped in quotation marks) — real PDFs from this source have
  // been seen using all of these variants inconsistently across months.
  let verse = "";
  let scripture = "";
  let bodyStart = 0;

  // Skip any leading blank lines before looking for the first real
  // paragraph — some PDFs have a blank line directly after the date,
  // before the scripture quote even starts.
  const leadingWs = rest.length - rest.replace(/^\s+/, "").length;
  const restTrimmed = rest.slice(leadingWs);

  const firstParaMatch = /^([\s\S]*?)(?:\r?\n\s*\r?\n|$)/.exec(restTrimmed);
  const firstPara = (firstParaMatch?.[1] ?? "").trim();

  // Book name, chapter:verse (allowing a trailing letter like "16b" for a
  // half-verse, and a verse range like "2:15-16" with optional spacing
  // around the dash), then an optional translation code — which itself
  // may or may not be in parentheses, and real PDFs have been seen with
  // stray/unbalanced parentheses and/or a trailing period around it.
  const BOOK = String.raw`(?:[1-3]\s)?[A-Z][a-zA-Z]+(?:\s+(?:of\s+)?[A-Z][a-zA-Z]+)*`;
  const CHAPTER_VERSE = String.raw`\s*\d+:\d+[a-z]?(?:\s*[-\u2013]\s*\d+[a-z]?)?`;
  const TRANSLATION = String.raw`(?:,?\s*\(?[A-Z]{2,5}\)?)?`;
  const TRAILING_JUNK = String.raw`\.?\s*\)?\s*$`;
  const REF = `(${BOOK}${CHAPTER_VERSE}${TRANSLATION})${TRAILING_JUNK}`;

  // Normal case: "<verse text> <dash> <reference>".
  let scriptureMatch = new RegExp(String.raw`^([\s\S]*?)\s*[\u2014\u2013-]\s*` + REF).exec(firstPara);
  // Fallback: some PDFs put the reference directly after the closing quote
  // with no dash at all — only try this when the text is actually quoted,
  // to avoid false-positives on ordinary body text.
  if (!scriptureMatch) {
    scriptureMatch = new RegExp(String.raw`^[“”"']([\s\S]*?)[“”"']\s*,?\s*` + REF).exec(firstPara);
  }

  if (scriptureMatch) {
    let v = scriptureMatch[1].trim();
    // Strip any wrapping quote characters (curly or straight) left over
    // from PDFs that do quote the verse — a no-op for PDFs that don't.
    v = v.replace(/^[“”"']+/, "").replace(/[“”"']+$/, "");
    verse = v.replace(/\s+/g, " ").trim();
    scripture = scriptureMatch[2].trim();
    bodyStart = leadingWs + (firstParaMatch ? firstParaMatch[0].length : 0);
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
    if (s === "AWAKE" || FLEX_DAILY_DEVOTIONAL_TEST.test(s)) continue;
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
  const chunks = text.split(new RegExp(`\\n\\s*AWAKE\\s*\\n\\s*${FLEX_DAILY_DEVOTIONAL}\\s*\\n`));

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
// Accepts one or more PDF paths, in any order, plus one optional output
// JSON path. Any argument ending in ".json" is treated as the output file
// (default "output.json" if none given); everything else is treated as a
// PDF to parse. Every day from every PDF is merged into one combined array.
const args = process.argv.slice(2);
const jsonArgs = args.filter((a) => a.toLowerCase().endsWith(".json"));
const pdfArgs = args.filter((a) => !a.toLowerCase().endsWith(".json"));

if (pdfArgs.length === 0) {
  console.error(
    "Usage: npx tsx parse-devotional.ts /path/to/devotional1.pdf [/path/to/devotional2.pdf ...] [output.json]",
  );
  process.exit(1);
}
const outputPath = jsonArgs[0] ?? "output.json";

let allResults: ParsedDevotional[] = [];
for (const pdfPath of pdfArgs) {
  const parsed = parseDevotionalPdf(pdfPath);
  console.error(`Parsed ${parsed.length} day(s) from ${pdfPath}`);
  allResults = allResults.concat(parsed);
}

// Guard against the same date appearing twice across different PDFs
// (e.g. accidentally passing the same file, or two PDFs covering an
// overlapping period) — keep the last one seen and warn about it.
const byDate = new Map<string, ParsedDevotional>();
for (const entry of allResults) {
  if (byDate.has(entry.date)) {
    console.error(`⚠ Duplicate date ${entry.date} found across input files — keeping the later one.`);
  }
  byDate.set(entry.date, entry);
}
const deduped = [...byDate.values()].sort((a, b) => (a.date < b.date ? -1 : 1));

console.error(`Total: ${deduped.length} day(s) across ${pdfArgs.length} file(s).`);

const json = JSON.stringify(deduped, null, 2);
writeFileSync(outputPath, json, "utf-8");
console.error(`Wrote ${outputPath}`);