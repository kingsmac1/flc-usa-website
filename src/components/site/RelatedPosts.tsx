import { Link } from "@tanstack/react-router";
import { Section, SectionHeading } from "./ui";

type RelatedItem = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  image: string;
};

type RelatedPostsProps = {
  items: RelatedItem[];
  route: string;
  title?: string;
};

export function RelatedPosts({ items, route, title = "You might also like" }: RelatedPostsProps) {
  if (!items.length) return null;

  const paramKey = route.includes("$series") ? "series" : "slug";

  return (
    <Section tone="cream">
      <SectionHeading eyebrow="Related" title={title} />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug} className="overflow-hidden rounded-3xl border border-border bg-card">
            <Link to={route} params={{ [paramKey]: item.slug }} className="block">
              <img src={item.image} alt={item.title} loading="lazy" className="aspect-[16/10] w-full object-cover" />
              <div className="p-6">
                <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                  {item.subtitle}
                </p>
                <h2 className="mt-2 font-display text-xl font-bold">{item.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-primary underline underline-offset-4">
                  Read more
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}