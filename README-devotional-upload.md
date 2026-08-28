# Uploading a New Month's Devotional

This document covers the full process for turning a new month's "Awake Daily Devotional" PDF into live content on the site: the individual daily articles *and* the downloadable monthly PDF.

There are two one-time setup requirements (Node.js and `pdftotext`) — if you've done this before on your machine, skip to **Step 1**.

---

## One-time setup (per machine, not per month)

### 1. Node.js and this project's dependencies

You should already have these if you can run the site locally. If not, install [Node.js](https://nodejs.org/) first, then from the project root:

```
npm install
```

### 2. `pdftotext` (part of `poppler`)

The parser script reads the PDF's text using a command-line tool called `pdftotext`, which is separate from Node/npm and needs installing once via [Homebrew](https://brew.sh/):

```
brew install poppler
```

Confirm it worked:

```
pdftotext -v
```

You should see a version number printed. If `brew` itself isn't found, install Homebrew first from [brew.sh](https://brew.sh/), then retry.

---

## Every month: the actual process

### Step 1 — Rename and place the PDF

Rename the month's PDF to match this exact pattern:

```
Awake-Devotional-<Month>-<Year>.pdf
```

Examples: `Awake-Devotional-August-2026.pdf`, `Awake-Devotional-September-2026.pdf`

Place it inside:

```
public/devotional-pdfs/
```

### Step 2 — Run the parser to extract every day from the PDF

From the project root, in your terminal:

```
npx tsx scripts/parse-devotional.ts "public/devotional-pdfs/Awake-Devotional-<Month>-<Year>.pdf" output.json
```

Replace `<Month>-<Year>` with the actual filename from Step 1. If your path has spaces anywhere, keep it wrapped in quotes exactly as shown.

**Watch the terminal output.** It will print `Parsed X day(s)` when done. If any day is missing a scripture, verse, prayer, reading plan, or body, it prints a `⚠` warning line naming that exact date — open `output.json`, find that date's entry, and fix it by hand before moving on. This step exists because PDF text extraction isn't always perfect (a missing punctuation mark or an unusual page layout can occasionally trip it up on a specific day) — a quick manual check here prevents a subtly wrong entry from going live.

`output.json` is created in the project's root folder once this finishes.

### Step 3 — Convert the JSON into the site's content files

```
node scripts/build-devotional-md.cjs output.json
```

This automatically creates one Markdown file per day, correctly sorted into year/month folders, e.g.:

```
content/devotionals/2026/08/2026-08-01.md
content/devotionals/2026/08/2026-08-02.md
...
content/devotionals/2026/08/2026-08-31.md
```

You'll see a `Wrote X file(s)` confirmation in the terminal.

### Step 4 — Turn on the monthly PDF download

Open `src/data/devotionals.ts` and find this line near the top of the "MONTHLY PDF ARCHIVE" section:

```typescript
const AVAILABLE_PDF_MONTHS = new Set<string>(["2026-06"]);
```

Add the new month's `"YYYY-MM"` string to the list:

```typescript
const AVAILABLE_PDF_MONTHS = new Set<string>(["2026-06", "2026-08"]);
```

This is what makes the "Download this month's PDF" button on the devotional archive page go live for that month — the button links directly to the PDF file placed in Step 1.

### Step 5 — Commit and push

```
git add content/devotionals public/devotional-pdfs src/data/devotionals.ts
git commit -m "Add August 2026 devotionals"
git push
```

Once Cloudflare Pages finishes building and deploying (usually a minute or two), the new month is live: every daily article at `/devotional/<date>`, and the monthly PDF download on the devotional archive page.

### Step 6 — Spot-check it

- Visit a couple of the new dates directly, e.g. `/devotional/2026-08-01`, and confirm the article renders (scripture, verse, body, prayer, further studies, reading plan, author).
- Visit `/devotional`, pick the new year/month from the PDF archive dropdown, and confirm the download button works.
- Open `/admin`, go to **Daily Devotionals**, and confirm the new month's entries show up there too — this means they're now fully editable through the CMS going forward, not just via this script.

---

## Alternative: editing one entry after it's live

Once a month's entries exist as files (via this process), you don't need to repeat any of the above to fix a typo or tweak a single day — just edit that entry directly through the CMS at `/admin`, the same way as any other content type. This script-based process is only for the initial bulk import of a whole month at once.

---

## Quick reference — full command sequence

```bash
# One-time setup only:
npm install
brew install poppler

# Every month:
npx tsx scripts/parse-devotional.ts "public/devotional-pdfs/Awake-Devotional-<Month>-<Year>.pdf" output.json
node scripts/build-devotional-md.cjs output.json
# → then manually add "<Year>-<Month>" to AVAILABLE_PDF_MONTHS in src/data/devotionals.ts
git add content/devotionals public/devotional-pdfs src/data/devotionals.ts
git commit -m "Add <Month> <Year> devotionals"
git push
```

---

## Files this process depends on

| File | Purpose |
|---|---|
| `scripts/parse-devotional.ts` | Reads the PDF, extracts each day into structured data |
| `scripts/build-devotional-md.cjs` | Converts that data into year/month-sorted Markdown files |
| `src/data/devotionals.ts` | Loads all Markdown files at build time; also tracks which months have a downloadable PDF |
| `public/devotional-pdfs/` | Where the actual monthly PDF files live |
| `content/devotionals/<year>/<month>/` | Where the individual daily article files live |

If any of these files go missing or get restructured, this process will need updating to match — this README should be kept in sync with the actual scripts, not treated as independent documentation.