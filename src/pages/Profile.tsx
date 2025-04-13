
import { Profile as ProfileType } from "@/types";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileProvider } from "@/components/profile/ProfileContext";
import ProfileCompletionMeter from "@/components/profile/ProfileCompletionMeter";
import { Sparkles } from "lucide-react";

type ProfileProps = {
  profile: ProfileType | null;
  onProfileUpdate: (profile: Partial<ProfileType>) => void;
};

const Profile = ({ profile, onProfileUpdate }: ProfileProps) => {
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
        <ProfileProvider profile={profile} onProfileUpdate={onProfileUpdate}>
          <ProfileForm />
        </ProfileProvider>
      </div>
    </div>
  );
};

export default Profile;
