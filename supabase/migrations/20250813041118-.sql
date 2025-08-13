-- Add policy to allow users to view other profiles for networking
-- This enables the core discovery functionality while maintaining security
CREATE POLICY "Users can view other universitario profiles for discovery" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can always see their own profile (existing functionality)
  auth.uid() = user_id 
  OR 
  -- Users can see profiles of universitario users for networking
  (user_type = 'universitario' AND full_name IS NOT NULL)
);