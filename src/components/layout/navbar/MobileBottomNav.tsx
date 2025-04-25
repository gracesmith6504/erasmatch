
import { Link } from "react-router-dom";
import { Home, Users, MessageSquare, User } from "lucide-react";
import { useNavigation } from "./useNavigation";

interface MobileBottomNavProps {
  isActive: (path: string) => boolean;
}

export const MobileBottomNav = ({ isActive }: MobileBottomNavProps) => {
  const { navigationItems } = useNavigation();
  
  return (
    <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center">
      <div className="bg-white shadow-xl rounded-full flex items-center px-3 py-2 space-x-2 border max-w-[95%] mx-auto">
        {navigationItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`p-3.5 rounded-full transition-colors ${
              isActive(item.path) 
                ? 'bg-green-100 text-erasmatch-green animate-pulse-soft' 
                : 'text-gray-500'
            }`}
          >
            <item.icon className="w-5 h-5" />
          </Link>
        ))}
        <Link to="/profile" className={`p-3.5 rounded-full transition-colors ${
          isActive('/profile') 
            ? 'bg-green-100 text-erasmatch-green animate-pulse-soft' 
            : 'text-gray-500'
        }`}>
          <User className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};
