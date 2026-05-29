-- Add city-aware overload for onboarding destination university search.
CREATE OR REPLACE FUNCTION public.search_universities(_q text, _limit int DEFAULT 25, _city text DEFAULT NULL)
RETURNS TABLE (
  id integer,
  name text,
  city text,
  country text,
  score integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH q AS (
    SELECT
      lower(btrim(coalesce(_q, ''))) AS term,
      lower(btrim(coalesce(_city, ''))) AS city_term
  ),
  alias_hits AS (
    SELECT ua.university_id,
           MAX(
             CASE
               WHEN lower(ua.alias) = (SELECT term FROM q) THEN 1000
               WHEN lower(ua.alias) LIKE (SELECT term FROM q) || '%' THEN 600
               WHEN lower(ua.alias) LIKE '%' || (SELECT term FROM q) || '%' THEN 300
               ELSE 0
             END
           ) AS alias_score
    FROM public.university_aliases ua, q
    WHERE q.term <> ''
      AND lower(ua.alias) LIKE '%' || q.term || '%'
    GROUP BY ua.university_id
  ),
  base AS (
    SELECT u.id, u.name, u.city, u.country,
      GREATEST(
        CASE WHEN lower(u.name) = (SELECT term FROM q) THEN 1000 ELSE 0 END,
        CASE WHEN lower(u.name) LIKE (SELECT term FROM q) || '%' THEN 700 ELSE 0 END,
        CASE WHEN lower(u.name) LIKE '%' || (SELECT term FROM q) || '%' THEN 400 ELSE 0 END,
        CASE WHEN lower(coalesce(u.city,'')) = (SELECT term FROM q) THEN 500 ELSE 0 END,
        CASE WHEN lower(coalesce(u.city,'')) LIKE (SELECT term FROM q) || '%' THEN 350 ELSE 0 END,
        CASE WHEN lower(coalesce(u.city,'')) LIKE '%' || (SELECT term FROM q) || '%' THEN 200 ELSE 0 END,
        CASE WHEN lower(coalesce(u.country,'')) LIKE '%' || (SELECT term FROM q) || '%' THEN 100 ELSE 0 END,
        COALESCE((SELECT alias_score FROM alias_hits ah WHERE ah.university_id = u.id), 0),
        CASE WHEN (SELECT term FROM q) = '' THEN 10 ELSE 0 END
      ) AS s
    FROM public.universities u, q
    WHERE (q.city_term = '' OR lower(coalesce(u.city, '')) = q.city_term)
      AND (
        q.term = ''
        OR lower(u.name) LIKE '%' || q.term || '%'
        OR lower(coalesce(u.city,'')) LIKE '%' || q.term || '%'
        OR lower(coalesce(u.country,'')) LIKE '%' || q.term || '%'
        OR u.id IN (SELECT university_id FROM alias_hits)
      )
  )
  SELECT id, name, city, country, s AS score
  FROM base
  WHERE s > 0
  ORDER BY s DESC, name ASC
  LIMIT GREATEST(1, LEAST(_limit, 100));
$$;

GRANT EXECUTE ON FUNCTION public.search_universities(text, int, text) TO anon, authenticated;