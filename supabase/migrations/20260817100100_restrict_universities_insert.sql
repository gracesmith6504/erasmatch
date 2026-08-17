-- Fix: the universities INSERT policy allowed any authenticated user to
-- insert arbitrary rows.  UPDATE and DELETE are already admin-only;
-- make INSERT match.

DROP POLICY IF EXISTS "Authenticated users can insert universities" ON public.universities;

CREATE POLICY "Admins can insert universities"
  ON public.universities FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
