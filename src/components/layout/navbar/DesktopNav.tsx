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
      <div className="hidden md:flex items-center gap-2">
        <Link to="/auth?mode=login">
          <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full px-5">
            Log In
          </Button>
        </Link>
        <Link to="/auth?mode=signup">
          <Button className="text-sm font-medium rounded-full px-5 bg-foreground text-background hover:bg-foreground/90 shadow-button">
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:flex items-center">
        <div className="bg-secondary rounded-full p-1 flex items-center gap-0.5">
          {navigationItems.map((item) => (
            <NavigationLink
              key={item.path}
              to={item.path}
              isActive={isActive(item.path)}
              className="px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium"
              activeClass="bg-foreground text-background shadow-button"
              inactiveClass="text-muted-foreground hover:text-foreground hover:bg-background/60"
              icon={item.icon}
            >
              {item.name}
            </NavigationLink>
          ))}
        </div>
      </div>

      <div className="hidden md:flex items-center gap-1">
        <Link
          to="/profile"
          className={`p-2 rounded-full transition-colors ${
            isActive('/profile')
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <User className="w-5 h-5" />
        </Link>
        <Button
          variant="ghost"
          onClick={onLogout}
          type="button"
          className="p-2 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          size="icon"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </>
  );
};