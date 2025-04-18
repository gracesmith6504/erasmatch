import { useEffect, useState } from "react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileProvider } from "@/components/profile/ProfileContext";
import ProfileCompletionMeter from "@/components/profile/ProfileCompletionMeter";
import { Sparkles, Share2 } from "lucide-react";
import { Profile as ProfileType } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShareButton } from "@/components/share/ShareButton";
import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog";

const Profile = () => {
  const { currentUserId } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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
      
      if (data) {
        setProfile(data as ProfileType);
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

  const handleProfileUpdate = async (updatedProfile: Partial<ProfileType>) => {
    if (!currentUserId || !profile) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', currentUserId);
      
      if (error) throw error;
      
      setProfile({ ...profile, ...updatedProfile });
      
      fetchProfile();
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating profile:', error);
      return Promise.reject(error);
    }
  };

  const handleCopyInviteLink = () => {
    if (!profile?.ref_code) return;
    
    const inviteLink = `https://erasmatch.com/u/${profile.ref_code}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Invite link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 overflow-x-hidden">
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
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 overflow-x-hidden">
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
      
      {profile && profile.ref_code && (
        <Card className="mb-6 border-blue-100 bg-blue-50">
          <CardContent className="pt-5">
            <div className="flex flex-col space-y-4">
              <div className="text-center">
                <h3 className="text-sm font-medium text-blue-800">Share your profile!</h3>
                <p className="text-xs text-blue-600 mt-1 truncate">
                  https://erasmatch.com/u/{profile.ref_code}
                </p>
              </div>
              <div className="flex justify-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white hover:bg-blue-50 text-blue-700 border-blue-200"
                  onClick={handleCopyInviteLink}
                >
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
                <ShareButton 
                  link={`https://erasmatch.com/u/${profile.ref_code}`}
                  city={profile.city || undefined}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <ProfileCompletionMeter profile={profile} />
      
      <div className="bg-white shadow rounded-lg p-6 animate-fade-in overflow-hidden">
        <ProfileProvider profile={profile} onProfileUpdate={handleProfileUpdate} fetchProfile={fetchProfile}>
          <ProfileForm />
        </ProfileProvider>
      </div>
      
      <div className="mt-8 text-center">
        <DeleteAccountDialog userId={currentUserId} />
      </div>
    </div>
  );
};

export default Profile;
