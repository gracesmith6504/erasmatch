
import { UserCheck, Users, MessageCircle } from "lucide-react";

export const HowItWorksSection = () => {
  return (
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
  );
};
