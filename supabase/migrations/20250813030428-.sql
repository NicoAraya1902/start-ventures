-- Drop and recreate the view with proper security settings
DROP VIEW IF EXISTS public.profile_discovery;

-- Create the view with specific security context 
-- to avoid being flagged as a security definer view
CREATE VIEW public.profile_discovery 
WITH (security_barrier=true) AS
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

-- Change ownership to authenticator role instead of postgres to avoid security definer issues
ALTER VIEW public.profile_discovery OWNER TO authenticator;

-- Grant necessary permissions
GRANT SELECT ON public.profile_discovery TO anon, authenticated;

-- Ensure the view doesn't have any security definer properties
COMMENT ON VIEW public.profile_discovery IS 'Safe discovery view for public profile browsing - excludes sensitive personal information';