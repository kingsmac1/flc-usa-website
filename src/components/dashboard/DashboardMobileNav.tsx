import {
  AtSign,
  BarChart3,
  BookOpen,
  CalendarCheck,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
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
import { useEffect, useRef, useState } from "react";
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
 * DashboardSidebar is hidden. Scrolls horizontally, with left/right arrow
 * buttons that appear only when there's more to scroll to in that
 * direction — mirrors the same pattern DashboardSidebar uses vertically.
 */
export function DashboardMobileNav({
  isPastor,
  activeSection,
}: {
  isPastor: boolean;
  activeSection: DashboardSection;
}) {
  const visibleItems = NAV_ITEMS.filter((item) => !(item.hint === "Pastor" && !isPastor));
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const updateScrollState = () => {
      setCanScrollLeft(scrollElement.scrollLeft > 0);
      setCanScrollRight(
        scrollElement.scrollLeft + scrollElement.clientWidth < scrollElement.scrollWidth - 1,
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
    activeLinkRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeSection]);

  const scrollByPage = (direction: -1 | 1) => {
    scrollRef.current?.scrollBy({ left: direction * 180, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Dashboard navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-deep/95 pb-[env(safe-area-inset-bottom)] text-deep-foreground backdrop-blur lg:hidden"
    >
      <div className="relative px-8">
        {canScrollLeft ? (
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            className="absolute left-0 top-0 z-10 grid h-full w-8 place-items-center bg-deep text-deep-foreground shadow-[4px_0_10px_rgba(0,0,0,0.2)]"
            aria-label="Show earlier dashboard sections"
            title="Show earlier dashboard sections"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
        ) : null}
        <div
          ref={scrollRef}
          className="scrollbar-none flex min-w-0 snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        >
          {visibleItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <Link
                key={item.id}
                to="/dashboard"
                search={{ section: item.id }}
                className={
                  "flex min-h-12 w-20 shrink-0 snap-center flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold transition-colors " +
                  (isActive ? "text-accent" : "text-deep-foreground/70 hover:text-deep-foreground")
                }
                ref={isActive ? activeLinkRef : undefined}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="size-5" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
        {canScrollRight ? (
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            className="absolute right-0 top-0 z-10 grid h-full w-8 place-items-center bg-deep text-deep-foreground shadow-[-4px_0_10px_rgba(0,0,0,0.2)]"
            aria-label="Show more dashboard sections"
            title="Show more dashboard sections"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </nav>
  );
}
