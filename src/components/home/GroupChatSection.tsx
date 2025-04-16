
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface GroupChatSectionProps {
  handleFindStudents: () => void;
}

export const GroupChatSection = ({ handleFindStudents }: GroupChatSectionProps) => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">You're Not Arriving Alone</h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            You're not arriving alone. Join your uni group chat the moment you sign up — and feel connected from day one.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-bold">
                  L
                </div>
                <h3 className="ml-3 font-bold text-lg">Lisbon Group Chat</h3>
              </div>
              <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                12 online
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Blurred chat messages */}
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex-shrink-0"></div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <div className="h-2 bg-gray-200 rounded w-40"></div>
                  <div className="h-2 bg-gray-200 rounded w-24 mt-2"></div>
                </div>
              </div>
              
              <div className="flex gap-3 justify-end">
                <div className="bg-blue-50 rounded-lg p-3 max-w-[80%]">
                  <div className="h-2 bg-blue-100 rounded w-32"></div>
                  <div className="h-2 bg-blue-100 rounded w-40 mt-2"></div>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex-shrink-0"></div>
              </div>
              
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex-shrink-0"></div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <div className="h-2 bg-gray-200 rounded w-36"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center">
              <div className="flex -space-x-2">
                <div className="h-7 w-7 rounded-full bg-blue-500 border-2 border-white"></div>
                <div className="h-7 w-7 rounded-full bg-green-500 border-2 border-white"></div>
                <div className="h-7 w-7 rounded-full bg-purple-500 border-2 border-white"></div>
                <div className="h-7 w-7 rounded-full bg-yellow-500 border-2 border-white flex items-center justify-center text-xs text-white font-bold">+8</div>
              </div>
              <div className="ml-3 text-xs text-gray-500">💬 Currently active</div>
            </div>
          </div>
          
          <div className="text-center md:text-left md:max-w-md">
            <h3 className="font-bold text-2xl text-gray-900 mb-4">Join your university group chat</h3>
            <p className="text-gray-600 mb-6">
              Connect with other Erasmus students headed to your destination. Share tips, ask questions, and make friends before you even arrive.
            </p>
            <div className="flex justify-center md:justify-start">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                onClick={handleFindStudents}
              >
                Find Students Near You <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
