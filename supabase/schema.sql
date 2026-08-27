-- ============================================================
-- FLC USA — Phase 2: Member accounts + comments
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- One row per member, linked 1:1 to Supabase's built-in auth.users table.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone can read basic profile info (needed to show a commenter's name).
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- Members can only edit their own profile.
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Automatically create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Comments — shared table for both the livestream page and the
-- daily devotional pages, distinguished by content_type/content_id.
--   content_type = 'livestream'  → content_id = 'general' (one ongoing feed)
--   content_type = 'devotional'  → content_id = the devotional's date, e.g. '2026-08-21'
-- ============================================================
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  content_type text not null check (content_type in ('livestream', 'devotional')),
  content_id text not null,
  body text not null check (char_length(trim(body)) > 0 and char_length(body) <= 1000),
  created_at timestamptz not null default now()
);

create index if not exists comments_lookup_idx
  on public.comments (content_type, content_id, created_at desc);

alter table public.comments enable row level security;

-- Everyone (including signed-out visitors) can read comments.
create policy "Comments are viewable by everyone"
  on public.comments for select
  using (true);

-- Only signed-in users can post, and only as themselves.
create policy "Authenticated users can insert their own comments"
  on public.comments for insert
  with check (auth.uid() = author_id);

-- Members can delete their own comments (e.g. to remove a typo/mistake).
create policy "Users can delete their own comments"
  on public.comments for delete
  using (auth.uid() = author_id);

-- Enable Realtime so comments appear live for everyone watching, without a refresh.
alter publication supabase_realtime add table public.comments;
