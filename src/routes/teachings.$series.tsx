import { createFileRoute, notFound } from "@tanstack/react-router";
import { PillLink, Section } from "@/components/site/ui";
import { getSeries, youtubeId, adjacentSeries, getRelatedSeries } from "@/data/teachings";
import { PostNavigation } from "@/components/site/PostNavigation";
import { RelatedPosts } from "@/components/site/RelatedPosts";
import { Reveal, HeroReveal } from "@/components/site/motion";
import { CtaBand } from "@/components/site/CtaBand";
import { ShareButtons } from "@/components/site/ShareButtons";
import { SITE } from "@/data/site";

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
    const { series } = loaderData;
    const title = `${series.title} | Teachings | Fountain of Life Church USA`;
    return {
      meta: [
        { title },
        { name: "description", content: series.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: series.summary },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/teachings/${series.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: series.summary },
      ],
      links: [{ rel: "canonical", href: `/teachings/${series.slug}` }],
    };
  },
  notFoundComponent: PostNotFound,
  component: TeachingsIndex,
});

function PostNotFound() {
  return (
    <Section tone="cream">
      <h1 className="text-3xl font-bold">Series not found</h1>
      <p className="mt-3 text-muted-foreground">That series doesn't exist.</p>
      <PillLink to="/teachings" className="mt-6">
        Back to teachings
      </PillLink>
    </Section>
  );
}

function TeachingsIndex() {
  const { series } = Route.useLoaderData();
  const { prev, next } = adjacentSeries(series.slug);
  const related = getRelatedSeries(series.slug, 3);

  const navItems = {
    prev: prev ? { slug: prev.slug, title: prev.title, date: prev.items[0]?.date ?? prev.slug } : undefined,
    next: next ? { slug: next.slug, title: next.title, date: next.items[0]?.date ?? next.slug } : undefined,
  };

  const relatedItems = related.map((s) => ({
    slug: s.slug,
    title: s.title,
    subtitle: `${s.items.length} sessions`,
    summary: s.summary,
    image: s.image,
  }));

  return (
    <>
      <Section tone="deep">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <HeroReveal
              eyebrow="Teaching series"
              heading={<h1 className="mt-3 max-w-3xl text-3xl font-bold sm:text-5xl">{series.title}</h1>}
              body={<p className="mt-3 max-w-2xl text-sm text-deep-foreground/75">{series.summary}</p>}
            />
          </div>
          <ShareButtons url={`${SITE.domain}/teachings/${series.slug}`} title={series.title} description={series.summary} />
        </div>
      </Section>

      <Section tone="cream">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <img
              src={series.image}
              alt={`${series.title} series artwork`}
              className="aspect-[4/3] w-full rounded-3xl object-cover"
            />
          </Reveal>
          <ul className="grid gap-4">
            {series.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <li className="overflow-hidden rounded-3xl border border-border bg-card">
                  <div className="aspect-video w-full bg-deep">
                    <iframe
                      className="size-full"
                      src={`https://www.youtube.com/embed/${youtubeId(item.youtube)}`}
                      title={item.title}
                      loading="lazy"
                      allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                      {item.speaker} · {item.duration}
                    </p>
                    <h2 className="mt-1 font-display text-lg font-bold">{item.title}</h2>
                    {item.summary ? (
                      <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
                    ) : null}
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
        <PostNavigation {...navItems} route="/teachings/$series" />
        <PillLink to="/teachings" variant="outline" className="mt-10">
          Back to teachings
        </PillLink>
      </Section>

      <RelatedPosts items={relatedItems} route="/teachings/$series" />

      <CtaBand items={["prayer", "give"]} tone="white" />
    </>
  );
}