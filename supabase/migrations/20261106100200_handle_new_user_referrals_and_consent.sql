-- Restore referral attribution, ref codes and privacy consent for email signups.
--
-- Since 20260818120000 the handle_new_user trigger creates the profile row
-- the moment auth.users gets a row. The client-side createUserProfile path in
-- AuthProvider (which set ref_code, invited_by and privacy_consent_at) then
-- finds an existing profile and never runs, so email signups since 2026-08-18
-- have no consent timestamp and no referral attribution, and only get a
-- ref_code when they finish onboarding.
--
-- The signup form (src/pages/Auth.tsx) now sends user metadata:
--   { "ref": "<referrer ref_code or null>", "privacy_consent": true }
-- and this trigger turns that into profile columns.
--
-- Google OAuth signups carry no custom metadata, so for them ref_code is set
-- here and privacy_consent_at / invited_by are still set client-side by
-- GoogleAuthHandler (allowed by enforce_profile_protected_columns because the
-- old values are NULL).
--
-- ref_code format mirrors src/utils/refCodeGenerator.ts:
--   first word of the name, lowercased, non a-z stripped, + 3 random digits
--   (100-999); "user" + 3 digits when the name is empty. After 10 collisions
--   it falls back to prefix + 6 digits, then keeps looping until unique.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_name        text := COALESCE(NEW.raw_user_meta_data ->> 'name',
                                 NEW.raw_user_meta_data ->> 'full_name');
  v_ref_in      text := NULLIF(btrim(NEW.raw_user_meta_data ->> 'ref'), '');
  v_consent     boolean := (NEW.raw_user_meta_data ->> 'privacy_consent') = 'true';
  v_prefix      text;
  v_ref_code    text;
  v_invited_by  text := NULL;
  v_attempts    int := 0;
BEGIN
  -- Ref code prefix: first word of the name, lowercase, letters a-z only.
  v_prefix := regexp_replace(lower(split_part(COALESCE(v_name, ''), ' ', 1)), '[^a-z]', '', 'g');
  IF v_prefix = '' THEN
    v_prefix := 'user';
  END IF;

  LOOP
    IF v_attempts < 10 THEN
      v_ref_code := v_prefix || (100 + floor(random() * 900))::int::text;
    ELSE
      v_ref_code := v_prefix || lpad((floor(random() * 1000000))::int::text, 6, '0');
    END IF;

    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.ref_code = v_ref_code
    );

    v_attempts := v_attempts + 1;
    IF v_attempts > 50 THEN
      -- Practically unreachable; guarantees termination.
      v_ref_code := v_prefix || replace(NEW.id::text, '-', '');
      EXIT;
    END IF;
  END LOOP;

  -- Only attribute the referral if the code belongs to an existing profile.
  IF v_ref_in IS NOT NULL THEN
    SELECT p.ref_code INTO v_invited_by
    FROM public.profiles p
    WHERE p.ref_code = v_ref_in
    LIMIT 1;
  END IF;

  INSERT INTO public.profiles (id, email, name, created_at, ref_code, invited_by, privacy_consent_at)
  VALUES (
    NEW.id,
    NEW.email,
    v_name,
    NOW(),
    v_ref_code,
    v_invited_by,
    CASE WHEN v_consent THEN NOW() ELSE NULL END
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Re-assert the trigger (idempotent; same definition as 20260818120000).
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
