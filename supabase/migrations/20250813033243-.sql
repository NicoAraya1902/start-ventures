-- Restrict profiles SELECT to own row only; remove connected-users broad SELECT access
-- This reduces attack surface while preserving functionality via SECURITY DEFINER functions

-- Ensure RLS is enabled (no-op if already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop the consolidated policy that allowed connected users to select all columns
DROP POLICY IF EXISTS "Users can view own and connected profiles" ON public.profiles;

-- Recreate a strict SELECT policy: users can only read their own profile rows directly
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Note:
-- - Connected users should fetch necessary details via the SECURITY DEFINER RPC
--   get_connected_profile_details(target_user_id uuid), which already performs
--   the connection check and returns only the intended fields.
-- - Public discovery continues to use get_discovery_profiles() which exposes
--   only non-sensitive fields.
