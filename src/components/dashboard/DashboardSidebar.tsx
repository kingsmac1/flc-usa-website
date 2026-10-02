import {
  AtSign,
  BarChart3,
  BookOpen,
  CalendarCheck,
  CalendarRange,
  ChevronDown,
  ChevronUp,
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
import { useEffect, useRef, useState } from "react";
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
 * Labeled nav rail, fixed to the viewport. The item list scrolls vertically
 * once it outgrows the available height, with up/down arrow buttons that
 * appear only when there's more to scroll to in that direction — mirrors
 * the same pattern DashboardMobileNav uses horizontally on small screens.
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const updateScrollState = () => {
      setCanScrollUp(scrollElement.scrollTop > 0);
      setCanScrollDown(
        scrollElement.scrollTop + scrollElement.clientHeight < scrollElement.scrollHeight - 1,
      );
    };

    updateScrollState();
    scrollElement.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      scrollElement.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [isPastor]);

  useEffect(() => {
    activeLinkRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeSection]);

  const scrollByPage = (direction: -1 | 1) => {
    scrollRef.current?.scrollBy({ top: direction * 168, behavior: "smooth" });
  };

  return (
    <aside
      className="z-30 hidden h-full w-64 shrink-0 flex-col overflow-hidden border-r border-deep-foreground/10 bg-deep py-5 text-deep-foreground lg:flex"
      aria-label="Dashboard navigation"
    >
      {/* Brand mark */}
      <Link
        to="/"
        className="mx-5 mb-6 flex shrink-0 items-center gap-3"
        aria-label={`${SITE.name} home`}
        title={SITE.name}
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-accent/20">
          <span className="font-display text-lg font-black">F</span>
        </span>
        <span className="truncate font-display text-sm font-bold">{SITE.short}</span>
      </Link>

      <div className="relative flex min-h-0 w-full flex-1 flex-col">
        {canScrollUp && (
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            className="absolute top-0 z-10 grid h-6 w-full shrink-0 place-items-center bg-deep text-deep-foreground/70 shadow-[0_6px_10px_-2px_rgba(0,0,0,0.4)] transition-colors hover:text-deep-foreground"
            aria-label="Show earlier menu items"
          >
            <ChevronUp className="size-4" aria-hidden="true" />
          </button>
        )}

        {/* Primary nav — scrolls once the tab list outgrows the viewport. */}
        <nav
          ref={scrollRef}
          className="scrollbar-none flex w-full flex-1 flex-col gap-1 overflow-y-auto overscroll-y-contain px-3 py-1"
        >
          {visibleItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <Link
                key={item.id}
                to="/dashboard"
                search={{ section: item.id }}
                className={
                  "flex shrink-0 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors " +
                  (isActive
                    ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                    : "text-deep-foreground/70 hover:bg-deep-foreground/10 hover:text-deep-foreground")
                }
                ref={isActive ? activeLinkRef : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="size-5 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
                {item.hint && (
                  <span className="ml-auto shrink-0 text-[10px] font-semibold tracking-wide text-deep-foreground/50 uppercase">
                    {item.hint}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {canScrollDown && (
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            className="absolute bottom-0 z-10 grid h-6 w-full shrink-0 place-items-center bg-deep text-deep-foreground/70 shadow-[0_-6px_10px_-2px_rgba(0,0,0,0.4)] transition-colors hover:text-deep-foreground"
            aria-label="Show more menu items"
          >
            <ChevronDown className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Sign out */}
      <button
        type="button"
        onClick={signOut}
        className="mx-3 mt-4 flex shrink-0 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-deep-foreground/70 transition-colors hover:bg-deep-foreground/10 hover:text-deep-foreground"
      >
        <LogOut className="size-5 shrink-0" aria-hidden="true" />
        Sign out
      </button>
    </aside>
  );
}
