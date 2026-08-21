import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import { DevotionalArticle } from "@/components/site/DevotionalArticle";
import { toISODate } from "@/components/site/DevotionalCalendar";
import { Section, SectionHeading } from "@/components/site/ui";
import {
  ARCHIVE_YEARS,
  DEVOTIONAL_YEAR,
  devotionalsForMonth,
  formatShortDate,
  monthLabel,
  pdfsForYear,
} from "@/data/devotionals";
import { cn } from "@/lib/utils";

const title = "Daily Devotional | Fountain of Life Church USA";
const description =
  "Read today's devotional from Fountain of Life Church USA — scripture, reflection, prayer and declarations for every day.";

export const Route = createFileRoute("/devotional/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/devotional" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/devotional" }],
  }),
  component: DevotionalIndex,
});

/** Month keys ("YYYY-MM") for the daily-article browser — independent of the PDF archive's years. */
const ARTICLE_MONTHS = Array.from(
  { length: 12 },
  (_, i) => `${DEVOTIONAL_YEAR}-${String(i + 1).padStart(2, "0")}`,
);

function DevotionalIndex() {
  const today = toISODate(new Date());
  const [month, setMonth] = useState(today.slice(0, 7));
  const days = devotionalsForMonth(month);

  const currentYear = new Date().getFullYear();
  const defaultYear = ARCHIVE_YEARS.includes(currentYear as (typeof ARCHIVE_YEARS)[number])
    ? currentYear
    : ARCHIVE_YEARS[ARCHIVE_YEARS.length - 1]!;
  const [pdfYear, setPdfYear] = useState<number>(defaultYear);
  const yearPdfs = pdfsForYear(pdfYear);

  return (
    <>
      <DevotionalArticle date={today} />

      <Section tone="white">
        <SectionHeading
          eyebrow="Daily archive"
          title="Every devotional, day by day"
          intro="Pick a month, then tap any day to read that devotional."
        />

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Choose a month">
          {ARTICLE_MONTHS.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={month === m}
              onClick={() => setMonth(m)}
              className={cn(
                "min-h-11 shrink-0 rounded-full border px-5 text-sm font-semibold transition-colors",
                month === m
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-secondary",
              )}
            >
              {monthLabel(m)}
            </button>
          ))}
        </div>

        <ul className="mt-6 grid gap-3">
          {days.map((d) => (
            <li key={d.date}>
              <Link
                to="/devotional/$date"
                params={{ date: d.date }}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4 transition-colors hover:bg-secondary"
              >
                <span className="min-w-0">
                  <span className="block text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                    {formatShortDate(d.date)} · {d.scripture}
                  </span>
                  <span className="mt-1 block truncate font-display text-lg font-bold">{d.title}</span>
                </span>
                <ArrowRight className="size-5 shrink-0 text-primary" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="cream">
        <SectionHeading
          eyebrow="Monthly archives"
          title="Download the devotional PDFs"
          intro="Choose a year to see every month's devotional available for download."
        />

        <div className="mt-6 max-w-xs">
          <label className="text-xs font-semibold uppercase text-muted-foreground" htmlFor="pdf-archive-year">
            Year
          </label>
          <select
            id="pdf-archive-year"
            value={pdfYear}
            onChange={(e) => setPdfYear(Number(e.target.value))}
            className="mt-2 min-h-11 w-full rounded-full border border-border bg-card px-4 text-sm focus-visible:outline-2 focus-visible:outline-accent"
          >
            {ARCHIVE_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {yearPdfs.map((pdf) => (
            <li key={pdf.month} className="rounded-3xl border border-border bg-card p-6">
              <h3 className="font-display text-lg font-bold">{pdf.label}</h3>
              {pdf.available ? (
                <a
                  href={pdf.file}
                  download
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground hover:brightness-95"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download PDF
                </a>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">PDF coming soon.</p>
              )}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}