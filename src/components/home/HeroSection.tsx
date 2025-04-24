
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, MessageSquare, Calendar } from "lucide-react";
import { ShareButton } from "@/components/share/ShareButton";
import { ActivityFeed } from "./ActivityFeed";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

interface HeroSectionProps {
  handleFindStudents: () => void;
  handleJoinChats: () => void;
  handlePlanning: () => void;
}

export const HeroSection = ({ 
  handleFindStudents, 
  handleJoinChats, 
  handlePlanning 
}: HeroSectionProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      navigate("/students");
    } else {
      navigate("/auth?mode=signup");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 py-20 sm:py-32">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1')] bg-cover bg-center opacity-5"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple rounded-full opacity-20 animate-bounce-subtle"></div>
      <div className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-r from-erasmatch-purple to-erasmatch-pink rounded-full opacity-20 animate-bounce-subtle" style={{animationDelay: "1s"}}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-4">
          <ShareButton showText={true} link="https://erasmatch.com"/>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight text-gray-900 font-display">
              Erasmus <span className="bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple bg-clip-text text-transparent">Just Got Social</span>
            </h1>
            <p className="text-lg sm:text-xl max-w-xl text-gray-600 mb-8 leading-relaxed">
              Get advice, make friends, and never feel alone on your Erasmus journey.
            </p>
            
            {/* New primary CTA button */}
            {!isAuthenticated && (
              <div className="w-full mb-8">
                <Button 
                  size="xl" 
                  variant="gradient"
                  className="w-full text-base px-8 py-6 shadow-lg hover:shadow-xl button-hover"
                  onClick={handleAuthAction}
                >
                Join Now!
                </Button>
                <p className="mt-2 text-sm text-gray-600">
                Already a member? <Link to="/auth?mode=login" className="underline text-erasmatch-blue">Log in</Link>
                </p>
              </div>
            )}
            
            {/* Mobile specific action buttons */}
            <div className="flex flex-col space-y-4 md:hidden">
              <Button 
                size="lg" 
                className="w-full text-base px-4 py-6 bg-erasmatch-blue hover:bg-erasmatch-blue/90 text-white shadow-md flex items-center justify-center"
                onClick={handleFindStudents}
              >
                <Search className="mr-2 h-5 w-5" />
                Explore Students
              </Button>
              <Button 
                size="lg" 
                className="w-full text-base px-4 py-6 bg-erasmatch-purple hover:bg-erasmatch-purple/90 text-white shadow-md flex items-center justify-center"
                onClick={handleJoinChats}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Join Group Chats
              </Button>
              <Button 
                size="lg" 
                className="w-full text-base px-4 py-6 bg-erasmatch-green hover:bg-erasmatch-green/90 text-white shadow-md flex items-center justify-center"
                onClick={handleFindStudents} 
              >
                <Calendar className="mr-2 h-5 w-5" />
                Find Travel Buddies
              </Button>
            </div>
            
            {/* Desktop buttons */}
            <div className="hidden md:flex flex-wrap gap-4">
              <Button 
                size="xl" 
                variant="gradient"
                className="text-lg px-8 py-6 text-white shadow-lg hover:shadow-xl button-hover"
                onClick={handleFindStudents}
              >
                Find Students Near You
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Mobile trust signal */}
            <div className="md:hidden text-center mt-8 text-sm text-gray-600">
              <p className="flex items-center justify-center">
                <Heart className="text-erasmatch-pink h-4 w-4 mr-1" />
                Trusted by Erasmus students in 18+ countries
              </p>
            </div>
          </div>
          
          {/* Activity feed component */}
          <ActivityFeed />
        </div>

        {/* Subtle connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20 hidden md:block" style={{ pointerEvents: 'none' }}>
          <line x1="25%" y1="30%" x2="40%" y2="70%" stroke="#e0e7ff" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="75%" y1="40%" x2="40%" y2="70%" stroke="#e0e7ff" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="75%" y1="40%" x2="65%" y2="75%" stroke="#e0e7ff" strokeWidth="1" strokeDasharray="5,5" />
        </svg>
      </div>
    </section>
  );
};
