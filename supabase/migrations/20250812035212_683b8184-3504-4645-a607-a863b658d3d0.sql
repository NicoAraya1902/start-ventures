-- Add RLS policies to restrict messaging to accepted contacts only
-- First, create a function to check if two users are connected (mutual accepted contact requests)
CREATE OR REPLACE FUNCTION public.users_are_connected(user1_id uuid, user2_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.contact_requests
    WHERE (
      (sender_id = user1_id AND receiver_id = user2_id) OR
      (sender_id = user2_id AND receiver_id = user1_id)
    ) AND status = 'accepted'
  );
$$;

-- Add new RLS policy for messages - only allow messaging between connected users
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;

CREATE POLICY "Users can send messages to connected contacts"
ON public.messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND 
  public.users_are_connected(sender_id, receiver_id)
);

-- Update existing policy to allow viewing messages between connected users
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;

CREATE POLICY "Users can view messages with connected contacts"
ON public.messages
FOR SELECT
USING (
  (auth.uid() = sender_id OR auth.uid() = receiver_id) AND
  public.users_are_connected(sender_id, receiver_id)
);

-- Enable realtime for messages table
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.messages;