
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
                <span className="text-xl md:text-xl font-bold gradient-text flex items-center">
                  <svg 
                    className="h-8 w-8 mr-2" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="10" className="text-erasmatch-dark"/>
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" 
                      stroke="currentColor" strokeWidth="2" />
                    <path d="M10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6C9.10457 6 10 6.89543 10 8Z" 
                      className="fill-erasmatch-green" />
                    <path d="M16 18L8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 17L12 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M16 12C17.1046 12 18 11.1046 18 10C18 8.89543 17.1046 8 16 8" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
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
