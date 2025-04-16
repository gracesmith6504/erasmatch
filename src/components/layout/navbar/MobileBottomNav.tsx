
import { Link } from "react-router-dom";
import { Home, Users, MessageSquare, User, MessageCircle } from "lucide-react";
import { useNavigation } from "./useNavigation";

interface MobileBottomNavProps {
  isActive: (path: string) => boolean;
}

export const MobileBottomNav = ({ isActive }: MobileBottomNavProps) => {
  const { navigationItems, hasUnreadMessages } = useNavigation();
  
  return (
    <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center">
      <div className="bg-white shadow-xl rounded-full flex items-center px-3 py-2 space-x-2 border">
        {navigationItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`p-3.5 rounded-full transition-colors ${
              isActive(item.path) ? 'bg-blue-100 text-erasmatch-blue' : 'text-gray-500'
            }`}
          >
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {item.hasNotification && !isActive(item.path) && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-erasmatch-blue rounded-full"></div>
              )}
            </div>
          </Link>
        ))}
        <Link to="/profile" className={`p-3.5 rounded-full transition-colors ${
          isActive('/profile') ? 'bg-blue-100 text-erasmatch-blue' : 'text-gray-500'
        }`}>
          <User className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};
