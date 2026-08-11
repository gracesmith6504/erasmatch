import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SEO
        title="Page Not Found | ErasMatch"
        description="The page you're looking for doesn't exist. Head back to ErasMatch to find Erasmus students in your city."
        path="/404"
        noIndex={true}
      />
      <div className="text-center">
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="text-erasmatch-green hover:text-erasmatch-green/80 underline transition-colors">
            Return to Home
          </Link>
          <Link to="/students" className="text-erasmatch-green hover:text-erasmatch-green/80 underline transition-colors">
            Browse Students
          </Link>
          <Link to="/auth" className="text-erasmatch-green hover:text-erasmatch-green/80 underline transition-colors">
            Sign In / Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
