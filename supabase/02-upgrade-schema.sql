-- ============================================================
-- FLC USA — Dashboard/CMS upgrade schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New
-- query), in the same project as the original schema.sql, AFTER that
-- file has already been run.
--
-- This is a consolidated end-state schema (not a literal history of
-- intermediate migrations) bringing this project's dashboard up to
-- parity with the grace-and-light-demo upgrade: member management with
-- roles, service reports + offerings + attendance, GPS check-in with a
-- dashboard-editable location, public form intake (contact/prayer/event
-- interest/salvation/newsletter), a messaging/email-campaign system with
-- scheduled dispatch, dashboard-editable email templates, and an
-- in-dashboard CMS for Books/Events/Teachings/Blog (replacing Sveltia).
--
-- ONE MANUAL STEP before running the very last section of this file
-- (search for "<YOUR_SUPABASE_SERVICE_ROLE_KEY>" below): replace that
-- placeholder with your real service-role key from Project Settings ->
-- API. Never commit that real key to git — it only ever lives pasted
-- directly into the SQL Editor for this one run.
-- ============================================================

-- ============================================================
-- 1. Membership signup form
-- ============================================================
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),

  full_name text not null,
  date_of_birth date,
  gender text,
  marital_status text,

  email text not null,
  phone text not null,
  address_street text,
  address_city text,
  address_state text,
  address_zip text,
  preferred_contact text, -- 'email' | 'phone' | 'text'

  visitor_status text,     -- 'first_time' | 'already_attending'
  heard_about_us text,
  baptized boolean,
  ministry_interests text[],

  notes text,
  consent_to_contact boolean not null default false,

  created_at timestamptz not null default now()
);

alter table public.members enable row level security;

drop policy if exists "Anyone can submit a membership form" on public.members;
create policy "Anyone can submit a membership form"
  on public.members for insert
  with check (true);

-- ============================================================
-- 2. Roles — member / staff / pastor
-- ============================================================
alter table public.profiles
  add column if not exists role text not null default 'member'
  check (role in ('member', 'staff', 'pastor'));

create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select coalesce(
    (select role in ('staff', 'pastor') from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.is_pastor()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select coalesce(
    (select role = 'pastor' from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ------------------------------------------------------------
-- HOW TO CREATE A DASHBOARD LOGIN / SET SOMEONE'S ROLE
-- ------------------------------------------------------------
-- 1. In the Supabase dashboard: Authentication -> Users -> "Add user"
--    -> "Create new user". Toggle "Auto Confirm User" ON.
-- 2. That creates their profiles row (role = 'member' by default).
-- 3. Assign their real role:
--    update public.profiles set role = 'staff'  where email = 'someone@example.com';
--    update public.profiles set role = 'pastor' where email = 'pastor@example.com';

-- Staff/pastor can view every membership submission.
drop policy if exists "Staff can view all member submissions" on public.members;
create policy "Staff can view all member submissions"
  on public.members for select
  using (public.is_admin());

-- Pastor-only edit/delete on members (staff keep read-only access).
drop policy if exists "Pastors can update members" on public.members;
create policy "Pastors can update members"
  on public.members for update
  using (public.is_pastor())
  with check (public.is_pastor());

drop policy if exists "Pastors can delete members" on public.members;
create policy "Pastors can delete members"
  on public.members for delete
  using (public.is_pastor());

-- Staff/pastor can moderate (delete) any comment, not just their own.
drop policy if exists "Admins can delete any comment" on public.comments;
create policy "Admins can delete any comment"
  on public.comments for delete
  using (public.is_admin());

-- ============================================================
-- 3. Livestream viewership
-- ============================================================
create table if not exists public.livestream_views (
  id uuid primary key default gen_random_uuid(),
  viewer_id uuid not null references public.profiles(id) on delete cascade,
  viewed_at timestamptz not null default now()
);

create index if not exists livestream_views_viewer_idx
  on public.livestream_views (viewer_id, viewed_at desc);

alter table public.livestream_views enable row level security;

drop policy if exists "Users can log their own livestream view" on public.livestream_views;
create policy "Users can log their own livestream view"
  on public.livestream_views for insert
  with check (auth.uid() = viewer_id);

drop policy if exists "Admins can view all livestream views" on public.livestream_views;
create policy "Admins can view all livestream views"
  on public.livestream_views for select
  using (public.is_admin());

-- ============================================================
-- 4. Service reports (with attendance + first-timers breakdown)
-- ============================================================
create table if not exists public.service_reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  service_date date not null,
  file_path text not null,
  notes text,
  attendance_adults integer check (attendance_adults >= 0),
  attendance_men integer check (attendance_men >= 0),
  attendance_women integer check (attendance_women >= 0),
  attendance_children integer check (attendance_children >= 0),
  first_timers integer check (first_timers >= 0),
  uploaded_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.service_reports enable row level security;

drop policy if exists "Admins can upload service reports" on public.service_reports;
create policy "Admins can upload service reports"
  on public.service_reports for insert
  with check (public.is_admin());

drop policy if exists "Admins can view service reports" on public.service_reports;
create policy "Admins can view service reports"
  on public.service_reports for select
  using (public.is_admin());

insert into storage.buckets (id, name, public)
values ('service-reports', 'service-reports', false)
on conflict (id) do nothing;

drop policy if exists "Admins can upload report files" on storage.objects;
create policy "Admins can upload report files"
  on storage.objects for insert
  with check (bucket_id = 'service-reports' and public.is_admin());

drop policy if exists "Admins can view report files" on storage.objects;
create policy "Admins can view report files"
  on storage.objects for select
  using (bucket_id = 'service-reports' and public.is_admin());

drop policy if exists "Admins can delete report files" on storage.objects;
create policy "Admins can delete report files"
  on storage.objects for delete
  using (bucket_id = 'service-reports' and public.is_admin());

-- ============================================================
-- 5. Offerings — pastor-only
-- ============================================================
create table if not exists public.offerings (
  id uuid primary key default gen_random_uuid(),
  service_date date not null,
  amount numeric(12, 2) not null check (amount >= 0),
  category text,
  notes text,
  recorded_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists offerings_date_idx on public.offerings (service_date);

alter table public.offerings enable row level security;

drop policy if exists "Pastors can insert offerings" on public.offerings;
create policy "Pastors can insert offerings"
  on public.offerings for insert
  with check (public.is_pastor());

drop policy if exists "Pastors can view offerings" on public.offerings;
create policy "Pastors can view offerings"
  on public.offerings for select
  using (public.is_pastor());

-- ============================================================
-- 6. GPS check-in
-- ============================================================
create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  service_date date not null default current_date,
  checked_in_at timestamptz not null default now(),
  method text not null check (method in ('gps', 'manual')),
  checked_in_by uuid references public.profiles(id),
  latitude double precision,
  longitude double precision,
  unique (member_id, service_date)
);

create index if not exists check_ins_date_idx on public.check_ins (service_date);

alter table public.check_ins enable row level security;

drop policy if exists "Members can self check-in via GPS" on public.check_ins;
create policy "Members can self check-in via GPS"
  on public.check_ins for insert
  with check (auth.uid() = member_id and method = 'gps');

drop policy if exists "Members can view their own check-ins" on public.check_ins;
create policy "Members can view their own check-ins"
  on public.check_ins for select
  using (auth.uid() = member_id);

drop policy if exists "Staff can manually check in members" on public.check_ins;
create policy "Staff can manually check in members"
  on public.check_ins for insert
  with check (public.is_admin() and method = 'manual' and checked_in_by = auth.uid());

drop policy if exists "Staff can view all check-ins" on public.check_ins;
create policy "Staff can view all check-ins"
  on public.check_ins for select
  using (public.is_admin());

drop policy if exists "Staff can delete check-ins" on public.check_ins;
create policy "Staff can delete check-ins"
  on public.check_ins for delete
  using (public.is_admin());

-- Check-in location as an editable dashboard setting (see section 10 for
-- the trigger function that reads from this table).
create table if not exists public.checkin_location_settings (
  id boolean primary key default true check (id),
  church_lat double precision not null,
  church_lng double precision not null,
  radius_meters double precision not null default 150,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

-- Placeholder coordinates — matches the TEST VALUE already hardcoded in
-- src/lib/checkin.ts (CHURCH_LOCATION). Replace with FLC USA's real
-- coordinates for 2415 Directors Row, Indianapolis, IN 46241 via the
-- dashboard's Check-in Location section once it's live.
insert into public.checkin_location_settings (id, church_lat, church_lng, radius_meters)
values (true, 4.982411, 7.971364, 150)
on conflict (id) do nothing;

alter table public.checkin_location_settings enable row level security;

drop policy if exists "Anyone can view checkin location" on public.checkin_location_settings;
create policy "Anyone can view checkin location"
  on public.checkin_location_settings for select
  using (true);

drop policy if exists "Pastors can update checkin location" on public.checkin_location_settings;
create policy "Pastors can update checkin location"
  on public.checkin_location_settings for update
  using (public.is_pastor())
  with check (public.is_pastor());

create or replace function public.validate_checkin_location()
returns trigger
language plpgsql
as $$
declare
  church_lat double precision;
  church_lng double precision;
  radius_meters double precision;
  distance_meters double precision;
begin
  if new.method = 'gps' then
    if new.latitude is null or new.longitude is null then
      raise exception 'Location is required for GPS check-in.';
    end if;

    select s.church_lat, s.church_lng, s.radius_meters
      into church_lat, church_lng, radius_meters
      from public.checkin_location_settings s
      where s.id = true;

    if church_lat is null then
      raise exception 'Check-in location has not been configured yet.';
    end if;

    distance_meters := 6371000 * acos(
      least(1.0, greatest(-1.0,
        cos(radians(church_lat)) * cos(radians(new.latitude)) *
        cos(radians(new.longitude) - radians(church_lng)) +
        sin(radians(church_lat)) * sin(radians(new.latitude))
      ))
    );

    if distance_meters > radius_meters then
      raise exception 'You need to be at the church to check in. You appear to be about % meters away.',
        round(distance_meters);
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists check_location_before_checkin on public.check_ins;
create trigger check_location_before_checkin
  before insert on public.check_ins
  for each row execute procedure public.validate_checkin_location();

-- ============================================================
-- 7. Public form intake — Contact, Prayer Request, Event Interest,
--    Salvation Decision, Newsletter Signup
-- ============================================================
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "Anyone can submit a contact message" on public.contact_messages;
create policy "Anyone can submit a contact message"
  on public.contact_messages for insert
  with check (true);

drop policy if exists "Staff can view contact messages" on public.contact_messages;
create policy "Staff can view contact messages"
  on public.contact_messages for select
  using (public.is_admin());

drop policy if exists "Staff can delete contact messages" on public.contact_messages;
create policy "Staff can delete contact messages"
  on public.contact_messages for delete
  using (public.is_admin());

-- Prayer requests: "confidential" rows are readable by the pastor only.
create table if not exists public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  category text not null check (category in (
    'Salvation', 'Healing', 'Family & Marriage', 'Finances & Provision',
    'Career & Business', 'Deliverance', 'Thanksgiving', 'Other'
  )),
  request text not null,
  confidential boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.prayer_requests enable row level security;

drop policy if exists "Anyone can submit a prayer request" on public.prayer_requests;
create policy "Anyone can submit a prayer request"
  on public.prayer_requests for insert
  with check (true);

drop policy if exists "Staff and pastor can view non-confidential prayer requests" on public.prayer_requests;
create policy "Staff and pastor can view non-confidential prayer requests"
  on public.prayer_requests for select
  using (public.is_admin() and confidential = false);

drop policy if exists "Only pastor can view confidential prayer requests" on public.prayer_requests;
create policy "Only pastor can view confidential prayer requests"
  on public.prayer_requests for select
  using (public.is_pastor() and confidential = true);

drop policy if exists "Staff can delete prayer requests" on public.prayer_requests;
create policy "Staff can delete prayer requests"
  on public.prayer_requests for delete
  using (public.is_admin());

-- Event interest — events are static data (src/data/events.ts), so the
-- slug/title are stored as plain text rather than a foreign key.
create table if not exists public.event_interest (
  id uuid primary key default gen_random_uuid(),
  event_slug text not null,
  event_title text not null,
  name text not null,
  email text not null,
  phone text,
  guests integer not null default 1,
  mode text not null check (mode in ('In person', 'Online')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists event_interest_slug_idx on public.event_interest (event_slug);

alter table public.event_interest enable row level security;

drop policy if exists "Anyone can register interest in an event" on public.event_interest;
create policy "Anyone can register interest in an event"
  on public.event_interest for insert
  with check (true);

drop policy if exists "Staff can view event interest" on public.event_interest;
create policy "Staff can view event interest"
  on public.event_interest for select
  using (public.is_admin());

drop policy if exists "Staff can delete event interest" on public.event_interest;
create policy "Staff can delete event interest"
  on public.event_interest for delete
  using (public.is_admin());

create table if not exists public.salvation_decisions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  location text,
  decision text not null check (decision in (
    'I gave my life to Christ for the first time',
    'I rededicated my life to Christ',
    'I would like to speak with a pastor'
  )),
  created_at timestamptz not null default now()
);

alter table public.salvation_decisions enable row level security;

drop policy if exists "Anyone can submit a salvation decision" on public.salvation_decisions;
create policy "Anyone can submit a salvation decision"
  on public.salvation_decisions for insert
  with check (true);

drop policy if exists "Staff can view salvation decisions" on public.salvation_decisions;
create policy "Staff can view salvation decisions"
  on public.salvation_decisions for select
  using (public.is_admin());

drop policy if exists "Staff can delete salvation decisions" on public.salvation_decisions;
create policy "Staff can delete salvation decisions"
  on public.salvation_decisions for delete
  using (public.is_admin());

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Anyone can subscribe to the newsletter" on public.newsletter_subscribers;
create policy "Anyone can subscribe to the newsletter"
  on public.newsletter_subscribers for insert
  with check (true);

drop policy if exists "Staff can view newsletter subscribers" on public.newsletter_subscribers;
create policy "Staff can view newsletter subscribers"
  on public.newsletter_subscribers for select
  using (public.is_admin());

drop policy if exists "Staff can delete newsletter subscribers" on public.newsletter_subscribers;
create policy "Staff can delete newsletter subscribers"
  on public.newsletter_subscribers for delete
  using (public.is_admin());

-- ============================================================
-- 8. Messaging / email campaigns (with scheduled dispatch)
-- ============================================================
create table if not exists public.email_campaigns (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  body text not null,
  mode text not null default 'visual' check (mode in ('visual', 'html')),
  service_date date not null,
  audience text not null check (audience in (
    'present', 'absent', 'all', 'individual', 'event_interest', 'newsletter'
  )),
  recipient_emails text[],
  event_slug text,
  event_title text,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'sent', 'failed', 'cancelled')),
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists email_campaigns_status_idx on public.email_campaigns (status, scheduled_for);

alter table public.email_campaigns enable row level security;

drop policy if exists "Staff can manage email campaigns" on public.email_campaigns;
create policy "Staff can manage email campaigns"
  on public.email_campaigns for all
  using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.email_campaign_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.email_campaigns(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  email text not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  error text,
  sent_at timestamptz
);

create index if not exists email_campaign_recipients_campaign_idx
  on public.email_campaign_recipients (campaign_id);

alter table public.email_campaign_recipients enable row level security;

drop policy if exists "Staff can view campaign recipients" on public.email_campaign_recipients;
create policy "Staff can view campaign recipients"
  on public.email_campaign_recipients for select
  using (public.is_admin());

-- ============================================================
-- 9. In-dashboard CMS — Books, Events, Teachings, Blog
--    (replaces Sveltia CMS at /admin — see scripts/migrate-cms-content.mjs
--    to import this project's own content/*.md into these tables)
-- ============================================================
create table if not exists public.cms_books (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  author text not null,
  price text not null,
  category text not null,
  description text not null,
  cover_url text not null,
  buy_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cms_books enable row level security;

drop policy if exists "Anyone can view books" on public.cms_books;
create policy "Anyone can view books"
  on public.cms_books for select
  using (true);

drop policy if exists "Admins can manage books" on public.cms_books;
create policy "Admins can manage books"
  on public.cms_books for all
  using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.cms_events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  type text not null,
  start timestamptz not null,
  "end" timestamptz,
  location text not null,
  flyer_url text not null,
  summary text not null,
  details text[] not null default '{}',
  registration boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cms_events_start_idx on public.cms_events (start);

alter table public.cms_events enable row level security;

drop policy if exists "Anyone can view events" on public.cms_events;
create policy "Anyone can view events"
  on public.cms_events for select
  using (true);

drop policy if exists "Admins can manage events" on public.cms_events;
create policy "Admins can manage events"
  on public.cms_events for all
  using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.cms_teachings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  image_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cms_teachings enable row level security;

drop policy if exists "Anyone can view teaching series" on public.cms_teachings;
create policy "Anyone can view teaching series"
  on public.cms_teachings for select
  using (true);

drop policy if exists "Admins can manage teaching series" on public.cms_teachings;
create policy "Admins can manage teaching series"
  on public.cms_teachings for all
  using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.cms_teaching_items (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.cms_teachings(id) on delete cascade,
  title text not null,
  speaker text not null,
  date date not null,
  duration text not null,
  youtube text not null,
  image_url text,
  summary text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cms_teaching_items_series_idx on public.cms_teaching_items (series_id, sort_order);

alter table public.cms_teaching_items enable row level security;

drop policy if exists "Anyone can view teaching items" on public.cms_teaching_items;
create policy "Anyone can view teaching items"
  on public.cms_teaching_items for select
  using (true);

drop policy if exists "Admins can manage teaching items" on public.cms_teaching_items;
create policy "Admins can manage teaching items"
  on public.cms_teaching_items for all
  using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.cms_blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  date date not null,
  author text not null,
  category text not null,
  image_url text not null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cms_blog_posts enable row level security;

drop policy if exists "Anyone can view blog posts" on public.cms_blog_posts;
create policy "Anyone can view blog posts"
  on public.cms_blog_posts for select
  using (true);

drop policy if exists "Admins can manage blog posts" on public.cms_blog_posts;
create policy "Admins can manage blog posts"
  on public.cms_blog_posts for all
  using (public.is_admin())
  with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('cms-media', 'cms-media', true)
on conflict (id) do nothing;

drop policy if exists "Anyone can view CMS media" on storage.objects;
create policy "Anyone can view CMS media"
  on storage.objects for select
  using (bucket_id = 'cms-media');

drop policy if exists "Admins can upload CMS media" on storage.objects;
create policy "Admins can upload CMS media"
  on storage.objects for insert
  with check (bucket_id = 'cms-media' and public.is_admin());

drop policy if exists "Admins can update CMS media" on storage.objects;
create policy "Admins can update CMS media"
  on storage.objects for update
  using (bucket_id = 'cms-media' and public.is_admin())
  with check (bucket_id = 'cms-media' and public.is_admin());

drop policy if exists "Admins can delete CMS media" on storage.objects;
create policy "Admins can delete CMS media"
  on storage.objects for delete
  using (bucket_id = 'cms-media' and public.is_admin());

-- ============================================================
-- 10. Editable email templates + owner inbox setting
-- ============================================================
create table if not exists public.email_templates (
  key text primary key,
  subject text not null,
  heading text not null,
  body text not null,
  mode text not null default 'visual' check (mode in ('visual', 'html')),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

alter table public.email_templates enable row level security;

drop policy if exists "Staff can view email templates" on public.email_templates;
create policy "Staff can view email templates"
  on public.email_templates for select
  using (public.is_admin());

drop policy if exists "Staff can manage email templates" on public.email_templates;
create policy "Staff can manage email templates"
  on public.email_templates for all
  using (public.is_admin())
  with check (public.is_admin());

-- Seed every key the app sends. `on conflict do nothing` so re-running
-- this (or running it after a pastor has already edited copy) never
-- clobbers their changes.
insert into public.email_templates (key, subject, heading, body) values
  ('contact_confirmation', 'We received your message — Fountain of Life Church USA', 'Message sent!',
   'Hi {{name}}, thanks for reaching out to Fountain of Life Church USA. We''ve received your message and our team will get back to you shortly.'),
  ('prayer_confirmation', 'We received your prayer request — Fountain of Life Church USA', 'Prayer request received',
   'Hi {{name}}, thank you for sharing your prayer request with us. Our intercessory team will be praying with you.'),
  ('salvation_confirmation', 'Welcome to the family! — Fountain of Life Church USA', 'Welcome to the family!',
   'Hi {{name}}, welcome to the family! Someone from our team will reach out to you shortly to help you take your next steps.'),
  ('event_interest_confirmation', 'You''re registered for {{event}} — Fountain of Life Church USA', 'You''re registered!',
   'Hi {{name}}, thanks for registering your interest in {{event}}. We''ll send you a reminder closer to the date.'),
  ('membership_confirmation', 'Welcome to Fountain of Life Church USA!', 'Welcome to Fountain of Life Church USA!',
   'Hi {{name}}, thank you for joining our family! Someone from our team will be in touch with you shortly.'),
  ('newsletter_confirmation', 'You''re on the list! — Fountain of Life Church USA', 'You''re on the list!',
   'Thanks for subscribing to our newsletter — you''ll hear from us soon with updates from Fountain of Life Church USA.'),
  ('checkin_confirmation', 'You''re checked in ✓ — Fountain of Life Church USA', 'You''re checked in ✓',
   'Hi {{name}}, you''re checked in for today''s service. Thanks for being here!'),
  ('owner_notification', 'New {{form_name}} — flcusa.org', 'New {{form_name}}',
   'You''ve received a new submission from the website. Details are below:')
on conflict (key) do nothing;

create table if not exists public.email_settings (
  id boolean primary key default true check (id),
  owner_emails text[] not null default array['info@flcusa.org'],
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

insert into public.email_settings (id) values (true) on conflict (id) do nothing;

alter table public.email_settings enable row level security;

drop policy if exists "Pastors can view email settings" on public.email_settings;
create policy "Pastors can view email settings"
  on public.email_settings for select
  using (public.is_pastor());

drop policy if exists "Pastors can update email settings" on public.email_settings;
create policy "Pastors can update email settings"
  on public.email_settings for update
  using (public.is_pastor())
  with check (public.is_pastor());

-- ============================================================
-- 11. Automatic dispatch for scheduled messaging campaigns
-- ------------------------------------------------------------
-- Every minute, checks email_campaigns for anything "scheduled" whose
-- time has arrived, and calls the dispatch-scheduled-campaigns edge
-- function to send it through Resend.
--
-- IMPORTANT: once this runs, scheduling a message for later WILL really
-- email people at that time, with no further action from anyone.
--
-- >>> Replace <YOUR_SUPABASE_SERVICE_ROLE_KEY> below with the real value
-- from Project Settings -> API before running this section. <<<
-- ============================================================

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

do $$
begin
  if not exists (select 1 from vault.secrets where name = 'service_role_key') then
    perform vault.create_secret(
      '<YOUR_SUPABASE_SERVICE_ROLE_KEY>',
      'service_role_key',
      'Used by the scheduled-messaging cron job to call the dispatch edge function.'
    );
  end if;
end $$;

select cron.schedule(
  'dispatch-scheduled-campaigns',
  '* * * * *',
  $$
  select net.http_post(
    url := 'https://wxpfqmvdhotvcntwanxg.supabase.co/functions/v1/dispatch-scheduled-campaigns',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'service_role_key')
    ),
    body := '{}'::jsonb
  );
  $$
);
