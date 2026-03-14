import { ReactNode } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "./navbar";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, handleLogout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const updateActivity = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ last_active_at: new Date().toISOString() })
          .eq("id", user.id);
      }
    };

    updateActivity();
    const interval = setInterval(updateActivity, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogoutClick = () => {
    handleLogout();
    toast.success("You have been logged out", {
      position: "top-center",
      duration: 3000,
      icon: "👋",
    });
    navigate("/");
  };

  const isMessagesPage = location.pathname === "/messages";
  const isHomePage = location.pathname === "/";

  return (
    <div className={`flex flex-col min-h-screen bg-background overflow-x-hidden w-full max-w-full ${isMessagesPage ? 'overflow-hidden' : ''}`}>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogoutClick} />

      <main className={`flex-1 pt-16 w-full max-w-full overflow-x-hidden ${!isMessagesPage ? 'pb-20 md:pb-8' : ''}`}>
        {children}
      </main>

      {/* Footer — only on non-message, non-home pages (home has its own footer) */}
      {!isMessagesPage && !isHomePage && (
        <footer className="bg-card border-t border-border py-6 md:py-8 mt-8 md:mt-12 w-full max-w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
              <div>
                <h3 className="text-lg font-display font-bold mb-3 md:mb-4">
                  <span className="text-erasmatch-blue">Eras</span><span className="text-erasmatch-green">Match</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Connecting Erasmus students worldwide for better exchange experiences.
                </p>
              </div>
              <div className="mt-6 md:mt-0">
                <h3 className="text-sm font-semibold mb-3 md:mb-4 text-foreground">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</a></li>
                  <li><a href="/students" className="text-muted-foreground hover:text-foreground transition-colors">Find Students</a></li>
                  <li><a href="/groups" className="text-muted-foreground hover:text-foreground transition-colors">Your Group Chats</a></li>
                </ul>
              </div>
              <div className="mt-6 md:mt-0">
                <h3 className="text-sm font-semibold mb-3 md:mb-4 text-foreground">Connect</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="mailto:erasmatchbusiness@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
                  <li><a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
                  <li><Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-5 md:pt-6">
              <p className="text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} ErasMatch. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;