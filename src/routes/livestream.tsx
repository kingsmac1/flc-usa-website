import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { BiblePanel } from "@/components/site/BiblePanel";
import { CtaBand } from "@/components/site/CtaBand";
import { CommentFeed } from "@/components/site/CommentFeed";
import { EventCountdown, NEXT_SERVICE } from "@/components/site/EventCountdown";
import { GiveWidget } from "@/components/site/GiveWidget";
import { LivestreamPlayer } from "@/components/site/LivestreamPlayer";
import { Section, SectionHeading } from "@/components/site/ui";
import { getLiveStatus } from "@/lib/youtube.functions";

const title = "Watch Live | Fountain of Life Church USA";
const description =
  "Join Fountain of Life Church USA live online. Follow the scripture alongside the stream, give, and worship with the family from anywhere.";

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
  const fetchStatus = useServerFn(getLiveStatus);
  const { data } = useQuery({
    queryKey: ["youtube-live"],
    queryFn: () => fetchStatus({}),
    refetchInterval: 60_000,
  });
  const { user } = useAuth();

  // Log one row per signed-in visit to the livestream page. Anonymous viewers
  // are intentionally not counted — the column references auth.users(id) via
  // FK, and a row with viewer_id=null would either fail the FK or skew counts.
  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;
    supabase
      .from("livestream_views")
      .insert({ viewer_id: user.id })
      .then(({ error }) => {
        if (error) console.error("Failed to log livestream view:", error.message);
      });
  }, [user?.id]);

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
          <LivestreamPlayer
            isLive={data?.isLive ?? false}
            videoId={data?.videoId ?? null}
            // Only use the YouTube title when the stream is actually live —
            // otherwise the YouTube helper's "offline" placeholder would
            // override the next-event title we just computed locally.
            title={data?.isLive ? data.title : undefined}
          />
          <BiblePanel />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <CommentFeed contentType="livestream" contentId="general" />
          <GiveWidget compact />
        </div>
      </Section>

      <CtaBand items={["salvation", "prayer"]} tone="white" />

      <EventCountdown {...NEXT_SERVICE} />
    </>
  );
}
