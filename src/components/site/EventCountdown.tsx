import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { PillLink } from "./ui";
import { nextUpcomingService } from "@/data/events";

export type EventCountdownProps = {
  /** Target datetime for the upcoming service. */
  target: Date;
  title: string;
  type: string;
};

export const NEXT_SERVICE: EventCountdownProps = {
  get target() {
    return nextUpcomingService().target;
  },
  get title() {
    return nextUpcomingService().title;
  },
  get type() {
    return nextUpcomingService().type;
  },
};

function diff(target: Date) {
  const ms = target.getTime() - Date.now();
  if (ms <= 0) return null;
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

function useCountdown(target: Date) {
  const [remaining, setRemaining] = useState<ReturnType<typeof diff>>(null);
  const [mounted, setMounted] = useState(false);
  const time = target.getTime();

  useEffect(() => {
    setMounted(true);
    setRemaining(diff(new Date(time)));
    const id = window.setInterval(() => setRemaining(diff(new Date(time))), 1000);
    return () => window.clearInterval(id);
  }, [time]);

  return { remaining, mounted };
}

function units(remaining: NonNullable<ReturnType<typeof diff>>) {
  return [
    { label: "Days", value: remaining.days },
    { label: "Hours", value: remaining.hours },
    { label: "Minutes", value: remaining.minutes },
    { label: "Seconds", value: remaining.seconds },
  ];
}

/** Compact countdown used inside the hero. */
export function ServiceCountdownCard({ target, title }: { target: Date; title: string }) {
  const { remaining, mounted } = useCountdown(target);

  return (
    <div className="rounded-[2rem] border border-deep-foreground/15 bg-deep/80 p-6 backdrop-blur">
      <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-accent">
        <CalendarClock className="size-3.5" aria-hidden="true" />
        Next service starts in
      </p>
      <dl className="mt-4 grid grid-cols-4 gap-3 text-center">
        {(mounted && remaining ? units(remaining) : [
          { label: "Days", value: 0 },
          { label: "Hours", value: 0 },
          { label: "Minutes", value: 0 },
          { label: "Seconds", value: 0 },
        ]).map((u) => (
          <div key={u.label} className="rounded-2xl border border-deep-foreground/15 py-3">
            <dd className="font-display text-2xl font-black tabular-nums text-accent sm:text-3xl">
              {mounted && remaining ? String(u.value).padStart(2, "0") : "--"}
            </dd>
            <dt className="mt-1 text-[0.65rem] uppercase text-deep-foreground/70">{u.label}</dt>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-sm text-deep-foreground/75">
        {mounted && !remaining ? "We are live right now — join the service." : title}
      </p>
    </div>
  );
}

export function EventCountdown({ target, title, type }: EventCountdownProps) {
  const { remaining, mounted } = useCountdown(target);

  return (
    <section className="bg-deep py-16 text-deep-foreground sm:py-20">
      <div className="container-flc grid gap-10 rounded-[2rem] bg-deep-foreground/5 p-8 lg:grid-cols-[1.1fr_1fr] lg:items-center sm:p-12">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase text-accent-foreground">
            <CalendarClock className="size-3.5" aria-hidden="true" />
            {type}
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{title}</h2>
          <p className="mt-3 max-w-md text-sm text-deep-foreground/75" suppressHydrationWarning>
            {mounted
              ? `${target.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} at ${target.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} — `
              : "Every Sunday at 10:00 AM — "}
            join us in person in Indianapolis or online from anywhere.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <PillLink to="/livestream" variant="accent">
              Watch Live
            </PillLink>
            <PillLink to="/contact" variant="light">
              Plan a Visit
            </PillLink>
            <PillLink to="/events" variant="light">
              View all events
            </PillLink>
          </div>
        </div>

        <div>
          {!mounted ? (
            <p className="rounded-3xl border border-deep-foreground/20 p-6 text-sm text-deep-foreground/70">
              Loading service countdown…
            </p>
          ) : remaining ? (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {units(remaining).map((u) => (
                <li key={u.label} className="rounded-3xl border border-deep-foreground/20 bg-deep p-4 text-center">
                  <span className="block font-display text-3xl font-black tabular-nums text-accent">
                    {String(u.value).padStart(2, "0")}
                  </span>
                  <span className="mt-1 block text-xs uppercase text-deep-foreground/70">{u.label}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-3xl border border-accent/40 bg-accent/10 p-6 text-sm">
              We are gathering right now — the service is live. Join us online.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
