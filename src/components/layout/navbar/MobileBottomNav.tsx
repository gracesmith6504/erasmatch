
import { Link, useLocation } from "react-router-dom";
import { Home, Users, MessageSquare, User } from "lucide-react";

interface MobileBottomNavProps {
  isAuthenticated: boolean;
  hasUnreadMessages: boolean;
}

export const MobileBottomNav = ({ 
  isAuthenticated, 
  hasUnreadMessages 
}: MobileBottomNavProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (!isAuthenticated) return null;

  return (
    <div className="md:hidden fixed bottom-4 left-0 right-0 z-50 flex justify-center">
      <div className="bg-white shadow-lg rounded-full flex items-center px-2 py-1 space-x-1 border">
        <Link to="/" className={`p-3 rounded-full transition-colors ${
          isActive('/') ? 'bg-blue-100 text-erasmatch-blue' : 'text-gray-500'
        }`}>
          <Home className="w-5 h-5" />
        </Link>
        <Link to="/students" className={`p-3 rounded-full transition-colors ${
          isActive('/students') ? 'bg-blue-100 text-erasmatch-blue' : 'text-gray-500'
        }`}>
          <Users className="w-5 h-5" />
        </Link>
        <Link to="/messages" className={`p-3 rounded-full transition-colors relative ${
          isActive('/messages') ? 'bg-blue-100 text-erasmatch-blue' : 'text-gray-500'
        }`}>
          <MessageSquare className="w-5 h-5" />
          {hasUnreadMessages && !isActive('/messages') && (
            <div className="absolute top-2 right-2 h-2 w-2 bg-erasmatch-blue rounded-full"></div>
          )}
        </Link>
        <Link to="/groups" className={`p-3 rounded-full transition-colors ${
          isActive('/groups') ? 'bg-blue-100 text-erasmatch-blue' : 'text-gray-500'
        }`}>
          <Users className="w-5 h-5" />
        </Link>
        <Link to="/profile" className={`p-3 rounded-full transition-colors ${
          isActive('/profile') ? 'bg-blue-100 text-erasmatch-blue' : 'text-gray-500'
        }`}>
          <User className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};
