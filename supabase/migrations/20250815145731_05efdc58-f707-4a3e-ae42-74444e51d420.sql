-- Add new area responsibility fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN responsible_areas text[],
ADD COLUMN seeking_areas text[],
ADD COLUMN team_members jsonb;

-- Update the discovery function to include the new fields
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
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  -- Return safe fields for public discovery including areas
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
    p.created_at
  FROM public.profiles p
  WHERE p.user_type IS NOT NULL
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
        OR (p.seeking_areas IS NOT NULL AND array_length(p.seeking_areas, 1) > 0)
      )
    );
$function$;

-- Update connected profile details function to include new fields
CREATE OR REPLACE FUNCTION public.get_connected_profile_details(target_user_id uuid)
RETURNS TABLE(
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
  responsible_areas text[],
  seeking_areas text[],
  team_members jsonb,
  interests text[], 
  support_areas text[]
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
    p.responsible_areas,
    p.seeking_areas,
    p.team_members,
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
$function$;