
import { useState, useEffect, useMemo } from "react";
import { MessagesContainer } from "@/components/messages/MessagesContainer";
import { useSearchParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMessagePartners } from "@/hooks/useMessagePartners";
import { useDirectMessages } from "@/hooks/useDirectMessages";
import { useSendMessage } from "@/hooks/useSendMessage";

type MessagesProps = {
  currentUserId: string;
};

const Messages = ({ currentUserId }: MessagesProps) => {
  const [searchParams] = useSearchParams();
  const [initialSelectedUser, setInitialSelectedUser] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const { data: messages = [] } = useDirectMessages(currentUserId);

  // Fetch only the profiles of message partners (+ any ?user= param) — not all 2,000
  const { data: profiles = [] } = useMessagePartners(
    messages,
    currentUserId,
    searchParams.get("user")
  );

  const sendMessage = useSendMessage();

  // Check for a user param in the URL (e.g., from StudentCard navigation)
  useEffect(() => {
    const userParam = searchParams.get('user');

    if (userParam) {
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

  // Build a Map<id, Profile> for O(1) lookups instead of O(n) .find() calls
  const profileMap = useMemo(() => {
    const map = new Map<string, typeof profiles[number]>();
    for (const p of profiles) map.set(p.id, p);
    return map;
  }, [profiles]);

  // Filter out messages with deleted users — O(n) with Map instead of O(n×m)
  const activeMessages = useMemo(() =>
    messages.filter(message => {
      const sender = profileMap.get(message.sender_id);
      const receiver = profileMap.get(message.receiver_id);
      return !(sender?.deleted_at || receiver?.deleted_at);
    }),
    [messages, profileMap]
  );

  // Filter active profiles (not deleted)
  const activeProfiles = useMemo(
    () => profiles.filter(profile => !profile.deleted_at),
    [profiles]
  );

  return (
    <div className="h-full min-h-0 overflow-hidden w-full inset-0 pb-0 flex flex-col">
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
