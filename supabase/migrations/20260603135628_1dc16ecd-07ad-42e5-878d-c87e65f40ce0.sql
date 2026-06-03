-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- IMMUTABLE text normalizer: lowercase, unaccent, strip punctuation, collapse whitespace
CREATE OR REPLACE FUNCTION public.normalize_text(t text)
RETURNS text
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
AS $$
  SELECT btrim(
    regexp_replace(
      regexp_replace(
        lower(unaccent('unaccent', coalesce(t, ''))),
        '[''’`\-.,/()_:;!?&]+', ' ', 'g'
      ),
      '\s+', ' ', 'g'
    )
  )
$$;

-- Trigram GIN indexes on normalized expressions
CREATE INDEX IF NOT EXISTS idx_universities_norm_name_trgm
  ON public.universities USING gin (public.normalize_text(name) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_universities_norm_city_trgm
  ON public.universities USING gin (public.normalize_text(city) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_university_aliases_norm_alias_trgm
  ON public.university_aliases USING gin (public.normalize_text(alias) gin_trgm_ops);

-- Rewrite search_universities: accent/punctuation-insensitive + trigram fallback
CREATE OR REPLACE FUNCTION public.search_universities(_q text, _limit integer DEFAULT 25, _city text DEFAULT NULL::text)
RETURNS TABLE(id integer, name text, city text, country text, score integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  WITH q AS (
    SELECT
      public.normalize_text(_q)    AS term,
      public.normalize_text(_city) AS city_term
  ),
  alias_hits AS (
    SELECT ua.university_id,
           MAX(
             CASE
               WHEN public.normalize_text(ua.alias) = (SELECT term FROM q) THEN 1000
               WHEN public.normalize_text(ua.alias) LIKE (SELECT term FROM q) || '%' THEN 600
               WHEN public.normalize_text(ua.alias) LIKE '%' || (SELECT term FROM q) || '%' THEN 300
               ELSE 0
             END
           ) AS alias_score,
           MAX(similarity(public.normalize_text(ua.alias), (SELECT term FROM q))) AS alias_sim
    FROM public.university_aliases ua, q
    WHERE q.term <> ''
      AND (
        public.normalize_text(ua.alias) LIKE '%' || q.term || '%'
        OR similarity(public.normalize_text(ua.alias), q.term) > 0.3
      )
    GROUP BY ua.university_id
  ),
  base AS (
    SELECT u.id, u.name, u.city, u.country,
      CASE
        WHEN q.term = '' THEN 10
        ELSE GREATEST(
          CASE WHEN public.normalize_text(u.name) = q.term THEN 1000 ELSE 0 END,
          CASE WHEN public.normalize_text(u.name) LIKE q.term || '%' THEN 700 ELSE 0 END,
          CASE WHEN public.normalize_text(u.name) LIKE '%' || q.term || '%' THEN 400 ELSE 0 END,
          CASE WHEN public.normalize_text(u.city) = q.term THEN 500 ELSE 0 END,
          CASE WHEN public.normalize_text(u.city) LIKE q.term || '%' THEN 350 ELSE 0 END,
          CASE WHEN public.normalize_text(u.city) LIKE '%' || q.term || '%' THEN 200 ELSE 0 END,
          CASE WHEN public.normalize_text(u.country) LIKE '%' || q.term || '%' THEN 100 ELSE 0 END,
          COALESCE((SELECT alias_score FROM alias_hits ah WHERE ah.university_id = u.id), 0)
        )
        + CASE
            WHEN similarity(public.normalize_text(u.name), q.term) > 0.3
              THEN (similarity(public.normalize_text(u.name), q.term) * 500)::int
            ELSE 0
          END
        + COALESCE(
            (SELECT CASE WHEN ah.alias_sim > 0.3 THEN (ah.alias_sim * 400)::int ELSE 0 END
             FROM alias_hits ah WHERE ah.university_id = u.id),
            0
          )
      END AS s
    FROM public.universities u, q
    WHERE (q.city_term = '' OR public.normalize_text(u.city) = q.city_term)
      AND (
        q.term = ''
        OR public.normalize_text(u.name)    LIKE '%' || q.term || '%'
        OR public.normalize_text(u.city)    LIKE '%' || q.term || '%'
        OR public.normalize_text(u.country) LIKE '%' || q.term || '%'
        OR similarity(public.normalize_text(u.name), q.term) > 0.3
        OR u.id IN (SELECT university_id FROM alias_hits)
      )
  )
  SELECT id, name, city, country, s AS score
  FROM base
  WHERE s > 0
  ORDER BY s DESC, name ASC
  LIMIT GREATEST(1, LEAST(_limit, 100));
$function$;