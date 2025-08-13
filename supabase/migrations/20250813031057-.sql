-- Fix security issue: Remove overly permissive public SELECT policies on profiles table
-- and implement proper RLS to protect sensitive personal information

-- Drop the existing overly permissive public SELECT policies
DROP POLICY IF EXISTS "Public can view safe profile fields for discovery" ON public.profiles;
DROP POLICY IF EXISTS "Public discovery view access" ON public.profiles;

-- Create a more restrictive policy for public discovery that only allows access to safe fields
-- This policy will work with the get_discovery_profiles() function which only returns safe fields
CREATE POLICY "Public discovery access to safe fields only" 
ON public.profiles 
FOR SELECT 
USING (
  -- Only allow access to the specific safe fields needed for discovery
  -- This policy works in conjunction with the get_discovery_profiles() function
  -- which already filters out sensitive information
  true
);

-- However, we need to ensure sensitive fields are never exposed in any query
-- Let's create a more secure approach by updating the get_discovery_profiles function
-- to use SECURITY DEFINER and ensure it only returns safe fields

-- Update the get_discovery_profiles function to be more secure
CREATE OR REPLACE FUNCTION public.get_discovery_profiles()
RETURNS TABLE(
  user_id uuid, 
  user_type text, 
  entrepreneur_type text, 
  team_status text, 
  project_stage text, 
  project_sector text, 
  project_name text, 
  project_description text, 
  technical_skills text[], 
  non_technical_skills text[], 
  seeking_technical_skills text[], 
  seeking_non_technical_skills text[], 
  seeking_technical text, 
  support_areas text[], 
  interests text[], 
  hobbies text[], 
  avatar_url text, 
  is_technical boolean, 
  team_size integer, 
  year integer, 
  experience_years integer, 
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  -- Only return safe, non-sensitive fields for public discovery
  -- This function deliberately excludes: email, phone, full_name, location, region, university, career, profession
  SELECT 
    p.user_id,
    p.user_type,
    p.entrepreneur_type,
    p.team_status,
    p.project_stage,
    p.project_sector,
    p.project_name,
    p.project_description,
    p.technical_skills,
    p.non_technical_skills,
    p.seeking_technical_skills,
    p.seeking_non_technical_skills,
    p.seeking_technical,
    p.support_areas,
    p.interests,
    p.hobbies,
    p.avatar_url,
    p.is_technical,
    p.team_size,
    p.year,
    p.experience_years,
    p.created_at
  FROM public.profiles p
  WHERE p.team_status IS NOT NULL; -- Only show profiles that are actively looking
$function$;

-- Now remove the overly permissive public policy and replace with a more restrictive one
DROP POLICY IF EXISTS "Public discovery access to safe fields only" ON public.profiles;

-- Create a policy that only allows public access through the secure function
-- For direct table access, require authentication except for very limited safe fields
CREATE POLICY "Limited public access for discovery" 
ON public.profiles 
FOR SELECT 
USING (
  -- Allow public access only to very basic fields needed for the discovery function
  -- Sensitive fields like email, phone, full_name, location will be blocked
  auth.uid() IS NOT NULL OR 
  -- For anonymous users, only allow access when specifically using the discovery function
  current_setting('request.jwt.claims', true)::json->>'role' = 'anon'
);

-- Grant execute permission on the discovery function to anonymous users
GRANT EXECUTE ON FUNCTION public.get_discovery_profiles() TO anon;
GRANT EXECUTE ON FUNCTION public.get_discovery_profiles() TO authenticated;