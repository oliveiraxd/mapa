-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create Enum for App Roles
create type public.app_role as enum ('admin', 'user');

-- 1. Create PROFILES table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Check if trigger exists before creating to avoid errors (simplified by dropping first provided it's safe)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Create USER_PROGRESS table (For "Concluído" button)
create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  card_id text not null,
  completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, card_id)
);

-- RLS for User Progress
alter table public.user_progress enable row level security;
create policy "Users can view own progress" on public.user_progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on public.user_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on public.user_progress for update using (auth.uid() = user_id);

-- 3. Create USER_CHECKLIST_PROGRESS table (For checklist items)
create table if not exists public.user_checklist_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  card_id text not null,
  item_index integer not null,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, card_id, item_index)
);

-- RLS for Checklist Progress
alter table public.user_checklist_progress enable row level security;
create policy "Users can view own checklist" on public.user_checklist_progress for select using (auth.uid() = user_id);
create policy "Users can insert own checklist" on public.user_checklist_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own checklist" on public.user_checklist_progress for update using (auth.uid() = user_id);

-- 4. Create USER_ROLES table (Optional, but good for completeness)
create table if not exists public.user_roles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  role app_role default 'user',
  unique(user_id, role)
);

-- RLS for User Roles
alter table public.user_roles enable row level security;
create policy "Users can view own roles" on public.user_roles for select using (auth.uid() = user_id);
create policy "Only admins can manage roles" on public.user_roles for all using (
  exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  )
);
