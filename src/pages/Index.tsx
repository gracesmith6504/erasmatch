
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Users, 
  MapPin, 
  School, 
  ArrowRight, 
  UserCheck,
  MessageCircle,
  UserPlus,
  CheckCircle,
  Globe,
  Calendar,
  Heart
} from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

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

  // Group chat data
  const groupChats = [
    { id: 1, name: "🎓 Trinity → Lisbon Chat", message: "8 new messages", image: "https://images.unsplash.com/photo-1562614460-e55cab877833?q=80&w=1074&auto=format&fit=crop" },
    { id: 2, name: "🍕 Rome City Chat", message: "Weekend dinner plans 🍝", image: "https://images.unsplash.com/photo-1615724596420-37b0b9d013a9?q=80&w=1074&auto=format&fit=crop" },
    { id: 3, name: "🎉 Barcelona Uni Chat", message: "3 new students joined", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=1170&auto=format&fit=crop" },
    { id: 4, name: "🇫🇷 Paris Exchange Group", message: "Planning welcome party!", image: "https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?q=80&w=1064&auto=format&fit=crop" },
    { id: 5, name: "🌊 Amsterdam Crew", message: "Weekend bike tour", image: "https://images.unsplash.com/photo-1459679749680-18eb1eb37418?q=80&w=1170&auto=format&fit=crop" },
  ];

  return (
    <div className="animate-fade-in min-h-screen">
      {/* Hero Section with floating avatars */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 py-20 sm:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1')] bg-cover bg-center opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight text-gray-900">
                Erasmus <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Just Got Social</span>
              </h1>
              <p className="text-lg sm:text-xl max-w-xl text-gray-600 mb-8 leading-relaxed">
                Get advice, make friends, and never feel alone on your Erasmus journey.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/auth?mode=signup">
                  <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    Find Students Near You
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative h-80 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-blue-50 to-transparent z-10"></div>
              <div className="overflow-auto h-full p-4">
                {activities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className={`flex items-center gap-4 p-4 mb-3 rounded-lg border border-gray-100 ${index === 0 ? 'animate-pulse-soft bg-blue-50' : 'bg-white'}`}
                  >
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white ${index === 0 ? 'bg-blue-500' : 'bg-purple-500'}`}>
                      {activity.text.includes("matched") ? 
                        <UserCheck className="h-6 w-6" /> : 
                        activity.text.includes("joined") ? 
                        <UserPlus className="h-6 w-6" /> : 
                        <MessageCircle className="h-6 w-6" />
                      }
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{activity.text}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent z-10"></div>
            </div>
          </div>

          {/* Subtle connection lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20" style={{ pointerEvents: 'none' }}>
            <line x1="25%" y1="30%" x2="40%" y2="70%" stroke="#e0e7ff" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="75%" y1="40%" x2="40%" y2="70%" stroke="#e0e7ff" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="75%" y1="40%" x2="65%" y2="75%" stroke="#e0e7ff" strokeWidth="1" strokeDasharray="5,5" />
          </svg>
        </div>
      </section>

      {/* Why ErasMatch */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Not just where you're going. Who you're going with.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Match with students</h3>
              <p className="text-gray-600">Connect with others going to your city or university</p>
            </div>

            <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Join group chats</h3>
              <p className="text-gray-600">Become part of city and university conversations</p>
            </div>

            <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Make plans</h3>
              <p className="text-gray-600">Feel at home before you even arrive</p>
            </div>

            <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Stay connected</h3>
              <p className="text-gray-600">Keep in touch throughout your exchange experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Your journey to making Erasmus connections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-6">
                <UserCheck className="h-10 w-10" />
                <div className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">1</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Create Your Profile</h3>
              <p className="text-gray-600">
                Tell us where you're going and what you're into
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-purple-600 mb-6">
                <Users className="h-10 w-10" />
                <div className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-lg font-bold">2</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Discover Students</h3>
              <p className="text-gray-600">
                See who's going to your city or university
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-pink-100 text-pink-600 mb-6">
                <MessageCircle className="h-10 w-10" />
                <div className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-lg font-bold">3</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Start Connecting</h3>
              <p className="text-gray-600">
                Message, join chats, and make plans together
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Student Stories</h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Real experiences from the ErasMatch community
            </p>
          </div>

          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              <CarouselItem className="md:basis-1/1 lg:basis-1/2">
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-4 flex justify-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-6 text-lg">
                      "I matched with 3 people before arriving in Amsterdam. We travelled together every weekend and became inseparable during our entire exchange."
                    </p>
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 flex items-center justify-center text-blue-600 font-semibold">
                        JD
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">Julia Dubois 🇫🇷</p>
                        <p className="text-sm text-gray-500">University of Amsterdam</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>

              <CarouselItem className="md:basis-1/1 lg:basis-1/2">
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-4 flex justify-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-6 text-lg">
                      "I was nervous about going to Prague alone, but I already had a roommate through ErasMatch before arriving. It made the whole experience so much easier!"
                    </p>
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-200 to-teal-200 flex items-center justify-center text-green-600 font-semibold">
                        MS
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">Marco Sanchez 🇪🇸</p>
                        <p className="text-sm text-gray-500">Charles University Prague</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>

              <CarouselItem className="md:basis-1/1 lg:basis-1/2">
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-4 flex justify-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-6 text-lg">
                      "The city chat for Berlin was so active! I got amazing tips about housing and which courses to take. It really helped me prepare for my semester abroad."
                    </p>
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 flex items-center justify-center text-purple-600 font-semibold">
                        LK
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">Lena Kowalski 🇵🇱</p>
                        <p className="text-sm text-gray-500">Humboldt University Berlin</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="-left-12" />
              <CarouselNext className="-right-12" />
            </div>
          </Carousel>
          
          <div className="md:hidden flex justify-center gap-2 mt-8">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <div className="h-2 w-2 rounded-full bg-gray-300"></div>
            <div className="h-2 w-2 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </section>

      {/* Group Chats in Action */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Real conversations, real connections.</h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Whether you're heading to Paris, Prague or Porto — there's already a chat waiting for you. Join, say hi, and start planning your Erasmus experience together.
            </p>
          </div>

          <div className="mt-12">
            <Carousel className="max-w-6xl mx-auto">
              <CarouselContent>
                {groupChats.map(chat => (
                  <CarouselItem key={chat.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <div className="relative group overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={chat.image} 
                            alt={chat.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                          <div className="flex flex-col">
                            <h3 className="text-lg font-bold">{chat.name}</h3>
                            <p className="text-sm text-blue-100 mt-1">{chat.message}</p>
                            <Button size="sm" className="mt-3 bg-white text-blue-600 hover:bg-blue-50 w-full">
                              Join Chat
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>
          </div>
          
          <div className="text-center mt-10">
            <Link to="/students">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                Browse Group Chats <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Join the Community */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl shadow-sm">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580846011-d3a5bc25702b')] bg-cover bg-center opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/80 to-purple-600/80"></div>
            
            <div className="relative px-6 py-16 sm:px-12 lg:px-16 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                ErasMatch is free, private, and growing fast.
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                ErasMatch is a safe space to meet, plan, and connect with real students before and during Erasmus.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm text-white text-sm">University of Barcelona</div>
                <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm text-white text-sm">Humboldt University</div>
                <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm text-white text-sm">Sorbonne University</div>
                <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm text-white text-sm">University of Amsterdam</div>
                <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm text-white text-sm">+ 45 more</div>
              </div>
              
              <Link to="/auth?mode=signup">
                <Button size="lg" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300">
                  Create Your Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Helping Erasmus students feel connected, wherever they go.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link to="/about" className="text-gray-500 hover:text-blue-600 transition-colors">About</Link>
            <Link to="/blog" className="text-gray-500 hover:text-blue-600 transition-colors">Blog</Link>
            <Link to="/faq" className="text-gray-500 hover:text-blue-600 transition-colors">FAQ</Link>
            <Link to="/contact" className="text-gray-500 hover:text-blue-600 transition-colors">Contact</Link>
            <a href="https://instagram.com/erasmatch" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">Instagram</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
