-- Update get_discovery_profiles function to only show complete profiles
-- A profile is complete if it has all mandatory fields filled (excluding phone and avatar_url which are optional)
CREATE OR REPLACE FUNCTION public.get_discovery_profiles()
 RETURNS TABLE(user_id uuid, full_name text, user_type text, entrepreneur_type text, team_status text, project_stage text, project_sector text, project_name text, project_description text, technical_skills text[], non_technical_skills text[], seeking_technical_skills text[], seeking_non_technical_skills text[], seeking_technical text, support_areas text[], interests text[], hobbies text[], avatar_url text, is_technical boolean, team_size integer, year integer, experience_years integer, created_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- Return safe fields for public discovery including full_name for partial name display
  -- This function deliberately excludes: email, phone, location, region, university, career, profession
  -- Only show complete profiles (phone and avatar_url are optional)
  SELECT 
    p.user_id,
    p.full_name,
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
  WHERE p.user_type IS NOT NULL
    AND p.full_name IS NOT NULL 
    AND p.full_name != ''
    AND p.gender IS NOT NULL
    AND p.entrepreneur_type IS NOT NULL
    AND p.team_status IS NOT NULL
    AND p.is_technical IS NOT NULL
    AND p.seeking_technical IS NOT NULL
    -- User type specific requirements
    AND (
      (p.user_type = 'universitario' AND p.university IS NOT NULL AND p.career IS NOT NULL AND p.career != '' AND p.year IS NOT NULL)
      OR
      (p.user_type = 'no_universitario' AND p.profession IS NOT NULL AND p.profession != '' AND p.experience_years IS NOT NULL)
    )
    -- Skills requirements based on technical profile
    AND (
      (p.is_technical = true AND p.technical_skills IS NOT NULL AND array_length(p.technical_skills, 1) > 0)
      OR
      (p.is_technical = false AND p.non_technical_skills IS NOT NULL AND array_length(p.non_technical_skills, 1) > 0)
    )
    -- Seeking skills requirements
    AND (
      (p.seeking_technical = 'technical' AND p.seeking_technical_skills IS NOT NULL AND array_length(p.seeking_technical_skills, 1) > 0)
      OR
      (p.seeking_technical = 'non_technical' AND p.seeking_non_technical_skills IS NOT NULL AND array_length(p.seeking_non_technical_skills, 1) > 0)
      OR
      (p.seeking_technical = 'both' AND p.seeking_technical_skills IS NOT NULL AND array_length(p.seeking_technical_skills, 1) > 0 AND p.seeking_non_technical_skills IS NOT NULL AND array_length(p.seeking_non_technical_skills, 1) > 0)
    );
$function$