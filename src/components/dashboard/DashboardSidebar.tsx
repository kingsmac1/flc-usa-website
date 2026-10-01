import {
  AtSign,
  BarChart3,
  BookOpen,
  CalendarCheck,
  CalendarRange,
  Coins,
  FileCode,
  FileText,
  GraduationCap,
  HeartHandshake,
  Home,
  Inbox,
  LocateFixed,
  LogOut,
  Mail,
  MessageCircle,
  Newspaper,
  Rss,
  Sparkles,
  Ticket,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SITE } from "@/data/site";
import { DASHBOARD_SECTIONS, type DashboardSection } from "./shared";

type NavItem = {
  label: string;
  id: DashboardSection;
  icon: LucideIcon;
  /** Optional badge shown next to the label (e.g. "Pastor only"). */
  hint?: string;
};

/**
 * Label/icon metadata per section id. `NAV_ITEMS` below is built by mapping
 * over `DASHBOARD_SECTIONS` so this list — not a separately hardcoded
 * array — stays the single source of truth for which tabs exist and in
 * what order.
 */
const NAV_META: Record<DashboardSection, { label: string; icon: LucideIcon; hint?: string }> = {
  overview: { label: "Overview", icon: Home },
  members: { label: "Members", icon: Users },
  viewers: { label: "Viewers", icon: Video },
  comments: { label: "Comments", icon: MessageCircle },
  accounts: { label: "Accounts", icon: BarChart3 },
  attendance: { label: "Attendance", icon: CalendarCheck },
  reports: { label: "Reports", icon: FileText },
  offerings: { label: "Offerings", icon: Coins, hint: "Pastor" },
  messaging: { label: "Messaging", icon: Mail },
  "email-templates": { label: "Email Templates", icon: FileCode },
  "owner-email": { label: "Owner Email", icon: AtSign, hint: "Pastor" },
  "checkin-location": { label: "Check-in Location", icon: LocateFixed, hint: "Pastor" },
  contact: { label: "Contact", icon: Inbox },
  prayer: { label: "Prayer Requests", icon: HeartHandshake },
  "event-interest": { label: "Event Interest", icon: Ticket },
  salvation: { label: "Salvation", icon: Sparkles },
  newsletter: { label: "Newsletter", icon: Rss },
  books: { label: "Books", icon: BookOpen },
  events: { label: "Events", icon: CalendarRange },
  teachings: { label: "Teachings", icon: GraduationCap },
  blog: { label: "Blog", icon: Newspaper },
};

const NAV_ITEMS: NavItem[] = DASHBOARD_SECTIONS.map((id) => ({ id, ...NAV_META[id] }));

/**
 * Collapsed icon rail with a separate expanded sub-section for the brand
 * and the user/sign-out area. Keeps the chrome low — the dashboard is the
 * star, the rail is just navigation.
 */
export function DashboardSidebar({
  isPastor,
  signOut,
  activeSection,
}: {
  isPastor: boolean;
  signOut: () => void;
  activeSection: DashboardSection;
}) {
  const visibleItems = NAV_ITEMS.filter((item) => !(item.hint === "Pastor" && !isPastor));

  return (
    <aside
      className="sticky top-0 z-30 hidden h-screen w-20 shrink-0 flex-col items-center border-r border-deep-foreground/10 bg-deep py-5 text-deep-foreground lg:flex"
      aria-label="Dashboard navigation"
    >
      {/* Brand mark */}
      <Link
        to="/"
        className="mb-8 grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-accent/20"
        aria-label={`${SITE.name} home`}
        title={`${SITE.name}`}
      >
        <span className="font-display text-lg font-black">F</span>
      </Link>

      {/* Primary nav — scrolls once the tab list outgrows the viewport. */}
      <nav className="flex min-h-0 flex-1 flex-col items-center gap-1.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <Link
              key={item.id}
              to="/dashboard"
              search={{ section: item.id }}
              className={
                "group relative grid size-12 shrink-0 place-items-center rounded-2xl transition-colors " +
                (isActive
                  ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                  : "text-deep-foreground/70 hover:bg-deep-foreground/10 hover:text-deep-foreground")
              }
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
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
        className="mt-4 grid size-12 shrink-0 place-items-center rounded-2xl text-deep-foreground/70 transition-colors hover:bg-deep-foreground/10 hover:text-deep-foreground"
        aria-label="Sign out"
        title="Sign out"
      >
        <LogOut className="size-5" aria-hidden="true" />
      </button>
    </aside>
  );
}
