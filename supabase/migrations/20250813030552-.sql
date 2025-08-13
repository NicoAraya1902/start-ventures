-- Remove the problematic view entirely and replace with a different approach
DROP VIEW IF EXISTS public.profile_discovery;

-- Instead of a view, create a function that returns the safe profile data
-- This gives us more control over security
CREATE OR REPLACE FUNCTION public.get_discovery_profiles()
RETURNS TABLE (
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
STABLE
SECURITY INVOKER  -- This ensures it runs with caller's privileges, not definer's
SET search_path = public
AS $$
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
  FROM public.profiles p;
$$;

-- Grant execute permission to the function
GRANT EXECUTE ON FUNCTION public.get_discovery_profiles() TO anon, authenticated;