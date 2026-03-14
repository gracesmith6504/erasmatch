import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { MobileNavToggle } from "./MobileNavToggle";
import { MobileBottomNav } from "./MobileBottomNav";
import { useNavigation } from "./useNavigation";

type NavbarProps = {
  isAuthenticated: boolean;
  onLogout: () => void;
};

const Navbar = ({ isAuthenticated, onLogout }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isActive } = useNavigation();

  useEffect(() => {
    setIsOpen(false);
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    onLogout();
    setIsOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-md shadow-soft border-b border-border'
            : 'bg-background'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <a href="/" className="flex items-center gap-1">
                <span className="text-xl font-display font-extrabold tracking-tight">
                <span className="text-erasmatch-blue">Eras</span><span className="text-erasmatch-green">Match</span>
              </span>
            </a>

            {/* Desktop navigation */}
            <DesktopNav
              isAuthenticated={isAuthenticated}
              isActive={isActive}
              onLogout={handleLogout}
            />

            {/* Mobile toggle */}
            <MobileNavToggle isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>

        {/* Mobile dropdown */}
        <MobileNav
          isOpen={isOpen}
          isAuthenticated={isAuthenticated}
          isActive={isActive}
          onLogout={handleLogout}
        />
      </nav>

      {isAuthenticated && <MobileBottomNav isActive={isActive} />}
    </>
  );
};

export default Navbar;