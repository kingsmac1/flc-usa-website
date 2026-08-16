import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/site/ui";
import { SERIES } from "@/data/teachings";

const title = "Teachings Library | Fountain of Life Church USA";
const description =
  "Browse sermon series, audio teachings and articles from Fountain of Life Church USA.";

export const Route = createFileRoute("/teachings/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/teachings" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/teachings" }],
  }),
  component: TeachingsIndex,
});

function TeachingsIndex() {
  return (
    <>
      <Section tone="deep">
        <SectionHeading
          tone="light"
          eyebrow="Teachings"
          title="Grow deeper in the Word"
          intro="Each collection gathers messages, audio and written teaching around one theme. Content shown is placeholder material."
        />
      </Section>

      <Section tone="cream">
        <ul className="grid gap-6 sm:grid-cols-2">
          {SERIES.map((s) => (
            <li key={s.slug} className="overflow-hidden rounded-3xl border border-border bg-card">
              <img src={s.image} alt={`${s.title} series artwork`} loading="lazy" className="aspect-[16/9] w-full object-cover" />
              <div className="p-6">
                <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                  {s.items.length} sessions
                </p>
                <h2 className="mt-2 font-display text-xl font-bold">{s.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
                <Link
                  to="/teachings/$series"
                  params={{ series: s.slug }}
                  className="mt-4 inline-block text-sm font-semibold text-primary underline underline-offset-4"
                >
                  View series
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}