# Monthly devotional PDFs

Drop monthly devotional PDF files in this folder. Recommended file name pattern:

    YYYY-MM.pdf      e.g. 2026-08.pdf

Then register the file in `src/data/devotionals.ts` under `DEVOTIONAL_PDFS`:

    { month: "2026-08", label: "August 2026", file: "/devotional-pdfs/2026-08.pdf" }

Anything in `public/` is served at the site root, so `/devotional-pdfs/2026-08.pdf`
becomes a working download link automatically. No code changes needed beyond the
one-line entry above.
