import { ArrowUpRight, Eye, MessageCircle, TrendingUp, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Badge } from "./Primitives";
import { ErrorBanner, Td } from "./Table";
import type {
  AccountRow,
  CommentRow,
  MemberRow,
  ReportRow,
  ViewerSummary,
} from "./types";

export type OverviewCounts = {
  members: number;
  profiles: number;
  comments: number;
  viewsLast7: number;
  reports: number;
  offeringsTotal: number;
};

type Props = {
  isLoading: boolean;
  isError: boolean;
  error: string;
  counts: OverviewCounts | undefined;
  members: MemberRow[];
  comments: CommentRow[];
  reports: ReportRow[];
  accounts: AccountRow[];
  viewers: ViewerSummary[];
};

export function OverviewSection({
  isLoading,
  isError,
  error,
  counts,
  members,
  comments,
  reports,
  accounts,
  viewers,
}: Props) {
  if (isError) {
    return <ErrorBanner message={error} />;
  }
  if (isLoading || !counts) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-3xl border border-border bg-secondary" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-72 animate-pulse rounded-3xl border border-border bg-secondary" />
          <div className="h-72 animate-pulse rounded-3xl border border-border bg-secondary" />
        </div>
      </div>
    );
  }

  // Sum total recorded attendance from service reports.
  const totalAttendance = reports.reduce(
    (sum, r) =>
      sum + (r.attendance_adults ?? 0) + (r.attendance_children ?? 0),
    0
  );

  const staffCount = accounts.filter(
    (a) => a.role === "admin" || a.role === "pastor"
  ).length;

  return (
    <div className="space-y-6">
      {/* Top stat row — one accent tile plus three lighter tiles, like the reference. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative overflow-hidden rounded-3xl border border-primary/40 bg-deep p-5 text-deep-foreground">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wide uppercase text-deep-foreground/70">
              Members
            </p>
            <Users className="size-4 text-gold" aria-hidden="true" />
          </div>
          <p className="mt-2 font-display text-4xl font-black">{counts.members}</p>
          <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gold">
            <TrendingUp className="size-3" aria-hidden="true" />
            All-time signups
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
              Views (7d)
            </p>
            <Eye className="size-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <p className="mt-2 font-display text-3xl font-black">{counts.viewsLast7}</p>
          <p className="mt-1 text-xs text-muted-foreground">Livestream views this week</p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
              Comments
            </p>
            <MessageCircle className="size-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <p className="mt-2 font-display text-3xl font-black">{counts.comments}</p>
          <p className="mt-1 text-xs text-muted-foreground">Total across all surfaces</p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
              Reports
            </p>
            <span className="text-xs font-semibold text-muted-foreground">uploaded</span>
          </div>
          <p className="mt-2 font-display text-3xl font-black">{counts.reports}</p>
          <p className="mt-1 text-xs text-muted-foreground">Service reports on file</p>
        </div>
      </div>

      {/* Secondary row: attendance total + accounts + viewers with quick links */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-primary/25 bg-deep p-5 text-deep-foreground">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wide uppercase text-deep-foreground/70">
              Total recorded attendance
            </p>
            <Eye className="size-4 text-deep-foreground/60" aria-hidden="true" />
          </div>
          <p className="mt-2 font-display text-3xl font-black">{totalAttendance}</p>
          <p className="mt-1 text-xs text-deep-foreground/60">
            Across {reports.length} service {reports.length === 1 ? "report" : "reports"}
          </p>
          <Link
            to="/dashboard"
            hash="reports"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
          >
            View reports
            <ArrowUpRight className="size-3" aria-hidden="true" />
          </Link>
        </div>
        <div className="rounded-3xl border border-primary/25 bg-deep p-5 text-deep-foreground">
          <p className="text-xs font-semibold tracking-wide uppercase text-deep-foreground/70">
            Registered accounts
          </p>
          <p className="mt-2 font-display text-3xl font-black">{counts.profiles}</p>
          <p className="mt-1 text-xs text-deep-foreground/60">
            {staffCount} staff · {Math.max(0, counts.profiles - staffCount)} members
          </p>
          <Link
            to="/dashboard"
            hash="accounts"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
          >
            View accounts
            <ArrowUpRight className="size-3" aria-hidden="true" />
          </Link>
        </div>
        <div className="rounded-3xl border border-primary/25 bg-deep p-5 text-deep-foreground">
          <p className="text-xs font-semibold tracking-wide uppercase text-deep-foreground/70">
            Active livestream viewers
          </p>
          <p className="mt-2 font-display text-3xl font-black">{viewers.length}</p>
          <p className="mt-1 text-xs text-deep-foreground/60">
            Unique people who watched in the last 7 days
          </p>
          <Link
            to="/dashboard"
            hash="viewers"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
          >
            View viewers
            <ArrowUpRight className="size-3" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Two-column row: latest members + recent comments */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold tracking-wide uppercase text-foreground">
              Latest members
            </h3>
            <Link
              to="/dashboard"
              hash="members"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View all
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {members.length === 0 ? (
              <p className="text-sm text-muted-foreground">No members yet.</p>
            ) : (
              members.slice(0, 5).map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 px-3 py-2.5">
                  <div className="grid size-9 shrink-0 place-items-center rounded-full bg-accent/15 text-xs font-bold text-accent-foreground">
                    {initialsFor(m.full_name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{m.full_name || "—"}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {m.email || "—"}
                    </p>
                  </div>
                  {m.visitor_status ? (
                    <Badge tone="light">{m.visitor_status.replace("_", " ")}</Badge>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold tracking-wide uppercase text-foreground">
              Recent comments
            </h3>
            <Link
              to="/dashboard"
              hash="comments"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View all
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            ) : (
              comments.slice(0, 5).map((c) => (
                <div key={c.id} className="rounded-2xl border border-border bg-secondary/40 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold">
                      {c.profiles?.full_name || "Anonymous"}
                    </p>
                    <Badge tone="light">{c.content_type}</Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-foreground/80">{c.body}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent service reports ticker */}
      <div className="rounded-3xl border border-primary/25 bg-deep p-5 text-deep-foreground">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold tracking-wide uppercase text-deep-foreground">
            Recent service reports
          </h3>
          <Link
            to="/dashboard"
            hash="reports"
            className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
          >
            View all
            <ArrowUpRight className="size-3" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-4">
          {reports.length === 0 ? (
            <p className="text-sm text-deep-foreground/60">No reports yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-deep-foreground/15">
              <table className="min-w-full text-sm text-deep-foreground">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-deep-foreground/60">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-deep-foreground/60">
                      Service date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-deep-foreground/60">
                      Attendance
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-deep-foreground/60">
                      Uploaded by
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.slice(0, 5).map((r) => (
                    <tr key={r.id} className="border-t border-deep-foreground/15">
                      <Td>
                        <p className="font-semibold">{r.title}</p>
                      </Td>
                      <Td>
                        <p className="text-sm">
                          {r.service_date
                            ? new Date(r.service_date).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </p>
                      </Td>
                      <Td>
                        <p className="text-sm font-semibold">
                          {(r.attendance_adults ?? 0) + (r.attendance_children ?? 0)} total
                        </p>
                        <p className="text-[10px] uppercase tracking-wide text-deep-foreground/60">
                          {r.attendance_adults ?? 0} adults · {r.attendance_children ?? 0} children
                        </p>
                      </Td>
                      <Td>{r.profiles?.full_name || "—"}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function initialsFor(name: string | null | undefined) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}
