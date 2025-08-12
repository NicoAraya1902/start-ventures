-- Change seeking_technical from boolean to text to support three options
ALTER TABLE public.profiles 
ALTER COLUMN seeking_technical TYPE text 
USING CASE 
  WHEN seeking_technical = true THEN 'technical'
  WHEN seeking_technical = false THEN 'non_technical'
  ELSE null
END;