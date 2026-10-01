export type MemberRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  marital_status: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  preferred_contact: string | null;
  visitor_status: string | null;
  heard_about_us: string | null;
  baptized: boolean | null;
  ministry_interests: string[] | null;
  notes: string | null;
  consent_to_contact: boolean;
  created_at: string;
};

export type EmailTemplateKey =
  | "contact_confirmation"
  | "prayer_confirmation"
  | "salvation_confirmation"
  | "event_interest_confirmation"
  | "membership_confirmation"
  | "newsletter_confirmation"
  | "checkin_confirmation"
  | "owner_notification";

export type EmailTemplateRow = {
  key: EmailTemplateKey;
  subject: string;
  heading: string;
  body: string;
  mode: "visual" | "html";
  updated_at: string;
};

export type EmailSettingsRow = {
  owner_emails: string[];
};

export type CheckinLocationRow = {
  church_lat: number;
  church_lng: number;
  radius_meters: number;
};

export type ViewerRow = {
  id: string;
  viewer_id: string;
  viewed_at: string;
  profiles: { full_name: string | null; email: string | null } | null;
};

export type ViewerSummary = {
  viewer_id: string;
  full_name: string | null;
  email: string | null;
  totalViews: number;
  lastViewedAt: string;
};

export type CommentRow = {
  id: string;
  author_id: string;
  content_type: string;
  content_id: string;
  body: string;
  created_at: string;
  profiles: { full_name: string | null; email: string | null } | null;
};

export type AccountRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  role: string | null;
};

export type ReportRow = {
  id: string;
  title: string;
  service_date: string;
  file_path: string;
  notes: string | null;
  uploaded_by: string;
  created_at: string;
  attendance_adults: number | null;
  attendance_men: number | null;
  attendance_women: number | null;
  attendance_children: number | null;
  first_timers: number | null;
  profiles: { full_name: string | null } | null;
};

export type OfferingRow = {
  id: string;
  service_date: string;
  amount: number;
  category: string | null;
  notes: string | null;
  recorded_by: string;
  created_at: string;
  profiles: { full_name: string | null } | null;
};

export type CheckInRow = {
  id: string;
  member_id: string;
  service_date: string;
  checked_in_at: string;
  method: "gps" | "manual";
  checked_in_by: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type EmailCampaignRow = {
  id: string;
  subject: string;
  body: string;
  mode: "visual" | "html";
  service_date: string;
  audience: "present" | "absent" | "all" | "individual" | "event_interest" | "newsletter";
  status: "draft" | "scheduled" | "sent" | "failed" | "cancelled";
  scheduled_for: string | null;
  sent_at: string | null;
  created_by: string;
  created_at: string;
  // Only set when audience = "individual".
  recipient_emails: string[] | null;
  // Only set when audience = "event_interest".
  event_slug: string | null;
  event_title: string | null;
  profiles: { full_name: string | null } | null;
};

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export type PrayerRequestRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  category: string;
  request: string;
  confidential: boolean;
  created_at: string;
};

export type EventInterestRow = {
  id: string;
  event_slug: string;
  event_title: string;
  name: string;
  email: string;
  phone: string | null;
  guests: number;
  mode: "In person" | "Online";
  notes: string | null;
  created_at: string;
};

export type SalvationDecisionRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  decision: string;
  created_at: string;
};

export type NewsletterSubscriberRow = {
  id: string;
  email: string;
  created_at: string;
};

export type BookRow = {
  id: string;
  slug: string;
  title: string;
  author: string;
  price: string;
  category: string;
  description: string;
  cover_url: string;
  buy_url: string;
  created_at: string;
};

export type EventRow = {
  id: string;
  slug: string;
  title: string;
  type: string;
  start: string;
  end: string | null;
  location: string;
  flyer_url: string;
  summary: string;
  details: string[];
  registration: boolean;
  created_at: string;
};

export type TeachingItemRow = {
  id: string;
  series_id: string;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  youtube: string;
  image_url: string | null;
  summary: string | null;
  sort_order: number;
};

export type TeachingSeriesRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  image_url: string;
  created_at: string;
  cms_teaching_items: TeachingItemRow[];
};

export type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image_url: string;
  body: string;
  created_at: string;
};
