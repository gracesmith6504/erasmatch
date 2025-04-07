
import { Profile as ProfileType } from "@/types";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileProvider } from "@/components/profile/ProfileContext";

type ProfileProps = {
  profile: ProfileType | null;
  onProfileUpdate: (profile: Partial<ProfileType>) => void;
};

const Profile = ({ profile, onProfileUpdate }: ProfileProps) => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {profile?.name ? "Edit Your Profile" : "Complete Your Profile"}
        </h1>
        
        <ProfileProvider profile={profile} onProfileUpdate={onProfileUpdate}>
          <ProfileForm />
        </ProfileProvider>
      </div>
    </div>
  );
};

export default Profile;
