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
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const removeNotificationBadges = () => {
      const notifications = document.querySelectorAll(
        ".notification-badge, .notification-dot"
      );
      notifications.forEach((badge) => badge.remove());
    };

    removeNotificationBadges();
    return () => removeNotificationBadges();
  }, [navigate]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    onLogout();
    setIsOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[80px] md:h-[88px] lg:h-[96px]">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <img
                  src="https://ceoflcktscennfmmdrvp.supabase.co/storage/v1/object/public/public-assets//erasmatch-logo-cropped-transparent.png"
                  alt="ErasMatch Logo"
                  className="h-[64px] w-auto"
                />
              </a>
            </div>

            {/* Desktop Nav */}
            <DesktopNav
              isAuthenticated={isAuthenticated}
              isActive={isActive}
              onLogout={handleLogout}
            />

            {/* Mobile Nav Toggle */}
            <MobileNavToggle isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        <MobileNav
          isOpen={isOpen}
          isAuthenticated={isAuthenticated}
          isActive={isActive}
          onLogout={handleLogout}
        />
      </nav>

      {/* Bottom Nav */}
      {isAuthenticated && <MobileBottomNav isActive={isActive} />}
    </>
  );
};

export default Navbar;
