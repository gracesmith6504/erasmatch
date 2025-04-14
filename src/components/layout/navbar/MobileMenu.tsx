
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Users, MessageSquare, User, LogOut, BellDot } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  isAuthenticated: boolean;
  onLogout: () => void;
  hasUnreadMessages: boolean;
}

export const MobileMenu = ({ 
  isOpen, 
  isAuthenticated, 
  onLogout,
  hasUnreadMessages 
}: MobileMenuProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
      <div className="px-4 pt-2 pb-3 space-y-1 bg-white shadow-md rounded-b-lg">
        {isAuthenticated ? (
          <>
            <Link to="/" className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/') 
                ? 'text-white bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}>
              <div className="flex items-center">
                <Home className="w-5 h-5 mr-3" />
                Home
              </div>
            </Link>
            <Link to="/students" className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/students') 
                ? 'text-white bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-3" />
                Students
              </div>
            </Link>
            <Link to="/messages" className={`block px-3 py-2.5 rounded-lg text-base font-medium relative ${
              isActive('/messages') 
                ? 'text-white bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}>
              <div className="flex items-center">
                {hasUnreadMessages && !isActive('/messages') ? (
                  <BellDot className="w-5 h-5 mr-3 text-erasmatch-blue" />
                ) : (
                  <MessageSquare className="w-5 h-5 mr-3" />
                )}
                Messages
                {hasUnreadMessages && !isActive('/messages') && (
                  <span className="absolute top-3 left-7 h-2 w-2 bg-erasmatch-blue rounded-full"></span>
                )}
              </div>
            </Link>
            <Link to="/groups" className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/groups') 
                ? 'text-white bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-3" />
                Groups
              </div>
            </Link>
            <Link to="/profile" className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
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
              className="w-full text-left block px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50"
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
              <Button variant="outline" className="w-full button-hover">Log In</Button>
            </Link>
            <Link to="/auth?mode=signup" className="w-full">
              <Button className="w-full button-hover bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple border-0 text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
