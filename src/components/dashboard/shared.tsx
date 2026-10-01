/**
 * Shared helpers and small UI primitives used by every section of the
 * admin dashboard. Kept here so section files stay focused on data
 * shaping, not the look-and-feel of an empty state or a stat card.
 */
import { FileText, Search } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

export const MINISTRY_OPTIONS: { value: string; label: string }[] = [
  { value: "ushers", label: "Ushering" },
  { value: "choir", label: "Choir / Worship" },
  { value: "media", label: "Media / Tech" },
  { value: "children", label: "Children's Ministry" },
  { value: "youth", label: "Youth" },
  { value: "outreach", label: "Outreach" },
  { value: "prayer_team", label: "Prayer Team" },
  { value: "hospitality", label: "Hospitality" },
  { value: "none_yet", label: "None yet — exploring" },
];

export const OFFERING_CATEGORIES = ["Tithe", "Offering", "Building Fund", "Other"] as const;

/**
 * Every top-level dashboard section, in sidebar order. This is the single
 * source of truth for which section ids are valid — the route's
 * `validateSearch`, the sidebar, and the mobile nav all read from it so a
 * bad/old `?section=` value in a URL always falls back to "overview"
 * instead of rendering nothing.
 *
 * flc's original 8 sections keep their existing relative order; the newer
 * sections are appended after them rather than interleaved.
 */
export const DASHBOARD_SECTIONS = [
  "overview",
  "members",
  "viewers",
  "comments",
  "accounts",
  "attendance",
  "reports",
  "offerings",
  "messaging",
  "email-templates",
  "owner-email",
  "checkin-location",
  "contact",
  "prayer",
  "event-interest",
  "salvation",
  "newsletter",
  "books",
  "events",
  "teachings",
  "blog",
] as const;

export type DashboardSection = (typeof DASHBOARD_SECTIONS)[number];

export const DEFAULT_DASHBOARD_SECTION: DashboardSection = "overview";

export const QUERY_KEYS = {
  stats: ["dashboard-stats"] as const,
  members: ["dashboard-members"] as const,
  views: ["dashboard-views"] as const,
  comments: ["dashboard-comments"] as const,
  accounts: ["dashboard-accounts"] as const,
  reports: ["dashboard-reports"] as const,
  offerings: ["dashboard-offerings"] as const,
  checkins: ["dashboard-checkins"] as const,
  campaigns: ["dashboard-campaigns"] as const,
  emailTemplates: ["dashboard-email-templates"] as const,
  emailSettings: ["dashboard-email-settings"] as const,
  checkinLocation: ["dashboard-checkin-location"] as const,
  contactMessages: ["dashboard-contact-messages"] as const,
  prayerRequests: ["dashboard-prayer-requests"] as const,
  eventInterest: ["dashboard-event-interest"] as const,
  salvationDecisions: ["dashboard-salvation-decisions"] as const,
  newsletterSubscribers: ["dashboard-newsletter-subscribers"] as const,
  cmsBooks: ["dashboard-cms-books"] as const,
  cmsEvents: ["dashboard-cms-events"] as const,
  cmsTeachings: ["dashboard-cms-teachings"] as const,
  cmsBlogPosts: ["dashboard-cms-blog-posts"] as const,
};

export function nowIso() {
  return new Date().toISOString();
}

export function sevenDaysAgoIso() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 7);
  return d.toISOString();
}

export function todayIso() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

/** Converts an ISO datetime into the local `YYYY-MM-DDTHH:mm` shape a `<input type="datetime-local">` expects. */
export function toDatetimeLocal(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
