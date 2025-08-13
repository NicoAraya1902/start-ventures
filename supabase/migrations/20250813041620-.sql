-- Remove the old restrictive policy since we have a new comprehensive one
DROP POLICY "Users can view own profile" ON public.profiles;