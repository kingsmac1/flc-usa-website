import { createFileRoute } from "@tanstack/react-router";
import { DevotionalArticle } from "@/components/site/DevotionalArticle";
import { toISODate } from "@/components/site/DevotionalCalendar";

const title = "Daily Devotional | Fountain of Life Church USA";
const description =
  "Read today's devotional from Fountain of Life Church USA — scripture, reflection, prayer and declarations for every day.";

export const Route = createFileRoute("/devotional/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/devotional" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/devotional" }],
  }),
  component: DevotionalIndex,
});

function DevotionalIndex() {
  return <DevotionalArticle date={toISODate(new Date())} />;
}