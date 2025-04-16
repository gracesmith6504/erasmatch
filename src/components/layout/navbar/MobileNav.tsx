
import { Link } from "react-router-dom";
import { Home, Users, MessageSquare, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "./useNavigation";

interface MobileNavProps {
  isOpen: boolean;
  isAuthenticated: boolean;
  isActive: (path: string) => boolean;
  onLogout: (e: React.MouseEvent) => void;
}

export const MobileNav = ({ 
  isOpen, 
  isAuthenticated, 
  isActive, 
  onLogout 
}: MobileNavProps) => {
  const { navigationItems } = useNavigation();
  
  return (
    <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
      <div className="px-4 pt-2 pb-3 space-y-2 bg-white shadow-md rounded-b-lg">
        {isAuthenticated ? (
          <>
            {navigationItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`block px-4 py-3 rounded-lg text-base font-medium ${
                  isActive(item.path) 
                    ? 'text-white bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            ))}
            <Link to="/profile" className={`block px-4 py-3 rounded-lg text-base font-medium ${
              isActive('/profile') 
                ? 'text-white bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}>
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3" />
                Profile
              </div>
            </Link>
            <button 
              onClick={onLogout}
              type="button"
              className="w-full text-left block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50"
            >
              <div className="flex items-center">
                <LogOut className="w-5 h-5 mr-3" />
                Log Out
              </div>
            </button>
          </>
        ) : (
          <div className="flex flex-col space-y-2 pt-2 pb-2">
            <Link to="/auth?mode=login" className="w-full">
              <Button variant="outline" className="w-full button-hover py-3 text-base">Log In</Button>
            </Link>
            <Link to="/auth?mode=signup" className="w-full">
              <Button className="w-full button-hover py-3 text-base bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple border-0 text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
