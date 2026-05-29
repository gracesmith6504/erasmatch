
-- Step 1: Update profiles pointing to duplicate universities
UPDATE profiles SET university = 'University of Freiburg' WHERE university = 'Albert-Ludwigs-Universität';
UPDATE profiles SET university = 'University of Valladolid' WHERE university = 'University of Valladolid (UVa)';
UPDATE profiles SET university = 'Lusófona University' WHERE university = 'Universidade Lusofona';

-- Step 2: Migrate existing aliases
UPDATE university_aliases SET university_id = 280 WHERE university_id = 356;
UPDATE university_aliases SET university_id = 237 WHERE university_id = 100 AND alias != 'University of Freiburg';
DELETE FROM university_aliases WHERE university_id = 100 AND alias = 'University of Freiburg';

-- Step 3: Add deleted names as new aliases
INSERT INTO university_aliases (alias, university_id) VALUES
  ('Kobenhavns Universitet (University of Copenhagen)', 7),
  ('Universität Wien (Institut für Geschichte)', 8),
  ('Albert-Ludwigs-Universität', 237),
  ('Eberhard-Karls-Universität Tübingen', 238),
  ('University of Padua(Padova)', 315),
  ('University of Valladolid (UVa)', 280),
  ('EDHEC Business School, Lille', 359),
  ('Universidade Lusofona', 378),
  ('University of Athens', 150);

-- Step 4: Delete the 9 duplicate universities
DELETE FROM universities WHERE id IN (134, 103, 100, 102, 325, 356, 24, 389, 14);
