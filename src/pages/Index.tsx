
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Globe, School } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-erasmatch-blue to-erasmatch-green py-16 sm:py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Connect with fellow Erasmus students
            </h1>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto opacity-90 mb-8">
              Find students going to the same university or city. Make friends before you even arrive!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="bg-white text-erasmatch-blue hover:bg-gray-100">
                  Join Now
                </Button>
              </Link>
              <Link to="/students">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Browse Students
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why ErasMatch?</h2>
            <p className="mt-4 text-xl text-gray-600">
              The easiest way to connect with other Erasmus students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-erasmatch-blue/10 text-erasmatch-blue mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Find Students</h3>
              <p className="mt-2 text-gray-600">
                Connect with students going to the same university or city as you
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-erasmatch-green/10 text-erasmatch-green mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Chat</h3>
              <p className="mt-2 text-gray-600">
                Message other students directly through our simple chat system
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-erasmatch-blue/10 text-erasmatch-blue mb-4">
                <School className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Share Experiences</h3>
              <p className="mt-2 text-gray-600">
                Learn from others who have been to your destination university
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-erasmatch-green/10 text-erasmatch-green mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Build Community</h3>
              <p className="mt-2 text-gray-600">
                Start building your international network before you even arrive
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-erasmatch-blue rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 lg:px-16">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-white">
                  Ready to connect with other Erasmus students?
                </h2>
                <p className="mt-4 text-lg leading-6 text-blue-100">
                  Join our growing community of international students today.
                </p>
                <div className="mt-8 flex justify-center">
                  <Link to="/auth?mode=signup">
                    <Button size="lg" className="bg-white text-erasmatch-blue hover:bg-gray-100">
                      Create Your Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Students Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 italic mb-4">
                "I found my roommates before even arriving in Barcelona! ErasMatch made my transition to Erasmus life so much easier."
              </p>
              <p className="font-medium text-gray-900">Maria, Universidad de Barcelona</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 italic mb-4">
                "Through ErasMatch I connected with other students from my home university who were going to the same destination. We planned our journey together!"
              </p>
              <p className="font-medium text-gray-900">Thomas, Technical University of Munich</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 italic mb-4">
                "The platform was super simple to use. I chatted with several students who gave me useful tips about accommodation and courses."
              </p>
              <p className="font-medium text-gray-900">Sophie, University of Amsterdam</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
