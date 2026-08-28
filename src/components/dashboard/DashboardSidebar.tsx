import {
  BarChart3,
  Calendar,
  Coins,
  FileText,
  Home,
  LogOut,
  MessageCircle,
  Users,
  Video,
} from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { type LucideIcon } from "lucide-react";
import { SITE } from "@/data/site";

type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  /** Optional badge shown next to the label (e.g. "Pastor only"). */
  hint?: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", to: "/dashboard", icon: Home },
  { label: "Members", to: "/dashboard#members", icon: Users },
  { label: "Viewers", to: "/dashboard#viewers", icon: Video },
  { label: "Comments", to: "/dashboard#comments", icon: MessageCircle },
  { label: "Accounts", to: "/dashboard#accounts", icon: BarChart3 },
  { label: "Reports", to: "/dashboard#reports", icon: FileText },
  { label: "Offerings", to: "/dashboard#offerings", icon: Coins, hint: "Pastor" },
];

/**
 * Collapsed icon rail with a separate expanded sub-section for the brand
 * and the user/sign-out area. Keeps the chrome low — the dashboard is the
 * star, the rail is just navigation.
 */
export function DashboardSidebar({
  isPastor,
  signOut,
}: {
  isPastor: boolean;
  signOut: () => void;
}) {
  // We use the location to highlight the active section. Hash-based anchors
  // give the same UX as the reference's "click to scroll" nav.
  const location = useLocation();
  const currentHash = location.hash ?? "";
  const currentPath = location.pathname;

  return (
    <aside
      className="sticky top-0 z-30 hidden h-screen w-20 shrink-0 flex-col items-center border-r border-deep-foreground/10 bg-deep py-5 text-deep-foreground lg:flex"
      aria-label="Dashboard navigation"
    >
      {/* Brand mark */}
      <Link
        to="/"
        className="mb-8 grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-accent/20"
        aria-label={`${SITE.name} home`}
        title={`${SITE.name}`}
      >
        <span className="font-display text-lg font-black">F</span>
      </Link>

      {/* Primary nav */}
      <nav className="flex flex-1 flex-col items-center gap-1.5">
        {NAV_ITEMS.map((item) => {
          // Hide pastor-only items for non-pastors.
          if (item.hint === "Pastor" && !isPastor) return null;
          const target = item.to;
          const isActive =
            target === currentPath && (currentHash === "" || currentHash === target);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={
                "group relative grid size-12 place-items-center rounded-2xl transition-colors " +
                (isActive
                  ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                  : "text-deep-foreground/70 hover:bg-deep-foreground/10 hover:text-deep-foreground")
              }
              aria-label={item.label}
              title={item.label}
            >
              <item.icon className="size-5" aria-hidden="true" />
              <span className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-xl border border-deep-foreground/20 bg-deep px-3 py-1.5 text-xs font-semibold text-deep-foreground opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                {item.label}
                {item.hint ? ` · ${item.hint}` : ""}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <button
        type="button"
        onClick={signOut}
        className="mt-4 grid size-12 place-items-center rounded-2xl text-deep-foreground/70 transition-colors hover:bg-deep-foreground/10 hover:text-deep-foreground"
        aria-label="Sign out"
        title="Sign out"
      >
        <LogOut className="size-5" aria-hidden="true" />
      </button>
    </aside>
  );
}
