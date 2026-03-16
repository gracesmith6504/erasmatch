-- Allow authenticated users to update universities (for admin cleanup)
CREATE POLICY "Authenticated users can update universities"
ON public.universities FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete universities (for admin cleanup)
CREATE POLICY "Authenticated users can delete universities"
ON public.universities FOR DELETE
TO authenticated
USING (true);