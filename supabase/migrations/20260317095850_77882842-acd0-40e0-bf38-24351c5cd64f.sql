
-- Insert 200 new universities and their aliases
-- Using a CTE to insert universities and capture their IDs for alias creation

DO $$
DECLARE
  v_id integer;
BEGIN

  -- Helper: insert university, then its aliases
  -- We'll use a temp table to batch this

  CREATE TEMP TABLE _uni_batch (
    name text,
    city text,
    country text,
    aliases text[] -- native names / alternate names
  );

  INSERT INTO _uni_batch VALUES
  -- Austria
  ('Alpen-Adria Universität Klagenfurt', 'Klagenfurt', 'Austria', ARRAY['Alpen-Adria-Universität Klagenfurt', 'AAU Klagenfurt']),
  ('FH Joanneum - University of Applied Sciences', 'Graz', 'Austria', ARRAY['FH Joanneum']),
  ('Graz University of Music', 'Graz', 'Austria', ARRAY['Kunstuniversität Graz', 'KUG']),
  ('University of Graz', 'Graz', 'Austria', ARRAY['Karl-Franzens-Universität Graz', 'KFU Graz']),
  ('University of Music and Performing Arts Vienna', 'Vienna', 'Austria', ARRAY['Universität für Musik und darstellende Kunst Wien', 'mdw Vienna']),
  ('University of Salzburg', 'Salzburg', 'Austria', ARRAY['Paris Lodron Universität Salzburg', 'PLUS Salzburg']),
  -- Belgium
  ('IHECS Brussels', 'Brussels', 'Belgium', ARRAY['Institut des Hautes Études des Communications Sociales']),
  ('Institut Supérieur de Musique et de Pédagogie', 'Namur', 'Belgium', ARRAY['IMEP Namur']),
  ('Karel de Grote University of Applied Sciences and Arts', 'Antwerp', 'Belgium', ARRAY['Karel de Grote Hogeschool', 'KdG']),
  ('UC Leuven-Limburg', 'Leuven', 'Belgium', ARRAY['UCLL']),
  ('University of Liège', 'Liège', 'Belgium', ARRAY['Université de Liège', 'ULiège']),
  ('University of Mons', 'Mons', 'Belgium', ARRAY['Université de Mons', 'UMons']),
  ('University of Namur', 'Namur', 'Belgium', ARRAY['Université de Namur', 'UNamur']),
  ('Vrije Universiteit Brussel', 'Brussels', 'Belgium', ARRAY['VUB']),
  -- Bulgaria
  ('Sofia University "St. Kliment Ohridski"', 'Sofia', 'Bulgaria', ARRAY['Софийски университет „Св. Климент Охридски"', 'SU Sofia']),
  -- Cyprus
  ('University of Cyprus', 'Nicosia', 'Cyprus', ARRAY['Πανεπιστήμιο Κύπρου', 'UCY']),
  -- Czech Republic
  ('Academy of Performing Arts in Prague - Music and Dance Faculty', 'Prague', 'Czech Republic', ARRAY['Hudební a taneční fakulta AMU', 'HAMU', 'AMU Prague']),
  ('Brno University of Technology', 'Brno', 'Czech Republic', ARRAY['Vysoké učení technické v Brně', 'BUT Brno', 'VUT Brno']),
  ('Czech Technical University in Prague', 'Prague', 'Czech Republic', ARRAY['České vysoké učení technické v Praze', 'CTU Prague', 'CVUT']),
  ('Palacký University Olomouc', 'Olomouc', 'Czech Republic', ARRAY['Univerzita Palackého v Olomouci', 'UPOL']),
  ('VSE Prague - Prague University of Economics and Business', 'Prague', 'Czech Republic', ARRAY['Vysoká škola ekonomická v Praze', 'VŠE Prague']),
  -- Denmark
  ('Copenhagen School of Design and Technology', 'Copenhagen', 'Denmark', ARRAY['Københavns Erhvervsakademi', 'KEA Copenhagen']),
  ('Technical University of Denmark', 'Lyngby', 'Denmark', ARRAY['Danmarks Tekniske Universitet', 'DTU']),
  -- Estonia
  ('Estonian Academy of Music and Theatre', 'Tallinn', 'Estonia', ARRAY['Eesti Muusika- ja Teatriakadeemia', 'EMTA']),
  ('Tartu Art College', 'Tartu', 'Estonia', ARRAY['Tartu Kõrgem Kunstikool', 'TKK Tartu']),
  -- Finland
  ('Aalto University', 'Espoo', 'Finland', ARRAY['Aalto-yliopisto']),
  ('LAB University of Applied Sciences', 'Lahti', 'Finland', ARRAY['LAB-ammattikorkeakoulu']),
  ('Metropolia University of Applied Sciences', 'Helsinki', 'Finland', ARRAY['Metropolia Ammattikorkeakoulu']),
  ('Satakunta University of Applied Sciences', 'Pori', 'Finland', ARRAY['Satakunnan Ammattikorkeakoulu', 'SAMK']),
  ('Tampere University of Applied Sciences', 'Tampere', 'Finland', ARRAY['Tampereen ammattikorkeakoulu', 'TAMK']),
  ('Turku University of Applied Sciences', 'Turku', 'Finland', ARRAY['Turun ammattikorkeakoulu', 'TUAS']),
  ('University of Eastern Finland', 'Joensuu', 'Finland', ARRAY['Itä-Suomen yliopisto', 'UEF']),
  ('University of Jyväskylä', 'Jyväskylä', 'Finland', ARRAY['Jyväskylän yliopisto', 'JYU']),
  ('University of Oulu', 'Oulu', 'Finland', ARRAY['Oulun yliopisto', 'UniOulu']),
  ('University of the Arts Helsinki', 'Helsinki', 'Finland', ARRAY['Taideyliopiston Sibelius-Akatemia', 'Sibelius Academy']),
  ('Xamk - South-Eastern Finland University of Applied Sciences', 'Kouvola', 'Finland', ARRAY['Kaakkois-Suomen Ammattikorkeakoulu', 'Xamk']),
  ('Åbo Akademi University', 'Turku', 'Finland', ARRAY['Åbo Akademi']),
  -- France
  ('Aix-Marseille University', 'Marseille', 'France', ARRAY['Aix-Marseille Université', 'AMU Marseille']),
  ('Audencia Business School', 'Nantes', 'France', ARRAY['Audencia Nantes']),
  ('EIGSI - School of Industrial Engineering', 'La Rochelle', 'France', ARRAY['École d''Ingénieurs en Génie des Systèmes Industriels', 'EIGSI']),
  ('ENIM - École Nationale d''Ingénieurs de Metz', 'Metz', 'France', ARRAY['École Nationale d''Ingénieurs de Metz', 'ENIM']),
  ('ENISE - École Nationale d''Ingénieurs de Saint-Étienne', 'Saint-Étienne', 'France', ARRAY['ENISE']),
  ('ENS Louis-Lumière', 'Saint-Denis', 'France', ARRAY['École Nationale Supérieure Louis-Lumière']),
  ('ESAIP Graduate School of Engineering', 'Angers', 'France', ARRAY['ESAIP École d''Ingénieurs', 'ESAIP']),
  ('ESCE International Business School', 'Paris', 'France', ARRAY['École Supérieure du Commerce Extérieur', 'ESCE']),
  ('ESIEA', 'Paris', 'France', ARRAY['École Supérieure d''Informatique Électronique et Automatique']),
  ('Excelia Business School', 'La Rochelle', 'France', ARRAY['Excelia']),
  ('IAE Grenoble', 'Grenoble', 'France', ARRAY['IAE Grenoble - Grenoble School of Management']),
  ('ICAM - Institut Catholique d''Arts et Métiers', 'Lille', 'France', ARRAY['Institut Catholique d''Arts et Métiers', 'ICAM']),
  ('ICN Business School', 'Nancy', 'France', ARRAY['ICN Business School Nancy-Metz', 'ICN']),
  ('INSA Rennes', 'Rennes', 'France', ARRAY['Institut National des Sciences Appliquées de Rennes']),
  ('ISEN Yncréa', 'Brest', 'France', ARRAY['ISEN']),
  ('ISEP - Institut Supérieur d''Électronique de Paris', 'Paris', 'France', ARRAY['Institut Supérieur d''Électronique de Paris', 'ISEP']),
  ('KEDGE Business School', 'Marseille', 'France', ARRAY['KEDGE']),
  ('Montpellier Business School', 'Montpellier', 'France', ARRAY['MBS Montpellier']),
  ('NEOMA Business School', 'Rouen', 'France', ARRAY['NEOMA']),
  ('Pôle Supérieur d''Enseignements Artistiques Nord-Pas de Calais', 'Lille', 'France', ARRAY['PSEA Lille']),
  ('Rennes School of Business', 'Rennes', 'France', ARRAY['RSB Rennes']),
  ('University Savoie Mont Blanc', 'Annecy', 'France', ARRAY['Université Savoie Mont Blanc', 'USMB']),
  ('University of Angers', 'Angers', 'France', ARRAY['Université d''Angers']),
  ('University of Burgundy', 'Dijon', 'France', ARRAY['Université de Bourgogne']),
  ('University of Nantes', 'Nantes', 'France', ARRAY['Université de Nantes']),
  ('Université Bretagne Sud', 'Lorient', 'France', ARRAY['UBS Lorient']),
  ('Université Clermont Auvergne', 'Clermont-Ferrand', 'France', ARRAY['UCA Clermont-Ferrand']),
  ('Université Côte d''Azur', 'Nice', 'France', ARRAY['UniCA Nice']),
  ('Université Paris-Dauphine', 'Paris', 'France', ARRAY['Université Paris-Dauphine - PSL', 'Dauphine', 'PSL Dauphine']),
  ('Université Paris-Est Créteil', 'Créteil', 'France', ARRAY['Université Paris-Est Créteil Val-de-Marne', 'UPEC']),
  ('Université Rennes 2', 'Rennes', 'France', ARRAY['Université Rennes 2 - Haute Bretagne', 'UR2']),
  ('Université Toulouse Jean Jaurès', 'Toulouse', 'France', ARRAY['Université Toulouse - Jean Jaurès', 'UT2J']),
  ('Université de Bretagne Occidentale', 'Brest', 'France', ARRAY['UBO Brest']),
  ('Université de Franche-Comté', 'Besançon', 'France', ARRAY['UFC Besançon']),
  ('Université de La Rochelle', 'La Rochelle', 'France', ARRAY['UniLR']),
  ('Université de Poitiers', 'Poitiers', 'France', ARRAY['UP Poitiers']),
  ('Université de Toulon', 'Toulon', 'France', ARRAY['UTLN']),
  ('Université de Tours', 'Tours', 'France', ARRAY['Univ. Tours']),
  -- Germany
  ('Aalen University of Applied Sciences', 'Aalen', 'Germany', ARRAY['Hochschule Aalen', 'HS Aalen']),
  ('Berlin University of the Arts', 'Berlin', 'Germany', ARRAY['Universität der Künste Berlin', 'UdK Berlin']),
  ('City University of Applied Sciences Bremen', 'Bremen', 'Germany', ARRAY['Hochschule Bremen', 'HS Bremen']),
  ('Darmstadt University of Applied Sciences', 'Darmstadt', 'Germany', ARRAY['Hochschule Darmstadt', 'h_da']),
  ('Deggendorf Institute of Technology', 'Deggendorf', 'Germany', ARRAY['Technische Hochschule Deggendorf', 'THD']),
  ('Emden/Leer University of Applied Sciences', 'Emden', 'Germany', ARRAY['Hochschule Emden/Leer', 'HS Emden-Leer']),
  ('FH Kiel - University of Applied Sciences', 'Kiel', 'Germany', ARRAY['Fachhochschule Kiel', 'FH Kiel']),
  ('Frankfurt University of Applied Sciences', 'Frankfurt am Main', 'Germany', ARRAY['FRA-UAS']),
  ('Fulda University of Applied Sciences', 'Fulda', 'Germany', ARRAY['Hochschule Fulda', 'HS Fulda']),
  ('Hanover University of Music Drama and Media', 'Hanover', 'Germany', ARRAY['Hochschule für Musik Theater und Medien Hannover', 'HMTMH']),
  ('Harz University of Applied Sciences', 'Wernigerode', 'Germany', ARRAY['Hochschule Harz', 'HS Harz']),
  ('Hochschule Augsburg', 'Augsburg', 'Germany', ARRAY['Hochschule Augsburg - University of Applied Sciences', 'HS Augsburg']),
  ('Hochschule Bremerhaven', 'Bremerhaven', 'Germany', ARRAY['HS Bremerhaven']),
  ('Hochschule Pforzheim', 'Pforzheim', 'Germany', ARRAY['Pforzheim University', 'HS Pforzheim']),
  ('Jade University of Applied Sciences', 'Wilhelmshaven', 'Germany', ARRAY['Jade Hochschule', 'Jade HS']),
  ('Kaiserslautern-Worms University of Applied Sciences', 'Kaiserslautern', 'Germany', ARRAY['Hochschule Kaiserslautern', 'HS Kaiserslautern']),
  ('Karlsruhe University of Education', 'Karlsruhe', 'Germany', ARRAY['Pädagogische Hochschule Karlsruhe', 'PH Karlsruhe']),
  ('Leipzig University', 'Leipzig', 'Germany', ARRAY['Universität Leipzig', 'Uni Leipzig']),
  ('Leipzig University of Music and Theatre', 'Leipzig', 'Germany', ARRAY['Hochschule für Musik und Theater Leipzig', 'HMT Leipzig']),
  ('Munich University of Applied Sciences', 'Munich', 'Germany', ARRAY['Hochschule München', 'HM Munich']),
  ('Offenburg University of Applied Sciences', 'Offenburg', 'Germany', ARRAY['Hochschule Offenburg', 'HS Offenburg']),
  ('Osnabrück University of Applied Sciences', 'Osnabrück', 'Germany', ARRAY['Hochschule Osnabrück', 'HS Osnabrück']),
  ('RheinMain University of Applied Sciences', 'Wiesbaden', 'Germany', ARRAY['Hochschule RheinMain', 'HSRM']),
  ('Ruhr University Bochum', 'Bochum', 'Germany', ARRAY['Ruhr-Universität Bochum', 'RUB']),
  ('South Westphalia University of Applied Sciences', 'Iserlohn', 'Germany', ARRAY['Fachhochschule Südwestfalen', 'FH SWF']),
  ('TU Dresden', 'Dresden', 'Germany', ARRAY['Technische Universität Dresden']),
  ('Technical University of Berlin', 'Berlin', 'Germany', ARRAY['Technische Universität Berlin', 'TU Berlin']),
  ('Technische Hochschule Ingolstadt', 'Ingolstadt', 'Germany', ARRAY['THI Ingolstadt']),
  ('Trier University of Applied Sciences', 'Trier', 'Germany', ARRAY['Hochschule Trier', 'HS Trier']),
  ('University of Augsburg', 'Augsburg', 'Germany', ARRAY['Universität Augsburg', 'Uni Augsburg']),
  ('University of Bamberg', 'Bamberg', 'Germany', ARRAY['Otto-Friedrich-Universität Bamberg', 'Uni Bamberg']),
  ('University of Bonn', 'Bonn', 'Germany', ARRAY['Rheinische Friedrich-Wilhelms-Universität Bonn', 'Uni Bonn']),
  ('University of Göttingen', 'Göttingen', 'Germany', ARRAY['Georg-August-Universität Göttingen', 'Uni Göttingen']),
  ('University of Kassel', 'Kassel', 'Germany', ARRAY['Universität Kassel', 'Uni Kassel']),
  ('University of Münster', 'Münster', 'Germany', ARRAY['Westfälische Wilhelms-Universität Münster', 'WWU Münster']),
  ('University of Oldenburg', 'Oldenburg', 'Germany', ARRAY['Carl von Ossietzky Universität Oldenburg', 'Uni Oldenburg']),
  ('University of Paderborn', 'Paderborn', 'Germany', ARRAY['Paderborn University', 'UPB']),
  ('Worms University of Applied Sciences', 'Worms', 'Germany', ARRAY['Hochschule Worms', 'HS Worms']),
  -- Greece
  ('Aristotle University of Thessaloniki', 'Thessaloniki', 'Greece', ARRAY['Αριστοτέλειο Πανεπιστήμιο Θεσσαλονίκης', 'AUTh']),
  ('International Hellenic University', 'Thessaloniki', 'Greece', ARRAY['Διεθνές Πανεπιστήμιο της Ελλάδος', 'IHU']),
  ('University of Western Macedonia', 'Kozani', 'Greece', ARRAY['Πανεπιστήμιο Δυτικής Μακεδονίας', 'UOWM']),
  -- Hungary
  ('University of Debrecen', 'Debrecen', 'Hungary', ARRAY['Debreceni Egyetem']),
  ('University of Pécs', 'Pécs', 'Hungary', ARRAY['Pécsi Tudományegyetem', 'PTE']),
  -- Iceland
  ('Reykjavík University', 'Reykjavik', 'Iceland', ARRAY['Háskólinn í Reykjavík', 'RU Reykjavik']),
  -- Italy
  ('Ca'' Foscari University of Venice', 'Venice', 'Italy', ARRAY['Università Ca'' Foscari Venezia', 'UniVe']),
  ('Conservatorio Alfredo Casella di L''Aquila', 'L''Aquila', 'Italy', ARRAY['Conservatorio di Musica Alfredo Casella']),
  ('Conservatorio Benedetto Marcello di Venezia', 'Venice', 'Italy', ARRAY['Conservatorio di Musica Benedetto Marcello']),
  ('Conservatorio E.F. Dall''Abaco di Verona', 'Verona', 'Italy', ARRAY['Conservatorio Statale di Musica E.F. Dall''Abaco']),
  ('Conservatorio Lorenzo Perosi di Campobasso', 'Campobasso', 'Italy', ARRAY['Conservatorio Statale di Musica Lorenzo Perosi']),
  ('LUISS University', 'Rome', 'Italy', ARRAY['Libera Università Internazionale degli Studi Sociali Guido Carli', 'LUISS Roma']),
  ('Polytechnic University of Turin', 'Turin', 'Italy', ARRAY['Politecnico di Torino', 'PoliTo']),
  ('Saint Louis College of Music', 'Rome', 'Italy', ARRAY['Saint Louis College of Music Roma', 'SLCM']),
  ('University of Cagliari', 'Cagliari', 'Italy', ARRAY['Università degli Studi di Cagliari', 'UniCA Cagliari']),
  ('University of Catania', 'Catania', 'Italy', ARRAY['Università degli Studi di Catania', 'UNICT']),
  ('University of Genoa', 'Genoa', 'Italy', ARRAY['Università degli Studi di Genova', 'UniGe']),
  ('University of Naples Federico II', 'Naples', 'Italy', ARRAY['Università degli Studi di Napoli Federico II', 'UniNa']),
  ('University of Pisa', 'Pisa', 'Italy', ARRAY['Università di Pisa', 'UniPI']),
  ('University of Turin', 'Turin', 'Italy', ARRAY['Università degli Studi di Torino', 'UNITO']),
  ('University of Udine', 'Udine', 'Italy', ARRAY['Università degli Studi di Udine', 'UniUD']),
  ('University of Urbino Carlo Bo', 'Urbino', 'Italy', ARRAY['Università degli Studi di Urbino Carlo Bo', 'UniUrb']),
  ('University of Verona', 'Verona', 'Italy', ARRAY['Università degli Studi di Verona', 'UniVR']),
  -- Latvia
  ('Latvian Maritime Academy', 'Riga', 'Latvia', ARRAY['Latvijas Jūras akadēmija', 'LJA']),
  ('Riga Technical University', 'Riga', 'Latvia', ARRAY['Rīgas Tehniskā universitāte', 'RTU']),
  ('Rīga Stradiņš University', 'Riga', 'Latvia', ARRAY['Rīgas Stradiņa universitāte', 'RSU']),
  ('Vidzeme University of Applied Sciences', 'Valmiera', 'Latvia', ARRAY['Vidzemes Augstskola', 'ViA']),
  -- Lithuania
  ('Kaunas University of Technology', 'Kaunas', 'Lithuania', ARRAY['Kauno technologijos universitetas', 'KTU']),
  ('Lithuanian Academy of Music and Theatre', 'Vilnius', 'Lithuania', ARRAY['Lietuvos muzikos ir teatro akademija', 'LMTA']),
  ('Vilnius Academy of Arts', 'Vilnius', 'Lithuania', ARRAY['Vilniaus dailės akademija', 'VDA']),
  ('Vilnius Gediminas Technical University', 'Vilnius', 'Lithuania', ARRAY['Vilniaus Gedimino technikos universitetas', 'VILNIUS TECH']),
  -- Netherlands
  ('Amsterdam University of Applied Sciences', 'Amsterdam', 'Netherlands', ARRAY['Hogeschool van Amsterdam', 'HvA']),
  ('ArtEZ University of the Arts', 'Arnhem', 'Netherlands', ARRAY['ArtEZ Hogeschool voor de Kunsten']),
  ('Avans University of Applied Sciences', 'Breda', 'Netherlands', ARRAY['Avans Hogeschool']),
  ('Breda University of Applied Sciences', 'Breda', 'Netherlands', ARRAY['BUAS']),
  ('Delft University of Technology', 'Delft', 'Netherlands', ARRAY['Technische Universiteit Delft', 'TU Delft']),
  ('Eindhoven University of Technology', 'Eindhoven', 'Netherlands', ARRAY['Technische Universiteit Eindhoven', 'TU/e']),
  ('HU University of Applied Sciences Utrecht', 'Utrecht', 'Netherlands', ARRAY['Hogeschool Utrecht', 'HU Utrecht']),
  ('Rotterdam University of Applied Sciences', 'Rotterdam', 'Netherlands', ARRAY['Hogeschool Rotterdam', 'HR Rotterdam']),
  ('Royal Conservatoire of The Hague', 'The Hague', 'Netherlands', ARRAY['Koninklijk Conservatorium Den Haag', 'KC']),
  ('Tilburg University', 'Tilburg', 'Netherlands', ARRAY['TiU']),
  ('University of Twente', 'Enschede', 'Netherlands', ARRAY['Universiteit Twente', 'UT Twente']),
  ('Wageningen University and Research', 'Wageningen', 'Netherlands', ARRAY['Wageningen Universiteit', 'WUR']),
  -- Norway
  ('Norwegian Academy of Music', 'Oslo', 'Norway', ARRAY['Norges musikkhøgskole', 'NMH']),
  ('University of Stavanger', 'Stavanger', 'Norway', ARRAY['Universitetet i Stavanger', 'UiS']),
  ('Volda University College', 'Volda', 'Norway', ARRAY['Høgskulen i Volda', 'HVO']),
  -- Poland
  ('Adam Mickiewicz University', 'Poznań', 'Poland', ARRAY['Uniwersytet im. Adama Mickiewicza w Poznaniu', 'UAM Poznań']),
  ('Gdynia Maritime University', 'Gdynia', 'Poland', ARRAY['Akademia Morska w Gdyni', 'GMU']),
  ('Poznan University of the Arts', 'Poznań', 'Poland', ARRAY['Uniwersytet Artystyczny w Poznaniu', 'UAP']),
  ('Silesian University of Technology', 'Gliwice', 'Poland', ARRAY['Politechnika Śląska', 'SUT']),
  ('University of Gdańsk', 'Gdańsk', 'Poland', ARRAY['Uniwersytet Gdański', 'UG Gdańsk']),
  ('Warsaw University of Technology', 'Warsaw', 'Poland', ARRAY['Politechnika Warszawska', 'WUT']),
  ('Wroclaw University of Science and Technology', 'Wrocław', 'Poland', ARRAY['Politechnika Wrocławska', 'WUST']),
  -- Portugal
  ('ESMAE - School of Music Arts and Performing Arts Porto', 'Porto', 'Portugal', ARRAY['Escola Superior de Música Artes e Espectáculo', 'ESMAE']),
  -- Romania
  ('National University of Music Bucharest', 'Bucharest', 'Romania', ARRAY['Universitatea Națională de Muzică din București', 'UNMB']),
  ('Technical University of Cluj-Napoca', 'Cluj-Napoca', 'Romania', ARRAY['Universitatea Tehnică din Cluj-Napoca', 'UTCN']),
  ('University of Art and Design Cluj-Napoca', 'Cluj-Napoca', 'Romania', ARRAY['Universitatea de Artă și Design Cluj-Napoca', 'UAD']),
  ('University of Bucharest', 'Bucharest', 'Romania', ARRAY['Universitatea din București', 'UniBuc']),
  -- Slovakia
  ('Comenius University Bratislava', 'Bratislava', 'Slovakia', ARRAY['Univerzita Komenského v Bratislave', 'CU Bratislava']),
  -- Spain
  ('Jaume I University', 'Castellón', 'Spain', ARRAY['Universitat Jaume I', 'UJI']),
  ('Miguel Hernández University of Elche', 'Elche', 'Spain', ARRAY['Universidad Miguel Hernández de Elche', 'UMH']),
  ('Rovira i Virgili University', 'Tarragona', 'Spain', ARRAY['Universitat Rovira i Virgili', 'URV']),
  ('TBS Education Barcelona', 'Barcelona', 'Spain', ARRAY['TBS Education Barcelona Campus', 'TBS Barcelona']),
  ('Universidad Alfonso X el Sabio', 'Madrid', 'Spain', ARRAY['UAX']),
  ('Universidad CEU Cardenal Herrera', 'Valencia', 'Spain', ARRAY['CEU-UCH']),
  ('Universidad Europea de Madrid', 'Madrid', 'Spain', ARRAY['UEM Madrid']),
  ('Universidad Europea de Valencia', 'Valencia', 'Spain', ARRAY['UEV']),
  ('University of Córdoba', 'Córdoba', 'Spain', ARRAY['Universidad de Córdoba', 'UCO']),
  ('University of Vigo', 'Vigo', 'Spain', ARRAY['Universidade de Vigo', 'UVigo']),
  -- Sweden
  ('Blekinge Institute of Technology', 'Karlskrona', 'Sweden', ARRAY['Blekinge Tekniska Högskola', 'BTH']),
  ('Halmstad University', 'Halmstad', 'Sweden', ARRAY['Högskolan i Halmstad']),
  ('KTH Royal Institute of Technology', 'Stockholm', 'Sweden', ARRAY['Kungliga Tekniska högskolan', 'KTH']),
  ('Karlstad University', 'Karlstad', 'Sweden', ARRAY['Karlstads Universitet', 'KAU']),
  ('Linköping University', 'Linköping', 'Sweden', ARRAY['Linköpings Universitet', 'LiU']),
  -- Switzerland
  ('FHNW - University of Applied Sciences and Arts Northwestern Switzerland', 'Basel', 'Switzerland', ARRAY['Fachhochschule Nordwestschweiz', 'FHNW']),
  ('University of Lausanne', 'Lausanne', 'Switzerland', ARRAY['Université de Lausanne', 'UNIL']),
  -- Turkey
  ('Yaşar University', 'İzmir', 'Turkey', ARRAY['Yaşar Üniversitesi']),
  -- United Kingdom
  ('Arts University Bournemouth', 'Bournemouth', 'United Kingdom', ARRAY['AUB']),
  ('Birmingham City University', 'Birmingham', 'United Kingdom', ARRAY['BCU']),
  ('Cardiff Metropolitan University', 'Cardiff', 'United Kingdom', ARRAY['Prifysgol Metropolitan Caerdydd', 'Cardiff Met']),
  ('Cardiff University', 'Cardiff', 'United Kingdom', ARRAY['Prifysgol Caerdydd']),
  ('Edge Hill University', 'Ormskirk', 'United Kingdom', ARRAY['EHU']),
  ('Middlesex University London', 'London', 'United Kingdom', ARRAY['Middlesex University', 'MDX']),
  ('Northumbria University Newcastle', 'Newcastle upon Tyne', 'United Kingdom', ARRAY['Northumbria University']),
  ('Solent University Southampton', 'Southampton', 'United Kingdom', ARRAY['Solent University']),
  ('Staffordshire University', 'Stoke-on-Trent', 'United Kingdom', ARRAY['Staffs']),
  ('University of Kent', 'Canterbury', 'United Kingdom', ARRAY['UKC']);

  -- Now insert universities and their aliases
  FOR v_id IN
    SELECT nextval('universities_id_seq') FROM generate_series(1, (SELECT count(*) FROM _uni_batch))
  LOOP
    -- no-op, just consuming sequence values
  END LOOP;

  -- Actually, let's do it properly: insert each uni and capture the id
  DECLARE
    rec RECORD;
    new_id integer;
    a text;
  BEGIN
    FOR rec IN SELECT * FROM _uni_batch LOOP
      INSERT INTO universities (name, city, country)
      VALUES (rec.name, rec.city, rec.country)
      RETURNING id INTO new_id;

      IF rec.aliases IS NOT NULL THEN
        FOREACH a IN ARRAY rec.aliases LOOP
          INSERT INTO university_aliases (alias, university_id)
          VALUES (a, new_id);
        END LOOP;
      END IF;
    END LOOP;
  END;

  DROP TABLE _uni_batch;
END $$;
