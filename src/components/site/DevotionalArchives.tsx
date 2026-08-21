import { Link } from "@tanstack/react-router";
import { ArrowRight, Download } from "lucide-react";
import { useState } from "react";
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

/** Month keys ("YYYY-MM") for the daily-article browser. */
const ARTICLE_MONTHS = Array.from(
  { length: 12 },
  (_, i) => `${DEVOTIONAL_YEAR}-${String(i + 1).padStart(2, "0")}`,
);

/**
 * Daily archive (month tabs + day list) and the monthly PDF archive.
 * Rendered on the devotional index and on every single devotional page.
 */
export function DevotionalArchives({ activeDate }: { activeDate: string }) {
  const [month, setMonth] = useState(
    ARTICLE_MONTHS.includes(activeDate.slice(0, 7)) ? activeDate.slice(0, 7) : ARTICLE_MONTHS[0]!,
  );
  const days = devotionalsForMonth(month);

  const currentYear = new Date().getFullYear();
  const defaultYear = ARCHIVE_YEARS.includes(currentYear as (typeof ARCHIVE_YEARS)[number])
    ? currentYear
    : ARCHIVE_YEARS[ARCHIVE_YEARS.length - 1]!;
  const [pdfYear, setPdfYear] = useState<number>(defaultYear);
  const yearPdfs = pdfsForYear(pdfYear);

  return (
    <>
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
                aria-current={d.date === activeDate ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 transition-colors",
                  d.date === activeDate
                    ? "border-accent bg-accent/10"
                    : "border-border bg-card hover:bg-secondary",
                )}
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
