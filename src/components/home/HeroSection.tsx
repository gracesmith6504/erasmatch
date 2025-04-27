
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Search, MessageSquare, Calendar, ArrowRight, Users, CheckCircle } from "lucide-react";
import { ShareButton } from "@/components/share/ShareButton";
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
  const [animateCard, setAnimateCard] = useState<string | null>(null);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      navigate("/students");
    } else {
      navigate("/auth?mode=signup");
    }
  };

  const handleCardHover = (id: string) => {
    setAnimateCard(id);
    setTimeout(() => setAnimateCard(null), 300);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50 py-16 sm:py-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute h-32 w-32 rounded-full bg-duo-green opacity-20 -top-10 -left-10 animate-spin-slow"></div>
        <div className="absolute h-24 w-24 rounded-full bg-duo-blue opacity-10 top-1/4 left-2/3 animate-bounce-light"></div>
        <div className="absolute h-16 w-16 rounded-full bg-tinder-red opacity-10 bottom-1/4 right-10 animate-float-medium"></div>
        <div className="absolute h-40 w-40 rounded-full bg-duo-yellow opacity-10 -bottom-20 -left-20"></div>
        <div className="absolute h-20 w-20 rounded-full bg-duo-purple opacity-10 top-1/3 -right-10 animate-float-slow"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-4">
          <ShareButton showText={true} link="https://erasmatch.com"/>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold font-rounded tracking-tight mb-6 leading-tight">
              Making <span className="gradient-text">Erasmus Friends</span> Made Fun!
            </h1>
            <p className="text-lg sm:text-xl max-w-xl mx-auto md:mx-0 text-gray-600 mb-8 leading-relaxed">
              Swipe, match, and connect with other Erasmus students near you. Just like making friends, but easier!
            </p>
            
            {/* Primary CTA button */}
            {!isAuthenticated && (
              <div className="w-full mb-8 max-w-sm mx-auto md:mx-0">
                <Button 
                  size="lg" 
                  className="w-full text-lg px-4 py-7 button-duo animate-bounce-light"
                  onClick={handleAuthAction}
                >
                  Start Your Adventure!
                </Button>
                <p className="mt-3 text-sm text-gray-600">
                  Already exploring? <Link to="/auth?mode=login" className="text-duo-blue font-semibold hover:underline">Log in</Link>
                </p>
              </div>
            )}
            
            {/* Mobile specific action buttons */}
            <div className="flex flex-col space-y-4 md:hidden">
              <Button 
                className="w-full text-base px-4 py-6 button-tinder flex items-center justify-center"
                onClick={handleFindStudents}
              >
                <Search className="mr-2 h-5 w-5" />
                Find Students
              </Button>
              <Button 
                className="w-full text-base px-4 py-6 bg-duo-purple hover:bg-purple-600 text-white rounded-2xl font-rounded font-bold flex items-center justify-center shadow-md hover:-translate-y-1 transition-all duration-200"
                onClick={handleJoinChats}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Join Group Chats
              </Button>
              <Button 
                className="w-full text-base px-4 py-6 bg-duo-blue hover:bg-blue-500 text-white rounded-2xl font-rounded font-bold flex items-center justify-center shadow-md hover:-translate-y-1 transition-all duration-200"
                onClick={handlePlanning} 
              >
                <Calendar className="mr-2 h-5 w-5" />
                Find Travel Buddies
              </Button>
            </div>
            
            {/* Desktop action buttons */}
            <div className="hidden md:flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 button-tinder"
                onClick={handleFindStudents}
              >
                Start Matching
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Mobile trust signal */}
            <div className="md:hidden text-center mt-8 text-sm text-gray-600">
              <p className="flex items-center justify-center">
                <Heart className="text-tinder-red h-4 w-4 mr-1" />
                Join 1000+ Erasmus students in 18+ countries
              </p>
            </div>
            
            {/* Features list */}
            <div className="hidden md:block mt-8">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-duo-green mr-2" />
                  <span className="text-gray-700">Find friends before you arrive</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-duo-green mr-2" />
                  <span className="text-gray-700">Chat with students going to your city</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-duo-green mr-2" />
                  <span className="text-gray-700">Join city & university group chats</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Student card stack with Tinder-inspired design */}
          <div className="relative h-96 max-w-sm mx-auto">
            {/* Card Stack */}
            <div 
              className={`absolute top-4 left-4 w-64 h-80 bg-white rounded-2xl shadow-lg overflow-hidden transform rotate-[-8deg] transition-all ${animateCard === 'card3' ? 'scale-105' : ''}`}
              onMouseEnter={() => handleCardHover('card3')}
            >
              <div className="h-32 bg-purple-100"></div>
              <div className="p-4">
                <div className="w-16 h-16 rounded-full bg-purple-500 text-white -mt-12 mb-3 flex items-center justify-center text-xl font-bold">MA</div>
                <h3 className="font-bold">Marta, 22</h3>
                <p className="text-sm text-gray-600">University of Barcelona</p>
                <div className="flex space-x-2 mt-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Marketing</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Photography</span>
                </div>
              </div>
            </div>
            
            <div 
              className={`absolute top-2 left-8 w-64 h-80 bg-white rounded-2xl shadow-lg overflow-hidden transform rotate-[-4deg] z-10 transition-all ${animateCard === 'card2' ? 'scale-105' : ''}`}
              onMouseEnter={() => handleCardHover('card2')}
            >
              <div className="h-32 bg-blue-100"></div>
              <div className="p-4">
                <div className="w-16 h-16 rounded-full bg-blue-500 text-white -mt-12 mb-3 flex items-center justify-center text-xl font-bold">JL</div>
                <h3 className="font-bold">Juan, 20</h3>
                <p className="text-sm text-gray-600">Humboldt University</p>
                <div className="flex space-x-2 mt-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Computer Science</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Gaming</span>
                </div>
              </div>
            </div>
            
            <div 
              className={`absolute top-0 left-12 w-64 h-80 bg-white rounded-2xl shadow-xl overflow-hidden z-20 transition-all ${animateCard === 'card1' ? 'scale-105 shadow-2xl' : ''}`}
              onMouseEnter={() => handleCardHover('card1')}
            >
              <div className="h-32 bg-green-100"></div>
              <div className="p-4">
                <div className="w-16 h-16 rounded-full bg-duo-green text-white -mt-12 mb-3 flex items-center justify-center text-xl font-bold">SC</div>
                <h3 className="font-bold">Sophie, 21</h3>
                <p className="text-sm text-gray-600">Sorbonne University</p>
                <div className="flex space-x-2 mt-2">
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Literature</span>
                  <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">Art</span>
                </div>
                <div className="flex space-x-3 mt-4">
                  <button className="h-12 w-12 rounded-full bg-duo-red flex items-center justify-center text-white shadow-md transform transition hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                  <button className="h-14 w-14 rounded-full bg-duo-green flex items-center justify-center text-white shadow-md transform transition hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg>
                  </button>
                  <button className="h-12 w-12 rounded-full bg-duo-blue flex items-center justify-center text-white shadow-md transform transition hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-circle"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Match animation appears when clicking */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 opacity-0 scale-0 transition-all duration-300" id="match-animation">
              <div className="text-4xl font-bold text-tinder-red bg-white px-6 py-3 rounded-full shadow-xl flex items-center">
                <Heart className="h-8 w-8 mr-2 fill-current" /> MATCHED!
              </div>
            </div>
            
            {/* Student count indicator */}
            <div className="absolute -bottom-2 right-0 bg-white px-4 py-2 rounded-full shadow-lg z-30 flex items-center">
              <Users className="h-5 w-5 text-duo-blue mr-2" />
              <span className="font-bold text-duo-blue">1000+ students</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
