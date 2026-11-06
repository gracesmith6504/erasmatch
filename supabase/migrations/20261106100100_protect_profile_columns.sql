-- Stop users from writing profile columns they should not control.
--
-- The "Users can update own profile" policy (20260723160100) lets a user
-- change ANY column of their own row. Abuses this closes:
--   * featured = true          -> shows up in the homepage hero
--                                 (get_featured_activity_profiles) and the
--                                 /students featured row
--   * avatar_url = any URL     -> arbitrary external image on the homepage and
--                                 in notification emails
--   * email = victim@...       -> combined with toggling onboarding_complete
--     + onboarding_complete       false -> true repeatedly, spams welcome
--       true/false loop           emails to the victim
--                                 (trigger_send_welcome_email, 20260818120200)
--   * ref_code / invited_by /  -> hijacking or rewriting referral attribution
--     privacy_consent_at          and the consent timestamp
--
-- The same columns are also checked on INSERT: the "Users can delete own
-- profile" + "Users can insert own profile" policies would otherwise let a
-- user delete their row and re-insert it with featured = true or someone
-- else's email, sidestepping an UPDATE-only check.
--
-- Rules apply only to requests made with an end-user JWT
-- (auth.role() = 'authenticated') by a non-admin. The service role, the
-- postgres role (SQL editor, migrations) and admins are not restricted.
-- auth.role() reads the request JWT, so the rules still apply if a
-- SECURITY DEFINER function were to update profiles on a user's behalf.

CREATE OR REPLACE FUNCTION public.enforce_profile_protected_columns()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  -- Own folder, single plain file name: no query strings, %-encoding or
  -- subpaths.
  avatar_pattern text :=
    '^https://ceoflcktscennfmmdrvp\.supabase\.co/storage/v1/object/public/avatars/'
    || NEW.id::text || '/[A-Za-z0-9._-]+$';
  violation text := NULL;
BEGIN
  IF auth.role() IS DISTINCT FROM 'authenticated' THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.featured IS TRUE THEN
      violation := 'featured cannot be set';
    ELSIF NEW.email IS NOT NULL
          AND lower(NEW.email) IS DISTINCT FROM lower(auth.jwt() ->> 'email') THEN
      violation := 'email must match your account email';
    ELSIF NEW.avatar_url IS NOT NULL
          AND NEW.avatar_url !~ avatar_pattern THEN
      violation := 'avatar_url must point to your own uploaded avatar';
    ELSIF NEW.invited_by IS NOT NULL AND NEW.invited_by = NEW.ref_code THEN
      violation := 'invited_by cannot be your own ref_code';
    ELSIF NEW.ref_code IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.ref_code = NEW.ref_code AND p.id <> NEW.id) THEN
      violation := 'ref_code is already taken';
    END IF;

  ELSE -- UPDATE
    IF NEW.featured IS DISTINCT FROM OLD.featured THEN
      violation := 'featured cannot be changed';
    ELSIF NEW.email IS DISTINCT FROM OLD.email THEN
      violation := 'email cannot be changed here';
    ELSIF OLD.onboarding_complete IS TRUE AND NEW.onboarding_complete IS NOT TRUE THEN
      violation := 'onboarding_complete cannot be reset';
    ELSIF NEW.ref_code IS DISTINCT FROM OLD.ref_code AND OLD.ref_code IS NOT NULL THEN
      violation := 'ref_code can only be set once';
    ELSIF NEW.ref_code IS DISTINCT FROM OLD.ref_code AND EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.ref_code = NEW.ref_code AND p.id <> NEW.id) THEN
      violation := 'ref_code is already taken';
    ELSIF NEW.privacy_consent_at IS DISTINCT FROM OLD.privacy_consent_at
          AND OLD.privacy_consent_at IS NOT NULL THEN
      violation := 'privacy_consent_at can only be set once';
    ELSIF NEW.invited_by IS DISTINCT FROM OLD.invited_by
          AND OLD.invited_by IS NOT NULL THEN
      violation := 'invited_by can only be set once';
    ELSIF NEW.invited_by IS DISTINCT FROM OLD.invited_by
          AND OLD.onboarding_complete IS TRUE THEN
      violation := 'invited_by can only be set during signup';
    ELSIF NEW.invited_by IS DISTINCT FROM OLD.invited_by
          AND NEW.invited_by = NEW.ref_code THEN
      violation := 'invited_by cannot be your own ref_code';
    ELSIF NEW.avatar_url IS DISTINCT FROM OLD.avatar_url
          AND NEW.avatar_url IS NOT NULL
          AND NEW.avatar_url !~ avatar_pattern THEN
      violation := 'avatar_url must point to your own uploaded avatar';
    END IF;
  END IF;

  -- Only look up the admin role when something would actually be rejected,
  -- so the frequent last_active_at updates stay cheap.
  IF violation IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Profile update rejected: %', violation
      USING ERRCODE = '42501'; -- insufficient_privilege
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_profile_protected_columns ON public.profiles;

CREATE TRIGGER enforce_profile_protected_columns
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_profile_protected_columns();

-- Users never delete their own profile row from the client (account deletion
-- goes through the delete-account function with the service role). Without
-- this, delete + re-insert would reset the "set once" columns above and
-- onboarding_complete, re-triggering welcome emails.
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
REVOKE DELETE ON public.profiles FROM authenticated, anon;

-- Enforce ref_code uniqueness in the database (the trigger checks above run
-- under RLS and can't see soft-deleted rows). Skipped with a notice if
-- duplicates already exist, so the migration never fails on old data.
DO $$
BEGIN
  IF EXISTS (
    SELECT ref_code FROM public.profiles
    WHERE ref_code IS NOT NULL
    GROUP BY ref_code HAVING count(*) > 1
  ) THEN
    RAISE NOTICE 'Duplicate ref_code values exist; unique index NOT created. Resolve them and re-run.';
  ELSE
    CREATE UNIQUE INDEX IF NOT EXISTS profiles_ref_code_key
      ON public.profiles (ref_code) WHERE ref_code IS NOT NULL;
  END IF;
END $$;
