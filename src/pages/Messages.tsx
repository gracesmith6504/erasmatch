
import { useState, useEffect } from "react";
import { MessagesContainer } from "@/components/messages/MessagesContainer";
import { useSearchParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfiles } from "@/hooks/useProfiles";
import { useDirectMessages } from "@/hooks/useDirectMessages";
import { useSendMessage } from "@/hooks/useSendMessage";

type MessagesProps = {
  currentUserId: string;
};

const Messages = ({ currentUserId }: MessagesProps) => {
  const [searchParams] = useSearchParams();
  const [initialSelectedUser, setInitialSelectedUser] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  const { data: profiles = [] } = useProfiles();
  const { data: messages = [] } = useDirectMessages(currentUserId);
  const sendMessage = useSendMessage();

  // Check for a user param in the URL (e.g., from StudentCard navigation)
  useEffect(() => {
    const userParam = searchParams.get('user');
    
    if (userParam) {
      console.log("URL parameter 'user' found:", userParam);
      setInitialSelectedUser(userParam);
    } else {
      setInitialSelectedUser(null);
    }
  }, [searchParams]);

  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Filter out messages with deleted users
  const activeMessages = messages.filter(message => {
    const senderProfile = profiles.find(p => p.id === message.sender_id);
    const receiverProfile = profiles.find(p => p.id === message.receiver_id);
    return !(senderProfile?.deleted_at || receiverProfile?.deleted_at);
  });

  // Filter active profiles (not deleted)
  const activeProfiles = profiles.filter(profile => !profile.deleted_at);

  return (
    <div className="h-full overflow-hidden w-full inset-0 pt-16 pb-0 flex flex-col">
      <MessagesContainer
        messages={activeMessages}
        profiles={activeProfiles}
        currentUserId={currentUserId}
        onSendMessage={sendMessage}
        initialSelectedUser={initialSelectedUser}
      />
    </div>
  );
};

export default Messages;
