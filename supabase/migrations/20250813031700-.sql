-- Fix remaining security issue: Completely remove public access to profiles table
-- Only allow access through authenticated users and the secure discovery function

-- Drop the still-too-permissive policy
DROP POLICY IF EXISTS "Limited public access for discovery" ON public.profiles;

-- Create a strict policy that ONLY allows authenticated users to access profiles directly
CREATE POLICY "Authenticated users only" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- The get_discovery_profiles() function already uses SECURITY DEFINER
-- so it can access the table even when called by anonymous users
-- but it only returns safe, non-sensitive fields

-- Ensure the discovery function has the right permissions
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.profiles FROM public;

-- Only grant specific access to authenticated users
GRANT SELECT ON public.profiles TO authenticated;

-- Ensure the discovery function can still be called by anonymous users
-- (the function itself uses SECURITY DEFINER to access the table)
GRANT EXECUTE ON FUNCTION public.get_discovery_profiles() TO anon;
GRANT EXECUTE ON FUNCTION public.get_discovery_profiles() TO authenticated;