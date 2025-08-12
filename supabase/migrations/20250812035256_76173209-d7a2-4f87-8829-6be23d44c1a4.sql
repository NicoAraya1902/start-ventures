-- Fix function search path security issue with CASCADE
DROP FUNCTION IF EXISTS public.users_are_connected(uuid, uuid) CASCADE;

CREATE OR REPLACE FUNCTION public.users_are_connected(user1_id uuid, user2_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.contact_requests
    WHERE (
      (sender_id = user1_id AND receiver_id = user2_id) OR
      (sender_id = user2_id AND receiver_id = user1_id)
    ) AND status = 'accepted'
  );
$$;

-- Recreate the policies
CREATE POLICY "Users can send messages to connected contacts"
ON public.messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND 
  public.users_are_connected(sender_id, receiver_id)
);

CREATE POLICY "Users can view messages with connected contacts"
ON public.messages
FOR SELECT
USING (
  (auth.uid() = sender_id OR auth.uid() = receiver_id) AND
  public.users_are_connected(sender_id, receiver_id)
);