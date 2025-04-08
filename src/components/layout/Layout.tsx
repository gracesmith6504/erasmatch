
import { ReactNode } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DemoModeBanner } from "@/components/ui/demo-mode-banner";

type LayoutProps = {
  children: ReactNode;
  isAuthenticated: boolean;
  onLogout: () => void;
};

const Layout = ({ children, isAuthenticated, onLogout }: LayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    toast.success("You have been logged out");
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className="container mx-auto mt-20 px-4 animate-fade-in">
        <DemoModeBanner />
      </div>
      <main className="flex-1 pt-4">{children}</main>
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
                <li><a href="/universities" className="text-gray-500 hover:text-erasmatch-blue">Universities</a></li>
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
