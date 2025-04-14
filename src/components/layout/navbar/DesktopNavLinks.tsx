
import { Link, useLocation } from "react-router-dom";
import { Home, Users, MessageSquare, BellDot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DesktopNavLinksProps {
  isAuthenticated: boolean;
  hasUnreadMessages: boolean;
}

export const DesktopNavLinks = ({ 
  isAuthenticated, 
  hasUnreadMessages 
}: DesktopNavLinksProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="hidden md:flex items-center space-x-1">
      {isAuthenticated ? (
        <div className="bg-gray-100 rounded-full p-1 flex items-center space-x-1">
          <Link to="/" className={`px-4 py-2 rounded-full transition-all duration-200 ${
            isActive('/') 
              ? 'text-white bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple shadow-sm' 
              : 'text-gray-700 hover:bg-gray-200'
          }`}>
            <div className="flex items-center space-x-1.5">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </div>
          </Link>
          <Link to="/students" className={`px-4 py-2 rounded-full transition-all duration-200 ${
            isActive('/students') 
              ? 'text-white bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple shadow-sm' 
              : 'text-gray-700 hover:bg-gray-200'
          }`}>
            <div className="flex items-center space-x-1.5">
              <Users className="w-4 h-4" />
              <span>Students</span>
            </div>
          </Link>
          <Link to="/messages" className={`px-4 py-2 rounded-full transition-all duration-200 relative ${
            isActive('/messages') 
              ? 'text-white bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple shadow-sm' 
              : 'text-gray-700 hover:bg-gray-200'
          }`}>
            <div className="flex items-center space-x-1.5">
              {hasUnreadMessages && !isActive('/messages') ? (
                <BellDot className="w-4 h-4 text-erasmatch-blue" />
              ) : (
                <MessageSquare className="w-4 h-4" />
              )}
              <span>Messages</span>
              {hasUnreadMessages && !isActive('/messages') && (
                <span className="absolute top-2 right-2 h-2 w-2 bg-erasmatch-blue rounded-full"></span>
              )}
            </div>
          </Link>
          <Link to="/groups" className={`px-4 py-2 rounded-full transition-all duration-200 ${
            isActive('/groups') 
              ? 'text-white bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple shadow-sm' 
              : 'text-gray-700 hover:bg-gray-200'
          }`}>
            <div className="flex items-center space-x-1.5">
              <Users className="w-4 h-4" />
              <span>Groups</span>
            </div>
          </Link>
        </div>
      ) : (
        <>
          <Link to="/auth?mode=login">
            <Button variant="ghost" className="button-hover">Log In</Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button className="button-hover bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple border-0 text-white">
              Sign Up
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};
