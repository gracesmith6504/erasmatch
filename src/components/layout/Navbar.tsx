
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageSquare, Users, User, LogOut, Building, Home } from "lucide-react";

type NavbarProps = {
  isAuthenticated: boolean;
  onLogout: () => void;
};

const Navbar = ({ isAuthenticated, onLogout }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [navigate]);

  // Add scroll effect to navbar
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

  // Check if nav link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold gradient-text">
                Eras<span className="text-erasmatch-green">Match</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <Link to="/" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-erasmatch-blue bg-blue-50' 
                    : 'text-gray-700 hover:text-erasmatch-blue hover:bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-1.5">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </div>
                </Link>
                <Link to="/students" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/students') 
                    ? 'text-erasmatch-blue bg-blue-50' 
                    : 'text-gray-700 hover:text-erasmatch-blue hover:bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-4 h-4" />
                    <span>Students</span>
                  </div>
                </Link>
                <Link to="/universities" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/universities') 
                    ? 'text-erasmatch-blue bg-blue-50' 
                    : 'text-gray-700 hover:text-erasmatch-blue hover:bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-1.5">
                    <Building className="w-4 h-4" />
                    <span>Universities</span>
                  </div>
                </Link>
                <Link to="/messages" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/messages') 
                    ? 'text-erasmatch-blue bg-blue-50' 
                    : 'text-gray-700 hover:text-erasmatch-blue hover:bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-1.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>Messages</span>
                  </div>
                </Link>
                <Link to="/profile" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/profile') 
                    ? 'text-erasmatch-blue bg-blue-50' 
                    : 'text-gray-700 hover:text-erasmatch-blue hover:bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-1.5">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </div>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={onLogout} 
                  className="button-hover text-gray-700 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth?mode=login">
                  <Button variant="ghost" className="button-hover">Log In</Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button className="button-hover bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple border-0 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
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

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
        <div className="px-4 pt-2 pb-3 space-y-1 bg-white shadow-md rounded-b-lg">
          {isAuthenticated ? (
            <>
              <Link to="/" className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive('/') 
                  ? 'text-white bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}>
                <div className="flex items-center">
                  <Home className="w-5 h-5 mr-3" />
                  Home
                </div>
              </Link>
              <Link to="/students" className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive('/students') 
                  ? 'text-white bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3" />
                  Students
                </div>
              </Link>
              <Link to="/universities" className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive('/universities') 
                  ? 'text-white bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}>
                <div className="flex items-center">
                  <Building className="w-5 h-5 mr-3" />
                  Universities
                </div>
              </Link>
              <Link to="/messages" className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive('/messages') 
                  ? 'text-white bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}>
                <div className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-3" />
                  Messages
                </div>
              </Link>
              <Link to="/profile" className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive('/profile') 
                  ? 'text-white bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}>
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-3" />
                  Profile
                </div>
              </Link>
              <button 
                onClick={onLogout}
                className="w-full text-left block px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50"
              >
                <div className="flex items-center">
                  <LogOut className="w-5 h-5 mr-3" />
                  Log Out
                </div>
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-2 pt-2 pb-2">
              <Link to="/auth?mode=login" className="w-full">
                <Button variant="outline" className="w-full button-hover">Log In</Button>
              </Link>
              <Link to="/auth?mode=signup" className="w-full">
                <Button className="w-full button-hover bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple border-0 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
