import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/site/ui";
import { BLOG_POSTS } from "@/data/blog";
import { Reveal } from "@/components/site/motion";
import { CtaBand } from "@/components/site/CtaBand";

const title = "Blog | Fountain of Life Church USA";
const description =
  "Articles, teaching notes and church news from Fountain of Life Church USA in Indianapolis.";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/blog" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <>
      <Section tone="deep">
        <SectionHeading
          tone="light"
          eyebrow="Blog"
          title="Words for the journey"
          intro="Encouragement, teaching and news from the house."
        />
      </Section>

      <Section tone="cream">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.07}>
              <li className="overflow-hidden rounded-3xl border border-border bg-card">
                <Link to="/blog/$slug" params={{ slug: post.slug }} className="block">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover"
                  />
                  <div className="p-6">
                    <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                      {post.category} ·{" "}
                      {new Date(`${post.date}T00:00:00Z`).toLocaleDateString("en-US", {
                        timeZone: "UTC",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <h2 className="mt-2 font-display text-xl font-bold">{post.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
                    <span className="mt-4 inline-block text-sm font-semibold text-primary underline underline-offset-4">
                      Read article
                    </span>
                  </div>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </Section>

      <CtaBand items={["prayer", "give"]} tone="white" />
    </>
  );
}
