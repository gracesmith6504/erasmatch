
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
  Camera,
  UserCheck,
  MessageCircle,
  UserPlus,
  MapPinned
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

  return (
    <div className="animate-fade-in min-h-screen">
      {/* Hero Section with floating avatars */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 py-20 sm:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1')] bg-cover bg-center opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-gray-900">
              Erasmus <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Just Got Social</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto text-gray-600 mb-10 leading-relaxed">
              Get advice, make friends, and never feel alone on your Erasmus journey.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
                  Find Students Near You
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/universities">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 w-full sm:w-auto">
                  Browse Universities
                </Button>
              </Link>
            </div>
          </div>

          {/* Floating Student Avatar Bubbles */}
          <div className="mt-16 relative h-72 md:h-96">
            <div className="absolute top-1/4 left-[15%] animate-float-slow">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 font-semibold shadow-md hover:scale-110 transition-transform cursor-pointer">
                <span>MG</span>
                <span className="absolute -top-1 -right-1 text-lg">🇪🇸</span>
              </div>
            </div>
            
            <div className="absolute top-1/2 right-[20%] animate-float-medium">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-r from-green-100 to-teal-100 flex items-center justify-center text-teal-600 font-semibold shadow-md hover:scale-110 transition-transform cursor-pointer">
                <span>JP</span>
                <span className="absolute -top-1 -right-1 text-lg">🇳🇱</span>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-[30%] animate-float-fast">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center text-purple-600 font-semibold shadow-md hover:scale-110 transition-transform cursor-pointer">
                <span>SD</span>
                <span className="absolute -top-1 -right-1 text-lg">🇩🇪</span>
              </div>
            </div>
            
            <div className="absolute top-[70%] right-[30%] animate-float-medium">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-r from-orange-100 to-yellow-100 flex items-center justify-center text-orange-600 font-semibold shadow-md hover:scale-110 transition-transform cursor-pointer">
                <span>TM</span>
                <span className="absolute -top-1 -right-1 text-lg">🇵🇹</span>
              </div>
            </div>
            
            <div className="absolute top-[20%] right-[40%] animate-float-slow">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-r from-pink-100 to-red-100 flex items-center justify-center text-pink-600 font-semibold shadow-md hover:scale-110 transition-transform cursor-pointer">
                <span>LK</span>
                <span className="absolute -top-1 -right-1 text-lg">🇫🇷</span>
              </div>
            </div>
            
            {/* Subtle connection lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              <line x1="25%" y1="30%" x2="40%" y2="70%" stroke="#e0e7ff" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="75%" y1="40%" x2="40%" y2="70%" stroke="#e0e7ff" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="75%" y1="40%" x2="65%" y2="75%" stroke="#e0e7ff" strokeWidth="1" strokeDasharray="5,5" />
            </svg>
          </div>
        </div>
      </section>

      {/* Social Proof Block */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <School className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-1">50+ Universities</h3>
              <p className="text-gray-600">Trusted by students from top universities across Europe</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <MessageSquare className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-1">25+ Active Cities</h3>
              <p className="text-gray-600">Connect with students in popular Erasmus destinations</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                <Heart className="h-7 w-7 text-pink-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-1">By Students, For Students</h3>
              <p className="text-gray-600">Created by former Erasmus students who understand your journey</p>
            </div>
          </div>
          
          {/* Testimonial Quote */}
          <div className="mt-12 max-w-2xl mx-auto text-center">
            <div className="relative">
              <div className="text-5xl text-purple-300 absolute -top-6 left-0">"</div>
              <p className="text-lg italic text-gray-700 px-8">
                I joined before flying to Berlin — I already knew 3 people before landing. It made the first week so much easier!
              </p>
              <div className="text-5xl text-purple-300 absolute -bottom-10 right-0">"</div>
            </div>
            <div className="mt-6 flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-300 to-purple-300 flex items-center justify-center text-white mr-3">
                ES
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Emma S.</p>
                <p className="text-sm text-gray-500">University of Berlin 🇩🇪</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Activity Feed */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Live Activity</h2>
            <p className="text-xl text-gray-600">See what's happening in the ErasMatch community right now</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-gray-50 to-transparent z-10"></div>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {activities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className={`flex items-center gap-4 p-4 border-b border-gray-100 ${index === 0 ? 'animate-pulse-soft bg-blue-50' : ''}`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${index === 0 ? 'bg-blue-500' : 'bg-purple-500'}`}>
                      {index === 0 ? <Sparkles className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{activity.text}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How ErasMatch Works</h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              We support you throughout your entire Erasmus journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-8 rounded-xl text-center transform transition duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-6">
                <UserCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Match</h3>
              <p className="text-gray-600">
                See who's going to the same place and connect before you even arrive
              </p>
            </div>

            <div className="bg-purple-50 p-8 rounded-xl text-center transform transition duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600 mb-6">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Message</h3>
              <p className="text-gray-600">
                Start chats, break the ice, and plan your first meetups together
              </p>
            </div>

            <div className="bg-pink-50 p-8 rounded-xl text-center transform transition duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-pink-600 mb-6">
                <UserPlus className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Join Groups</h3>
              <p className="text-gray-600">
                Stay connected with other Erasmus students in your city and university
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Student Stories</h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Hear from students who found their community through ErasMatch
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
                      "I was nervous about going to Lisbon alone — now I already have friends there. We made a group chat and planned our first week together before any of us arrived."
                    </p>
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 flex items-center justify-center text-blue-600 font-semibold">
                        MG
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">Maria González 🇵🇹</p>
                        <p className="text-sm text-gray-500">Universidade de Lisboa</p>
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
                      "I connected with other students from my home university who were going to the same destination. We planned our journey together and now we're inseparable!"
                    </p>
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-200 to-teal-200 flex items-center justify-center text-green-600 font-semibold">
                        TM
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">Thomas Müller 🇩🇪</p>
                        <p className="text-sm text-gray-500">Technical University of Munich</p>
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
                      "The platform was super helpful! I chatted with several students who gave me useful tips about accommodation and courses. ErasMatch made Amsterdam feel like home from day one."
                    </p>
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 flex items-center justify-center text-purple-600 font-semibold">
                        SD
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">Sophie Dubois 🇳🇱</p>
                        <p className="text-sm text-gray-500">University of Amsterdam</p>
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

      {/* Discover Cities */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Discover by City</h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Find students and join chats in popular Erasmus destinations
            </p>
          </div>

          <div className="mt-12">
            <Carousel className="max-w-6xl mx-auto">
              <CarouselContent>
                {[
                  { name: "Barcelona", flag: "🇪🇸", users: 432, image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=1170&auto=format&fit=crop" },
                  { name: "Lisbon", flag: "🇵🇹", users: 315, image: "https://images.unsplash.com/photo-1562614460-e55cab877833?q=80&w=1074&auto=format&fit=crop" },
                  { name: "Berlin", flag: "🇩🇪", users: 289, image: "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?q=80&w=1170&auto=format&fit=crop" },
                  { name: "Paris", flag: "🇫🇷", users: 267, image: "https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?q=80&w=1064&auto=format&fit=crop" },
                  { name: "Rome", flag: "🇮🇹", users: 254, image: "https://images.unsplash.com/photo-1615724596420-37b0b9d013a9?q=80&w=1074&auto=format&fit=crop" },
                  { name: "Amsterdam", flag: "🇳🇱", users: 223, image: "https://images.unsplash.com/photo-1459679749680-18eb1eb37418?q=80&w=1170&auto=format&fit=crop" },
                ].map(city => (
                  <CarouselItem key={city.name} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <div className="relative group overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={city.image} 
                            alt={city.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-xl font-bold flex items-center">
                                {city.name} <span className="ml-1">{city.flag}</span>
                              </h3>
                              <div className="flex items-center text-sm mt-1">
                                <Users className="h-4 w-4 mr-1 text-blue-300" />
                                <span>{city.users} students</span>
                              </div>
                            </div>
                            <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
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
                See All Cities <ArrowRight className="ml-2 h-4 w-4" />
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
                Ready to find your Erasmus community?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                ErasMatch is a safe space to meet, plan, and connect with real students before and during Erasmus.
                It's free, private, and built for you.
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
      
      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Helping Erasmus students feel at home, wherever they're going.
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
