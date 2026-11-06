-- Hide profiles.email from client roles for real.
--
-- 20260526172419 ran `REVOKE SELECT (email) ON public.profiles FROM authenticated`,
-- but that was a no-op: `authenticated` still held the table-level SELECT
-- privilege (Supabase default grant), which covers every column including
-- email. Any signed-in user could read every other user's email with
-- `select=email` (RLS only filters rows, not columns).
--
-- Fix: drop the table-level SELECT entirely, then grant SELECT on an explicit
-- column list that excludes email. Revoking table-level SELECT also removes
-- any existing column-level SELECT grants, so the re-grant below is the
-- complete set.
--
-- Consequences for clients (authenticated / anon):
--   * select('*') or select('email') on profiles -> permission denied
--   * insert/update/upsert(...).select() with no column list -> permission denied
--     (RETURNING * needs SELECT on every column)
-- SECURITY DEFINER functions and the service role are unaffected.
--
-- IMPORTANT: any column added to profiles in future must be added to a
-- GRANT SELECT (...) here as well, or clients will not be able to read it.
--
-- UPDATE / INSERT / DELETE grants are deliberately left unchanged.

REVOKE SELECT ON public.profiles FROM authenticated, anon;

GRANT SELECT (
  id,
  name,
  avatar_url,
  bio,
  city,
  university,
  home_university,
  course,
  semester,
  personality_tags,
  created_at,
  deleted_at,
  last_active_at,
  ref_code,
  invited_by,
  onboarding_complete,
  featured,
  privacy_consent_at,
  email_notifications,
  arrival_date,
  departure_date,
  looking_for,
  onboarding_step
) ON public.profiles TO authenticated;

-- Service role keeps full access for edge functions / admin code.
GRANT ALL ON public.profiles TO service_role;
