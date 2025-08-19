-- First drop the existing function to allow changing its return type
DROP FUNCTION public.get_discovery_profiles();

-- Recreate the function with university field included
CREATE OR REPLACE FUNCTION public.get_discovery_profiles()
 RETURNS TABLE(
   user_id uuid,
   full_name text,
   user_type text,
   entrepreneur_type text,
   team_status text,
   project_stage text,
   project_sector text,
   project_name text,
   project_description text,
   responsible_areas text[],
   seeking_areas text[],
   team_members jsonb,
   support_areas text[],
   interests text[],
   hobbies text[],
   avatar_url text,
   is_technical boolean,
   team_size integer,
   year integer,
   experience_years integer,
   seeking_technical_preference text,
   created_at timestamp with time zone,
   university text
 )
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- Require authentication to access discovery profiles
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
    p.responsible_areas,
    p.seeking_areas,
    p.team_members,
    p.support_areas,
    p.interests,
    p.hobbies,
    p.avatar_url,
    p.is_technical,
    p.team_size,
    p.year,
    p.experience_years,
    p.seeking_technical_preference,
    p.created_at,
    p.university
  FROM public.profiles p
  WHERE auth.uid() IS NOT NULL  -- Require authentication
    AND p.user_id != auth.uid()  -- Don't show current user in discovery
    AND p.user_type IS NOT NULL
    AND p.full_name IS NOT NULL 
    AND p.full_name != ''
    AND p.gender IS NOT NULL
    AND p.entrepreneur_type IS NOT NULL
    AND p.team_status IS NOT NULL
    AND p.is_technical IS NOT NULL
    -- User type specific requirements
    AND (
      (p.user_type = 'universitario' AND p.university IS NOT NULL AND p.career IS NOT NULL AND p.career != '' AND p.year IS NOT NULL)
      OR
      (p.user_type = 'no_universitario' AND p.profession IS NOT NULL AND p.profession != '' AND p.experience_years IS NOT NULL)
    )
    -- Area requirements: must have responsible areas and seeking areas (if looking for team)
    AND (
      p.responsible_areas IS NOT NULL 
      AND array_length(p.responsible_areas, 1) > 0
      AND (
        p.team_status != 'buscando' 
        OR (p.seeking_areas IS NOT NULL AND array_length(p.seeking_areas, 1) > 0 AND p.seeking_technical_preference IS NOT NULL)
      )
    );
$function$