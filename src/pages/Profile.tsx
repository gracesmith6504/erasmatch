
import { Profile as ProfileType } from "@/types";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileProvider } from "@/components/profile/ProfileContext";
import ProfileCompletionMeter from "@/components/profile/ProfileCompletionMeter";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

const Profile = () => {
  const { currentUserProfile, handleProfileUpdate } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Once we have the profile data, stop loading
    if (currentUserProfile !== undefined) {
      setLoading(false);
    }
  }, [currentUserProfile]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold gradient-text flex items-center">
          {currentUserProfile?.name ? `${currentUserProfile.name}'s Profile` : "Complete Your Profile"}
          <Sparkles className="ml-2 h-5 w-5 text-erasmatch-purple animate-pulse-soft" />
        </h1>
        <p className="text-gray-600 mt-2">
          {currentUserProfile?.name 
            ? "Keep your profile up-to-date to connect with other exchange students" 
            : "Tell us about yourself to get matched with other exchange students"}
        </p>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-80 w-full rounded-lg" />
        </div>
      ) : (
        <>
          <ProfileCompletionMeter profile={currentUserProfile} />
          
          <div className="bg-white shadow rounded-lg p-6 animate-fade-in">
            <ProfileProvider 
              profile={currentUserProfile} 
              onProfileUpdate={handleProfileUpdate}
            >
              <ProfileForm />
            </ProfileProvider>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
