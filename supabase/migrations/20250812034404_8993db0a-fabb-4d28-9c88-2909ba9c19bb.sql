-- First, let's drop the overly restrictive policy
DROP POLICY IF EXISTS "Users can send requests only to universitarios" ON public.contact_requests;

-- Create a simpler, more robust policy that allows sending requests to universitarios
-- but also provides better error handling
CREATE POLICY "Users can send contact requests to universitarios" 
ON public.contact_requests 
FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id 
  AND EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE user_id = contact_requests.receiver_id 
    AND user_type = 'universitario'
  )
);

-- Add a policy to prevent duplicate requests (this will help with better error messages)
CREATE UNIQUE INDEX IF NOT EXISTS unique_contact_request 
ON public.contact_requests(sender_id, receiver_id) 
WHERE status != 'rejected';