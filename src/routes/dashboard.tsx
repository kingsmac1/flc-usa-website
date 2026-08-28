import { Link, createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { PillButton, Section } from "@/components/site/ui";
import { DashboardBody } from "@/components/dashboard/DashboardBody";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
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
  const { user, loading, isAdmin, isPastor, signOut } = useAuth();
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
      queryClient.invalidateQueries({ queryKey: key });
    });
  };

  // Any query currently fetching? Used to spin the refresh button.
  const isRefreshing = queryClient.isFetching() > 0;

  const userName = (user.user_metadata?.["full_name"] as string | undefined) ?? user.email ?? "Signed in";
  const userRole = isPastor ? "Pastor" : "Admin";

  return (
    <div className="flex min-h-screen bg-cream">
      <DashboardSidebar
        isPastor={isPastor}
        signOut={() => void signOut()}
      />
      <div className="flex min-h-screen flex-1 flex-col">
        <DashboardTopbar
          userName={userName}
          userRole={userRole}
          userEmail={user.email ?? ""}
          isRefreshing={isRefreshing}
          onRefresh={invalidateAll}
          onSignOut={() => void signOut()}
        />
        <main className="flex-1 px-5 py-8 sm:px-8 lg:py-10">
          <DashboardBody />
        </main>
      </div>
    </div>
  );
}
