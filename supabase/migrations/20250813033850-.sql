-- Fix discovery function to show all universitario profiles, not just those with team_status
-- This enables the core networking functionality while maintaining security

CREATE OR REPLACE FUNCTION public.get_discovery_profiles()
 RETURNS TABLE(user_id uuid, user_type text, entrepreneur_type text, team_status text, project_stage text, project_sector text, project_name text, project_description text, technical_skills text[], non_technical_skills text[], seeking_technical_skills text[], seeking_non_technical_skills text[], seeking_technical text, support_areas text[], interests text[], hobbies text[], avatar_url text, is_technical boolean, team_size integer, year integer, experience_years integer, created_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- Return safe, non-sensitive fields for public discovery
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
  WHERE p.user_type IS NOT NULL; -- Show all profiles with a defined user_type
$function$;