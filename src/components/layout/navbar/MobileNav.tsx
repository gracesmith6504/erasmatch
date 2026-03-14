import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
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
  onLogout,
}: MobileNavProps) => {
  const { navigationItems } = useNavigation();

  return (
    <div
      className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? "max-h-screen" : "max-h-0"
      }`}
    >
      <div className="px-4 pt-2 pb-3 space-y-1 bg-background border-t border-border shadow-soft rounded-b-xl">
        {isAuthenticated ? (
          <>
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            ))}
            <Link
              to="/profile"
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                isActive("/profile")
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3" />
                Profile
              </div>
            </Link>
            <button
              onClick={onLogout}
              type="button"
              className="w-full text-left block px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <div className="flex items-center">
                <LogOut className="w-5 h-5 mr-3" />
                Log Out
              </div>
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-2 py-2">
            <Link to="/auth?mode=login" className="w-full">
              <Button
                variant="outline"
                className="w-full py-3 text-base rounded-xl border-border text-foreground hover:bg-secondary"
              >
                Log In
              </Button>
            </Link>
            <Link to="/auth?mode=signup" className="w-full">
              <Button className="w-full py-3 text-base rounded-xl bg-foreground text-background hover:bg-foreground/90">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};