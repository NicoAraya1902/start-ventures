-- Add location and region columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN location TEXT,
ADD COLUMN region TEXT;

-- Set default values for existing records
UPDATE public.profiles 
SET location = 'Santiago', 
    region = 'Región Metropolitana de Santiago' 
WHERE location IS NULL OR region IS NULL;