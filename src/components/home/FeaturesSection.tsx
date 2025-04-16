
import { UserCheck, MessageSquare, Calendar, Globe } from "lucide-react";

export const FeaturesSection = () => {
  return (
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
  );
};
