
-- Expand alias coverage for popular universities missing aliases
INSERT INTO university_aliases (alias, university_id)
SELECT alias, u.id FROM (VALUES
  -- University of Bordeaux (id 250) - 10 students, no aliases
  ('Université de Bordeaux', 250),
  ('UBx', 250),
  -- University of Vienna (id 8) - 7 students, no aliases
  ('Universität Wien', 8),
  ('UniWien', 8),
  -- University of Minho (id 261) - 6 students, no aliases
  ('Universidade do Minho', 261),
  ('UMinho', 261),
  -- University of Valencia (id 256) - 5 students, no aliases
  ('Universitat de València', 256),
  ('UV', 256),
  -- University of Padua (id 315) - 4 students, no aliases
  ('Università degli Studi di Padova', 315),
  ('UniPd', 315),
  ('UNIPD', 315),
  -- Albert-Ludwigs-Universität (id 100) - 4 students, no aliases
  ('University of Freiburg', 100),
  ('Uni Freiburg', 100),
  ('ALU Freiburg', 100),
  -- University of Oslo (id 126) - 4 students, no aliases
  ('Universitetet i Oslo', 126),
  ('UiO', 126),
  -- Aarhus University (id 242) - 4 students, no aliases
  ('Aarhus Universitet', 242),
  ('AU', 242),
  -- Ecole de Management Grenoble (id 23) - 4 students, no aliases
  ('GEM', 23),
  ('Grenoble Ecole de Management', 23),
  -- Mälardalens University (id 308) - 3 students, no aliases
  ('MDU', 308),
  ('Mälardalen University', 308),
  -- Universidad de Alcalá (id 41) - 3 students, no aliases
  ('UAH', 41),
  ('University of Alcalá', 41),
  -- University Institute of Technology of Montpellier (id 209) - 3 students, no aliases
  ('IUT Montpellier', 209),
  ('IUT de Montpellier', 209),
  -- Boston University (id 156) - 3 students, no aliases
  ('BU', 156),
  -- Universitat Autònoma Barcelona (id 39) - already has UAB
  ('Autonomous University of Barcelona', 39),
  -- University of Strasbourg (id 25) - 3 students, no aliases
  ('Université de Strasbourg', 25),
  ('Unistra', 25),
  -- Julius-Maximilian University of Würzburg (id 208) - 3 students, no aliases
  ('JMU Würzburg', 208),
  ('Uni Würzburg', 208),
  ('Julius-Maximilians-Universität Würzburg', 208),
  -- University of Warsaw (id 12) - 3 students, no aliases
  ('Uniwersytet Warszawski', 12),
  ('UW', 12),
  -- University of Ljubljana (id 234) - 2 students, no aliases
  ('Univerza v Ljubljani', 234),
  ('UL', 234),
  -- Institut d'Etudes Politiques (id 94) - 2 students, no aliases
  ('Sciences Po Bordeaux', 94),
  ('IEP Bordeaux', 94),
  -- HWR Berlin (id 313) - 2 students, no aliases
  ('Hochschule für Wirtschaft und Recht Berlin', 313),
  ('Berlin School of Economics and Law', 313),
  -- Budapest Business School (id 218) - 2 students, no aliases
  ('BGE', 218),
  ('Budapesti Gazdasági Egyetem', 218),
  -- University of Malaga (id 264) - 2 students, no aliases
  ('Universidad de Málaga', 264),
  ('UMA', 264),
  -- EM Lyon Business School (id 343) - 2 students, no aliases
  ('emlyon', 343),
  ('EMLYON', 343),
  -- Lille Catholic University (id 312) - 2 students, no aliases
  ('Université Catholique de Lille', 312),
  ('UCL Lille', 312),
  -- IE Madrid (id 40) - 2 students, no aliases
  ('IE University', 40),
  ('IE Business School', 40),
  -- University of Cadiz (id 265) - 2 students, no aliases
  ('Universidad de Cádiz', 265),
  ('UCA', 265),
  -- Università degli Studi di Siena (id 105) - 2 students, no aliases
  ('University of Siena', 105),
  ('UniSi', 105),
  -- Utrecht University (id 125) - 2 students, no aliases
  ('Universiteit Utrecht', 125),
  ('UU', 125),
  -- University of Porto (id 11) - 2 students, no aliases
  ('Universidade do Porto', 11),
  ('UP', 11),
  -- University of Seville (id 91) - 2 students, no aliases
  ('Universidad de Sevilla', 91),
  ('US', 91),
  -- Solvay Brussels (id 18) - 2 students, no aliases
  ('Solvay', 18),
  ('ULB', 18),
  ('Université Libre de Bruxelles', 18),
  -- Vrije Universiteit Amsterdam (id 229) - 2 students, no aliases
  ('VU Amsterdam', 229),
  ('VU', 229),
  -- Uppsala University (id 47) - 2 students, no aliases
  ('Uppsala Universitet', 47),
  ('UU Uppsala', 47),
  -- University of Salerno (id 199) - 2 students, no aliases
  ('Università degli Studi di Salerno', 199),
  ('UniSa', 199),
  -- Université Paris Cité (id 319) - 2 students, no aliases
  ('Paris Cité', 319),
  ('UPC', 319),
  -- University of Granada (id 255) - 2 students, no aliases
  ('Universidad de Granada', 255),
  ('UGR', 255),
  -- Sapienza (check if exists)
  -- University of Barcelona (id 6) - already has UB
  ('Universitat de Barcelona', 6),
  -- Erasmus University Rotterdam (id 35) - already has EUR
  ('Erasmus Universiteit Rotterdam', 35),
  ('Erasmus Rotterdam', 35),
  -- Trinity College Dublin (id 15) - already has TCD
  ('Trinity', 15),
  ('Trinity Dublin', 15),
  -- KU Leuven (id 159) - already has KUL
  ('Katholieke Universiteit Leuven', 159),
  -- University of Bologna (id 151) - already has UniBo, UNIBO
  ('Alma Mater Studiorum', 151),
  ('Università di Bologna', 151),
  -- Charles University (id 211) - already has CUNI, Karlova
  ('Univerzita Karlova', 211),
  -- Sciences Po Paris (id 97) - already has Sciences Po
  ('Institut d''Études Politiques de Paris', 97),
  ('SciencesPo', 97),
  -- Catholic University of Portugal (id 221) - already has UCP, Católica
  ('Universidade Católica Portuguesa', 221),
  -- University of Amsterdam (id 5) - already has UvA
  ('Universiteit van Amsterdam', 5),
  -- Bocconi University (id 33) - already has Bocconi, SDA Bocconi
  ('Università Bocconi', 33),
  -- Dublin City University (id 143) - already has DCU
  ('DCU Dublin', 143),
  -- University of Florence (id 341) - already has UniFi
  ('Università degli Studi di Firenze', 341),
  -- Jagiellonian University (id 90) - already has UJ
  ('Uniwersytet Jagielloński', 90),
  -- Humboldt University (id 240) - already has HU Berlin
  ('Humboldt-Universität zu Berlin', 240),
  -- Ghent University (id 201) - already has UGent
  ('Universiteit Gent', 201),
  -- University of Edinburgh (id 136) - already has UoE
  ('Edinburgh Uni', 136)
) AS v(alias, uni_id)
JOIN universities u ON u.id = v.uni_id
ON CONFLICT DO NOTHING;
