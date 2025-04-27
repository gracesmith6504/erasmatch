
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Profile } from "@/types";
import { ProfileHeader } from "@/components/profile/view/ProfileHeader";
import { ProfileDetails } from "@/components/profile/view/ProfileDetails";
import { MessageDialog } from "@/components/profile/view/MessageDialog";
import { NotFoundView } from "@/components/profile/view/NotFoundView";
import { useProfileView } from "@/hooks/useProfileView";

type ProfileViewProps = {
  profiles: Profile[];
  currentUserId: string | null;
  onSendMessage: (receiverId: string, content: string) => void;
};

const ProfileView = ({ profiles, currentUserId, onSendMessage }: ProfileViewProps) => {
  const { id } = useParams<{ id: string }>();
  const profile = profiles.find((p) => p.id === id);
  
  const {
    universityCity,
    isLoadingCity,
    isMessageDialogOpen,
    setIsMessageDialogOpen,
    messageContent,
    setMessageContent,
    isSending,
    handleSendMessage,
    isOwnProfile
  } = useProfileView(profile, currentUserId, onSendMessage);

  if (!profile) {
    return <NotFoundView />;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
        
        <div className="px-4 sm:px-6 pb-5">
          {!isOwnProfile && currentUserId && (
            <div className="mt-5 sm:mt-0 flex justify-end">
              <Button 
                onClick={() => setIsMessageDialogOpen(true)}
                className="w-full sm:w-auto flex items-center"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </div>
          )}
          
          <ProfileDetails 
            profile={profile} 
            universityCity={universityCity} 
            isLoadingCity={isLoadingCity} 
          />
        </div>
      </div>

      <MessageDialog
        isOpen={isMessageDialogOpen}
        onOpenChange={setIsMessageDialogOpen}
        onSendMessage={handleSendMessage}
        messageContent={messageContent}
        setMessageContent={setMessageContent}
        isSending={isSending}
        recipientName={profile.name || ""}
      />
    </div>
  );
};

export default ProfileView;
