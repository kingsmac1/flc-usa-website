import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CommentFeed } from "./CommentFeed";
import { DevotionalArchives } from "./DevotionalArchives";
import { DevotionalCalendar } from "./DevotionalCalendar";
import { Section, SectionHeading } from "./ui";
import { adjacentDevotionals, formatDevotionalDate, formatShortDate, getDevotional } from "@/data/devotionals";

export function DevotionalArticle({ date, showArchives = true }: { date: string; showArchives?: boolean }) {
  const devotional = getDevotional(date);
  const { prev, next } = adjacentDevotionals(date);

  return (
    <>
      <Section tone="deep">
        <SectionHeading
          tone="light"
          eyebrow="Daily devotional"
          title={devotional.title}
          intro={formatDevotionalDate(date)}
        />
      </Section>

      <Section tone="cream">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <article className="rounded-3xl border border-border bg-card p-7">
            <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
              {devotional.scripture}
            </p>
            <blockquote className="mt-3 border-l-4 border-accent pl-4 text-lg leading-relaxed">
              “{devotional.verse}”
            </blockquote>
            {devotional.body.map((p) => (
              <p key={p.slice(0, 24)} className="mt-5 text-base leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
            <div className="mt-8 rounded-3xl bg-secondary p-5">
              <h2 className="font-display text-base font-bold">Prayer</h2>
              <p className="mt-2 text-sm text-muted-foreground">{devotional.prayer}</p>
            </div>
            {devotional.declarations?.length ? (
              <div className="mt-4 rounded-3xl border border-accent/40 bg-accent/10 p-5">
                <h2 className="font-display text-base font-bold">Declarations</h2>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {devotional.declarations.map((d) => (
                    <li key={d}>“{d}”</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              {devotional.furtherStudies ? (
                <p>
                  <span className="font-semibold text-foreground">Further studies:</span>{" "}
                  {devotional.furtherStudies}
                </p>
              ) : null}
              {devotional.readingPlan ? (
                <p>
                  <span className="font-semibold text-foreground">Bible reading plan:</span>{" "}
                  {devotional.readingPlan}
                </p>
              ) : null}
              {devotional.author ? <p>Written by {devotional.author}</p> : null}
            </div>
          </article>
          <DevotionalCalendar value={date} />
        </div>
        <nav
          aria-label="Devotional navigation"
          className="mt-6 grid gap-3 sm:grid-cols-2"
        >
          {prev ? (
            <Link
              to="/devotional/$date"
              params={{ date: prev.date }}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                  Previous · {formatShortDate(prev.date)}
                </span>
                <span className="mt-1 block truncate font-display text-base font-bold">{prev.title}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to="/devotional/$date"
              params={{ date: next.date }}
              className="flex items-center justify-end gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-right transition-colors hover:bg-secondary"
            >
              <span className="min-w-0">
                <span className="block text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                  Next · {formatShortDate(next.date)}
                </span>
                <span className="mt-1 block truncate font-display text-base font-bold">{next.title}</span>
              </span>
              <ArrowRight className="size-5 shrink-0 text-primary" aria-hidden="true" />
            </Link>
          ) : null}
        </nav>

        <div className="mt-6">
          <CommentFeed title="Share your reflection" />
        </div>
      </Section>

      {showArchives ? <DevotionalArchives activeDate={date} /> : null}
    </>
  );
}
