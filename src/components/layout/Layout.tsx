import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
   const interval = setInterval(updateActivity, 60000); // every 60 seconds
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

  // Check if we're on the messages page to adjust layout
  const isMessagesPage = location.pathname === "/messages";

  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 overflow-x-hidden w-full max-w-full ${isMessagesPage ? 'overflow-hidden' : ''}`}>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogoutClick} />
      
      {/* Adjusted container based on page type */}
      <main className={`flex-1 pt-16 md:pt-16 w-full max-w-full overflow-x-hidden ${!isMessagesPage ? 'pb-20 md:pb-8' : ''}`}>
        {children}
      </main>
      
      {/* Only show footer on non-message pages */}
      {!isMessagesPage && (
        <footer className="bg-white border-t py-6 md:py-8 mt-8 md:mt-12 w-full max-w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-3 md:mb-4 gradient-text">ErasMatch</h3>
                <p className="text-sm text-gray-500">
                  Connecting Erasmus students worldwide for better exchange experiences.
                </p>
              </div>
              <div className="mt-6 md:mt-0">
                <h3 className="text-sm font-semibold mb-3 md:mb-4 text-gray-700">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/" className="text-gray-500 hover:text-erasmatch-blue">Home</a></li>
                  <li><a href="/students" className="text-gray-500 hover:text-erasmatch-blue">Find Students</a></li>
                  <li><a href="/groups" className="text-gray-500 hover:text-erasmatch-blue">Your Group Chats</a></li>
                </ul>
              </div>
              <div className="mt-6 md:mt-0">
                <h3 className="text-sm font-semibold mb-3 md:mb-4 text-gray-700">Connect</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-500 hover:text-erasmatch-blue">About Us</a></li>
                  <li><a href="#" className="text-gray-500 hover:text-erasmatch-blue">Contact</a></li>
                  <li><a href="#" className="text-gray-500 hover:text-erasmatch-blue">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-5 md:pt-6">
              <p className="text-center text-sm text-gray-500">
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
