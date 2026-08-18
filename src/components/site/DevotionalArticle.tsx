import { CommentFeed } from "./CommentFeed";
import { DevotionalCalendar } from "./DevotionalCalendar";
import { Section, SectionHeading } from "./ui";
import { formatDevotionalDate, getDevotional } from "@/data/devotionals";

export function DevotionalArticle({ date }: { date: string }) {
  const devotional = getDevotional(date);

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
        <div className="mt-6">
          <CommentFeed title="Share your reflection" />
        </div>
      </Section>
    </>
  );
}