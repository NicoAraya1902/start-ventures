-- Fix critical security issue: Remove overly permissive discovery policy
-- The current "Discovery profiles only for authenticated users" policy allows
-- any authenticated user to access all profile data directly from the table

-- Drop the problematic policy that exposes all user data
DROP POLICY IF EXISTS "Discovery profiles only for authenticated users" ON public.profiles;

-- The remaining policies are sufficient:
-- 1. "Users can view own profile" - users can see their own data
-- 2. "Users can view connected profiles" - users can see connected contacts
-- 3. Discovery data is safely handled through the security definer function get_discovery_profiles()
--    which filters and limits what data is exposed

-- The get_discovery_profiles() function uses SECURITY DEFINER so it can access
-- the table even with restrictive RLS policies, ensuring discovery works safely