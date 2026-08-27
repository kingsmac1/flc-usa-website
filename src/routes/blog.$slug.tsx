import { createFileRoute, notFound } from "@tanstack/react-router";
import { PillLink, Section } from "@/components/site/ui";
import { getPost, adjacentPosts, getRelatedPosts } from "@/data/blog";
import { PostNavigation } from "@/components/site/PostNavigation";
import { RelatedPosts } from "@/components/site/RelatedPosts";
import { Reveal } from "@/components/site/motion";
import { CtaBand } from "@/components/site/CtaBand";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article not found | Fountain of Life Church USA" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    const title = `${post.title} | Fountain of Life Church USA`;
    return {
      meta: [
        { title },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${post.slug}` },
        { property: "og:image", content: post.image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: post.excerpt },
        { name: "twitter:image", content: post.image },
      ],
      links: [{ rel: "canonical", href: `/blog/${post.slug}` }],
    };
  },
  notFoundComponent: PostNotFound,
  component: BlogPostPage,
});

function PostNotFound() {
  return (
    <Section tone="cream">
      <h1 className="text-3xl font-bold">Article not found</h1>
      <p className="mt-3 text-muted-foreground">That article doesn't exist.</p>
      <PillLink to="/blog" className="mt-6">
        Back to the blog
      </PillLink>
    </Section>
  );
}

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const { prev, next } = adjacentPosts(post.slug);
  const related = getRelatedPosts(post.slug, 3);

  const relatedItems = related.map((p) => ({
    slug: p.slug,
    title: p.title,
    subtitle: `${p.category} · ${new Date(`${p.date}T00:00:00Z`).toLocaleDateString("en-US", {
      timeZone: "UTC",
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`,
    summary: p.excerpt,
    image: p.image,
  }));

  const navItems = {
    prev: prev ? { slug: prev.slug, title: prev.title, date: prev.date } : undefined,
    next: next ? { slug: next.slug, title: next.title, date: next.date } : undefined,
  };

  return (
    <>
      <Section tone="deep">
        <p className="text-xs font-semibold tracking-wide uppercase text-accent">
          {post.category} ·{" "}
          {new Date(`${post.date}T00:00:00Z`).toLocaleDateString("en-US", {
            timeZone: "UTC",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-sm text-deep-foreground/75">By {post.author}</p>
      </Section>

      <Section tone="cream">
        <Reveal>
        <article className="mx-auto max-w-3xl">
          <img src={post.image} alt={post.title} className="aspect-[16/9] w-full rounded-3xl object-cover" />
          <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/90">
            {post.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <PostNavigation {...navItems} route="/blog/$slug" />
          <PillLink to="/blog" variant="outline" className="mt-10">
            Back to all articles
          </PillLink>
        </article>
        </Reveal>
      </Section>

      <RelatedPosts items={relatedItems} route="/blog/$slug" />

      <CtaBand items={["prayer", "salvation"]} tone="white" />
    </>
  );
}