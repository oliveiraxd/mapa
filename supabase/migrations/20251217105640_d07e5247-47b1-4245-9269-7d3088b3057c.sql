-- Add PERMISSIVE policy allowing users to delete their own profile
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = id);