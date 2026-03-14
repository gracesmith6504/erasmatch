import { ProfileProvider } from "@/components/profile/context/ProfileProvider";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog";
import { DataExportDialog } from "@/components/profile/DataExportDialog";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { currentUserId, currentUserProfile, handleProfileUpdate } = useAuth();

  const fetchProfile = async () => {};

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-2xl shadow-card border border-border p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-center mb-8 text-foreground">
            Your Profile
          </h1>
          
          <ProfileProvider 
            profile={currentUserProfile}
            onProfileUpdate={handleProfileUpdate}
            fetchProfile={fetchProfile}
          >
            <ProfileForm />
          </ProfileProvider>

          {/* GDPR Compliance Section */}
          <div className="mt-8 pt-8 border-t border-border">
            <h2 className="text-lg font-display font-semibold text-foreground mb-4">Data & Privacy</h2>
            <div className="space-y-3">
              <DataExportDialog userId={currentUserId} />
              <DeleteAccountDialog userId={currentUserId} />
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Your data is protected under GDPR. You can export your data or delete your account at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;