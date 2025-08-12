-- Add technical skills fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_technical boolean,
ADD COLUMN seeking_technical boolean,
ADD COLUMN technical_skills text[],
ADD COLUMN non_technical_skills text[];