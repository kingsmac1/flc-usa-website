import {
  BarChart3,
  Coins,
  FileText,
  Home,
  MessageCircle,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

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
 * Bottom-of-screen icon tab bar shown on small viewports where the
 * DashboardSidebar is hidden. Each tab is the same hash-anchored
 * dashboard route the desktop rail uses.
 */
export function DashboardMobileNav({ isPastor }: { isPastor: boolean }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const currentHash = location.hash ?? "";

  return (
    <nav
      aria-label="Dashboard navigation"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-deep/95 px-2 pb-[env(safe-area-inset-bottom)] text-deep-foreground backdrop-blur lg:hidden"
    >
      {NAV_ITEMS.filter((i) => !(i.hint === "Pastor" && !isPastor))
        .slice(0, 5)
        .map((item) => {
          const isActive = item.to === currentPath && (currentHash === "" || currentHash === item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={
                "flex min-h-12 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold transition-colors " +
                (isActive ? "text-accent" : "text-deep-foreground/70 hover:text-deep-foreground")
              }
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="size-5" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
    </nav>
  );
}
