
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
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Remove any notification elements that might be present
  useEffect(() => {
    const removeNotificationBadges = () => {
      // This looks for any pink circles/notifications that might be appearing
      const notifications = document.querySelectorAll('.notification-badge, .notification-dot');
      notifications.forEach(badge => {
        badge.remove();
      });
    };

    // Run initially and whenever route changes
    removeNotificationBadges();
    
    return () => {
      removeNotificationBadges();
    };
  }, [navigate]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default form submission
    onLogout();
    setIsOpen(false); // Close mobile menu after logout
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-16 items-center">
            {/* Logo section */}
            <div className="flex items-center">
              <a href="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl md:text-xl font-bold gradient-text animate-pulse-soft">
                  Eras<span className="text-erasmatch-green">Match</span> 
                </span>
              </a>
            </div>
            
            {/* Desktop navigation */}
            <DesktopNav 
              isAuthenticated={isAuthenticated} 
              isActive={isActive} 
              onLogout={handleLogout} 
            />
            
            {/* Mobile navigation toggle */}
            <MobileNavToggle isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <MobileNav 
          isOpen={isOpen} 
          isAuthenticated={isAuthenticated} 
          isActive={isActive} 
          onLogout={handleLogout} 
        />
      </nav>
      
      {/* Mobile Bottom Navigation */}
      {isAuthenticated && <MobileBottomNav isActive={isActive} />}
    </>
  );
};

export default Navbar;
