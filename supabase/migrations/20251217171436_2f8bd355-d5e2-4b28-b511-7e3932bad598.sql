-- Create table for storing user checklist item progress
CREATE TABLE public.user_checklist_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  card_id TEXT NOT NULL,
  item_index INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, card_id, item_index)
);

-- Enable Row Level Security
ALTER TABLE public.user_checklist_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own checklist progress
CREATE POLICY "Users can view own checklist progress"
ON public.user_checklist_progress
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own checklist progress
CREATE POLICY "Users can insert own checklist progress"
ON public.user_checklist_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own checklist progress
CREATE POLICY "Users can update own checklist progress"
ON public.user_checklist_progress
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can view all checklist progress
CREATE POLICY "Admins can view all checklist progress"
ON public.user_checklist_progress
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_user_checklist_progress_updated_at
BEFORE UPDATE ON public.user_checklist_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();