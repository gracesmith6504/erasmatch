
-- ================================================
-- Step 1: Fix trailing newline characters in existing university names
-- ================================================
UPDATE universities
SET name = TRIM(REGEXP_REPLACE(name, E'[\\t\\n\\r]+', '', 'g'))
WHERE name != TRIM(REGEXP_REPLACE(name, E'[\\t\\n\\r]+', '', 'g'));

-- Also fix any trailing newlines in profiles.university and profiles.home_university
UPDATE profiles
SET university = TRIM(REGEXP_REPLACE(university, E'[\\t\\n\\r]+', '', 'g'))
WHERE university IS NOT NULL
  AND university != TRIM(REGEXP_REPLACE(university, E'[\\t\\n\\r]+', '', 'g'));

UPDATE profiles
SET home_university = TRIM(REGEXP_REPLACE(home_university, E'[\\t\\n\\r]+', '', 'g'))
WHERE home_university IS NOT NULL
  AND home_university != TRIM(REGEXP_REPLACE(home_university, E'[\\t\\n\\r]+', '', 'g'));

-- ================================================
-- Step 2: Insert missing universities (only if not already present)
-- ================================================
INSERT INTO universities (name, city, country) VALUES
  ('1 Decembrie 1918 University of Alba Iulia', 'Alba Iulia', 'Romania'),
  ('Académie Royale des Beaux-Arts de Liège', 'Liège', 'Belgium'),
  ('Academy of Fine Arts and Design', 'Bratislava', 'Slovakia'),
  ('Academy of Fine Arts Krakow', 'Krakow', 'Poland'),
  ('AGH University', 'Krakow', 'Poland'),
  ('Antalya Bilim University', 'Antalya', 'Turkey'),
  ('Chinese University of Hong Kong', 'Hong Kong', 'Hong Kong'),
  ('Dalhousie University', 'Halifax', 'Canada'),
  ('ESSCA School of Management Budapest', 'Budapest', 'Hungary'),
  ('Exeter University', 'Exeter', 'United Kingdom'),
  ('Hellenic Mediterranean University', 'Heraklion', 'Greece'),
  ('Hungarian University of Fine Arts, Budapest', 'Budapest', 'Hungary'),
  ('Instituto Politécnico de Lisboa', 'Lisbon', 'Portugal'),
  ('Kodolányi János Egyetem', 'Székesfehérvár', 'Hungary'),
  ('LASALLE College of the Arts', 'Singapore', 'Singapore'),
  ('Lusófona University', 'Lisbon', 'Portugal'),
  ('Marmara University', 'Istanbul', 'Turkey'),
  ('Mary Immaculate College', 'Limerick', 'Ireland'),
  ('Modul University Vienna', 'Vienna', 'Austria'),
  ('NATFA Sofia', 'Sofia', 'Bulgaria'),
  ('Pázmány ITK', 'Budapest', 'Hungary'),
  ('Saxion University', 'Enschede', 'Netherlands'),
  ('TecnoCampus University', 'Mataró', 'Spain'),
  ('Thomas More', 'Mechelen', 'Belgium'),
  ('Toulouse Business School', 'Toulouse', 'France'),
  ('UC Louvain', 'Louvain-la-Neuve', 'Belgium'),
  ('Universidade Lusofona', 'Lisbon', 'Portugal'),
  ('Università degli Studi Roma', 'Rome', 'Italy'),
  ('Université Mohammed V', 'Rabat', 'Morocco'),
  ('University Grenoble Alpes', 'Grenoble', 'France'),
  ('University of Deusto', 'Bilbao', 'Spain'),
  ('University of Malta', 'Msida', 'Malta')
ON CONFLICT DO NOTHING;

-- ================================================
-- Step 3: Normalize profile text to match canonical university names
-- ================================================

-- Fix casing issues
UPDATE profiles SET university = 'Thomas More' WHERE LOWER(TRIM(university)) = 'thomas more' AND university != 'Thomas More';
UPDATE profiles SET university = 'TecnoCampus University' WHERE LOWER(TRIM(university)) = 'tecnocampus university' AND university != 'TecnoCampus University';
UPDATE profiles SET university = 'Toulouse Business School' WHERE LOWER(TRIM(university)) = 'toulouse business school' AND university != 'Toulouse Business School';
UPDATE profiles SET university = 'AGH University' WHERE LOWER(TRIM(university)) = 'agh university' AND university != 'AGH University';
UPDATE profiles SET university = 'Exeter University' WHERE LOWER(TRIM(university)) = 'exeter university' AND university != 'Exeter University';
UPDATE profiles SET university = 'Kodolányi János Egyetem' WHERE LOWER(TRIM(university)) = 'kodolanyi janos egyetem';
UPDATE profiles SET university = 'Università degli Studi Roma' WHERE LOWER(TRIM(university)) = 'università degli studi roma' AND university != 'Università degli Studi Roma';

-- Also normalize home_university with same fixes
UPDATE profiles SET home_university = 'Thomas More' WHERE LOWER(TRIM(home_university)) = 'thomas more' AND home_university != 'Thomas More';

-- ================================================
-- Step 4: Add aliases for abbreviations and local names
-- ================================================
-- We need the IDs of newly inserted universities, so use subqueries
INSERT INTO university_aliases (alias, university_id)
SELECT alias, u.id FROM (VALUES
  ('UAM', 'Universidad Autónoma de Madrid (UAM)'),
  ('Universidad Autónoma de Madrid', 'Universidad Autónoma de Madrid (UAM)'),
  ('UFP', 'University Fernando Pessoa (UFP)'),
  ('Universidade Fernando Pessoa', 'University Fernando Pessoa (UFP)'),
  ('UVa', 'University of Valladolid (UVa)'),
  ('Universidad de Valladolid', 'University of Valladolid (UVa)'),
  ('AGH', 'AGH University'),
  ('AGH University of Science and Technology', 'AGH University'),
  ('Akademia Górniczo-Hutnicza', 'AGH University'),
  ('UCLouvain', 'UC Louvain'),
  ('Université catholique de Louvain', 'UC Louvain'),
  ('TBS', 'Toulouse Business School'),
  ('TBS Education', 'Toulouse Business School'),
  ('CUHK', 'Chinese University of Hong Kong'),
  ('Dal', 'Dalhousie University'),
  ('MIC', 'Mary Immaculate College'),
  ('MIC Limerick', 'Mary Immaculate College'),
  ('Pázmány Péter Katolikus Egyetem', 'Pázmány ITK'),
  ('PPKE ITK', 'Pázmány ITK'),
  ('Kodolányi János University', 'Kodolányi János Egyetem'),
  ('Kodolanyi Janos Egyetem', 'Kodolányi János Egyetem'),
  ('NATFA', 'NATFA Sofia'),
  ('National Academy for Theatre and Film Arts', 'NATFA Sofia'),
  ('Saxion University of Applied Sciences', 'Saxion University'),
  ('Thomas More University of Applied Sciences', 'Thomas More'),
  ('University of Exeter', 'Exeter University'),
  ('UoM', 'University of Malta'),
  ('Università ta Malta', 'University of Malta'),
  ('Lusófona', 'Lusófona University'),
  ('Universidade Lusófona', 'Lusófona University'),
  ('IPL', 'Instituto Politécnico de Lisboa'),
  ('Université Mohammed V de Rabat', 'Université Mohammed V'),
  ('UGA', 'University Grenoble Alpes'),
  ('Université Grenoble Alpes', 'University Grenoble Alpes'),
  ('Universidad de Deusto', 'University of Deusto'),
  ('ASE', 'ASE Bucharest University of Economic Studies'),
  ('Academia de Studii Economice din București', 'ASE Bucharest University of Economic Studies'),
  ('UFSC', 'Universidade Federal de Santa Catarina')
) AS v(alias, uni_name)
JOIN universities u ON LOWER(TRIM(u.name)) = LOWER(TRIM(v.uni_name))
ON CONFLICT DO NOTHING;

-- ================================================
-- Step 5: Backfill missing city data on profiles from universities table
-- ================================================
UPDATE profiles p
SET city = u.city
FROM universities u
WHERE LOWER(TRIM(p.university)) = LOWER(TRIM(u.name))
  AND p.city IS NULL
  AND u.city IS NOT NULL
  AND p.deleted_at IS NULL;
