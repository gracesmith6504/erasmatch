
-- 1. Fix whitespace in university names (trim leading/trailing spaces and tabs)
UPDATE universities SET name = TRIM(BOTH E'\t' FROM TRIM(name)) WHERE name != TRIM(BOTH E'\t' FROM TRIM(name));

-- 2. Fix whitespace in university city names  
UPDATE universities SET city = TRIM(city) WHERE city IS NOT NULL AND city != TRIM(city);

-- 3. Standardize country names
UPDATE universities SET country = 'United States' WHERE country IN ('America', 'USA');
UPDATE universities SET country = 'Czech Republic' WHERE country = 'Czechia';
UPDATE universities SET country = 'United Kingdom' WHERE country = 'Northern Ireland';

-- 4. Merge duplicate Almeria: keep id=342 (accented), delete id=268
UPDATE profiles SET university = 'University of Almería' WHERE LOWER(TRIM(university)) = 'university of almeria';
DELETE FROM universities WHERE id = 268;

-- 5. Merge Florence/Firenze: keep id=341 (University of Florence), delete id=139
UPDATE profiles SET university = 'University of Florence' WHERE LOWER(TRIM(university)) IN ('università degli studi di firenze', 'university of florence');
DELETE FROM universities WHERE id = 139;

-- 6. Fix profiles where city name was entered as university
UPDATE profiles SET 
  city = CASE WHEN city IS NULL OR TRIM(city) = '' THEN INITCAP(TRIM(university)) ELSE city END,
  university = NULL
WHERE LOWER(TRIM(university)) IN ('brussels', 'almeria', 'arezzo', 'caen', 'liège', 'copenaghen');

-- 7. Fix "copenaghen" typo in city
UPDATE profiles SET city = 'Copenhagen' WHERE LOWER(TRIM(city)) = 'copenaghen';

-- 8. Trim whitespace in profile values
UPDATE profiles SET university = NULLIF(TRIM(university), '') WHERE university IS NOT NULL AND university != TRIM(university);
UPDATE profiles SET city = NULLIF(TRIM(city), '') WHERE city IS NOT NULL AND city != TRIM(city);

-- 9. Backfill missing cities on profiles from universities table
UPDATE profiles p 
SET city = u.city 
FROM universities u 
WHERE LOWER(TRIM(p.university)) = LOWER(TRIM(u.name)) 
  AND u.city IS NOT NULL 
  AND (p.city IS NULL OR TRIM(p.city) = '')
  AND p.university IS NOT NULL AND TRIM(p.university) != '';

-- 10. Clean up junk entries
UPDATE profiles SET university = NULL WHERE LOWER(TRIM(university)) IN ('internship', 'hech');
UPDATE profiles SET 
  city = CASE WHEN city IS NULL OR TRIM(city) = '' THEN 'Barcelona' ELSE city END,
  university = NULL 
WHERE LOWER(TRIM(university)) = 'internship in barcelona';

-- 11. Fix city = "ESSCA Bordeaux"
UPDATE profiles SET city = 'Bordeaux' WHERE TRIM(city) = 'ESSCA Bordeaux';
