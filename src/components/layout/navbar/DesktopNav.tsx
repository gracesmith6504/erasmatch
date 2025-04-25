
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "./useNavigation";
import { NavigationLink } from "./NavigationLink";

interface DesktopNavProps {
  isAuthenticated: boolean;
  isActive: (path: string) => boolean;
  onLogout: (e: React.MouseEvent) => void;
}

export const DesktopNav = ({ isAuthenticated, isActive, onLogout }: DesktopNavProps) => {
  const { navigationItems } = useNavigation();
  
  if (!isAuthenticated) {
    return (
      <div className="hidden md:flex items-center space-x-1">
        <Link to="/auth?mode=login">
          <Button variant="outline" className="button-hover rounded-xl">Log In</Button>
        </Link>
        <Link to="/auth?mode=signup">
          <Button variant="gradient" className="button-hover rounded-xl">
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <div className="hidden md:flex items-center space-x-1">
        <div className="bg-gray-100 rounded-full p-1 flex items-center space-x-1">
          {navigationItems.map((item) => (
            <NavigationLink 
              key={item.path}
              to={item.path} 
              isActive={isActive(item.path)}
              className="px-4 py-2 rounded-full transition-all duration-200"
              activeClass="text-white bg-gradient-to-r from-erasmatch-dark to-erasmatch-green shadow-sm"
              inactiveClass="text-gray-700 hover:bg-gray-200"
              icon={item.icon}
            >
              {item.name}
            </NavigationLink>
          ))}
        </div>
      </div>
      
      <div className="hidden md:block">
        <div className="flex items-center space-x-2">
          <Link to="/profile" className={`p-2 rounded-full ${
            isActive('/profile') 
              ? 'bg-gray-200' 
              : 'hover:bg-gray-100'
          }`}>
            <User className="w-5 h-5 text-erasmatch-green" />
          </Link>
          <Button 
            variant="ghost" 
            onClick={onLogout}
            type="button" 
            className="p-2 rounded-full hover:bg-red-100 hover:text-red-600"
            size="icon"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </>
  );
};
