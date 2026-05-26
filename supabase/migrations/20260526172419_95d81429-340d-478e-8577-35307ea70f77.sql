-- Revoke column-level SELECT on email so authenticated users cannot read other users' emails via PostgREST.
REVOKE SELECT (email) ON public.profiles FROM authenticated;
REVOKE SELECT (email) ON public.profiles FROM anon;

-- Re-grant SELECT on all non-email columns to authenticated (anon never had row access via RLS).
GRANT SELECT (
  id, name, avatar_url, bio, city, university, home_university, course, semester,
  personality_tags, created_at, deleted_at, last_active_at, ref_code, invited_by,
  onboarding_complete, featured, privacy_consent_at, email_notifications,
  arrival_date, looking_for, onboarding_step
) ON public.profiles TO authenticated;

-- Service role keeps full access for edge functions / admin code.
GRANT ALL ON public.profiles TO service_role;