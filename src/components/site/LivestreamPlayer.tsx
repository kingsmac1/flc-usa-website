import { Play, Radio } from "lucide-react";
import { PLACEHOLDER } from "@/data/site";

export type LivestreamPlayerProps = {
  /** Set once the YouTube Data API integration lands in Phase 2. */
  isLive?: boolean;
  videoId?: string | null;
  title?: string;
};

export function LivestreamPlayer({
  isLive = false,
  videoId = null,
  title = "Sunday Celebration Service",
}: LivestreamPlayerProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="relative aspect-video w-full bg-deep">
        {isLive && videoId ? (
          <iframe
            className="size-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
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
                <p className="mx-auto mt-2 max-w-md text-sm text-deep-foreground/75">
                  Our next broadcast begins Sunday at 10:00 AM. The live YouTube player appears here
                  automatically when the stream starts.
                </p>
                <a
                  href="https://www.youtube.com/@fountainoflifechurchusa"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground"
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
        <div>
          <h3 className="font-display text-lg font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground">Fountain of Life Church USA · Indianapolis</p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
          {isLive ? "Live now" : "Starts Sunday, 10:00 AM"}
        </span>
      </div>
    </div>
  );
}