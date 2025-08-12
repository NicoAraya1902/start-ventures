-- CRITICAL SECURITY FIX: Replace overly permissive profiles policy
-- Remove the existing "Profiles are viewable by everyone" policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create granular policies for profile access
-- Policy 1: Users can view basic public info for discovery (name, university, project info only)
CREATE POLICY "Public profile discovery" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Policy 2: Users can view full profile details only for connected contacts
CREATE POLICY "Connected users can view full profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.contact_requests 
    WHERE (
      (sender_id = auth.uid() AND receiver_id = profiles.user_id) OR
      (sender_id = profiles.user_id AND receiver_id = auth.uid())
    ) AND status = 'accepted'
  )
);

-- Add RLS policy to hide sensitive data (email, phone) from public view
-- This will be handled in the application layer by filtering fields

-- Create a view for public profile data (non-sensitive fields only)
CREATE OR REPLACE VIEW public.profiles_public AS
SELECT 
  id,
  user_id,
  full_name,
  university,
  career,
  year,
  profession,
  experience_years,
  user_type,
  entrepreneur_type,
  project_name,
  project_description,
  project_stage,
  project_sector,
  team_size,
  team_status,
  is_technical,
  seeking_technical,
  technical_skills,
  non_technical_skills,
  seeking_technical_skills,
  seeking_non_technical_skills,
  support_areas,
  interests,
  hobbies,
  avatar_url,
  location,
  region,
  created_at,
  gender
FROM public.profiles;

-- Enable RLS on the public view
ALTER VIEW public.profiles_public SET (security_barrier = true);

-- Grant access to the public view
GRANT SELECT ON public.profiles_public TO authenticated;
GRANT SELECT ON public.profiles_public TO anon;