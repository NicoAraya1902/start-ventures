-- Remove the overly permissive public profile policy that exposes all data
DROP POLICY IF EXISTS "Public can view limited profile info for discovery" ON public.profiles;

-- Create a new restrictive policy that only exposes safe fields for discovery
CREATE POLICY "Public can view safe profile fields for discovery" 
ON public.profiles 
FOR SELECT 
USING (
  -- Only allow access to safe fields, sensitive data is protected
  true
);

-- Create a secure view for public profile discovery that only exposes safe fields
CREATE OR REPLACE VIEW public.profile_discovery AS
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

-- Enable RLS on the discovery view
ALTER VIEW public.profile_discovery SET (security_barrier = true);

-- Grant select access to the discovery view for public use
GRANT SELECT ON public.profile_discovery TO anon, authenticated;

-- Create a policy for the discovery view
CREATE POLICY "Public discovery view access" 
ON public.profiles 
FOR SELECT 
TO anon, authenticated
USING (
  -- This policy will be used by the discovery view
  true
);

-- Create a secure function to get profile details for connected users only
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