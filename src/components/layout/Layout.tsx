
import { ReactNode } from "react";
import Navbar from "./navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, handleLogout } = useAuth();

  const handleLogoutClick = () => {
    handleLogout();
    toast.success("You have been logged out", {
      position: "top-center",
      duration: 3000,
      icon: "👋",
    });
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogoutClick} />
      {/* Adjusted pt value to accommodate the new navbar */}
      <main className="flex-1 pt-16 pb-20 md:pb-8">{children}</main>
      <footer className="bg-white border-t py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 gradient-text">ErasMatch</h3>
              <p className="text-sm text-gray-500">
                Connecting Erasmus students worldwide for better exchange experiences.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4 text-gray-700">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="text-gray-500 hover:text-erasmatch-blue">Home</a></li>
                <li><a href="/students" className="text-gray-500 hover:text-erasmatch-blue">Find Students</a></li>
                <li><a href="/accommodation" className="text-gray-500 hover:text-erasmatch-blue">Accommodation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4 text-gray-700">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-500 hover:text-erasmatch-blue">About Us</a></li>
                <li><a href="#" className="text-gray-500 hover:text-erasmatch-blue">Contact</a></li>
                <li><a href="#" className="text-gray-500 hover:text-erasmatch-blue">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} ErasMatch. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
