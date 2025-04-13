
import { useEffect, useState } from "react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileProvider } from "@/components/profile/ProfileContext";
import ProfileCompletionMeter from "@/components/profile/ProfileCompletionMeter";
import { Sparkles } from "lucide-react";
import { Profile as ProfileType } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const { currentUserId } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile data when component mounts or when currentUserId changes
  const fetchProfile = async () => {
    if (!currentUserId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUserId)
        .single();

      if (error) throw error;
      
      // Ensure the data conforms to the Profile type by adding any missing properties
      if (data) {
        const profileData = {
          ...data,
          country: data.country || null, // Add country field with null default if missing
        };
        setProfile(profileData as ProfileType);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [currentUserId]);

  // Function to handle profile updates
  const handleProfileUpdate = async (updatedProfile: Partial<ProfileType>) => {
    if (!currentUserId || !profile) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', currentUserId);
      
      if (error) throw error;
      
      // Update local state with new profile data
      setProfile({ ...profile, ...updatedProfile });
      
      // Refetch the profile to ensure we have the latest data
      fetchProfile();
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating profile:', error);
      return Promise.reject(error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-4 w-full mb-2" />
        <div className="bg-white shadow rounded-lg p-6 animate-fade-in">
          <div className="space-y-6">
            <Skeleton className="h-24 w-24 rounded-full mx-auto" />
            <Skeleton className="h-10 w-3/4 mx-auto" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold gradient-text flex items-center">
          {profile?.name ? `${profile.name}'s Profile` : "Complete Your Profile"}
          <Sparkles className="ml-2 h-5 w-5 text-erasmatch-purple animate-pulse-soft" />
        </h1>
        <p className="text-gray-600 mt-2">
          {profile?.name 
            ? "Keep your profile up-to-date to connect with other exchange students" 
            : "Tell us about yourself to get matched with other exchange students"}
        </p>
      </div>
      
      <ProfileCompletionMeter profile={profile} />
      
      <div className="bg-white shadow rounded-lg p-6 animate-fade-in">
        <ProfileProvider profile={profile} onProfileUpdate={handleProfileUpdate} fetchProfile={fetchProfile}>
          <ProfileForm />
        </ProfileProvider>
      </div>
    </div>
  );
};

export default Profile;
