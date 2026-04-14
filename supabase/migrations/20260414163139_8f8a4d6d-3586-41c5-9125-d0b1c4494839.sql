
CREATE OR REPLACE FUNCTION public.get_city_preview_avatars(_city_name text)
RETURNS TABLE(avatar_url text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT p.avatar_url
  FROM public.profiles p
  WHERE p.city = _city_name
    AND p.deleted_at IS NULL
    AND p.avatar_url IS NOT NULL
  ORDER BY p.created_at DESC
  LIMIT 8;
$$;
