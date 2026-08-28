import { Link, createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, RefreshCw, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { PillButton, Section, SectionHeading } from "@/components/site/ui";
import { DashboardBody } from "@/components/dashboard/DashboardBody";
import { QUERY_KEYS } from "@/components/dashboard/shared";

const title = "Dashboard | Fountain of Life Church USA";
const description = "Internal admin dashboard for Fountain of Life Church USA staff.";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/dashboard" },
    ],
    links: [{ rel: "canonical", href: "/dashboard" }],
  }),
  component: DashboardPage,
});

export function DashboardPage() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const queryClient = useQueryClient();

  if (loading || !isSupabaseConfigured) {
    return (
      <Section tone="cream" className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="size-8 animate-spin text-accent" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            {loading ? "Checking your access…" : "Supabase is not configured."}
          </p>
        </div>
      </Section>
    );
  }

  if (!user || !isAdmin) {
    return (
      <Section tone="cream" className="flex min-h-[60vh] items-center justify-center">
        <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-10 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full border border-destructive/40 bg-destructive/10 text-destructive">
            <Lock className="size-7" aria-hidden="true" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-bold">You don't have access to this page</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The dashboard is for church staff only. If you believe you should have access, ask
            an administrator to update your role in Supabase.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-primary/30 bg-transparent px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
            >
              Back to the site
            </Link>
            <PillButton type="button" variant="primary" onClick={() => void signOut()}>
              Sign out
            </PillButton>
          </div>
        </div>
      </Section>
    );
  }

  const invalidateAll = () => {
    Object.values(QUERY_KEYS).forEach((key) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.offerings[0]] });
      queryClient.invalidateQueries({ queryKey: key });
    });
  };

  return (
    <>
      <Section tone="deep">
        <SectionHeading
          tone="light"
          eyebrow="Admin"
          title="Dashboard"
          intro="Internal overview of the church family. Only visible to signed-in staff."
        />
      </Section>

      <Section tone="cream">
        <div className="space-y-8">
          {/* Top bar: user context + refresh */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-accent/15 text-accent">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">
                  {user.user_metadata?.["full_name"] ?? user.email ?? "Signed in"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PillButton type="button" variant="outline" onClick={invalidateAll}>
                <RefreshCw className="size-4" aria-hidden="true" />
                Refresh
              </PillButton>
              <PillButton type="button" variant="primary" onClick={() => void signOut()}>
                Sign out
              </PillButton>
            </div>
          </div>

          <DashboardBody />
        </div>
      </Section>
    </>
  );
}
