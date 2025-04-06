
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
      <div className="container mx-auto mt-4 px-4">
        <DemoModeBanner />
      </div>
      <main className="flex-1">{children}</main>
      <footer className="bg-white border-t py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} ErasMatch. Connecting Erasmus students worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
