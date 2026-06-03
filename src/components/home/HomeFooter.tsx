import { Link } from "react-router-dom";

const TOP_CITIES = [
  { slug: "barcelona", name: "Barcelona", flag: "🇪🇸" },
  { slug: "lisbon", name: "Lisbon", flag: "🇵🇹" },
  { slug: "milan", name: "Milan", flag: "🇮🇹" },
  { slug: "prague", name: "Prague", flag: "🇨🇿" },
  { slug: "budapest", name: "Budapest", flag: "🇭🇺" },
  { slug: "amsterdam", name: "Amsterdam", flag: "🇳🇱" },
  { slug: "madrid", name: "Madrid", flag: "🇪🇸" },
  { slug: "rome", name: "Rome", flag: "🇮🇹" },
  { slug: "paris", name: "Paris", flag: "🇫🇷" },
  { slug: "berlin", name: "Berlin", flag: "🇩🇪" },
];

export const HomeFooter = () => {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <span className="text-lg font-bold text-foreground">
              <span className="text-erasmatch-blue">Eras</span><span className="text-erasmatch-green">Match</span>
            </span>
            <p className="text-sm text-muted-foreground mt-1">
              Connecting Erasmus students worldwide.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link to="/students" className="text-muted-foreground hover:text-foreground transition-colors">Students</Link>
              <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-2">
              {TOP_CITIES.map((city) => (
                <Link
                  key={city.slug}
                  to={`/erasmus/${city.slug}`}
                  className="text-xs text-muted-foreground hover:text-accent transition-colors"
                >
                  {city.flag} Erasmus {city.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ErasMatch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
