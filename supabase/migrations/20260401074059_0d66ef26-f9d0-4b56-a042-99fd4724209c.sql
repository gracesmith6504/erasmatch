CREATE OR REPLACE FUNCTION public.get_referrer_profile(_ref_code text)
RETURNS TABLE(first_name text, avatar_url text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT
    split_part(name, ' ', 1) as first_name,
    avatar_url
  FROM public.profiles
  WHERE ref_code = _ref_code
    AND deleted_at IS NULL
    AND name IS NOT NULL
  LIMIT 1;
$$;