
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, MessageSquare, Calendar } from "lucide-react";
import { ShareButton } from "@/components/share/ShareButton";
import { ActivityFeed } from "./ActivityFeed";
import { Heart } from "lucide-react";

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
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 py-20 sm:py-32">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1')] bg-cover bg-center opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-4">
          <ShareButton showText={true} link="https://erasmatch.com"/>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-left">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight text-gray-900">
              Erasmus <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Just Got Social</span>
            </h1>
            <p className="text-lg sm:text-xl max-w-xl text-gray-600 mb-8 leading-relaxed">
              Get advice, make friends, and never feel alone on your Erasmus journey.
            </p>
            
            {/* Mobile specific action buttons */}
            <div className="flex flex-col space-y-4 md:hidden">
              <Button 
                size="lg" 
                className="w-full text-base px-4 py-6 bg-blue-500 hover:bg-blue-600 text-white shadow-md flex items-center justify-center"
                onClick={handleFindStudents}
              >
                <Search className="mr-2 h-5 w-5" />
                Explore Students
              </Button>
              <Button 
                size="lg" 
                className="w-full text-base px-4 py-6 bg-purple-500 hover:bg-purple-600 text-white shadow-md flex items-center justify-center"
                onClick={handleJoinChats}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Join Group Chats
              </Button>
              <Button 
                size="lg" 
                className="w-full text-base px-4 py-6 bg-green-500 hover:bg-green-600 text-white shadow-md flex items-center justify-center"
                onClick={handleFindStudents} // Changed to use handleFindStudents instead of handlePlanning
              >
                <Calendar className="mr-2 h-5 w-5" />
                Find Travel Buddies
              </Button>
            </div>
            
            {/* Desktop buttons */}
            <div className="hidden md:flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleFindStudents}
              >
                Find Students Near You
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Mobile trust signal */}
            <div className="md:hidden text-center mt-8 text-sm text-gray-600">
              <p className="flex items-center justify-center">
                <Heart className="text-pink-500 h-4 w-4 mr-1" />
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
