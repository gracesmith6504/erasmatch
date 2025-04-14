
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useNavigate } from "react-router-dom";
import { GraduationCap, MapPin } from "lucide-react";

const Groups = () => {
  const { currentUserId } = useAuth();
  const { profiles } = useData();
  const navigate = useNavigate();

  // Get current user profile
  const currentUserProfile = profiles.find(p => p.id === currentUserId);
  const userUniversity = currentUserProfile?.university || "your university";
  const userCity = currentUserProfile?.city || "your city";

  const handleNavigateToUniversityChat = () => {
    if (!currentUserProfile?.university) {
      return;
    }
    navigate(`/group-chat/university/${encodeURIComponent(currentUserProfile.university)}`);
  };

  const handleNavigateToCityChat = () => {
    if (!currentUserProfile?.city) {
      return;
    }
    navigate(`/group-chat/city/${encodeURIComponent(currentUserProfile.city)}`);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Join Group Chats</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* University Card */}
        <div 
          onClick={handleNavigateToUniversityChat}
          className="flex-1 rounded-3xl overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-8 relative cursor-pointer shadow-lg transform transition-transform hover:scale-[1.02] hover:shadow-xl"
        >
          <div className="absolute top-6 right-6 opacity-30">
            <GraduationCap size={80} />
          </div>
          <div className="mt-8">
            <h2 className="text-5xl font-bold mb-2">Your University</h2>
            <p className="text-2xl opacity-90 mb-4">
              Chat with students at {userUniversity}
            </p>
          </div>
        </div>
        
        {/* City Card */}
        <div 
          onClick={handleNavigateToCityChat}
          className="flex-1 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-400 text-white p-8 relative cursor-pointer shadow-lg transform transition-transform hover:scale-[1.02] hover:shadow-xl"
        >
          <div className="absolute top-6 right-6 opacity-30">
            <MapPin size={80} />
          </div>
          <div className="mt-8">
            <h2 className="text-5xl font-bold mb-2">Your City</h2>
            <p className="text-2xl opacity-90 mb-4">
              Group chat for {userCity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;
