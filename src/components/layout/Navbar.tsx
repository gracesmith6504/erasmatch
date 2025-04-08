
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageSquare, Users, User, LogOut, Building } from "lucide-react";

type NavbarProps = {
  isAuthenticated: boolean;
  onLogout: () => void;
};

const Navbar = ({ isAuthenticated, onLogout }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [navigate]);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-erasmatch-blue">
                Eras<span className="text-erasmatch-green">Match</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/students" className="text-gray-700 hover:text-erasmatch-blue px-3 py-2 rounded-md font-medium flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Students
                </Link>
                <Link to="/universities" className="text-gray-700 hover:text-erasmatch-blue px-3 py-2 rounded-md font-medium flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  Universities
                </Link>
                <Link to="/messages" className="text-gray-700 hover:text-erasmatch-blue px-3 py-2 rounded-md font-medium flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Messages
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-erasmatch-blue px-3 py-2 rounded-md font-medium flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Profile
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={onLogout} 
                  className="text-gray-700 hover:text-red-600 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth?mode=login">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button>Sign Up</Button>
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
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {isAuthenticated ? (
              <>
                <Link to="/students" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-erasmatch-blue hover:bg-gray-50">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Students
                  </div>
                </Link>
                <Link to="/universities" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-erasmatch-blue hover:bg-gray-50">
                  <div className="flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Universities
                  </div>
                </Link>
                <Link to="/messages" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-erasmatch-blue hover:bg-gray-50">
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Messages
                  </div>
                </Link>
                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-erasmatch-blue hover:bg-gray-50">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Profile
                  </div>
                </Link>
                <button 
                  onClick={onLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <LogOut className="w-5 h-5 mr-2" />
                    Log Out
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link to="/auth?mode=login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-erasmatch-blue hover:bg-gray-50">
                  Log In
                </Link>
                <Link to="/auth?mode=signup" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-erasmatch-blue hover:bg-gray-50">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
