
INSERT INTO university_aliases (alias, university_id)
VALUES
  ('Sapienza', 232),
  ('La Sapienza', 232),
  ('Università di Roma La Sapienza', 232),
  ('University of Rome', 232),
  ('Sapienza Roma', 232),
  ('Università degli Studi di Roma', 390),
  ('Roma Tre', 390),
  ('University of Rome Studies', 390)
ON CONFLICT DO NOTHING;
