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
    <div className="md:hidden fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="bg-card/90 backdrop-blur-xl shadow-elevated rounded-full flex items-center px-1.5 py-1.5 gap-0.5 border border-border/60 pointer-events-auto">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            aria-label={item.name}
            className={`p-2.5 rounded-full transition-colors relative ${
              isActive(item.path)
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <item.icon className="w-[18px] h-[18px]" strokeWidth={2} />
            {item.badge > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1">
                {item.badge > 99 ? "99+" : item.badge}
              </span>
            )}
          </Link>
        ))}
        <NotificationBell />
        <Link
          to="/profile"
          aria-label="Profile"
          className={`p-2.5 rounded-full transition-colors ${
            isActive("/profile")
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          <User className="w-[18px] h-[18px]" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
};