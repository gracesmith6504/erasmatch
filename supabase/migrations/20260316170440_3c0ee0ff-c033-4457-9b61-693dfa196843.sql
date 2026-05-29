
-- 1. Add "University of Paris" as alias for Université Paris Cité (319)
INSERT INTO university_aliases (alias, university_id) VALUES ('University of Paris', 319);

-- 2. Delete University of Paris (96)
DELETE FROM universities WHERE id = 96;

-- 3. Delete University of Toulouse I Capitole (307) — no profiles, no aliases
DELETE FROM universities WHERE id = 307;
