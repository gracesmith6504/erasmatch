
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Users, 
  Globe, 
  School, 
  ArrowRight, 
  MapPin, 
  GraduationCap, 
  Languages,
  Clock,
  Sparkles,
  Heart,
  Camera
} from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

const Index = () => {
  // Activity feed data - simulated real-time activities
  const [activities, setActivities] = useState([
    { id: 1, text: "✨ Paula matched with Leo in Barcelona", time: "Just now" },
    { id: 2, text: "🇮🇹 Anna joined the Rome University Chat", time: "2 minutes ago" },
    { id: 3, text: "🏠 Lucas found housing in Amsterdam", time: "5 minutes ago" },
    { id: 4, text: "🇫🇷 Sofia and Thiago met in Paris", time: "10 minutes ago" },
    { id: 5, text: "🎓 Michael joined ERASMUS+ 2025", time: "15 minutes ago" }
  ]);

  // Simulate new activities appearing in real-time
  useEffect(() => {
    const possibleActivities = [
      { text: "✨ Mia matched with Alex in Berlin", time: "Just now" },
      { text: "🇵🇹 Carlos joined the Lisbon University Chat", time: "Just now" },
      { text: "🏠 Emma found housing in Vienna", time: "Just now" },
      { text: "🇪🇸 Luca and Sophie met in Madrid", time: "Just now" },
      { text: "🎓 Olivia joined ERASMUS+ 2025", time: "Just now" }
    ];

    const interval = setInterval(() => {
      const randomActivity = possibleActivities[Math.floor(Math.random() * possibleActivities.length)];
      setActivities(prev => [{
        id: Date.now(),
        ...randomActivity
      }, ...prev.slice(0, 4)]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section with floating cards */}
      <section className="relative overflow-hidden bg-gradient-to-br from-erasmatch-blue via-erasmatch-purple to-erasmatch-blue py-20 sm:py-32 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-erasmatch-blue/90 via-erasmatch-purple/80 to-erasmatch-blue/90"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Erasmus <span className="bg-gradient-to-r from-erasmatch-yellow to-erasmatch-orange bg-clip-text text-transparent">Just Got Social</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto opacity-90 mb-10 leading-relaxed">
              Get advice, make friends, and never feel alone on your Erasmus journey.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="text-lg px-8 py-6 bg-white text-erasmatch-blue hover:bg-gray-100 shadow-xl button-hover w-full sm:w-auto">
                  Find Students Near You
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/universities">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-white text-white bg-transparent hover:bg-white/10 button-hover w-full sm:w-auto">
                  Browse Universities
                </Button>
              </Link>
            </div>
          </div>

          {/* Floating Student Profile Cards */}
          <div className="mt-16 relative h-64 md:h-96">
            {/* These would be animated with CSS in a production environment */}
            <div className="absolute top-0 left-[10%] bg-white rounded-xl shadow-lg p-4 transform -rotate-6 transition-all hover:rotate-0 hover:scale-105 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center text-erasmatch-blue font-semibold">
                  MG
                </div>
                <div>
                  <p className="font-medium">Maria G.</p>
                  <p className="text-sm text-gray-500">Barcelona 🇪🇸</p>
                </div>
              </div>
            </div>
            
            <div className="absolute top-1/4 right-[15%] bg-white rounded-xl shadow-lg p-4 transform rotate-3 transition-all hover:rotate-0 hover:scale-105 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-100 to-teal-100 flex items-center justify-center text-erasmatch-green font-semibold">
                  JP
                </div>
                <div>
                  <p className="font-medium">Jan P.</p>
                  <p className="text-sm text-gray-500">Amsterdam 🇳🇱</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-[25%] bg-white rounded-xl shadow-lg p-4 transform rotate-6 transition-all hover:rotate-0 hover:scale-105 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center text-erasmatch-purple font-semibold">
                  SD
                </div>
                <div>
                  <p className="font-medium">Sophie D.</p>
                  <p className="text-sm text-gray-500">Berlin 🇩🇪</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-1/3 right-[25%] bg-white rounded-xl shadow-lg p-4 transform -rotate-3 transition-all hover:rotate-0 hover:scale-105 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-orange-100 to-yellow-100 flex items-center justify-center text-erasmatch-orange font-semibold">
                  TM
                </div>
                <div>
                  <p className="font-medium">Thomas M.</p>
                  <p className="text-sm text-gray-500">Lisbon 🇵🇹</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <span className="text-4xl font-bold mb-2">300+</span>
              <span className="text-lg">Universities</span>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <span className="text-4xl font-bold mb-2">5,000+</span>
              <span className="text-lg">Students</span>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <span className="text-4xl font-bold mb-2">30+</span>
              <span className="text-lg">Countries</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Activity Feed */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Live Activity</h2>
            <p className="text-xl text-gray-600">See what's happening in the ErasMatch community right now</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-white to-transparent z-10"></div>
              <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-soft">
                {activities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className={`flex items-center gap-4 p-4 border-b border-gray-100 ${index === 0 ? 'animate-pulse-soft' : ''}`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${index === 0 ? 'bg-erasmatch-blue' : 'bg-erasmatch-purple'}`}>
                      {index === 0 ? <Sparkles className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{activity.text}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How ErasMatch Works */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold gradient-text mb-4">How ErasMatch Works</h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              We support you throughout your entire Erasmus journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-soft border border-gray-100 text-center transition-all hover:-translate-y-1 duration-300">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-erasmatch-blue mb-6">
                <GraduationCap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Before You Go</h3>
              <p className="text-gray-600 mb-5">
                Find students headed to your destination, get insider tips, and make friends before you even pack your bags.
              </p>
              <Link to="/students">
                <Button variant="outline" className="w-full button-hover">
                  Find Students
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-soft border border-gray-100 text-center transition-all hover:-translate-y-1 duration-300">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-erasmatch-green/20 to-teal-100 text-erasmatch-green mb-6">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">While Abroad</h3>
              <p className="text-gray-600 mb-5">
                Join local chats, discover events, plan trips together, and build your international network.
              </p>
              <Link to="/groups">
                <Button variant="outline" className="w-full button-hover">
                  Join Group Chats
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-soft border border-gray-100 text-center transition-all hover:-translate-y-1 duration-300">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-100 to-yellow-100 text-erasmatch-orange mb-6">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">After Erasmus</h3>
              <p className="text-gray-600 mb-5">
                Stay in touch with your international friends, share your experiences, and plan reunions anywhere in Europe.
              </p>
              <Link to="/messages">
                <Button variant="outline" className="w-full button-hover">
                  Connect & Share
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Student Stories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold gradient-text mb-4">Student Stories</h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Hear from students who found their community through ErasMatch
            </p>
          </div>

          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              <CarouselItem className="md:basis-1/1 lg:basis-1/2">
                <div className="bg-white p-8 rounded-xl shadow-soft border border-gray-100 h-full flex flex-col">
                  <div className="flex-grow">
                    <div className="flex items-center text-yellow-400 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-6 text-lg">
                      "I found my roommates before even arriving in Barcelona! ErasMatch made my transition to Erasmus life so much easier. We even planned our first weekend trip together."
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center text-erasmatch-blue font-semibold">
                      MG
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Maria González</p>
                      <p className="text-sm text-gray-500">Universidad de Barcelona</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              <CarouselItem className="md:basis-1/1 lg:basis-1/2">
                <div className="bg-white p-8 rounded-xl shadow-soft border border-gray-100 h-full flex flex-col">
                  <div className="flex-grow">
                    <div className="flex items-center text-yellow-400 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-6 text-lg">
                      "Through ErasMatch I connected with other students from my home university who were going to the same destination. We planned our journey together and now we're inseparable!"
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-100 to-teal-100 flex items-center justify-center text-erasmatch-green font-semibold">
                      TM
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Thomas Müller</p>
                      <p className="text-sm text-gray-500">Technical University of Munich</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              <CarouselItem className="md:basis-1/1 lg:basis-1/2">
                <div className="bg-white p-8 rounded-xl shadow-soft border border-gray-100 h-full flex flex-col">
                  <div className="flex-grow">
                    <div className="flex items-center text-yellow-400 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-6 text-lg">
                      "The platform was super simple to use. I chatted with several students who gave me useful tips about accommodation and courses. ErasMatch made Amsterdam feel like home from day one."
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center text-erasmatch-purple font-semibold">
                      SD
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Sophie Dubois</p>
                      <p className="text-sm text-gray-500">University of Amsterdam</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="-left-12" />
              <CarouselNext className="-right-12" />
            </div>
          </Carousel>
          
          <div className="md:hidden flex justify-center gap-2 mt-8">
            <div className="h-2 w-2 rounded-full bg-erasmatch-blue"></div>
            <div className="h-2 w-2 rounded-full bg-gray-300"></div>
            <div className="h-2 w-2 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </section>

      {/* Discover by City */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold gradient-text mb-4">Discover by City</h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Find students and chats in popular Erasmus destinations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { name: "Barcelona", flag: "🇪🇸", users: 432 },
              { name: "Lisbon", flag: "🇵🇹", users: 315 },
              { name: "Berlin", flag: "🇩🇪", users: 289 },
              { name: "Paris", flag: "🇫🇷", users: 267 },
              { name: "Rome", flag: "🇮🇹", users: 254 },
              { name: "Amsterdam", flag: "🇳🇱", users: 223 },
              { name: "Vienna", flag: "🇦🇹", users: 198 },
              { name: "Prague", flag: "🇨🇿", users: 187 },
              { name: "Copenhagen", flag: "🇩🇰", users: 176 },
              { name: "Budapest", flag: "🇭🇺", users: 165 },
            ].map(city => (
              <div key={city.name} className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md duration-300">
                <div className="h-24 bg-gradient-to-br from-erasmatch-blue to-erasmatch-purple flex items-center justify-center">
                  <span className="text-3xl">{city.flag}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{city.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    <span>{city.users} students</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/students">
              <Button className="bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple text-white">
                See All Cities <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Join the Community */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580846011-d3a5bc25702b')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-erasmatch-blue/90 to-erasmatch-purple/90"></div>
            
            <div className="relative px-6 py-16 sm:px-12 lg:px-16 text-center">
              <h2 className="text-3xl font-extrabold text-white mb-4">
                Ready to find your Erasmus community?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                Join our growing family of international students and make the most of your exchange experience.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm text-white">University of Barcelona</div>
                <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm text-white">Humboldt University</div>
                <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm text-white">Sorbonne University</div>
                <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm text-white">University of Amsterdam</div>
                <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm text-white">University of Lisbon</div>
                <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm text-white">+ 295 more</div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/auth?mode=signup">
                  <Button size="lg" className="text-lg px-8 py-6 bg-white text-erasmatch-blue hover:bg-gray-100 shadow-xl button-hover">
                    Create Your Profile
                  </Button>
                </Link>
                <Link to="/students">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-white text-white bg-transparent hover:bg-white/10 button-hover">
                    Browse Students
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trust Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-erasmatch-blue mb-6">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Built by Students</h3>
              <p className="text-gray-600">
                ErasMatch was created by former Erasmus students who understand exactly what you need.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-100 to-teal-100 text-erasmatch-green mb-6">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Growing Community</h3>
              <p className="text-gray-600">
                Join students from over 300 universities across Europe and make meaningful connections.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-100 to-yellow-100 text-erasmatch-orange mb-6">
                <Camera className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Share Experiences</h3>
              <p className="text-gray-600">
                Document your journey and connect with others through shared experiences and stories.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
