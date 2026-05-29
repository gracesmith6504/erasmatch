CREATE OR REPLACE FUNCTION public.get_featured_activity_profiles()
RETURNS TABLE (first_name text, avatar_url text, country text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    split_part(p.name, ' ', 1) as first_name,
    p.avatar_url,
    u.country
  FROM public.profiles p
  LEFT JOIN public.universities u ON u.name = p.university
  WHERE p.deleted_at IS NULL
    AND p.featured = true
    AND p.avatar_url IS NOT NULL
    AND p.name IS NOT NULL
  ORDER BY p.created_at DESC
  LIMIT 10;
$$;