-- Add hobbies and interests fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN hobbies TEXT[],
ADD COLUMN interests TEXT[];