-- ============================================================
-- Fix 8: Let users delete their own profile view records (GDPR).
--
-- Before: There was no DELETE policy on profile_views, so users
--         could never remove evidence that they viewed someone's
--         profile.  Under GDPR, users have the "right to erasure"
--         — they should be able to delete data they created.
--
-- After:  You can delete your own view records (where you are
--         the viewer).
-- ============================================================

CREATE POLICY "Users can delete own profile views"
  ON public.profile_views FOR DELETE
  TO authenticated
  USING (auth.uid() = viewer_id);
