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
import { DASHBOARD_SECTIONS, type DashboardSection } from "./shared";

type NavItem = {
  label: string;
  id: DashboardSection;
  icon: LucideIcon;
  /** Optional badge shown next to the label (e.g. "Pastor only"). */
  hint?: string;
};

/**
 * Label/icon metadata per section id — kept in step with
 * DashboardSidebar's NAV_META so the mobile bar and the desktop rail always
 * agree on labels/icons/pastor-only hints for every tab.
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
 * Bottom-of-screen icon tab bar shown on small viewports where the
 * DashboardSidebar is hidden. Scrolls horizontally — with 21 sections now
 * on the dashboard, a fixed 5-up grid would leave most of them unreachable
 * on mobile, so every tab after the first 5 slides into view on swipe
 * instead of being dropped.
 */
export function DashboardMobileNav({
  isPastor,
  activeSection,
}: {
  isPastor: boolean;
  activeSection: DashboardSection;
}) {
  const visibleItems = NAV_ITEMS.filter((item) => !(item.hint === "Pastor" && !isPastor));

  return (
    <nav
      aria-label="Dashboard navigation"
      className="fixed inset-x-0 bottom-0 z-30 flex overflow-x-auto border-t border-border bg-deep/95 px-2 pb-[env(safe-area-inset-bottom)] text-deep-foreground backdrop-blur lg:hidden"
    >
      {visibleItems.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <Link
            key={item.id}
            to="/dashboard"
            search={{ section: item.id }}
            className={
              "flex min-h-12 w-20 shrink-0 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold transition-colors " +
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
