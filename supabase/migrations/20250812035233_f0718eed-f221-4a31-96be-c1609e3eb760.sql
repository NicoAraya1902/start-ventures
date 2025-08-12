-- Fix function search path security issue
DROP FUNCTION IF EXISTS public.users_are_connected(uuid, uuid);

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