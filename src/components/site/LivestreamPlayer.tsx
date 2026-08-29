import { Play, Radio } from "lucide-react";
import { PLACEHOLDER } from "@/data/site";
import { nextUpcomingService } from "@/data/events";

export type LivestreamPlayerProps = {
  /** Set by the YouTube live-status check. */
  isLive?: boolean;
  videoId?: string | null;
  title?: string | undefined;
};

export function LivestreamPlayer({
  isLive = false,
  videoId = null,
  title,
}: LivestreamPlayerProps) {
  const service = nextUpcomingService();
  // When the YouTube API gives us a real title, prefer it; otherwise mirror
  // the next event/service that the EventCountdown below is counting to.
  const displayTitle = title ?? service.title;
  const displayType = service.type;
  const target = service.target;

  // Human-readable start label, e.g. "Sunday, 10:00 AM" or "Wed, Sep 3 · 7:00 PM".
  const startLabel = formatStartLabel(target);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="relative aspect-video min-h-64 w-full bg-deep sm:min-h-0 sm:aspect-video">
        {isLive && videoId ? (
          <iframe
            className="size-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={displayTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0">
            <img
              src={PLACEHOLDER.worship}
              alt="Congregation worshipping during a service"
              className="size-full object-cover opacity-35"
              loading="lazy"
            />
            <div className="absolute inset-0 grid place-items-center p-6 text-center text-deep-foreground">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-deep-foreground/25 px-3 py-1 text-xs font-semibold uppercase">
                  <Radio className="size-3.5" aria-hidden="true" />
                  Offline
                </span>
                <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
                  We are not currently live
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-deep-foreground/75" suppressHydrationWarning>
                  {offlineCopy(target)}
                </p>
                <a
                  href="https://www.youtube.com/@fountainoflifechurchusa"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground sm:mt-5"
                >
                  <Play className="size-4" aria-hidden="true" />
                  Watch past services
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold">{displayTitle}</h3>
          <p className="text-sm text-muted-foreground">
            {displayType} · Fountain of Life Church USA · Indianapolis
          </p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground" suppressHydrationWarning>
          {isLive ? "Live now" : `Starts ${startLabel}`}
        </span>
      </div>
    </div>
  );
}

/** Format a service start like "Sunday, 10:00 AM" or "Wed, Sep 3 · 7:00 PM". */
function formatStartLabel(target: Date) {
  return `${target.toLocaleDateString(undefined, {
    weekday: "long",
  })}, ${target.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

/** Copy shown while offline. Reflects whichever event is next, not just Sunday. */
function offlineCopy(target: Date) {
  const dayWord = target.toLocaleDateString(undefined, { weekday: "long" });
  const time = target.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `Our next broadcast begins ${dayWord} at ${time}. The live YouTube player appears here automatically when the stream starts.`;
}
