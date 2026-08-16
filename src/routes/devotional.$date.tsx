import { createFileRoute } from "@tanstack/react-router";
import { DevotionalArticle } from "@/components/site/DevotionalArticle";
import { formatDevotionalDate } from "@/data/devotionals";

export const Route = createFileRoute("/devotional/$date")({
  head: ({ params }) => {
    const title = `Devotional for ${formatDevotionalDate(params.date)} | Fountain of Life Church USA`;
    const description = `Read the Fountain of Life Church USA devotional for ${formatDevotionalDate(params.date)} — scripture, reflection and prayer.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/devotional/${params.date}` },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: `/devotional/${params.date}` }],
    };
  },
  component: DevotionalByDate,
});

function DevotionalByDate() {
  const { date } = Route.useParams();
  return <DevotionalArticle date={date} />;
}