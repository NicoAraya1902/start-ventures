-- Add user_type field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN user_type text CHECK (user_type IN ('universitario', 'no_universitario')) DEFAULT 'universitario';

-- Add profession field for non-university users
ALTER TABLE public.profiles 
ADD COLUMN profession text;

-- Add experience_years field for non-university users  
ALTER TABLE public.profiles 
ADD COLUMN experience_years integer;

-- Make university field nullable since non-university users won't have it
-- (it's already nullable, so no change needed)

-- Update existing profiles to be 'universitario' type
UPDATE public.profiles SET user_type = 'universitario' WHERE user_type IS NULL;