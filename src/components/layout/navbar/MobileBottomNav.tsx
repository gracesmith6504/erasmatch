import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import { useNavigation } from "./useNavigation";

interface MobileBottomNavProps {
  isActive: (path: string) => boolean;
}

export const MobileBottomNav = ({ isActive }: MobileBottomNavProps) => {
  const { navigationItems } = useNavigation();
  const location = useLocation();

  if (location.pathname === "/messages") return null;

  return (
    <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center">
      <div className="bg-card shadow-elevated rounded-full flex items-center px-3 py-2 gap-1 border border-border max-w-[95%] mx-auto">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`p-3.5 rounded-full transition-colors ${
              isActive(item.path)
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <item.icon className="w-5 h-5" />
          </Link>
        ))}
        <Link
          to="/profile"
          className={`p-3.5 rounded-full transition-colors ${
            isActive("/profile")
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          <User className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};