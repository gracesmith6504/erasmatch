
import { Profile as ProfileType } from "@/types";
import { useProfileForm } from "@/components/profile/useProfileForm";
import { ProfileForm } from "@/components/profile/ProfileForm";

type ProfileProps = {
  profile: ProfileType | null;
  onProfileUpdate: (profile: Partial<ProfileType>) => void;
};

const Profile = ({ profile, onProfileUpdate }: ProfileProps) => {
  const {
    form,
    loading,
    handleChange,
    handleSelectChange,
    handleUniversityChange,
    handleSubmit
  } = useProfileForm(profile, onProfileUpdate);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {profile?.name ? "Edit Your Profile" : "Complete Your Profile"}
        </h1>
        
        <ProfileForm
          form={form}
          loading={loading}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          handleUniversityChange={handleUniversityChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Profile;
