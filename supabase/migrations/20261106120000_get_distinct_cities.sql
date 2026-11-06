-- Distinct, non-empty, trimmed city names from universities and non-deleted
-- profiles, used by the CityAutocomplete component. Replaces the client
-- loading every profiles.city and universities.city row (12k+ rows, capped
-- at 1000 per request by PostgREST) just to build a distinct list.
--
-- SECURITY INVOKER (default): callers only see cities from rows RLS lets them
-- read, same as the previous direct table queries.
CREATE OR REPLACE FUNCTION public.get_distinct_cities()
RETURNS SETOF text
LANGUAGE sql
STABLE
SET search_path = 'public'
AS $$
  SELECT DISTINCT c
  FROM (
    SELECT btrim(u.city) AS c FROM public.universities u WHERE u.city IS NOT NULL
    UNION
    SELECT btrim(p.city) AS c FROM public.profiles p WHERE p.city IS NOT NULL AND p.deleted_at IS NULL
  ) cities
  WHERE c <> ''
  ORDER BY c;
$$;

GRANT EXECUTE ON FUNCTION public.get_distinct_cities() TO anon, authenticated;
