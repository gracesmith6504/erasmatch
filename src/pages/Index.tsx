
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Globe, School, ArrowRight, MapPin, GraduationCap, Languages } from "lucide-react";

const Index = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section with gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-erasmatch-blue via-erasmatch-purple to-erasmatch-blue py-20 sm:py-32 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-erasmatch-blue/90 via-erasmatch-purple/80 to-erasmatch-blue/90"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Find Your <span className="text-erasmatch-yellow">Erasmus</span> Community
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto opacity-90 mb-10 leading-relaxed">
              Connect with fellow students, explore universities, and make friends before you even arrive at your destination.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="text-lg px-8 py-6 bg-white text-erasmatch-blue hover:bg-gray-100 shadow-xl button-hover">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/universities">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-white text-white bg-transparent hover:bg-white/10 button-hover">
                  Browse Universities
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold gradient-text mb-4">How ErasMatch Helps You</h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Make the most of your Erasmus experience with our platform designed specially for exchange students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100 text-center transition-all hover:-translate-y-1 duration-300">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-erasmatch-blue mb-4">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Students</h3>
              <p className="text-gray-600">
                Connect with students going to the same university or city as you
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100 text-center transition-all hover:-translate-y-1 duration-300">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-green-100 to-teal-100 text-erasmatch-green mb-4">
                <MessageSquare className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chat</h3>
              <p className="text-gray-600">
                Message other students directly through our simple chat system
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100 text-center transition-all hover:-translate-y-1 duration-300">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-erasmatch-purple mb-4">
                <School className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Share Experiences</h3>
              <p className="text-gray-600">
                Learn from others who have been to your destination university
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100 text-center transition-all hover:-translate-y-1 duration-300">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-orange-100 to-yellow-100 text-erasmatch-orange mb-4">
                <Globe className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Build Community</h3>
              <p className="text-gray-600">
                Start building your international network before you even arrive
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold gradient-text mb-4">How It Works</h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Three simple steps to make the most of your exchange experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative bg-white p-8 rounded-xl shadow-soft border border-gray-100 text-center">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-50 to-purple-50 mb-6">
                <GraduationCap className="h-8 w-8 text-erasmatch-blue" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and share details about your home university, destination, and interests
              </p>
            </div>

            <div className="relative bg-white p-8 rounded-xl shadow-soft border border-gray-100 text-center">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-50 to-purple-50 mb-6">
                <MapPin className="h-8 w-8 text-erasmatch-purple" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Discover Connections</h3>
              <p className="text-gray-600">
                Find students and universities that match your destination and interests
              </p>
            </div>

            <div className="relative bg-white p-8 rounded-xl shadow-soft border border-gray-100 text-center">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-50 to-purple-50 mb-6">
                <Languages className="h-8 w-8 text-erasmatch-green" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Connect & Communicate</h3>
              <p className="text-gray-600">
                Message other students and start building your international network
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580846011-d3a5bc25702b')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-erasmatch-blue/90 to-erasmatch-purple/90"></div>
            
            <div className="relative px-6 py-16 sm:px-12 lg:px-16 text-center">
              <h2 className="text-3xl font-extrabold text-white mb-4">
                Ready to connect with other Erasmus students?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                Join our growing community of international students and make the most of your exchange experience.
              </p>
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

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold gradient-text mb-4">What Students Say</h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Hear from students who have used ErasMatch for their exchange experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-soft border border-gray-100 flex flex-col">
              <div className="flex-grow">
                <div className="flex items-center text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">
                  "I found my roommates before even arriving in Barcelona! ErasMatch made my transition to Erasmus life so much easier."
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

            <div className="bg-white p-8 rounded-xl shadow-soft border border-gray-100 flex flex-col">
              <div className="flex-grow">
                <div className="flex items-center text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">
                  "Through ErasMatch I connected with other students from my home university who were going to the same destination. We planned our journey together!"
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

            <div className="bg-white p-8 rounded-xl shadow-soft border border-gray-100 flex flex-col">
              <div className="flex-grow">
                <div className="flex items-center text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">
                  "The platform was super simple to use. I chatted with several students who gave me useful tips about accommodation and courses."
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
