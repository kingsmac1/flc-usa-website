import { Bell, Loader2, Mail, RefreshCw, Search } from "lucide-react";
import { PillButton } from "@/components/site/ui";

type Props = {
  userName: string;
  userRole: string;
  userEmail: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  onSignOut: () => void;
};

export function DashboardTopbar({
  userName,
  userRole,
  userEmail,
  isRefreshing,
  onRefresh,
  onSignOut,
}: Props) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-card/90 px-5 py-4 backdrop-blur sm:px-8">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search members, reports, comments…"
          className="min-h-10 w-full rounded-2xl border border-border bg-secondary pl-9 pr-3 text-sm focus-visible:outline-2 focus-visible:outline-accent"
        />
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="Messages"
          className="hidden sm:grid size-10 place-items-center rounded-2xl border border-border bg-card text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
        >
          <Mail className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="hidden sm:grid size-10 place-items-center rounded-2xl border border-border bg-card text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
        >
          <Bell className="size-4" aria-hidden="true" />
        </button>
        <PillButton
          type="button"
          variant="outline"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="size-4" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">Refresh</span>
        </PillButton>

        {/* User chip */}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-1.5">
          <div className="grid size-8 place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
            {initialsFor(userName)}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold leading-tight">{userName}</p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {userRole}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="hidden lg:inline text-xs font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Sign out
        </button>
        <p className="hidden xl:block text-[10px] text-muted-foreground">{userEmail}</p>
      </div>
    </header>
  );
}

function initialsFor(name: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}
