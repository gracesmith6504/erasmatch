
-- Fix 8 profiles with whitespace/newline characters that have exact matches (score 1.000)
UPDATE profiles
SET university = TRIM(REGEXP_REPLACE(university, E'[\\t\\n\\r]+', '', 'g'))
WHERE deleted_at IS NULL
  AND university IS NOT NULL
  AND university != TRIM(REGEXP_REPLACE(university, E'[\\t\\n\\r]+', '', 'g'));
