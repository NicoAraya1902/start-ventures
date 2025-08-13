-- Tighten profiles visibility to prevent personal info exposure
-- 1) Drop permissive discovery policy
DROP POLICY IF EXISTS "Users can view other universitario profiles for discovery" ON public.profiles;

-- 2) Reinstate own-profile visibility
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- 3) Allow viewing profiles of accepted contacts only (mutual consent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Users can view connected profiles'
  ) THEN
    CREATE POLICY "Users can view connected profiles"
    ON public.profiles
    FOR SELECT
    USING (public.users_are_connected(auth.uid(), user_id));
  END IF;
END $$;