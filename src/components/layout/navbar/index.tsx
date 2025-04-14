
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavbarBrand } from "./NavbarBrand";
import { DesktopNavLinks } from "./DesktopNavLinks";
import { ProfileMenu } from "./ProfileMenu";
import { MobileMenu } from "./MobileMenu";
import { MobileBottomNav } from "./MobileBottomNav";
import { useNavbarState } from "./useNavbarState";

type NavbarProps = {
  isAuthenticated: boolean;
  onLogout: () => void;
  currentUserId?: string;
};

const Navbar = ({ isAuthenticated, onLogout, currentUserId }: NavbarProps) => {
  const { isOpen, setIsOpen, scrolled, hasUnreadMessages } = useNavbarState({ 
    isAuthenticated, 
    currentUserId 
  });

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <NavbarBrand />
            <DesktopNavLinks 
              isAuthenticated={isAuthenticated} 
              hasUnreadMessages={hasUnreadMessages} 
            />
            <ProfileMenu 
              isAuthenticated={isAuthenticated} 
              onLogout={onLogout} 
            />
            
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-erasmatch-blue focus:outline-none"
              >
                {isOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        <MobileMenu 
          isOpen={isOpen} 
          isAuthenticated={isAuthenticated} 
          onLogout={onLogout}
          hasUnreadMessages={hasUnreadMessages}
        />
      </nav>
      
      <MobileBottomNav 
        isAuthenticated={isAuthenticated} 
        hasUnreadMessages={hasUnreadMessages} 
      />
    </>
  );
};

export default Navbar;
