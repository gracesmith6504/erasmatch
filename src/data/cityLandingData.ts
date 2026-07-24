export interface CityFAQ {
  question: string;
  answer: string;
}

export interface CityLandingInfo {
  slug: string;
  name: string;
  country: string;
  flag: string;
  tagline: string;
  description: string;
  faqs: CityFAQ[];
}

export const cityLandingData: CityLandingInfo[] = [
  {
    slug: "barcelona",
    name: "Barcelona",
    country: "Spain",
    flag: "🇪🇸",
    tagline: "Sun, culture, and the biggest Erasmus community in Europe",
    description: "Barcelona is consistently the most popular Erasmus destination in Europe. With world-class universities, vibrant nightlife, Mediterranean beaches, and a massive international student community, it's the perfect city to spend your exchange semester.",
    faqs: [
      { question: "Is Barcelona good for Erasmus?", answer: "Barcelona is the #1 Erasmus destination in Europe. The city has a huge international student community, excellent universities like UB, UAB, and UPF, affordable student life compared to northern Europe, and endless cultural and social activities." },
      { question: "How much does it cost to live in Barcelona as a student?", answer: "Expect to spend €700–€1,000/month including rent, food, and transport. Shared apartments in Eixample or Gràcia typically cost €400–€600/month per room. A monthly metro pass is around €40." },
      { question: "What is the nightlife like in Barcelona for Erasmus students?", answer: "Barcelona's nightlife is legendary. From beach bars in Barceloneta to clubs on the Port Olímpic, there's something every night. Erasmus parties are organized weekly, and most clubs don't get busy until after midnight." },
      { question: "When should I arrive in Barcelona for Erasmus?", answer: "Most students arrive in late August or early September for the fall semester, or late January for the spring semester. Arriving 1–2 weeks early is recommended to find accommodation and settle in." },
    ],
  },
  {
    slug: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    flag: "🇵🇹",
    tagline: "Affordable, sunny, and full of Erasmus energy",
    description: "Lisbon offers an unbeatable mix of affordability, sunshine, and culture. With its hilly neighborhoods, Atlantic coastline, and growing student scene, it's quickly becoming one of Europe's most sought-after Erasmus destinations.",
    faqs: [
      { question: "Is Lisbon affordable for Erasmus students?", answer: "Lisbon is one of the most affordable capitals in Western Europe. Expect €600–€900/month total. Student meals can be found for €3–€5, and public transport is around €30/month with a student pass." },
      { question: "What universities in Lisbon accept Erasmus students?", answer: "Top Erasmus universities include Universidade de Lisboa, NOVA University, ISCTE, and Universidade Católica. All have strong international programs and English-taught courses." },
      { question: "What's the weather like in Lisbon?", answer: "Lisbon enjoys over 300 days of sunshine per year. Winters are mild (10–15°C) and summers are warm (25–30°C). You can surf and enjoy beaches from April through October." },
    ],
  },
  {
    slug: "milan",
    name: "Milan",
    country: "Italy",
    flag: "🇮🇹",
    tagline: "Fashion, food, and world-class universities",
    description: "Milan is Italy's economic and cultural powerhouse. Home to prestigious universities like Politecnico di Milano and Bocconi, it combines academic excellence with Italian cuisine, fashion, and easy access to the Alps and Italian lakes.",
    faqs: [
      { question: "Is Milan expensive for Erasmus students?", answer: "Milan is pricier than other Italian cities but still manageable. Budget €800–€1,200/month. Shared rooms run €450–€700. Student discounts on transport and meals help keep costs down." },
      { question: "What can I study in Milan on Erasmus?", answer: "Milan excels in engineering, design, business, and fashion. Politecnico di Milano, Bocconi, and Università degli Studi di Milano all offer extensive English-taught programs for exchange students." },
      { question: "What should I do in Milan as a student?", answer: "Explore the Navigli district for aperitivo, visit Lake Como on weekends, attend Milan Fashion Week events, and take advantage of cheap Ryanair flights to explore the rest of Europe." },
    ],
  },
  {
    slug: "prague",
    name: "Prague",
    country: "Czech Republic",
    flag: "🇨🇿",
    tagline: "Stunning architecture and the best student nightlife in Central Europe",
    description: "Prague combines Gothic charm with an incredibly vibrant student scene. With some of the lowest living costs in the EU, world-famous beer culture, and a central location perfect for traveling, it's a top pick for Erasmus students.",
    faqs: [
      { question: "How cheap is Prague for Erasmus students?", answer: "Prague is one of the cheapest Erasmus destinations. Budget €500–€750/month. A beer costs €1.50, a meal €4–€6, and rent in shared flats is €300–€450/month." },
      { question: "Is Prague good for Erasmus?", answer: "Absolutely. Charles University and Czech Technical University have large Erasmus programs. The city has a huge international student community, incredible nightlife, and is perfectly located for weekend trips across Europe." },
      { question: "What's the nightlife like in Prague?", answer: "Prague has some of the best nightlife in Europe. Multi-story clubs, underground bars, boat parties on the Vltava, and affordable drinks make it a student favorite. The five-story Karlovy Lazne club is legendary." },
    ],
  },
  {
    slug: "budapest",
    name: "Budapest",
    country: "Hungary",
    flag: "🇭🇺",
    tagline: "Thermal baths, ruin bars, and an unbeatable student vibe",
    description: "Budapest is the hidden gem of Erasmus destinations. Famous for its ruin bars, thermal baths, and incredibly low cost of living, it offers a unique blend of history, nightlife, and community that students never forget.",
    faqs: [
      { question: "Why is Budapest popular for Erasmus?", answer: "Budapest offers the best value in Europe — incredible experiences at very low cost. Ruin bars, thermal baths, Danube river cruises, and a thriving student scene make it unforgettable. Universities like ELTE and Corvinus have strong Erasmus programs." },
      { question: "How much does it cost to live in Budapest as a student?", answer: "Budapest is extremely affordable. Expect €450–€700/month total. Rent in shared flats is €250–€400, meals are €3–€5, and a monthly transport pass is about €10 with a student card." },
      { question: "What are ruin bars in Budapest?", answer: "Ruin bars are unique to Budapest — they're bars and clubs built in abandoned buildings and courtyards, decorated with eclectic art and furniture. Szimpla Kert is the most famous, but there are dozens to explore." },
    ],
  },
  {
    slug: "amsterdam",
    name: "Amsterdam",
    country: "Netherlands",
    flag: "🇳🇱",
    tagline: "Bikes, canals, and a truly international campus",
    description: "Amsterdam is one of Europe's most international cities. With top-ranked universities, nearly everyone speaking English, and a cycling culture that makes the city incredibly livable, it's an ideal Erasmus destination for those seeking quality education and culture.",
    faqs: [
      { question: "Is Amsterdam good for Erasmus?", answer: "Amsterdam offers world-class education at UvA and VU Amsterdam, with nearly all courses available in English. The city is extremely international, bike-friendly, and packed with culture, museums, and events." },
      { question: "Is Amsterdam expensive for students?", answer: "Amsterdam is on the pricier side — budget €900–€1,300/month. The biggest expense is housing (€500–€800 for a shared room). However, cycling everywhere saves on transport, and student discounts are widely available." },
      { question: "What makes Amsterdam special for students?", answer: "The cycling culture, canal-side study spots, vibrant music scene, and proximity to other Dutch cities by train. Plus, the international atmosphere means you'll feel at home immediately." },
    ],
  },
  {
    slug: "madrid",
    name: "Madrid",
    country: "Spain",
    flag: "🇪🇸",
    tagline: "Spain's capital with endless energy and Erasmus traditions",
    description: "Madrid is Spain's beating heart — a city of late nights, incredible food, and deep Erasmus traditions. With prestigious universities and a social culture built around gathering and sharing, it's where lifelong friendships are made.",
    faqs: [
      { question: "Is Madrid or Barcelona better for Erasmus?", answer: "Both are excellent — Madrid offers a more authentic Spanish experience with lower rent, incredible food culture, and Spain's best museums. Barcelona has beaches and a more international feel. Many students say Madrid feels more 'real' Spain." },
      { question: "How much does it cost to live in Madrid as a student?", answer: "Madrid is slightly cheaper than Barcelona. Budget €650–€950/month. Shared rooms cost €350–€550, and eating out is very affordable with menú del día (set lunch) for €10–€12." },
      { question: "What universities in Madrid accept Erasmus students?", answer: "Top choices include Universidad Complutense de Madrid (UCM), Universidad Autónoma de Madrid (UAM), and Universidad Carlos III. All have well-established Erasmus programs with hundreds of exchange students each semester." },
    ],
  },
  {
    slug: "rome",
    name: "Rome",
    country: "Italy",
    flag: "🇮🇹",
    tagline: "History, pasta, and la dolce vita on a student budget",
    description: "Rome is where ancient history meets vibrant student life. Study surrounded by the Colosseum, the Vatican, and centuries of art — then unwind with €1 espresso and the best pizza you've ever had.",
    faqs: [
      { question: "Is Rome good for Erasmus students?", answer: "Rome is incredible for Erasmus. La Sapienza is one of Europe's largest universities with a huge international community. The city offers unmatched culture, amazing food, and a lively student neighborhood in San Lorenzo." },
      { question: "How much does it cost to live in Rome?", answer: "Rome is mid-range for Italy. Budget €700–€1,000/month. Shared rooms are €400–€600, but food is affordable — pizza al taglio for €2, espresso for €1, and pasta for €4–€6 at local trattorias." },
      { question: "What should Erasmus students know about Rome?", answer: "Bureaucracy moves slowly in Rome — bring patience. But the rewards are huge: free museum days, aperitivo culture, weekend trips to Naples or Florence for under €20, and some of the best food on Earth." },
    ],
  },
  {
    slug: "paris",
    name: "Paris",
    country: "France",
    flag: "🇫🇷",
    tagline: "The city of lights, love, and legendary universities",
    description: "Paris needs no introduction. Home to the Sorbonne and Sciences Po, it combines world-class academics with unparalleled culture. Yes, it's expensive — but the student discounts, free museums, and café culture make it worth every euro.",
    faqs: [
      { question: "Is Paris too expensive for Erasmus?", answer: "Paris is expensive but manageable with planning. Budget €900–€1,400/month. Apply for CAF housing aid (up to €200/month back), eat at university restaurants (CROUS) for €3.30, and take advantage of free museum access for under-26 EU residents." },
      { question: "What universities in Paris accept Erasmus students?", answer: "Paris has dozens of Erasmus-partner universities including Sorbonne Université, Sciences Po, Paris-Saclay, Université Paris Cité, and many grandes écoles. Course availability in English varies by institution." },
      { question: "What's student life like in Paris?", answer: "Student life revolves around the Latin Quarter and Quartier des Étudiants. Expect picnics along the Seine, cheap wine, world-class museums, and a social scene that peaks Thursday through Saturday." },
    ],
  },
  {
    slug: "berlin",
    name: "Berlin",
    country: "Germany",
    flag: "🇩🇪",
    tagline: "Creative, alternative, and surprisingly affordable",
    description: "Berlin is Europe's creative capital. With no tuition fees at public universities, a legendary techno scene, incredible street art, and a cost of living lower than most Western European capitals, it's the perfect city for free-spirited Erasmus students.",
    faqs: [
      { question: "Is Berlin affordable for Erasmus students?", answer: "Berlin is one of the most affordable major cities in Western Europe. Budget €700–€1,000/month. Public university tuition is free (just a semester fee of ~€300 including transport), and rent in shared flats is €400–€600." },
      { question: "What makes Berlin unique for Erasmus?", answer: "Berlin's culture is unlike anywhere else — world-famous techno clubs, vibrant street art, diverse food scene, and an alternative, open-minded atmosphere. The city is also incredibly international with a huge English-speaking community." },
      { question: "What universities in Berlin accept Erasmus students?", answer: "Top options include Freie Universität Berlin, Humboldt-Universität, and Technische Universität Berlin. All offer extensive English-taught courses and have large Erasmus programs with strong support services." },
    ],
  },
  {
    slug: "vienna",
    name: "Vienna",
    country: "Austria",
    flag: "🇦🇹",
    tagline: "Imperial charm meets top-ranked student life",
    description: "Vienna consistently ranks as one of the world's best cities for quality of life. With stunning architecture, world-class music and art, excellent public transport, and affordable student housing, it's an Erasmus destination that combines culture with comfort.",
    faqs: [
      { question: "Is Vienna good for Erasmus?", answer: "Vienna is an excellent Erasmus destination. It was ranked the world's most liveable city multiple times. The city has top universities like Universität Wien and TU Wien, a massive international student community, and an incredible cultural scene." },
      { question: "How much does it cost to live in Vienna as a student?", answer: "Expect €800–€1,100/month including rent, food, and transport. Student dorms cost €300–€500/month. A semester public transport ticket is around €75, and student meals at Mensa canteens cost €4–€6." },
      { question: "What is the student nightlife like in Vienna?", answer: "Vienna has a diverse nightlife scene — from traditional wine taverns (Heuriger) to modern clubs along the Danube Canal. The Bermuda Triangle area in the 1st district is popular with students, and there are regular Erasmus parties." },
    ],
  },
  {
    slug: "munich",
    name: "Munich",
    country: "Germany",
    flag: "🇩🇪",
    tagline: "Beer gardens, Bavarian Alps, and world-class academics",
    description: "Munich offers the best of both worlds: a thriving modern city with deep Bavarian traditions. Home to the Technical University of Munich and Ludwig Maximilian University, it combines academic excellence with Oktoberfest, alpine skiing, and stunning beer garden culture.",
    faqs: [
      { question: "Is Munich expensive for Erasmus students?", answer: "Munich is one of Germany's pricier cities. Budget €900–€1,300/month. However, public university tuition is free (semester fee ~€150 including transport), and student dorms are €300–€500/month if you secure one early." },
      { question: "What universities in Munich accept Erasmus students?", answer: "Top universities include TU Munich (ranked #1 in Germany), LMU Munich, and Hochschule München. All have strong Erasmus partnerships and offer many English-taught courses, especially at master's level." },
      { question: "What can I do in Munich outside of studying?", answer: "Munich offers incredible outdoor activities — skiing in the Alps is 1 hour away, plus lakes like Starnberger See. The city has famous beer gardens (Englischer Garten), Christmas markets in winter, and Oktoberfest in September." },
    ],
  },
  {
    slug: "porto",
    name: "Porto",
    country: "Portugal",
    flag: "🇵🇹",
    tagline: "Riverside charm, port wine, and the friendliest locals",
    description: "Porto is Portugal's second city with a personality all its own. Known for its stunning riverside setting, famous port wine cellars, and warm local culture, it offers a more intimate and affordable Erasmus experience than Lisbon while still having an active student scene.",
    faqs: [
      { question: "Is Porto affordable for Erasmus students?", answer: "Porto is one of Europe's most affordable student cities. Budget €500–€800/month. Shared rooms cost €250–€400/month, student lunches are €3–€5, and a monthly transport pass is around €30." },
      { question: "What universities in Porto accept Erasmus students?", answer: "The University of Porto (UP) is Portugal's largest and highest-ranked university. Other options include ISEP (engineering) and Católica Porto. UP alone hosts over 2,000 Erasmus students each year." },
      { question: "What makes Porto special for Erasmus?", answer: "Porto has an incredibly welcoming local culture, beautiful tiled buildings, a lively Ribeira waterfront, and legendary nightlife along Rua Galerias de Paris. The city is smaller than Lisbon, so you build closer friendships faster." },
    ],
  },
  {
    slug: "krakow",
    name: "Krakow",
    country: "Poland",
    flag: "🇵🇱",
    tagline: "Historic, affordable, and one of Europe's best-kept secrets",
    description: "Krakow is a stunning medieval city that offers one of the best value-for-money Erasmus experiences in Europe. With a beautiful old town, vibrant student quarter in Kazimierz, extremely low living costs, and a huge international student population, it's a top pick for budget-conscious exchange students.",
    faqs: [
      { question: "How cheap is Krakow for Erasmus students?", answer: "Krakow is one of Europe's cheapest Erasmus destinations. Budget €400–€650/month total. Rent in shared flats is €200–€350/month, a restaurant meal costs €4–€7, and a beer is around €2. Your Erasmus grant goes very far here." },
      { question: "Is Krakow good for Erasmus?", answer: "Absolutely. Krakow has a massive student population (over 200,000 students), a beautiful and walkable old town, incredible nightlife, and easy budget airline connections to the rest of Europe. Jagiellonian University is one of Europe's oldest." },
      { question: "What is the nightlife like in Krakow?", answer: "Krakow's nightlife is legendary among Erasmus students. The Kazimierz district has dozens of bars and clubs, many in atmospheric old cellars. Drinks are very cheap, and there are Erasmus parties almost every night of the week." },
    ],
  },
  {
    slug: "istanbul",
    name: "Istanbul",
    country: "Turkey",
    flag: "🇹🇷",
    tagline: "Where Europe meets Asia — culture, history, and energy",
    description: "Istanbul is one of the world's most fascinating cities, straddling two continents. With a rich history spanning Roman, Byzantine, and Ottoman empires, incredibly affordable living, delicious food, and a growing Erasmus community, it offers a truly unique exchange experience.",
    faqs: [
      { question: "Can I do Erasmus in Istanbul?", answer: "Yes! Turkey participates in the Erasmus+ programme. Top universities include Boğaziçi University, Istanbul Technical University, and Koç University. Many offer English-taught courses, and Istanbul has a growing international student community." },
      { question: "How affordable is Istanbul for students?", answer: "Istanbul is very affordable compared to Western Europe. Budget €350–€600/month. Student meals cost €2–€4, public transport is around €15/month with a student card, and rent in shared flats is €150–€300/month." },
      { question: "What should I know before going to Istanbul for Erasmus?", answer: "Istanbul is huge — pick your neighborhood wisely (Kadıköy and Beşiktaş are popular with students). The city has incredible food, from street simit to fish sandwiches by the Bosphorus. Learning a few Turkish phrases goes a long way with locals." },
    ],
  },
  {
    slug: "seville",
    name: "Seville",
    country: "Spain",
    flag: "🇪🇸",
    tagline: "Flamenco, tapas, and year-round sunshine",
    description: "Seville is the heart of Andalusia and one of Spain's most beloved Erasmus destinations. With over 300 days of sunshine, free tapas culture, stunning Moorish architecture, and a passionate local spirit, it offers an authentically Spanish exchange experience that students never forget.",
    faqs: [
      { question: "Is Seville a good Erasmus city?", answer: "Seville is one of Spain's top Erasmus destinations. The Universidad de Sevilla hosts thousands of exchange students each year. The city is affordable, the weather is amazing, and the social scene is incredibly welcoming." },
      { question: "How much does it cost to live in Seville as a student?", answer: "Seville is very affordable for Spain. Budget €600–€900/month. Shared rooms cost €250–€400/month, and many bars still serve free tapas with drinks. A monthly bus pass is around €35." },
      { question: "What is Seville known for?", answer: "Seville is famous for flamenco, the stunning Alcázar palace, Semana Santa (Holy Week) processions, and the Feria de Abril festival. The city also has a fantastic food scene — try salmorejo, pescaíto frito, and montaditos." },
    ],
  },
  {
    slug: "copenhagen",
    name: "Copenhagen",
    country: "Denmark",
    flag: "🇩🇰",
    tagline: "Design, cycling culture, and Scandinavian quality of life",
    description: "Copenhagen is a world leader in design, sustainability, and quality of life. While it's not the cheapest destination, Danish universities are tuition-free for EU students, the cycling infrastructure is unmatched, and the city's hygge culture creates a uniquely cozy student experience.",
    faqs: [
      { question: "Is Copenhagen expensive for Erasmus?", answer: "Copenhagen is one of Europe's most expensive cities. Budget €1,000–€1,500/month. However, tuition is free for EU/EEA students, and student housing through KKIK or university dorms (€400–€600/month) helps manage costs." },
      { question: "What universities in Copenhagen accept Erasmus students?", answer: "Top options include the University of Copenhagen, Copenhagen Business School (CBS), and the Technical University of Denmark (DTU). Most courses are taught in English, especially at master's level." },
      { question: "What makes Copenhagen special for students?", answer: "Copenhagen is the world's most bike-friendly city — you'll cycle everywhere. The design scene is world-class, Tivoli Gardens is magical, and the student culture is relaxed and inclusive. Christiania offers a unique alternative community experience." },
    ],
  },
  {
    slug: "dublin",
    name: "Dublin",
    country: "Ireland",
    flag: "🇮🇪",
    tagline: "Pubs, craic, and English-speaking study abroad",
    description: "Dublin is the go-to Erasmus destination for students who want an English-speaking experience in Europe. With its legendary pub culture, literary heritage, friendly locals, and proximity to stunning Irish countryside, it offers a warm and social exchange semester.",
    faqs: [
      { question: "Is Dublin good for Erasmus if I don't speak another language?", answer: "Dublin is perfect if English is your strongest language. All courses are in English, and you'll be fully immersed in an English-speaking culture. It's one of the most accessible Erasmus destinations for language reasons." },
      { question: "How expensive is Dublin for students?", answer: "Dublin is expensive — budget €1,000–€1,400/month. Accommodation is the biggest cost at €500–€800/month for a shared room. However, many part-time jobs are available, and student discounts are widely offered." },
      { question: "What is the social scene like in Dublin for Erasmus?", answer: "Dublin's social scene revolves around its famous pubs — Temple Bar is the tourist hub, but locals prefer spots in areas like Rathmines, Ranelagh, and Stoneybatter. Live music is everywhere, and the Irish craic (fun) is real." },
    ],
  },
  {
    slug: "lyon",
    name: "Lyon",
    country: "France",
    flag: "🇫🇷",
    tagline: "France's culinary capital with a vibrant student scene",
    description: "Lyon is France's third-largest city and widely considered its gastronomic capital. With excellent universities, a UNESCO World Heritage old town, a large student population, and lower costs than Paris, it offers the best of French culture without the Parisian price tag.",
    faqs: [
      { question: "Is Lyon better than Paris for Erasmus?", answer: "Many Erasmus students prefer Lyon over Paris. It's significantly cheaper (€700–€1,000/month vs €1,200+), less overwhelming, has a tight-knit student community, and still offers world-class French culture, food, and architecture." },
      { question: "What universities in Lyon accept Erasmus students?", answer: "Top options include Université Lyon 1 (Claude Bernard), Université Lyon 2 (Lumière), Université Lyon 3 (Jean Moulin), and the prestigious Sciences Po Lyon and INSA. Many offer courses in both French and English." },
      { question: "What is Lyon known for?", answer: "Lyon is the culinary capital of France — birthplace of Paul Bocuse and home to traditional 'bouchon' restaurants. It also has a stunning Renaissance old town (Vieux Lyon), the Fête des Lumières light festival in December, and easy access to the Alps." },
    ],
  },
  {
    slug: "warsaw",
    name: "Warsaw",
    country: "Poland",
    flag: "🇵🇱",
    tagline: "Modern, affordable, and rising fast as a student city",
    description: "Warsaw is one of Europe's fastest-growing capitals and an increasingly popular Erasmus destination. Rebuilt from WWII destruction, it blends modern architecture with a charming reconstructed old town. With extremely low costs, a booming tech and startup scene, and excellent nightlife, it's a smart choice for exchange students.",
    faqs: [
      { question: "Is Warsaw cheap for Erasmus students?", answer: "Warsaw is very affordable. Budget €450–€700/month. Rent in shared flats is €250–€400/month, a restaurant meal costs €5–€8, and public transport is around €10/month with a student pass. Your Erasmus grant covers a lot." },
      { question: "What universities in Warsaw accept Erasmus students?", answer: "Top universities include the University of Warsaw (UW), Warsaw University of Technology, and SGH Warsaw School of Economics. Most offer English-taught courses and have well-organized Erasmus student networks (ESN)." },
      { question: "What is there to do in Warsaw as a student?", answer: "Warsaw has a vibrant nightlife scene, especially around Pawilony bar complex and the Praga district. The city has excellent museums, beautiful parks (Łazienki), and great transport links for weekend trips to Krakow, Gdańsk, or the Tatra Mountains." },
    ],
  },
];

export const getCityBySlug = (slug: string): CityLandingInfo | undefined => {
  return cityLandingData.find((city) => city.slug === slug);
};
