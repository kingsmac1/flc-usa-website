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

export const QUERY_KEYS = {
  stats: ["dashboard-stats"] as const,
  members: ["dashboard-members"] as const,
  views: ["dashboard-views"] as const,
  comments: ["dashboard-comments"] as const,
  accounts: ["dashboard-accounts"] as const,
  reports: ["dashboard-reports"] as const,
  offerings: ["dashboard-offerings"] as const,
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
