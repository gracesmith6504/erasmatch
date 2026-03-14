import { Link } from "react-router-dom";

export const HomeFooter = () => {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-lg font-bold text-foreground">
              <span className="text-erasmatch-blue">Eras</span><span className="text-erasmatch-green">Match</span>
            </span>
            <p className="text-sm text-muted-foreground mt-1">
              Connecting Erasmus students worldwide.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <a href="https://instagram.com/erasmatch" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">Instagram</a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ErasMatch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
