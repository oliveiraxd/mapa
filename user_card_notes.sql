-- Create the user_card_notes table
create table if not exists public.user_card_notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  card_id text not null,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint user_card_notes_user_card_unique unique (user_id, card_id)
);

-- Enable Row Level Security (RLS)
alter table public.user_card_notes enable row level security;

-- Create policies
create policy "Users can view their own notes"
  on public.user_card_notes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own notes"
  on public.user_card_notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own notes"
  on public.user_card_notes for update
  using (auth.uid() = user_id);
