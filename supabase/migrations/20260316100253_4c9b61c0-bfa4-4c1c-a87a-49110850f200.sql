-- Backfill profiles.city from universities.city where profile has university but no city
UPDATE profiles p
SET city = u.city
FROM universities u
WHERE p.university = u.name
  AND p.city IS NULL
  AND u.city IS NOT NULL
  AND p.deleted_at IS NULL;