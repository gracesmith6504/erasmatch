
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowLeft, MoreVertical, Ban } from "lucide-react";
import { ProfileHeader } from "@/components/profile/view/ProfileHeader";
import { ProfileDetails } from "@/components/profile/view/ProfileDetails";
import { MessageDialog } from "@/components/profile/view/MessageDialog";
import { NotFoundView } from "@/components/profile/view/NotFoundView";
import { useProfileView } from "@/hooks/useProfileView";
import { recordProfileView } from "@/hooks/useProfileViewers";
import { useBlockedUsers } from "@/hooks/useBlockedUsers";
import { BlockUserDialog } from "@/components/block/BlockUserDialog";
import { useProfiles } from "@/hooks/useProfiles";
import { useSendMessage } from "@/hooks/useSendMessage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

type ProfileViewProps = {
  currentUserId: string | null;
};

const ProfileView = ({ currentUserId }: ProfileViewProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: profiles = [] } = useProfiles();
  const sendMessage = useSendMessage();
  const profile = profiles.find((p) => p.id === id);
  const { blockUser, isBlocked } = useBlockedUsers();
  const [isBlockedByOther, setIsBlockedByOther] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  
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
  } = useProfileView(profile, currentUserId, sendMessage);

  // Check if the other user has blocked us (bidirectional)
  useEffect(() => {
    if (currentUserId && id && currentUserId !== id) {
      supabase.rpc("is_blocked", { user_a: currentUserId, user_b: id })
        .then(({ data }) => setIsBlockedByOther(!!data));
    }
  }, [currentUserId, id]);

  // Record profile view
  useEffect(() => {
    if (currentUserId && profile?.id && currentUserId !== profile.id) {
      recordProfileView(profile.id);
    }
  }, [currentUserId, profile?.id]);

  const handleBackToStudents = () => {
    navigate('/students', { state: { fromProfile: true }});
  };

  const handleBlock = () => {
    if (id) blockUser(id);
  };

  const handleBlockAndReport = (reason: string) => {
    if (id) blockUser(id, reason, true);
  };

  if (!profile) {
    return <NotFoundView />;
  }

  // If either user has blocked the other, show unavailable
  if (isBlockedByOther || (id && isBlocked(id))) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
        <div className="mb-4">
          <Button variant="outline" size="sm" onClick={handleBackToStudents} className="flex items-center text-muted-foreground">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Students
          </Button>
        </div>
        <div className="bg-card shadow rounded-lg p-12 text-center">
          <Ban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Profile not available</h2>
          <p className="text-muted-foreground">This profile is no longer accessible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleBackToStudents}
          className="flex items-center text-muted-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Students
        </Button>
      </div>
      
      <div className="bg-card shadow rounded-lg overflow-hidden">
        <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
        
        <div className="px-4 sm:px-6 pb-5">
          {!isOwnProfile && currentUserId && (
            <div className="mt-5 sm:mt-0 flex justify-end gap-2">
              <Button 
                onClick={() => setIsMessageDialogOpen(true)}
                className="flex items-center"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setShowBlockDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Block User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

      <BlockUserDialog
        isOpen={showBlockDialog}
        onOpenChange={setShowBlockDialog}
        userName={profile.name || "this user"}
        onBlock={handleBlock}
        onBlockAndReport={handleBlockAndReport}
      />
    </div>
  );
};

export default ProfileView;
