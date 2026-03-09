-- TotoTrip Initial Schema
-- Run this migration against Supabase once the domain is configured.

-- Users (由 Supabase Auth 管理，这里只扩展 profiles)
create table public.profiles (
  id uuid references auth.users primary key,
  display_name text,
  avatar_url text,
  preferred_language text default 'en',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Saved Trips
create table public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  cities text[] default '{}',
  days integer,
  itinerary jsonb,
  locations jsonb,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Chat Sessions  
create table public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text,
  messages jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Feedback
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  type text not null check (type in ('bug', 'feature', 'general')),
  message text not null,
  page_url text,
  user_agent text,
  created_at timestamptz default now()
);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.feedback enable row level security;

-- Users can read/update own profile
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Users can CRUD own trips
create policy "Users can view own trips" on public.trips for select using (auth.uid() = user_id);
create policy "Users can insert own trips" on public.trips for insert with check (auth.uid() = user_id);
create policy "Users can update own trips" on public.trips for update using (auth.uid() = user_id);
create policy "Users can delete own trips" on public.trips for delete using (auth.uid() = user_id);
-- Public trips viewable by all
create policy "Public trips viewable" on public.trips for select using (is_public = true);

-- Chat sessions
create policy "Users can view own chats" on public.chat_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own chats" on public.chat_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own chats" on public.chat_sessions for update using (auth.uid() = user_id);
create policy "Users can delete own chats" on public.chat_sessions for delete using (auth.uid() = user_id);

-- Anyone can submit feedback
create policy "Anyone can submit feedback" on public.feedback for insert with check (true);
