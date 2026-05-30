
CREATE OR REPLACE FUNCTION public.get_city_stats(_city_name text)
RETURNS TABLE(student_count bigint, university_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT
    (SELECT count(*) FROM public.profiles WHERE city = _city_name AND deleted_at IS NULL) AS student_count,
    (SELECT count(*) FROM public.universities WHERE city = _city_name) AS university_count;
$$;
