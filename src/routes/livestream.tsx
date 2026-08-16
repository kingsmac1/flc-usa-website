import { createFileRoute } from "@tanstack/react-router";
import { BiblePanel } from "@/components/site/BiblePanel";
import { CommentFeed } from "@/components/site/CommentFeed";
import { EventCountdown, NEXT_SERVICE } from "@/components/site/EventCountdown";
import { LivestreamPlayer } from "@/components/site/LivestreamPlayer";
import { Section, SectionHeading } from "@/components/site/ui";

const title = "Watch Live | Fountain of Life Church USA";
const description =
  "Join Fountain of Life Church USA live online. Follow the scripture alongside the stream and worship with the family from anywhere.";

export const Route = createFileRoute("/livestream")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "video.other" },
      { property: "og:url", content: "/livestream" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/livestream" }],
  }),
  component: LivestreamPage,
});

function LivestreamPage() {
  return (
    <>
      <Section tone="deep">
        <SectionHeading
          tone="light"
          eyebrow="Livestream"
          title="Worship with us from anywhere"
          intro="Our services stream every Sunday at 10:00 AM and Wednesday at 7:00 PM (ET)."
        />
      </Section>

      <Section tone="cream">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <LivestreamPlayer isLive={false} videoId={null} />
          <BiblePanel />
        </div>
        <div className="mt-6">
          <CommentFeed />
        </div>
      </Section>

      <EventCountdown {...NEXT_SERVICE} />
    </>
  );
}