
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Groups = () => {
  const { currentUserId } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUserId) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUserId)
          .single();

        if (error) throw error;
        setProfile(data as Profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUserId]);

  const handleNavigateToUniversityChat = () => {
    if (!profile?.university) {
      toast.error("Please set your university in your profile first", {
        description: "Go to your profile to update your university",
        action: {
          label: "Go to Profile",
          onClick: () => navigate("/profile"),
        },
      });
      return;
    }
    navigate(`/groups/university/${encodeURIComponent(profile.university)}`);
  };

  const handleNavigateToCityChat = () => {
    if (!profile?.city) {
      toast.error("Please set your city in your profile first", {
        description: "Go to your profile to update your city",
        action: {
          label: "Go to Profile",
          onClick: () => navigate("/profile"),
        },
      });
      return;
    }
    navigate(`/groups/city/${encodeURIComponent(profile.city)}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Join Group Chats</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Join Group Chats</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* University Card */}
        <div 
          onClick={handleNavigateToUniversityChat}
          className="relative overflow-hidden rounded-3xl shadow-lg cursor-pointer transition-transform hover:scale-[1.02] group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-700 opacity-90" />
          <div className="absolute top-4 right-4">
            <GraduationCap className="h-16 w-16 text-white/50" />
          </div>
          <div className="absolute top-5 right-5 bg-white/20 rounded-full px-3 py-1">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-white" />
              <span className="text-sm font-medium text-white">
                {profile?.university ? "Join" : "Set university"}
              </span>
            </div>
          </div>
          <div className="relative p-10 h-64 flex flex-col justify-end">
            <h2 className="text-4xl font-bold text-white mb-2">Your University</h2>
            <p className="text-xl text-white/90 mb-1">
              {profile?.university 
                ? `Chat with students at ${profile.university}` 
                : "Set your university to join the chat"}
            </p>
            <p className="text-sm text-white/70">
              Everyone heading to the same Erasmus university
            </p>
          </div>
        </div>
        
        {/* City Card */}
        <div 
          onClick={handleNavigateToCityChat}
          className="relative overflow-hidden rounded-3xl shadow-lg cursor-pointer transition-transform hover:scale-[1.02] group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 opacity-90" />
          <div className="absolute top-4 right-4">
            <MapPin className="h-16 w-16 text-white/50" />
          </div>
          <div className="absolute top-5 right-5 bg-white/20 rounded-full px-3 py-1">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-white" />
              <span className="text-sm font-medium text-white">
                {profile?.city ? "Join" : "Set city"}
              </span>
            </div>
          </div>
          <div className="relative p-10 h-64 flex flex-col justify-end">
            <h2 className="text-4xl font-bold text-white mb-2">Your City</h2>
            <p className="text-xl text-white/90 mb-1">
              {profile?.city 
                ? `Group chat for ${profile.city}` 
                : "Set your city to join the chat"}
            </p>
            <p className="text-sm text-white/70">
              Meet others headed to {profile?.city || "your city"} this semester
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;
