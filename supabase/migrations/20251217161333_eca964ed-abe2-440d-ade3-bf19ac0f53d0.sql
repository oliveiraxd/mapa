-- Create table for diagnostic responses
CREATE TABLE public.diagnostic_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  responses jsonb NOT NULL DEFAULT '{}',
  next_steps jsonb NOT NULL DEFAULT '[]',
  score integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE public.diagnostic_responses ENABLE ROW LEVEL SECURITY;

-- Users can view their own diagnostic
CREATE POLICY "Users can view own diagnostic"
ON public.diagnostic_responses
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own diagnostic
CREATE POLICY "Users can insert own diagnostic"
ON public.diagnostic_responses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own diagnostic
CREATE POLICY "Users can update own diagnostic"
ON public.diagnostic_responses
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can view all diagnostics
CREATE POLICY "Admins can view all diagnostics"
ON public.diagnostic_responses
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_diagnostic_responses_updated_at
BEFORE UPDATE ON public.diagnostic_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();