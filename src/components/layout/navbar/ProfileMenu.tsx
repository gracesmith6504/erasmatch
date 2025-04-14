
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

interface ProfileMenuProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const ProfileMenu = ({ isAuthenticated, onLogout }: ProfileMenuProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (!isAuthenticated) return null;

  return (
    <div className="hidden md:block">
      <div className="flex items-center space-x-2">
        <Link to="/profile" className={`p-2 rounded-full ${
          isActive('/profile') 
            ? 'bg-gray-200' 
            : 'hover:bg-gray-100'
        }`}>
          <User className="w-5 h-5 text-erasmatch-blue" />
        </Link>
        <Button 
          variant="ghost" 
          onClick={onLogout} 
          className="p-2 rounded-full hover:bg-red-100 hover:text-red-600"
          size="icon"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
