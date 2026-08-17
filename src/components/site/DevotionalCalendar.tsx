import { useNavigate } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { getPdfForDate } from "@/data/devotionals";

export function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** Date picker that routes to /devotional/:date. */
export function DevotionalCalendar({ value }: { value: string }) {
  const navigate = useNavigate();
  const [date, setDate] = useState(value);
  const pdf = getPdfForDate(date);

  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <h2 className="inline-flex items-center gap-2 font-display text-lg font-bold">
        <CalendarDays className="size-5 text-primary" aria-hidden="true" />
        Browse the archive
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick any date to read that day's devotional.
      </p>
      <label className="sr-only" htmlFor="devotional-date">
        Devotional date
      </label>
      <input
        id="devotional-date"
        type="date"
        value={date}
        max={toISODate(new Date())}
        onChange={(e) => {
          setDate(e.target.value);
          if (e.target.value) {
            navigate({ to: "/devotional/$date", params: { date: e.target.value } });
          }
        }}
        className="mt-4 min-h-11 w-full rounded-full border border-border bg-secondary px-4 text-sm focus-visible:outline-2 focus-visible:outline-accent"
      />
      {pdf ? (
        <a
          href={pdf.file}
          download
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-primary/30 px-6 text-sm font-semibold text-primary hover:bg-secondary"
        >
          Download {pdf.label} PDF
        </a>
      ) : (
        <>
          <button
            type="button"
            disabled
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-primary/30 px-6 text-sm font-semibold text-primary opacity-60"
          >
            Download this month's PDF
          </button>
          <p className="mt-2 text-xs text-muted-foreground">
            No PDF has been uploaded for this month yet.
          </p>
        </>
      )}
    </div>
  );
}