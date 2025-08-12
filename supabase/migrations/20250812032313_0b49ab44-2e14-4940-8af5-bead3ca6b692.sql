-- Add seeking skills fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN seeking_technical_skills TEXT[],
ADD COLUMN seeking_non_technical_skills TEXT[];