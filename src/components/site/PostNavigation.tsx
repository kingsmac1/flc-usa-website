import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type NavItem = {
  slug: string;
  title: string;
  date: string;
};

type PostNavigationProps = {
  prev?: NavItem | undefined;
  next?: NavItem | undefined;
  route: string;
};

export function PostNavigation({ prev, next, route }: PostNavigationProps) {
  if (!prev && !next) return null;

  const paramKey = route.includes("$series") ? "series" : "slug";

  return (
    <nav aria-label="Post navigation" className="mt-6 grid gap-3 sm:grid-cols-2">
      {prev ? (
        <Link
          to={route}
          params={{ [paramKey]: prev.slug }}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="size-5 shrink-0 text-primary" aria-hidden="true" />
          <span className="min-w-0">
            <span className="block text-xs font-semibold tracking-wide uppercase text-muted-foreground">
              Previous · {formatShortDate(prev.date)}
            </span>
            <span className="mt-1 block truncate font-display text-base font-bold">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          to={route}
          params={{ [paramKey]: next.slug }}
          className="flex items-center justify-end gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-right transition-colors hover:bg-secondary"
        >
          <span className="min-w-0">
            <span className="block text-xs font-semibold tracking-wide uppercase text-muted-foreground">
              Next · {formatShortDate(next.date)}
            </span>
            <span className="mt-1 block truncate font-display text-base font-bold">{next.title}</span>
          </span>
          <ArrowRight className="size-5 shrink-0 text-primary" aria-hidden="true" />
        </Link>
      ) : null}
    </nav>
  );
}

function formatShortDate(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
