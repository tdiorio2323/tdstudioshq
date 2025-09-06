-- Add missing DELETE policy for user_roles to fix RLS warning
CREATE POLICY "Users can delete their own roles" ON public.user_roles
  FOR DELETE USING (auth.uid() = user_id);

-- Add missing DELETE policy for profiles
CREATE POLICY "Users can delete their own profile" ON public.profiles
  FOR DELETE USING (auth.uid() = user_id);