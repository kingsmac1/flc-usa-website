import { createFileRoute, notFound } from "@tanstack/react-router";
import { PillLink, Section, SectionHeading } from "@/components/site/ui";
import { getSeries } from "@/data/teachings";

export const Route = createFileRoute("/teachings/$series")({
  loader: ({ params }) => {
    const series = getSeries(params.series);
    if (!series) throw notFound();
    return { series };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Series unavailable | Fountain of Life Church USA" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.series.title} | Teachings | Fountain of Life Church USA`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.series.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.series.summary },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/teachings/${loaderData.series.slug}` },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: loaderData.series.summary },
      ],
      links: [{ rel: "canonical", href: `/teachings/${loaderData.series.slug}` }],
    };
  },
  notFoundComponent: SeriesNotFound,
  component: SeriesDetail,
});

function SeriesNotFound() {
  return (
    <Section tone="cream">
      <h1 className="text-3xl font-bold">Series not found</h1>
      <p className="mt-3 text-muted-foreground">That teaching series doesn't exist yet.</p>
      <PillLink to="/teachings" className="mt-6">
        Back to teachings
      </PillLink>
    </Section>
  );
}

function SeriesDetail() {
  const { series } = Route.useLoaderData();

  return (
    <>
      <Section tone="deep">
        <SectionHeading tone="light" eyebrow="Teaching series" title={series.title} intro={series.summary} />
      </Section>

      <Section tone="cream">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <img
            src={series.image}
            alt={`${series.title} series artwork`}
            className="aspect-[4/3] w-full rounded-3xl object-cover"
          />
          <ul className="grid gap-4">
            {series.items.map((item) => (
              <li
                key={item.title}
                className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border bg-card p-5"
              >
                <div>
                  <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                    {item.format} · {item.duration}
                  </p>
                  <h2 className="mt-1 font-display text-lg font-bold">{item.title}</h2>
                </div>
                <button
                  type="button"
                  disabled
                  className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground opacity-70"
                >
                  Play
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Media playback connects to the church media library in Phase 2.
        </p>
      </Section>
    </>
  );
}