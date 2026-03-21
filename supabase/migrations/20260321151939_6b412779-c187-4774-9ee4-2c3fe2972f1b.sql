CREATE OR REPLACE FUNCTION public.get_landing_page_profiles()
RETURNS TABLE (
  first_name text,
  avatar_url text,
  city text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    split_part(name, ' ', 1) as first_name,
    avatar_url,
    city
  FROM public.profiles
  WHERE deleted_at IS NULL
    AND avatar_url IS NOT NULL
    AND city IS NOT NULL
    AND name IS NOT NULL
  ORDER BY created_at DESC
  LIMIT 12;
$$;