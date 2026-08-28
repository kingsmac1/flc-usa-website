import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import {
  MembersSection,
  ViewersSection,
  CommentsSection,
  AccountsSection,
  ServiceReportsSection,
  OfferingsSection,
} from "./sections";
import {
  QUERY_KEYS,
  sevenDaysAgoIso,
  todayIso,
} from "./shared";
import {
  type MemberRow,
  type ViewerRow,
  type ViewerSummary,
  type CommentRow,
  type AccountRow,
  type ReportRow,
  type OfferingRow,
} from "./types";
import { StatCard } from "./Primitives";

export function DashboardBody() {
  const { user, isPastor } = useAuth();
  const queryClient = useQueryClient();

  // Service reports state
  const [reportTitle, setReportTitle] = useState("");
  const [reportDate, setReportDate] = useState(todayIso());
  const [reportNotes, setReportNotes] = useState("");
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportUploading, setReportUploading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Offerings state
  const [offerFrom, setOfferFrom] = useState(() => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [offerTo, setOfferTo] = useState(todayIso());
  const [offerDate, setOfferDate] = useState(todayIso());
  const [offerAmount, setOfferAmount] = useState("");
  const [offerCategory, setOfferCategory] = useState("");
  const [offerNotes, setOfferNotes] = useState("");
  const [offerSubmitting, setOfferSubmitting] = useState(false);
  const [offerError, setOfferError] = useState<string | null>(null);
  const [offerSuccess, setOfferSuccess] = useState(false);

  // -- Queries -------------------------------------------------------------
  // Each query is independent so a single failure doesn't block the rest.

  const stats = useQuery({
    queryKey: QUERY_KEYS.stats,
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const since = sevenDaysAgoIso();
      const [members, profiles, comments, views] = await Promise.all([
        supabase.from("members").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("comments").select("id", { count: "exact", head: true }),
        supabase.from("livestream_views").select("id", { count: "exact", head: true }).gte("viewed_at", since),
      ]);
      const firstError = members.error || profiles.error || comments.error || views.error;
      if (firstError) throw new Error(firstError.message);
      return {
        members: members.count ?? 0,
        profiles: profiles.count ?? 0,
        comments: comments.count ?? 0,
        viewsLast7: views.count ?? 0,
      };
    },
  });

  const membersQuery = useQuery({
    queryKey: QUERY_KEYS.members,
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("id, full_name, email, phone, visitor_status, ministry_interests, created_at")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw new Error(error.message);
      return (data ?? []) as MemberRow[];
    },
  });

  const viewersQuery = useQuery({
    queryKey: QUERY_KEYS.views,
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("livestream_views")
        .select("id, viewer_id, viewed_at, profiles!livestream_views_viewer_id_fkey(full_name, email)")
        .order("viewed_at", { ascending: false })
        .limit(1000);
      if (error) throw new Error(error.message);
      const rows = ((data ?? []) as unknown as ViewerRow[]);
      const map = new Map<string, ViewerSummary>();
      for (const r of rows) {
        const existing = map.get(r.viewer_id);
        if (existing) {
          existing.totalViews += 1;
        } else {
          map.set(r.viewer_id, {
            viewer_id: r.viewer_id,
            full_name: r.profiles?.full_name ?? null,
            email: r.profiles?.email ?? null,
            totalViews: 1,
            lastViewedAt: r.viewed_at,
          });
        }
      }
      return [...map.values()].sort(
        (a, b) => new Date(b.lastViewedAt).getTime() - new Date(a.lastViewedAt).getTime()
      );
    },
  });

  const commentsQuery = useQuery({
    queryKey: QUERY_KEYS.comments,
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("id, author_id, content_type, content_id, body, created_at, profiles(full_name, email)")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as CommentRow[];
    },
  });

  const accountsQuery = useQuery({
    queryKey: QUERY_KEYS.accounts,
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, created_at, is_admin, role")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw new Error(error.message);
      return (data ?? []) as AccountRow[];
    },
  });

  const reportsQuery = useQuery({
    queryKey: QUERY_KEYS.reports,
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_reports")
        .select("id, title, service_date, file_path, notes, uploaded_by, created_at, profiles!service_reports_uploaded_by_fkey(full_name)")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as ReportRow[];
    },
  });

  // Offerings is gated by isPastor at the query level too — a non-pastor
  // never triggers a fetch even if a parent were ever to render this hook.
  const offeringsQuery = useQuery({
    queryKey: [...QUERY_KEYS.offerings, offerFrom, offerTo],
    enabled: isSupabaseConfigured && isPastor,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offerings")
        .select("id, service_date, amount, category, notes, recorded_by, created_at, profiles!offerings_recorded_by_fkey(full_name)")
        .gte("service_date", offerFrom)
        .lte("service_date", offerTo)
        .order("service_date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as OfferingRow[];
    },
  });

  // -- Handlers ------------------------------------------------------------

  const handleDeleteComment = async (id: string) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete comment:", error.message);
      return;
    }
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
  };

  const handleUploadReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportError(null);
    setReportSuccess(false);
    if (!reportFile) {
      setReportError("Please choose a file to upload.");
      return;
    }
    if (!isSupabaseConfigured || !user) return;

    setReportUploading(true);
    const safeName = reportFile.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
    const path = `${reportDate}-${Date.now()}-${safeName}`;

    const upload = await supabase.storage
      .from("service-reports")
      .upload(path, reportFile, { upsert: false });
    if (upload.error) {
      setReportUploading(false);
      setReportError(upload.error.message);
      return;
    }

    const { error: insertError } = await supabase.from("service_reports").insert({
      title: reportTitle.trim(),
      service_date: reportDate,
      file_path: path,
      notes: reportNotes.trim() || null,
      uploaded_by: user.id,
    });
    setReportUploading(false);

    if (insertError) {
      // Best-effort cleanup of the dangling file.
      await supabase.storage.from("service-reports").remove([path]);
      setReportError(insertError.message);
      return;
    }

    setReportTitle("");
    setReportDate(todayIso());
    setReportNotes("");
    setReportFile(null);
    setReportSuccess(true);
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports });
  };

  const handleDownloadReport = async (filePath: string) => {
    if (!isSupabaseConfigured) return;
    // 60-second signed URL — short-lived, no permanent public link.
    const { data, error } = await supabase.storage
      .from("service-reports")
      .createSignedUrl(filePath, 60);
    if (error) {
      console.error("Failed to create signed URL:", error.message);
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const handleAddOffering = async (e: React.FormEvent) => {
    e.preventDefault();
    setOfferError(null);
    setOfferSuccess(false);

    const amt = Number(offerAmount);
    if (!Number.isFinite(amt) || amt <= 0) {
      setOfferError("Amount must be a positive number.");
      return;
    }
    if (!isSupabaseConfigured || !user) return;
    setOfferSubmitting(true);
    const { error } = await supabase.from("offerings").insert({
      service_date: offerDate,
      amount: amt,
      category: offerCategory || null,
      notes: offerNotes.trim() || null,
      recorded_by: user.id,
    });
    setOfferSubmitting(false);
    if (error) {
      setOfferError(error.message);
      return;
    }
    setOfferAmount("");
    setOfferCategory("");
    setOfferNotes("");
    setOfferSuccess(true);
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.offerings });
  };

  const todayTotal = useMemo(() => {
    if (!offeringsQuery.data) return 0;
    return offeringsQuery.data
      .filter((r) => r.service_date === todayIso())
      .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  }, [offeringsQuery.data]);

  const rangeTotal = useMemo(() => {
    if (!offeringsQuery.data) return 0;
    return offeringsQuery.data
      .filter((r) => r.service_date >= offerFrom && r.service_date <= offerTo)
      .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  }, [offeringsQuery.data, offerFrom, offerTo]);

  const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");

  return (
    <>
      {/* 1. Overview / stats */}
      <section aria-labelledby="stats-heading">
        <h2
          id="stats-heading"
          className="mb-4 font-display text-sm font-bold tracking-wide uppercase text-accent"
        >
          1 · Overview
        </h2>
        {stats.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-3xl border border-border bg-secondary"
              />
            ))}
          </div>
        ) : stats.isError ? (
          <p role="alert" className="rounded-2xl border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-destructive">
            {errMsg(stats.error)}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total members" value={stats.data?.members ?? 0} tone="light" />
            <StatCard label="Registered accounts" value={stats.data?.profiles ?? 0} tone="accent" />
            <StatCard label="Total comments" value={stats.data?.comments ?? 0} tone="light" />
            <StatCard label="Livestream views (7d)" value={stats.data?.viewsLast7 ?? 0} tone="deep" />
          </div>
        )}
      </section>

      {/* 2. Members */}
      <section aria-labelledby="members-heading">
        <h2 id="members-heading" className="mb-4 font-display text-sm font-bold tracking-wide uppercase text-accent">
          2 · Members
        </h2>
        <div className="rounded-3xl border border-border bg-card p-6">
          <MembersSection
            rows={membersQuery.data ?? []}
            isLoading={membersQuery.isLoading}
            isError={membersQuery.isError}
            error={errMsg(membersQuery.error)}
          />
        </div>
      </section>

      {/* 3. Livestream Viewers */}
      <section aria-labelledby="viewers-heading">
        <h2 id="viewers-heading" className="mb-4 font-display text-sm font-bold tracking-wide uppercase text-accent">
          3 · Livestream viewers
        </h2>
        <div className="rounded-3xl border border-border bg-card p-6">
          <ViewersSection
            rows={viewersQuery.data ?? []}
            isLoading={viewersQuery.isLoading}
            isError={viewersQuery.isError}
            error={errMsg(viewersQuery.error)}
          />
        </div>
      </section>

      {/* 4. Comments */}
      <section aria-labelledby="comments-heading">
        <h2 id="comments-heading" className="mb-4 font-display text-sm font-bold tracking-wide uppercase text-accent">
          4 · Comments
        </h2>
        <div className="rounded-3xl border border-border bg-card p-6">
          <CommentsSection
            rows={commentsQuery.data ?? []}
            isLoading={commentsQuery.isLoading}
            isError={commentsQuery.isError}
            error={errMsg(commentsQuery.error)}
            onDelete={handleDeleteComment}
          />
        </div>
      </section>

      {/* 5. Registered Accounts */}
      <section aria-labelledby="accounts-heading">
        <h2 id="accounts-heading" className="mb-4 font-display text-sm font-bold tracking-wide uppercase text-accent">
          5 · Registered accounts
        </h2>
        <div className="rounded-3xl border border-border bg-card p-6">
          <AccountsSection
            rows={accountsQuery.data ?? []}
            isLoading={accountsQuery.isLoading}
            isError={accountsQuery.isError}
            error={errMsg(accountsQuery.error)}
          />
        </div>
      </section>

      {/* 6. Service Reports (any admin) */}
      <section aria-labelledby="reports-heading">
        <h2 id="reports-heading" className="mb-4 font-display text-sm font-bold tracking-wide uppercase text-accent">
          6 · Service reports
        </h2>
        <div className="rounded-3xl border border-border bg-card p-6">
          <ServiceReportsSection
            rows={reportsQuery.data ?? []}
            isLoading={reportsQuery.isLoading}
            isError={reportsQuery.isError}
            error={errMsg(reportsQuery.error)}
            title={reportTitle}
            setTitle={setReportTitle}
            date={reportDate}
            setDate={setReportDate}
            notes={reportNotes}
            setNotes={setReportNotes}
            file={reportFile}
            setFile={setReportFile}
            uploading={reportUploading}
            uploadError={reportError}
            uploadSuccess={reportSuccess}
            onSubmit={handleUploadReport}
            onDownload={handleDownloadReport}
          />
        </div>
      </section>

      {/* 7. Offerings — pastor only. The render and the query are both gated
          on isPastor, so a non-pastor admin never sees this section or any
          of the financial data behind it. */}
      {isPastor ? (
        <section aria-labelledby="offerings-heading">
          <h2 id="offerings-heading" className="mb-4 font-display text-sm font-bold tracking-wide uppercase text-accent">
            7 · Offerings
          </h2>
          <div className="rounded-3xl border border-border bg-card p-6">
            <OfferingsSection
              rows={offeringsQuery.data ?? []}
              isLoading={offeringsQuery.isLoading}
              isError={offeringsQuery.isError}
              error={errMsg(offeringsQuery.error)}
              todayTotal={todayTotal}
              rangeTotal={rangeTotal}
              offerFrom={offerFrom}
              offerTo={offerTo}
              setOfferFrom={setOfferFrom}
              setOfferTo={setOfferTo}
              offerDate={offerDate}
              setOfferDate={setOfferDate}
              offerAmount={offerAmount}
              setOfferAmount={setOfferAmount}
              offerCategory={offerCategory}
              setOfferCategory={setOfferCategory}
              offerNotes={offerNotes}
              setOfferNotes={setOfferNotes}
              submitting={offerSubmitting}
              submitError={offerError}
              submitSuccess={offerSuccess}
              onSubmit={handleAddOffering}
            />
          </div>
        </section>
      ) : null}
    </>
  );
}
