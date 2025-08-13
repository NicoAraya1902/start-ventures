-- Fix the security definer function by adding search_path protection
CREATE OR REPLACE FUNCTION public.get_connected_profile_details(target_user_id uuid)
RETURNS TABLE (
  user_id uuid,
  full_name text,
  email text,
  phone text,
  location text,
  region text,
  university text,
  career text,
  profession text,
  user_type text,
  avatar_url text,
  project_name text,
  project_description text,
  technical_skills text[],
  non_technical_skills text[],
  interests text[],
  support_areas text[]
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public  -- Fix: Set immutable search path
AS $$
  SELECT 
    p.user_id,
    p.full_name,
    p.email,
    p.phone,
    p.location,
    p.region,
    p.university,
    p.career,
    p.profession,
    p.user_type,
    p.avatar_url,
    p.project_name,
    p.project_description,
    p.technical_skills,
    p.non_technical_skills,
    p.interests,
    p.support_areas
  FROM public.profiles p
  WHERE p.user_id = target_user_id
    AND (
      -- User can see their own profile
      auth.uid() = target_user_id
      OR
      -- Or if they are connected via accepted contact request
      EXISTS (
        SELECT 1 FROM public.contact_requests cr
        WHERE (
          (cr.sender_id = auth.uid() AND cr.receiver_id = target_user_id) OR
          (cr.sender_id = target_user_id AND cr.receiver_id = auth.uid())
        ) AND cr.status = 'accepted'
      )
    );
$$;

-- Remove the problematic security definer view and replace with a regular view
DROP VIEW IF EXISTS public.profile_discovery;

-- Create a regular view for safe profile discovery (no security definer)
CREATE VIEW public.profile_discovery AS
SELECT 
  user_id,
  user_type,
  entrepreneur_type,
  team_status,
  project_stage,
  project_sector,
  project_name,
  project_description,
  technical_skills,
  non_technical_skills,
  seeking_technical_skills,
  seeking_non_technical_skills,
  seeking_technical,
  support_areas,
  interests,
  hobbies,
  avatar_url,
  is_technical,
  team_size,
  year,
  experience_years,
  created_at
FROM public.profiles;

-- Grant access to the view
GRANT SELECT ON public.profile_discovery TO anon, authenticated;