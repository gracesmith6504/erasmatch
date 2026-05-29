-- Trigram indexes for fast fuzzy search on universities and aliases
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_universities_name_trgm
  ON public.universities USING gin (lower(name) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_universities_city_trgm
  ON public.universities USING gin (lower(city) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_universities_country_trgm
  ON public.universities USING gin (lower(country) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_university_aliases_alias_trgm
  ON public.university_aliases USING gin (lower(alias) gin_trgm_ops);

-- Server-side search RPC: searches name, city, country, and aliases.
-- Prioritizes exact alias / name matches, then prefix matches, then contains.
CREATE OR REPLACE FUNCTION public.search_universities(_q text, _limit int DEFAULT 25)
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
    SELECT lower(btrim(coalesce(_q, ''))) AS term
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
        COALESCE((SELECT alias_score FROM alias_hits ah WHERE ah.university_id = u.id), 0)
      ) AS s
    FROM public.universities u
    WHERE (SELECT term FROM q) = ''
       OR lower(u.name) LIKE '%' || (SELECT term FROM q) || '%'
       OR lower(coalesce(u.city,'')) LIKE '%' || (SELECT term FROM q) || '%'
       OR lower(coalesce(u.country,'')) LIKE '%' || (SELECT term FROM q) || '%'
       OR u.id IN (SELECT university_id FROM alias_hits)
  )
  SELECT id, name, city, country, s AS score
  FROM base
  WHERE s > 0 OR (SELECT term FROM q) = ''
  ORDER BY s DESC, name ASC
  LIMIT GREATEST(1, LEAST(_limit, 100));
$$;

GRANT EXECUTE ON FUNCTION public.search_universities(text, int) TO anon, authenticated;