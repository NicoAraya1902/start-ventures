-- Fix critical security issue: Remove overly permissive authenticated user policy
-- and implement proper user-specific access controls

-- Remove the dangerous policy that allows any authenticated user to see all profiles
DROP POLICY IF EXISTS "Authenticated users only" ON public.profiles;

-- The existing policies are actually more secure and appropriate:
-- 1. "Users can view own profile" - allows users to see their own full profile
-- 2. "Connected users can view basic profile info" - allows connected users to see limited info
-- 3. "Users can insert their own profile" - allows users to create their own profile
-- 4. "Users can update their own profile" - allows users to update their own profile

-- Let's verify these policies are sufficient and secure:

-- Policy 1: Users can view their own complete profile (this is secure)
-- This policy already exists: "Users can view own profile" USING (auth.uid() = user_id)

-- Policy 2: Connected users can view limited profile info (this is secure)  
-- This policy already exists: "Connected users can view basic profile info"
-- USING (EXISTS (SELECT 1 FROM contact_requests WHERE ... AND status = 'accepted'))

-- The discovery function uses SECURITY DEFINER so it can access profiles
-- while only returning safe, non-sensitive fields to anonymous users

-- Let's ensure the existing policies are optimal by recreating them clearly:

-- First, let's drop and recreate the connection-based policy to make it more explicit
DROP POLICY IF EXISTS "Connected users can view basic profile info" ON public.profiles;
DROP POLICY IF EXISTS "Connected users can view profile info" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Create a single, comprehensive SELECT policy that combines both conditions
CREATE POLICY "Users can view own and connected profiles" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can always see their own profile
  auth.uid() = user_id
  OR
  -- Or if they are connected via accepted contact request
  EXISTS (
    SELECT 1 FROM public.contact_requests
    WHERE (
      (sender_id = auth.uid() AND receiver_id = profiles.user_id) OR
      (sender_id = profiles.user_id AND receiver_id = auth.uid())
    ) AND status = 'accepted'
  )
);

-- Note: The get_discovery_profiles() function bypasses RLS using SECURITY DEFINER
-- and only returns safe fields, so anonymous discovery still works securely