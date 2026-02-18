-- Fix UPDATE policy to include WITH CHECK for proper upsert functionality
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;

CREATE POLICY "Users can update own progress"
ON public.user_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);