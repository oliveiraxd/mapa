-- Create USER_SURVEYS table for lead qualification and value ladder tracking
create table if not exists public.user_surveys (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  stage text not null,
  previous_attempt text not null,
  preferred_format text not null,
  whatsapp text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.user_surveys enable row level security;

-- Policies
create policy "Users can view their own survey responses"
  on public.user_surveys for select
  using (auth.uid() = user_id);

create policy "Users can insert their own survey responses"
  on public.user_surveys for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own survey responses"
  on public.user_surveys for update
  using (auth.uid() = user_id);
