import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { isSupabaseConfigured, supabase, supabaseUrl } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import {
  MembersSection,
  ViewersSection,
  CommentsSection,
  AccountsSection,
  AttendanceSection,
  ServiceReportsSection,
  OfferingsSection,
  MessagingSection,
  EmailTemplatesSection,
  OwnerEmailSection,
  CheckinLocationSection,
  ContactMessagesSection,
  PrayerRequestsSection,
  EventInterestSection,
  SalvationDecisionsSection,
  NewsletterSection,
  OverviewSection,
  type OverviewCounts,
  BooksSection,
  EventsSection,
  TeachingsSection,
  BlogSection,
} from "./sections";
import {
  QUERY_KEYS,
  nowIso,
  sevenDaysAgoIso,
  todayIso,
  toDatetimeLocal,
  type DashboardSection,
} from "./shared";
import { EMPTY_MEMBER_FORM, type MemberFormValues } from "./MemberForm";
import { EMPTY_BOOK_FORM, type BookFormValues } from "./BooksSection";
import { EMPTY_EVENT_FORM, type EventFormValues } from "./EventsSection";
import {
  EMPTY_SERIES_FORM,
  EMPTY_TEACHING_ITEM_FORM,
  type SeriesFormValues,
  type TeachingItemFormValues,
} from "./TeachingsSection";
import { EMPTY_BLOG_FORM, type BlogFormValues } from "./BlogSection";
import {
  type MemberRow,
  type ViewerRow,
  type ViewerSummary,
  type CommentRow,
  type AccountRow,
  type ReportRow,
  type OfferingRow,
  type CheckInRow,
  type EmailCampaignRow,
  type EmailTemplateKey,
  type EmailTemplateRow,
  type EmailSettingsRow,
  type CheckinLocationRow,
  type ContactMessageRow,
  type PrayerRequestRow,
  type EventInterestRow,
  type SalvationDecisionRow,
  type NewsletterSubscriberRow,
  type BookRow,
  type EventRow,
  type TeachingSeriesRow,
  type TeachingItemRow,
  type BlogPostRow,
} from "./types";

const PASTOR_ONLY_SECTIONS: DashboardSection[] = ["offerings", "owner-email", "checkin-location"];

export function DashboardBody({ section }: { section: DashboardSection }) {
  const { user, isPastor } = useAuth();
  const queryClient = useQueryClient();

  // A non-pastor can't reach the offerings, owner-email, or
  // checkin-location sections even by typing the URL directly — the
  // sidebar/mobile nav already hide the link, this is the render-time
  // backstop.
  const activeSection: DashboardSection =
    PASTOR_ONLY_SECTIONS.includes(section) && !isPastor ? "overview" : section;

  // Service reports state
  const [reportTitle, setReportTitle] = useState("");
  const [reportDate, setReportDate] = useState(todayIso());
  const [reportNotes, setReportNotes] = useState("");
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportUploading, setReportUploading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Attendance fields — kept as strings so empty inputs stay empty until
  // the form is submitted. Coerced to numbers (or null) in handleUploadReport.
  const [reportAdults, setReportAdults] = useState("");
  const [reportMen, setReportMen] = useState("");
  const [reportWomen, setReportWomen] = useState("");
  const [reportChildren, setReportChildren] = useState("");
  const [reportFirstTimers, setReportFirstTimers] = useState("");

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

  // Attendance state
  const [attendanceDate, setAttendanceDate] = useState(todayIso());

  // Messaging (new campaign) state
  const [msgSubject, setMsgSubject] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [msgBodyMode, setMsgBodyMode] = useState<"visual" | "html">("visual");
  const [msgServiceDate, setMsgServiceDate] = useState(todayIso());
  const [msgAudience, setMsgAudience] = useState<EmailCampaignRow["audience"]>("all");
  const [msgRecipientEmailsText, setMsgRecipientEmailsText] = useState("");
  const [msgEventSlug, setMsgEventSlug] = useState("");
  const [msgSendMode, setMsgSendMode] = useState<"now" | "schedule">("now");
  const [msgScheduledFor, setMsgScheduledFor] = useState("");
  const [msgSubmitting, setMsgSubmitting] = useState(false);
  const [msgError, setMsgError] = useState<string | null>(null);
  const [msgSuccess, setMsgSuccess] = useState(false);

  // Member add/edit form state — pastor only. `memberFormMode` is null when
  // the form is closed; "add" or "edit" when open. Only one form (add xor
  // edit-one-row) can be open at a time.
  const [memberFormMode, setMemberFormMode] = useState<"add" | "edit" | null>(null);
  const [memberEditingId, setMemberEditingId] = useState<string | null>(null);
  const [memberForm, setMemberForm] = useState<MemberFormValues>(EMPTY_MEMBER_FORM);
  const [memberSubmitting, setMemberSubmitting] = useState(false);
  const [memberError, setMemberError] = useState<string | null>(null);
  const [memberSuccess, setMemberSuccess] = useState(false);

  // Books CMS form state
  const [bookFormMode, setBookFormMode] = useState<"add" | "edit" | null>(null);
  const [bookEditingId, setBookEditingId] = useState<string | null>(null);
  const [bookForm, setBookForm] = useState<BookFormValues>(EMPTY_BOOK_FORM);
  const [bookCoverFile, setBookCoverFile] = useState<File | null>(null);
  const [bookSubmitting, setBookSubmitting] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);
  const [bookSuccess, setBookSuccess] = useState(false);

  // Events CMS form state
  const [eventFormMode, setEventFormMode] = useState<"add" | "edit" | null>(null);
  const [eventEditingId, setEventEditingId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState<EventFormValues>(EMPTY_EVENT_FORM);
  const [eventFlyerFile, setEventFlyerFile] = useState<File | null>(null);
  const [eventSubmitting, setEventSubmitting] = useState(false);
  const [eventError, setEventError] = useState<string | null>(null);
  const [eventSuccess, setEventSuccess] = useState(false);

  // Teachings CMS form state — series form, the currently "drilled into"
  // series (null = showing the series list), and that series' item form.
  const [seriesFormMode, setSeriesFormMode] = useState<"add" | "edit" | null>(null);
  const [seriesEditingId, setSeriesEditingId] = useState<string | null>(null);
  const [seriesForm, setSeriesForm] = useState<SeriesFormValues>(EMPTY_SERIES_FORM);
  const [seriesImageFile, setSeriesImageFile] = useState<File | null>(null);
  const [seriesSubmitting, setSeriesSubmitting] = useState(false);
  const [seriesError, setSeriesError] = useState<string | null>(null);
  const [seriesSuccess, setSeriesSuccess] = useState(false);

  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);

  const [itemFormMode, setItemFormMode] = useState<"add" | "edit" | null>(null);
  const [itemEditingId, setItemEditingId] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState<TeachingItemFormValues>(EMPTY_TEACHING_ITEM_FORM);
  const [itemImageFile, setItemImageFile] = useState<File | null>(null);
  const [itemSubmitting, setItemSubmitting] = useState(false);
  const [itemError, setItemError] = useState<string | null>(null);
  const [itemSuccess, setItemSuccess] = useState(false);

  // Blog CMS form state
  const [blogFormMode, setBlogFormMode] = useState<"add" | "edit" | null>(null);
  const [blogEditingId, setBlogEditingId] = useState<string | null>(null);
  const [blogForm, setBlogForm] = useState<BlogFormValues>(EMPTY_BLOG_FORM);
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null);
  const [blogSubmitting, setBlogSubmitting] = useState(false);
  const [blogError, setBlogError] = useState<string | null>(null);
  const [blogSuccess, setBlogSuccess] = useState(false);

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
        .select(
          "id, full_name, email, phone, date_of_birth, gender, marital_status, address_street, address_city, address_state, address_zip, preferred_contact, visitor_status, heard_about_us, baptized, ministry_interests, notes, consent_to_contact, created_at"
        )
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
        .select("id, full_name, email, created_at, role")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw new Error(error.message);
      return (data ?? []) as AccountRow[];
    },
  });

  const checkInsQuery = useQuery({
    queryKey: [...QUERY_KEYS.checkins, attendanceDate],
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("check_ins")
        .select("id, member_id, service_date, checked_in_at, method, checked_in_by, latitude, longitude")
        .eq("service_date", attendanceDate);
      if (error) throw new Error(error.message);
      return (data ?? []) as CheckInRow[];
    },
  });

  const reportsQuery = useQuery({
    queryKey: QUERY_KEYS.reports,
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_reports")
        .select("id, title, service_date, file_path, notes, uploaded_by, created_at, attendance_adults, attendance_men, attendance_women, attendance_children, first_timers, profiles!service_reports_uploaded_by_fkey(full_name)")
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

  const campaignsQuery = useQuery({
    queryKey: QUERY_KEYS.campaigns,
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_campaigns")
        .select("id, subject, body, mode, service_date, audience, status, scheduled_for, sent_at, created_by, created_at, recipient_emails, event_slug, event_title, profiles!email_campaigns_created_by_fkey(full_name)")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as EmailCampaignRow[];
    },
  });

  const emailTemplatesQuery = useQuery({
    queryKey: QUERY_KEYS.emailTemplates,
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_templates")
        .select("key, subject, heading, body, mode, updated_at")
        .order("key", { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []) as EmailTemplateRow[];
    },
  });

  const emailSettingsQuery = useQuery({
    queryKey: QUERY_KEYS.emailSettings,
    enabled: isSupabaseConfigured && isPastor,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_settings")
        .select("owner_emails")
        .eq("id", true)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as EmailSettingsRow | null;
    },
  });

  const checkinLocationQuery = useQuery({
    queryKey: QUERY_KEYS.checkinLocation,
    enabled: isSupabaseConfigured && isPastor,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("checkin_location_settings")
        .select("church_lat, church_lng, radius_meters")
        .eq("id", true)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as CheckinLocationRow | null;
    },
  });

  const contactMessagesQuery = useQuery({
    queryKey: QUERY_KEYS.contactMessages,
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("id, name, email, message, created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw new Error(error.message);
      return (data ?? []) as ContactMessageRow[];
    },
  });

  const prayerRequestsQuery = useQuery({
    queryKey: QUERY_KEYS.prayerRequests,
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prayer_requests")
        .select("id, name, email, phone, category, request, confidential, created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw new Error(error.message);
      return (data ?? []) as PrayerRequestRow[];
    },
  });

  const eventInterestQuery = useQuery({
    queryKey: QUERY_KEYS.eventInterest,
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_interest")
        .select("id, event_slug, event_title, name, email, phone, guests, mode, notes, created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw new Error(error.message);
      return (data ?? []) as EventInterestRow[];
    },
  });

  const salvationDecisionsQuery = useQuery({
    queryKey: QUERY_KEYS.salvationDecisions,
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("salvation_decisions")
        .select("id, name, email, phone, location, decision, created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw new Error(error.message);
      return (data ?? []) as SalvationDecisionRow[];
    },
  });

  const newsletterSubscribersQuery = useQuery({
    queryKey: QUERY_KEYS.newsletterSubscribers,
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("id, email, created_at")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw new Error(error.message);
      return (data ?? []) as NewsletterSubscriberRow[];
    },
  });

  const booksQuery = useQuery({
    queryKey: QUERY_KEYS.cmsBooks,
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase.from("cms_books").select("*").order("title");
      if (error) throw new Error(error.message);
      return (data ?? []) as BookRow[];
    },
  });

  const eventsQuery = useQuery({
    queryKey: QUERY_KEYS.cmsEvents,
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase.from("cms_events").select("*").order("start");
      if (error) throw new Error(error.message);
      return (data ?? []) as EventRow[];
    },
  });

  const teachingsQuery = useQuery({
    queryKey: QUERY_KEYS.cmsTeachings,
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_teachings")
        .select("*, cms_teaching_items(*)")
        .order("created_at")
        .order("sort_order", { referencedTable: "cms_teaching_items" });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as TeachingSeriesRow[];
    },
  });

  const blogPostsQuery = useQuery({
    queryKey: QUERY_KEYS.cmsBlogPosts,
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase.from("cms_blog_posts").select("*").order("date", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as BlogPostRow[];
    },
  });

  // Uploads a file to the public "cms-media" storage bucket and returns its
  // public URL — shared by the Books/Events/Teachings/Blog forms below.
  const uploadCmsMedia = async (file: File, folder: string): Promise<string> => {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
    const path = `${folder}/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("cms-media").upload(path, file, { upsert: false });
    if (error) throw new Error(error.message);
    return supabase.storage.from("cms-media").getPublicUrl(path).data.publicUrl;
  };

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

  const handleDeleteContactMessage = async (id: string) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete contact message:", error.message);
      return;
    }
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.contactMessages });
  };

  const handleDeletePrayerRequest = async (id: string) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from("prayer_requests").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete prayer request:", error.message);
      return;
    }
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.prayerRequests });
  };

  const handleDeleteEventInterest = async (id: string) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from("event_interest").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete event interest:", error.message);
      return;
    }
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.eventInterest });
  };

  const handleDeleteSalvationDecision = async (id: string) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from("salvation_decisions").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete salvation decision:", error.message);
      return;
    }
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.salvationDecisions });
  };

  const handleDeleteNewsletterSubscriber = async (id: string) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete newsletter subscriber:", error.message);
      return;
    }
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.newsletterSubscribers });
  };

  const handleMarkPresent = async (profileId: string) => {
    if (!isSupabaseConfigured || !user) return;
    const { error } = await supabase.from("check_ins").insert({
      member_id: profileId,
      service_date: attendanceDate,
      method: "manual",
      checked_in_by: user.id,
    });
    if (error) {
      console.error("Failed to mark present:", error.message);
      return;
    }
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.checkins });
  };

  const handleUndoCheckIn = async (checkInId: string) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from("check_ins").delete().eq("id", checkInId);
    if (error) {
      console.error("Failed to undo check-in:", error.message);
      return;
    }
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.checkins });
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
      attendance_adults: Number(reportAdults) || 0,
      attendance_men: reportMen === "" ? null : Number(reportMen),
      attendance_women: reportWomen === "" ? null : Number(reportWomen),
      attendance_children: Number(reportChildren) || 0,
      first_timers: reportFirstTimers === "" ? null : Number(reportFirstTimers),
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
    setReportAdults("");
    setReportMen("");
    setReportWomen("");
    setReportChildren("");
    setReportFirstTimers("");
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgError(null);
    setMsgSuccess(false);

    if (!msgSubject.trim()) {
      setMsgError("Subject is required.");
      return;
    }
    if (!msgBody.replace(/<[^>]+>/g, "").trim()) {
      setMsgError("Message body is required.");
      return;
    }
    if (msgSendMode === "schedule" && !msgScheduledFor) {
      setMsgError("Choose a date and time to schedule this for.");
      return;
    }

    let recipientEmails: string[] | null = null;
    let eventSlug: string | null = null;
    let eventTitle: string | null = null;

    if (msgAudience === "individual") {
      recipientEmails = [
        ...new Set(
          msgRecipientEmailsText
            .split(/[,\n]/)
            .map((s) => s.trim())
            .filter(Boolean)
        ),
      ];
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalid = recipientEmails.filter((addr) => !emailPattern.test(addr));
      if (recipientEmails.length === 0) {
        setMsgError("Enter at least one recipient email address.");
        return;
      }
      if (invalid.length > 0) {
        setMsgError(`These don't look like valid email addresses: ${invalid.join(", ")}`);
        return;
      }
    }

    if (msgAudience === "event_interest") {
      const event = interestedEvents.find((ev) => ev.slug === msgEventSlug);
      if (!event) {
        setMsgError("Choose which event to message.");
        return;
      }
      eventSlug = event.slug;
      eventTitle = event.title;
    }

    if (!isSupabaseConfigured || !user) return;

    setMsgSubmitting(true);
    const { data: inserted, error } = await supabase
      .from("email_campaigns")
      .insert({
        subject: msgSubject.trim(),
        body: msgBody.trim(),
        mode: msgBodyMode,
        service_date: msgServiceDate,
        audience: msgAudience,
        recipient_emails: recipientEmails,
        event_slug: eventSlug,
        event_title: eventTitle,
        created_by: user.id,
        ...(msgSendMode === "now"
          ? { status: "sent", sent_at: nowIso() }
          : { status: "scheduled", scheduled_for: new Date(msgScheduledFor).toISOString() }),
      })
      .select("id")
      .single();

    if (error) {
      setMsgSubmitting(false);
      setMsgError(error.message);
      return;
    }

    // "Send now" actually delivers through Resend below, via a plain HTTP
    // call to the dispatch-scheduled-campaigns edge function (NOT a
    // TanStack Start server function — a useServerFn call reachable from a
    // second route was found to break the whole site's build here, so
    // real sending, immediate or scheduled, is kept entirely on this one
    // already-isolated Supabase edge function). "Schedule for later" only
    // saves the record — the same function picks it up on its own within
    // a minute via the scheduled cron job.
    if (msgSendMode === "now") {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData.session?.access_token;
        const res = await fetch(`${supabaseUrl}/functions/v1/dispatch-scheduled-campaigns`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ campaign_id: inserted.id }),
        });
        const result = await res.json();
        const outcome = result?.results?.[0];
        if (!res.ok || outcome?.outcome === "failed") {
          setMsgError(
            outcome?.reason === "no recipients"
              ? "Saved, but there was nobody to send it to."
              : "Email delivery failed."
          );
        } else if (outcome?.failed > 0) {
          setMsgError(`Delivered to ${outcome.delivered}, but ${outcome.failed} failed.`);
        }
      } catch {
        setMsgError("Email delivery failed.");
      }
    }

    setMsgSubmitting(false);
    setMsgSubject("");
    setMsgBody("");
    setMsgBodyMode("visual");
    setMsgServiceDate(todayIso());
    setMsgAudience("all");
    setMsgRecipientEmailsText("");
    setMsgEventSlug("");
    setMsgSendMode("now");
    setMsgScheduledFor("");
    setMsgSuccess(true);
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.campaigns });
  };

  // Marks a still-pending scheduled message as cancelled rather than
  // deleting it, so it stops appearing to the once-a-minute automatic
  // sender (which only ever looks for status = "scheduled") while still
  // leaving a record behind of what was cancelled and when.
  const handleCancelScheduledMessage = async (id: string) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from("email_campaigns").update({ status: "cancelled" }).eq("id", id);
    if (error) {
      console.error("Failed to cancel scheduled message:", error.message);
      return;
    }
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.campaigns });
  };

  const handleSaveEmailTemplate = async (
    key: EmailTemplateKey,
    patch: Pick<EmailTemplateRow, "subject" | "heading" | "body" | "mode">,
  ): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured || !user) return { error: "Supabase is not configured." };
    const { error } = await supabase
      .from("email_templates")
      .update({ ...patch, updated_by: user.id, updated_at: nowIso() })
      .eq("key", key);
    if (error) return { error: error.message };
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.emailTemplates });
    return {};
  };

  const handleSaveOwnerEmails = async (ownerEmails: string[]): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured || !user) return { error: "Supabase is not configured." };
    const { error } = await supabase
      .from("email_settings")
      .update({ owner_emails: ownerEmails, updated_by: user.id, updated_at: nowIso() })
      .eq("id", true);
    if (error) return { error: error.message };
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.emailSettings });
    return {};
  };

  const handleSaveCheckinLocation = async (values: CheckinLocationRow): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured || !user) return { error: "Supabase is not configured." };
    const { error } = await supabase
      .from("checkin_location_settings")
      .update({ ...values, updated_by: user.id, updated_at: nowIso() })
      .eq("id", true);
    if (error) return { error: error.message };
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.checkinLocation });
    return {};
  };

  const openAddMember = () => {
    setMemberForm(EMPTY_MEMBER_FORM);
    setMemberEditingId(null);
    setMemberError(null);
    setMemberSuccess(false);
    setMemberFormMode("add");
  };

  const openEditMember = (row: MemberRow) => {
    setMemberForm({
      fullName: row.full_name ?? "",
      dob: row.date_of_birth ?? "",
      gender: row.gender ?? "",
      maritalStatus: row.marital_status ?? "",
      email: row.email ?? "",
      phone: row.phone ?? "",
      street: row.address_street ?? "",
      city: row.address_city ?? "",
      state: row.address_state ?? "",
      zip: row.address_zip ?? "",
      preferredContact: row.preferred_contact ?? "",
      visitorStatus: (row.visitor_status as MemberFormValues["visitorStatus"]) || "",
      heardAboutUs: row.heard_about_us ?? "",
      baptized: row.baptized === true ? "yes" : row.baptized === false ? "no" : "",
      ministryInterests: new Set(row.ministry_interests ?? []),
      notes: row.notes ?? "",
      consentToContact: row.consent_to_contact,
    });
    setMemberEditingId(row.id);
    setMemberError(null);
    setMemberSuccess(false);
    setMemberFormMode("edit");
  };

  const closeMemberForm = () => {
    setMemberFormMode(null);
    setMemberEditingId(null);
    setMemberError(null);
  };

  const handleSubmitMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError(null);
    setMemberSuccess(false);
    if (!memberForm.fullName.trim()) {
      setMemberError("Full name is required.");
      return;
    }
    if (!memberForm.email.trim()) {
      setMemberError("Email is required.");
      return;
    }
    if (!memberForm.phone.trim()) {
      setMemberError("Phone is required.");
      return;
    }
    if (!isSupabaseConfigured) return;

    const payload = {
      full_name: memberForm.fullName.trim(),
      date_of_birth: memberForm.dob || null,
      gender: memberForm.gender || null,
      marital_status: memberForm.maritalStatus || null,
      email: memberForm.email.trim(),
      phone: memberForm.phone.trim(),
      address_street: memberForm.street.trim() || null,
      address_city: memberForm.city.trim() || null,
      address_state: memberForm.state.trim() || null,
      address_zip: memberForm.zip.trim() || null,
      preferred_contact: memberForm.preferredContact || null,
      visitor_status: memberForm.visitorStatus || null,
      heard_about_us: memberForm.heardAboutUs || null,
      baptized: memberForm.baptized || null,
      ministry_interests: memberForm.ministryInterests.size > 0 ? [...memberForm.ministryInterests] : null,
      notes: memberForm.notes.trim() || null,
      consent_to_contact: memberForm.consentToContact,
    };

    setMemberSubmitting(true);

    if (memberFormMode === "edit" && memberEditingId) {
      const { error } = await supabase.from("members").update(payload).eq("id", memberEditingId);
      setMemberSubmitting(false);
      if (error) {
        setMemberError(error.message);
        return;
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      closeMemberForm();
      return;
    }

    const { error } = await supabase.from("members").insert(payload);
    setMemberSubmitting(false);
    if (error) {
      setMemberError(error.message);
      return;
    }
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
    setMemberForm(EMPTY_MEMBER_FORM);
    setMemberSuccess(true);
  };

  const handleDeleteMember = async (id: string) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete member:", error.message);
      return;
    }
    if (memberEditingId === id) closeMemberForm();
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
  };

  // -- Books CMS handlers ---------------------------------------------------

  const openAddBook = () => {
    setBookForm(EMPTY_BOOK_FORM);
    setBookEditingId(null);
    setBookCoverFile(null);
    setBookError(null);
    setBookSuccess(false);
    setBookFormMode("add");
  };

  const openEditBook = (row: BookRow) => {
    setBookForm({
      slug: row.slug,
      title: row.title,
      author: row.author,
      price: row.price,
      category: row.category,
      description: row.description,
      buyUrl: row.buy_url,
      coverUrl: row.cover_url,
    });
    setBookEditingId(row.id);
    setBookCoverFile(null);
    setBookError(null);
    setBookSuccess(false);
    setBookFormMode("edit");
  };

  const closeBookForm = () => {
    setBookFormMode(null);
    setBookEditingId(null);
    setBookCoverFile(null);
    setBookError(null);
  };

  const handleSubmitBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookError(null);
    setBookSuccess(false);
    if (!isSupabaseConfigured) return;
    if (bookFormMode === "add" && !bookCoverFile) {
      setBookError("Please choose a cover image.");
      return;
    }
    setBookSubmitting(true);
    try {
      const coverUrl = bookCoverFile ? await uploadCmsMedia(bookCoverFile, "books") : bookForm.coverUrl;
      const payload = {
        slug: bookForm.slug.trim(),
        title: bookForm.title.trim(),
        author: bookForm.author.trim(),
        price: bookForm.price.trim(),
        category: bookForm.category,
        description: bookForm.description.trim(),
        buy_url: bookForm.buyUrl.trim(),
        cover_url: coverUrl,
      };
      if (bookFormMode === "edit" && bookEditingId) {
        const { error } = await supabase.from("cms_books").update(payload).eq("id", bookEditingId);
        if (error) throw new Error(error.message);
        closeBookForm();
      } else {
        const { error } = await supabase.from("cms_books").insert(payload);
        if (error) throw new Error(error.message);
        setBookForm(EMPTY_BOOK_FORM);
        setBookCoverFile(null);
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cmsBooks });
      setBookSuccess(true);
    } catch (err) {
      setBookError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBookSubmitting(false);
    }
  };

  const handleDeleteBook = async (row: BookRow) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from("cms_books").delete().eq("id", row.id);
    if (error) {
      console.error("Failed to delete book:", error.message);
      return;
    }
    if (bookEditingId === row.id) closeBookForm();
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cmsBooks });
  };

  // -- Events CMS handlers ---------------------------------------------------

  const openAddEvent = () => {
    setEventForm(EMPTY_EVENT_FORM);
    setEventEditingId(null);
    setEventFlyerFile(null);
    setEventError(null);
    setEventSuccess(false);
    setEventFormMode("add");
  };

  const openEditEvent = (row: EventRow) => {
    setEventForm({
      slug: row.slug,
      title: row.title,
      type: row.type,
      start: toDatetimeLocal(row.start),
      end: toDatetimeLocal(row.end),
      location: row.location,
      summary: row.summary,
      details: row.details.join("\n"),
      registration: row.registration,
      flyerUrl: row.flyer_url,
    });
    setEventEditingId(row.id);
    setEventFlyerFile(null);
    setEventError(null);
    setEventSuccess(false);
    setEventFormMode("edit");
  };

  const closeEventForm = () => {
    setEventFormMode(null);
    setEventEditingId(null);
    setEventFlyerFile(null);
    setEventError(null);
  };

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventError(null);
    setEventSuccess(false);
    if (!isSupabaseConfigured) return;
    if (eventFormMode === "add" && !eventFlyerFile) {
      setEventError("Please choose a flyer image.");
      return;
    }
    setEventSubmitting(true);
    try {
      const flyerUrl = eventFlyerFile ? await uploadCmsMedia(eventFlyerFile, "events") : eventForm.flyerUrl;
      const payload = {
        slug: eventForm.slug.trim(),
        title: eventForm.title.trim(),
        type: eventForm.type,
        start: new Date(eventForm.start).toISOString(),
        end: eventForm.end ? new Date(eventForm.end).toISOString() : null,
        location: eventForm.location.trim(),
        summary: eventForm.summary.trim(),
        details: eventForm.details.split(/\r?\n/).map((l) => l.trim()).filter(Boolean),
        registration: eventForm.registration,
        flyer_url: flyerUrl,
      };
      if (eventFormMode === "edit" && eventEditingId) {
        const { error } = await supabase.from("cms_events").update(payload).eq("id", eventEditingId);
        if (error) throw new Error(error.message);
        closeEventForm();
      } else {
        const { error } = await supabase.from("cms_events").insert(payload);
        if (error) throw new Error(error.message);
        setEventForm(EMPTY_EVENT_FORM);
        setEventFlyerFile(null);
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cmsEvents });
      setEventSuccess(true);
    } catch (err) {
      setEventError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setEventSubmitting(false);
    }
  };

  const handleDeleteEvent = async (row: EventRow) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from("cms_events").delete().eq("id", row.id);
    if (error) {
      console.error("Failed to delete event:", error.message);
      return;
    }
    if (eventEditingId === row.id) closeEventForm();
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cmsEvents });
  };

  // -- Teachings CMS handlers ------------------------------------------------

  const selectedSeries = useMemo(
    () => (selectedSeriesId ? (teachingsQuery.data ?? []).find((s) => s.id === selectedSeriesId) ?? null : null),
    [selectedSeriesId, teachingsQuery.data],
  );

  const openAddSeries = () => {
    setSeriesForm(EMPTY_SERIES_FORM);
    setSeriesEditingId(null);
    setSeriesImageFile(null);
    setSeriesError(null);
    setSeriesSuccess(false);
    setSeriesFormMode("add");
  };

  const openEditSeries = (row: TeachingSeriesRow) => {
    setSeriesForm({ slug: row.slug, title: row.title, summary: row.summary, imageUrl: row.image_url });
    setSeriesEditingId(row.id);
    setSeriesImageFile(null);
    setSeriesError(null);
    setSeriesSuccess(false);
    setSeriesFormMode("edit");
  };

  const closeSeriesForm = () => {
    setSeriesFormMode(null);
    setSeriesEditingId(null);
    setSeriesImageFile(null);
    setSeriesError(null);
  };

  const handleSubmitSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    setSeriesError(null);
    setSeriesSuccess(false);
    if (!isSupabaseConfigured) return;
    if (seriesFormMode === "add" && !seriesImageFile) {
      setSeriesError("Please choose a series image.");
      return;
    }
    setSeriesSubmitting(true);
    try {
      const imageUrl = seriesImageFile ? await uploadCmsMedia(seriesImageFile, "teachings") : seriesForm.imageUrl;
      const payload = {
        slug: seriesForm.slug.trim(),
        title: seriesForm.title.trim(),
        summary: seriesForm.summary.trim(),
        image_url: imageUrl,
      };
      if (seriesFormMode === "edit" && seriesEditingId) {
        const { error } = await supabase.from("cms_teachings").update(payload).eq("id", seriesEditingId);
        if (error) throw new Error(error.message);
        closeSeriesForm();
      } else {
        const { error } = await supabase.from("cms_teachings").insert(payload);
        if (error) throw new Error(error.message);
        setSeriesForm(EMPTY_SERIES_FORM);
        setSeriesImageFile(null);
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cmsTeachings });
      setSeriesSuccess(true);
    } catch (err) {
      setSeriesError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSeriesSubmitting(false);
    }
  };

  const handleDeleteSeries = async (row: TeachingSeriesRow) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from("cms_teachings").delete().eq("id", row.id);
    if (error) {
      console.error("Failed to delete series:", error.message);
      return;
    }
    if (seriesEditingId === row.id) closeSeriesForm();
    if (selectedSeriesId === row.id) setSelectedSeriesId(null);
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cmsTeachings });
  };

  const openAddItem = () => {
    setItemForm(EMPTY_TEACHING_ITEM_FORM);
    setItemEditingId(null);
    setItemImageFile(null);
    setItemError(null);
    setItemSuccess(false);
    setItemFormMode("add");
  };

  const openEditItem = (row: TeachingItemRow) => {
    setItemForm({
      title: row.title,
      speaker: row.speaker,
      date: row.date,
      duration: row.duration,
      youtube: row.youtube,
      summary: row.summary ?? "",
      imageUrl: row.image_url ?? "",
    });
    setItemEditingId(row.id);
    setItemImageFile(null);
    setItemError(null);
    setItemSuccess(false);
    setItemFormMode("edit");
  };

  const closeItemForm = () => {
    setItemFormMode(null);
    setItemEditingId(null);
    setItemImageFile(null);
    setItemError(null);
  };

  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setItemError(null);
    setItemSuccess(false);
    if (!isSupabaseConfigured || !selectedSeries) return;
    setItemSubmitting(true);
    try {
      const imageUrl = itemImageFile ? await uploadCmsMedia(itemImageFile, "teachings") : itemForm.imageUrl || null;
      const payload = {
        title: itemForm.title.trim(),
        speaker: itemForm.speaker.trim(),
        date: itemForm.date,
        duration: itemForm.duration.trim(),
        youtube: itemForm.youtube.trim(),
        summary: itemForm.summary.trim() || null,
        image_url: imageUrl,
      };
      if (itemFormMode === "edit" && itemEditingId) {
        const { error } = await supabase.from("cms_teaching_items").update(payload).eq("id", itemEditingId);
        if (error) throw new Error(error.message);
        closeItemForm();
      } else {
        const { error } = await supabase
          .from("cms_teaching_items")
          .insert({ ...payload, series_id: selectedSeries.id, sort_order: selectedSeries.cms_teaching_items.length });
        if (error) throw new Error(error.message);
        setItemForm(EMPTY_TEACHING_ITEM_FORM);
        setItemImageFile(null);
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cmsTeachings });
      setItemSuccess(true);
    } catch (err) {
      setItemError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setItemSubmitting(false);
    }
  };

  const handleDeleteItem = async (row: TeachingItemRow) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from("cms_teaching_items").delete().eq("id", row.id);
    if (error) {
      console.error("Failed to delete session:", error.message);
      return;
    }
    if (itemEditingId === row.id) closeItemForm();
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cmsTeachings });
  };

  // -- Blog CMS handlers -----------------------------------------------------

  const openAddBlogPost = () => {
    setBlogForm(EMPTY_BLOG_FORM);
    setBlogEditingId(null);
    setBlogImageFile(null);
    setBlogError(null);
    setBlogSuccess(false);
    setBlogFormMode("add");
  };

  const openEditBlogPost = (row: BlogPostRow) => {
    setBlogForm({
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      date: row.date,
      author: row.author,
      category: row.category,
      body: row.body,
      imageUrl: row.image_url,
    });
    setBlogEditingId(row.id);
    setBlogImageFile(null);
    setBlogError(null);
    setBlogSuccess(false);
    setBlogFormMode("edit");
  };

  const closeBlogForm = () => {
    setBlogFormMode(null);
    setBlogEditingId(null);
    setBlogImageFile(null);
    setBlogError(null);
  };

  const handleSubmitBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogError(null);
    setBlogSuccess(false);
    if (!isSupabaseConfigured) return;
    if (blogFormMode === "add" && !blogImageFile) {
      setBlogError("Please choose a featured image.");
      return;
    }
    setBlogSubmitting(true);
    try {
      const imageUrl = blogImageFile ? await uploadCmsMedia(blogImageFile, "blog") : blogForm.imageUrl;
      const payload = {
        slug: blogForm.slug.trim(),
        title: blogForm.title.trim(),
        excerpt: blogForm.excerpt.trim(),
        date: blogForm.date,
        author: blogForm.author.trim(),
        category: blogForm.category,
        body: blogForm.body.trim(),
        image_url: imageUrl,
      };
      if (blogFormMode === "edit" && blogEditingId) {
        const { error } = await supabase.from("cms_blog_posts").update(payload).eq("id", blogEditingId);
        if (error) throw new Error(error.message);
        closeBlogForm();
      } else {
        const { error } = await supabase.from("cms_blog_posts").insert(payload);
        if (error) throw new Error(error.message);
        setBlogForm(EMPTY_BLOG_FORM);
        setBlogImageFile(null);
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cmsBlogPosts });
      setBlogSuccess(true);
    } catch (err) {
      setBlogError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBlogSubmitting(false);
    }
  };

  const handleDeleteBlogPost = async (row: BlogPostRow) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from("cms_blog_posts").delete().eq("id", row.id);
    if (error) {
      console.error("Failed to delete post:", error.message);
      return;
    }
    if (blogEditingId === row.id) closeBlogForm();
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cmsBlogPosts });
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

  // Distinct events that actually have interest submissions, for the
  // Messaging "Event interest" audience picker — grounded in real signups
  // rather than the full static events list, same idea as Attendance being
  // grounded in a specific service date's check-ins.
  const interestedEvents = useMemo(() => {
    const bySlug = new Map<string, { slug: string; title: string; count: number }>();
    for (const r of eventInterestQuery.data ?? []) {
      const existing = bySlug.get(r.event_slug);
      if (existing) {
        existing.count += 1;
      } else {
        bySlug.set(r.event_slug, { slug: r.event_slug, title: r.event_title, count: 1 });
      }
    }
    return [...bySlug.values()].sort((a, b) => a.title.localeCompare(b.title));
  }, [eventInterestQuery.data]);

  const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");

  // Aggregate counts for the overview tiles. Offering total uses today only
  // so the headline number matches what's on the offering card.
  const overviewCounts: OverviewCounts | undefined = stats.data
    ? {
        members: stats.data.members,
        profiles: stats.data.profiles,
        comments: stats.data.comments,
        viewsLast7: stats.data.viewsLast7,
        reports: reportsQuery.data?.length ?? 0,
        offeringsTotal: todayTotal,
      }
    : undefined;

  const sectionCopy: Record<DashboardSection, { title: string; subtitle: string }> = {
    overview: { title: "Overview", subtitle: "A quick view of your church family and recent activity." },
    members: { title: "Members", subtitle: "Everyone who has filled in the membership form." },
    viewers: { title: "Livestream viewers", subtitle: "Who's watching, and how often." },
    comments: { title: "Comments", subtitle: "Moderate comments left across the site." },
    accounts: { title: "Registered accounts", subtitle: "Everyone with a sign-in to the site." },
    attendance: { title: "Attendance", subtitle: "Check people in for today's service." },
    reports: { title: "Service reports", subtitle: "Uploaded reports and attendance breakdowns." },
    messaging: { title: "Messaging", subtitle: "Email campaigns to members and visitors." },
    "email-templates": { title: "Email Templates", subtitle: "The confirmation emails sent for every form on the site." },
    "owner-email": { title: "Owner Email", subtitle: "Pastor-only — the church inbox that receives a copy of every submission." },
    "checkin-location": { title: "Check-in Location", subtitle: "Pastor-only — the coordinates and radius used to validate GPS check-in." },
    contact: { title: "Contact messages", subtitle: "Submissions from the site's Contact page." },
    prayer: { title: "Prayer requests", subtitle: "Submissions from the Prayer Request page. Confidential requests are visible to pastor accounts only." },
    "event-interest": { title: "Event interest", subtitle: "Who's registered interest in upcoming events." },
    salvation: { title: "Salvation decisions", subtitle: "Submissions from the Prayer of Salvation page." },
    newsletter: { title: "Newsletter subscribers", subtitle: "Everyone who's signed up via the footer form." },
    offerings: { title: "Offerings", subtitle: "Pastor-only financial records." },
    books: { title: "Books", subtitle: "Titles shown on the public Book Store page." },
    events: { title: "Events", subtitle: "Conferences, prayer nights and gatherings shown on the Events page." },
    teachings: { title: "Teachings", subtitle: "Sermon series and their video sessions shown on the Teachings page." },
    blog: { title: "Blog", subtitle: "Articles shown on the public Blog page." },
  };
  const { title: sectionTitle, subtitle: sectionSubtitle } = sectionCopy[activeSection];

  return (
    <div className="space-y-8">
      {/* Page header — swaps with the active section so it still reads as
          a proper page title, not just chrome around a fixed "Dashboard". */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-black sm:text-4xl">{sectionTitle}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{sectionSubtitle}</p>
        </div>
      </div>

      {/* Only the active section is ever rendered — switching sections in
          the sidebar/mobile nav swaps this out, it never scrolls to it. */}
      {activeSection === "overview" ? (
        <OverviewSection
          isLoading={stats.isLoading}
          isError={stats.isError}
          error={errMsg(stats.error)}
          counts={overviewCounts}
          members={membersQuery.data ?? []}
          comments={commentsQuery.data ?? []}
          reports={reportsQuery.data ?? []}
          accounts={accountsQuery.data ?? []}
          viewers={viewersQuery.data ?? []}
        />
      ) : null}

      {activeSection === "members" ? (
        <div className="rounded-3xl border border-border bg-card p-6">
          <MembersSection
            rows={membersQuery.data ?? []}
            isLoading={membersQuery.isLoading}
            isError={membersQuery.isError}
            error={errMsg(membersQuery.error)}
            isPastor={isPastor}
            formMode={memberFormMode}
            formValue={memberForm}
            onFormChange={(patch) => setMemberForm((prev) => ({ ...prev, ...patch }))}
            onOpenAdd={openAddMember}
            onOpenEdit={openEditMember}
            onCancelForm={closeMemberForm}
            onSubmitForm={handleSubmitMember}
            onDelete={handleDeleteMember}
            formSubmitting={memberSubmitting}
            formError={memberError}
            formSuccess={memberSuccess}
          />
        </div>
      ) : null}

      {activeSection === "viewers" ? (
        <div className="rounded-3xl border border-border bg-card p-6">
          <ViewersSection
            rows={viewersQuery.data ?? []}
            isLoading={viewersQuery.isLoading}
            isError={viewersQuery.isError}
            error={errMsg(viewersQuery.error)}
          />
        </div>
      ) : null}

      {activeSection === "comments" ? (
        <div className="rounded-3xl border border-border bg-card p-6">
          <CommentsSection
            rows={commentsQuery.data ?? []}
            isLoading={commentsQuery.isLoading}
            isError={commentsQuery.isError}
            error={errMsg(commentsQuery.error)}
            onDelete={handleDeleteComment}
          />
        </div>
      ) : null}

      {activeSection === "accounts" ? (
        <div className="rounded-3xl border border-border bg-card p-6">
          <AccountsSection
            rows={accountsQuery.data ?? []}
            isLoading={accountsQuery.isLoading}
            isError={accountsQuery.isError}
            error={errMsg(accountsQuery.error)}
          />
        </div>
      ) : null}

      {activeSection === "attendance" ? (
        <div className="rounded-3xl border border-border bg-card p-6">
          <AttendanceSection
            date={attendanceDate}
            onDateChange={setAttendanceDate}
            profiles={accountsQuery.data ?? []}
            profilesLoading={accountsQuery.isLoading}
            profilesIsError={accountsQuery.isError}
            profilesError={errMsg(accountsQuery.error)}
            checkIns={checkInsQuery.data ?? []}
            checkInsLoading={checkInsQuery.isLoading}
            checkInsIsError={checkInsQuery.isError}
            checkInsError={errMsg(checkInsQuery.error)}
            onMarkPresent={handleMarkPresent}
            onUndo={handleUndoCheckIn}
          />
        </div>
      ) : null}

      {activeSection === "reports" ? (
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
            adults={reportAdults}
            setAdults={setReportAdults}
            men={reportMen}
            setMen={setReportMen}
            women={reportWomen}
            setWomen={setReportWomen}
            children={reportChildren}
            setChildren={setReportChildren}
            firstTimers={reportFirstTimers}
            setFirstTimers={setReportFirstTimers}
            uploading={reportUploading}
            uploadError={reportError}
            uploadSuccess={reportSuccess}
            onSubmit={handleUploadReport}
            onDownload={handleDownloadReport}
          />
        </div>
      ) : null}

      {activeSection === "messaging" ? (
        <div className="rounded-3xl border border-border bg-card p-6">
          <MessagingSection
            rows={campaignsQuery.data ?? []}
            isLoading={campaignsQuery.isLoading}
            isError={campaignsQuery.isError}
            error={errMsg(campaignsQuery.error)}
            subject={msgSubject}
            setSubject={setMsgSubject}
            body={msgBody}
            setBody={setMsgBody}
            bodyMode={msgBodyMode}
            setBodyMode={setMsgBodyMode}
            serviceDate={msgServiceDate}
            setServiceDate={setMsgServiceDate}
            audience={msgAudience}
            setAudience={setMsgAudience}
            recipientEmailsText={msgRecipientEmailsText}
            setRecipientEmailsText={setMsgRecipientEmailsText}
            events={interestedEvents}
            eventSlug={msgEventSlug}
            setEventSlug={setMsgEventSlug}
            sendMode={msgSendMode}
            setSendMode={setMsgSendMode}
            scheduledFor={msgScheduledFor}
            setScheduledFor={setMsgScheduledFor}
            submitting={msgSubmitting}
            submitError={msgError}
            submitSuccess={msgSuccess}
            onSubmit={handleSendMessage}
            onCancelScheduled={handleCancelScheduledMessage}
          />
        </div>
      ) : null}

      {activeSection === "email-templates" ? (
        <div className="rounded-3xl border border-border bg-card p-6">
          <EmailTemplatesSection
            rows={emailTemplatesQuery.data ?? []}
            isLoading={emailTemplatesQuery.isLoading}
            isError={emailTemplatesQuery.isError}
            error={errMsg(emailTemplatesQuery.error)}
            onSave={handleSaveEmailTemplate}
          />
        </div>
      ) : null}

      {/* Owner Email — pastor only, same gating pattern as Offerings. */}
      {activeSection === "owner-email" && isPastor ? (
        <div className="rounded-3xl border border-border bg-card p-6">
          <OwnerEmailSection
            row={emailSettingsQuery.data ?? null}
            isLoading={emailSettingsQuery.isLoading}
            isError={emailSettingsQuery.isError}
            error={errMsg(emailSettingsQuery.error)}
            onSave={handleSaveOwnerEmails}
          />
        </div>
      ) : null}

      {/* Check-in Location — pastor only, same gating pattern as Offerings. */}
      {activeSection === "checkin-location" && isPastor ? (
        <div className="rounded-3xl border border-border bg-card p-6">
          <CheckinLocationSection
            row={checkinLocationQuery.data ?? null}
            isLoading={checkinLocationQuery.isLoading}
            isError={checkinLocationQuery.isError}
            error={errMsg(checkinLocationQuery.error)}
            onSave={handleSaveCheckinLocation}
          />
        </div>
      ) : null}

      {activeSection === "contact" ? (
        <div className="rounded-3xl border border-border bg-card p-6">
          <ContactMessagesSection
            rows={contactMessagesQuery.data ?? []}
            isLoading={contactMessagesQuery.isLoading}
            isError={contactMessagesQuery.isError}
            error={errMsg(contactMessagesQuery.error)}
            onDelete={handleDeleteContactMessage}
          />
        </div>
      ) : null}

      {activeSection === "prayer" ? (
        <div className="rounded-3xl border border-border bg-card p-6">
          <PrayerRequestsSection
            rows={prayerRequestsQuery.data ?? []}
            isLoading={prayerRequestsQuery.isLoading}
            isError={prayerRequestsQuery.isError}
            error={errMsg(prayerRequestsQuery.error)}
            onDelete={handleDeletePrayerRequest}
          />
        </div>
      ) : null}

      {activeSection === "event-interest" ? (
        <div className="rounded-3xl border border-border bg-card p-6">
          <EventInterestSection
            rows={eventInterestQuery.data ?? []}
            isLoading={eventInterestQuery.isLoading}
            isError={eventInterestQuery.isError}
            error={errMsg(eventInterestQuery.error)}
            onDelete={handleDeleteEventInterest}
          />
        </div>
      ) : null}

      {activeSection === "salvation" ? (
        <div className="rounded-3xl border border-border bg-card p-6">
          <SalvationDecisionsSection
            rows={salvationDecisionsQuery.data ?? []}
            isLoading={salvationDecisionsQuery.isLoading}
            isError={salvationDecisionsQuery.isError}
            error={errMsg(salvationDecisionsQuery.error)}
            onDelete={handleDeleteSalvationDecision}
          />
        </div>
      ) : null}

      {activeSection === "newsletter" ? (
        <div className="rounded-3xl border border-border bg-card p-6">
          <NewsletterSection
            rows={newsletterSubscribersQuery.data ?? []}
            isLoading={newsletterSubscribersQuery.isLoading}
            isError={newsletterSubscribersQuery.isError}
            error={errMsg(newsletterSubscribersQuery.error)}
            onDelete={handleDeleteNewsletterSubscriber}
          />
        </div>
      ) : null}

      {/* Offerings — pastor only. The render and the query are both gated
          on isPastor, so a non-pastor admin never sees this section or any
          of the financial data behind it (activeSection also can't be
          "offerings" for them — see the fallback above). */}
      {activeSection === "offerings" && isPastor ? (
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
      ) : null}

      {activeSection === "books" ? (
        <div className="rounded-3xl border border-border bg-card p-6">
          <BooksSection
            rows={booksQuery.data ?? []}
            isLoading={booksQuery.isLoading}
            isError={booksQuery.isError}
            error={errMsg(booksQuery.error)}
            formMode={bookFormMode}
            formValue={bookForm}
            onFormChange={(patch) => setBookForm((prev) => ({ ...prev, ...patch }))}
            coverFile={bookCoverFile}
            onCoverFileChange={setBookCoverFile}
            onOpenAdd={openAddBook}
            onOpenEdit={openEditBook}
            onCancelForm={closeBookForm}
            onSubmitForm={handleSubmitBook}
            onDelete={handleDeleteBook}
            formSubmitting={bookSubmitting}
            formError={bookError}
            formSuccess={bookSuccess}
          />
        </div>
      ) : null}

      {activeSection === "events" ? (
        <div className="rounded-3xl border border-border bg-card p-6">
          <EventsSection
            rows={eventsQuery.data ?? []}
            isLoading={eventsQuery.isLoading}
            isError={eventsQuery.isError}
            error={errMsg(eventsQuery.error)}
            formMode={eventFormMode}
            formValue={eventForm}
            onFormChange={(patch) => setEventForm((prev) => ({ ...prev, ...patch }))}
            flyerFile={eventFlyerFile}
            onFlyerFileChange={setEventFlyerFile}
            onOpenAdd={openAddEvent}
            onOpenEdit={openEditEvent}
            onCancelForm={closeEventForm}
            onSubmitForm={handleSubmitEvent}
            onDelete={handleDeleteEvent}
            formSubmitting={eventSubmitting}
            formError={eventError}
            formSuccess={eventSuccess}
          />
        </div>
      ) : null}

      {activeSection === "teachings" ? (
        <div className="rounded-3xl border border-border bg-card p-6">
          <TeachingsSection
            seriesRows={teachingsQuery.data ?? []}
            isLoading={teachingsQuery.isLoading}
            isError={teachingsQuery.isError}
            error={errMsg(teachingsQuery.error)}
            seriesFormMode={seriesFormMode}
            seriesFormValue={seriesForm}
            onSeriesFormChange={(patch) => setSeriesForm((prev) => ({ ...prev, ...patch }))}
            seriesImageFile={seriesImageFile}
            onSeriesImageFileChange={setSeriesImageFile}
            onOpenAddSeries={openAddSeries}
            onOpenEditSeries={openEditSeries}
            onCancelSeriesForm={closeSeriesForm}
            onSubmitSeriesForm={handleSubmitSeries}
            onDeleteSeries={handleDeleteSeries}
            seriesFormSubmitting={seriesSubmitting}
            seriesFormError={seriesError}
            seriesFormSuccess={seriesSuccess}
            selectedSeries={selectedSeries}
            onSelectSeries={(row) => setSelectedSeriesId(row?.id ?? null)}
            itemFormMode={itemFormMode}
            itemFormValue={itemForm}
            onItemFormChange={(patch) => setItemForm((prev) => ({ ...prev, ...patch }))}
            itemImageFile={itemImageFile}
            onItemImageFileChange={setItemImageFile}
            onOpenAddItem={openAddItem}
            onOpenEditItem={openEditItem}
            onCancelItemForm={closeItemForm}
            onSubmitItemForm={handleSubmitItem}
            onDeleteItem={handleDeleteItem}
            itemFormSubmitting={itemSubmitting}
            itemFormError={itemError}
            itemFormSuccess={itemSuccess}
          />
        </div>
      ) : null}

      {activeSection === "blog" ? (
        <div className="rounded-3xl border border-border bg-card p-6">
          <BlogSection
            rows={blogPostsQuery.data ?? []}
            isLoading={blogPostsQuery.isLoading}
            isError={blogPostsQuery.isError}
            error={errMsg(blogPostsQuery.error)}
            formMode={blogFormMode}
            formValue={blogForm}
            onFormChange={(patch) => setBlogForm((prev) => ({ ...prev, ...patch }))}
            imageFile={blogImageFile}
            onImageFileChange={setBlogImageFile}
            onOpenAdd={openAddBlogPost}
            onOpenEdit={openEditBlogPost}
            onCancelForm={closeBlogForm}
            onSubmitForm={handleSubmitBlogPost}
            onDelete={handleDeleteBlogPost}
            formSubmitting={blogSubmitting}
            formError={blogError}
            formSuccess={blogSuccess}
          />
        </div>
      ) : null}
    </div>
  );
}
