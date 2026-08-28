export type MemberRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  visitor_status: string | null;
  ministry_interests: string[] | null;
  created_at: string;
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
  is_admin: boolean | null;
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
