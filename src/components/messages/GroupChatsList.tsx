
import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { GroupChat, Profile, GroupMessage } from "@/types";
import { useUniversityResolver } from "@/hooks/useUniversityResolver";

type GroupChatsListProps = {
  profiles: Profile[];
  currentUserProfile: Profile | null;
  onSelectGroupChat: (universityName: string) => void;
  selectedGroupChat: string | null;
};

export const GroupChatsList = ({
  profiles,
  currentUserProfile,
  onSelectGroupChat,
  selectedGroupChat,
}: GroupChatsListProps) => {
  const [availableGroups, setAvailableGroups] = useState<GroupChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { resolver, ready: resolverReady } = useUniversityResolver();

  useEffect(() => {
    const fetchGroups = async () => {
      if (!currentUserProfile?.university || !resolverReady) {
        if (resolverReady) setIsLoading(false);
        return;
      }

      // Resolve the current user's university string to its canonical name so
      // membership and message lookups still work if they stored an alias/typo.
      const canonical = resolver.resolveToCanonical(currentUserProfile.university);
      const allNames = resolver.getAllNamesFor(canonical);

      try {
        // Members = anyone whose stored university resolves to the same canonical.
        const universityStudents = profiles.filter(
          (profile) => resolver.resolveToCanonical(profile.university || "") === canonical
        );

        // Pull the latest message across every known alias of this canonical name.
        const { data: latestMessages, error } = await supabase
          .from("group_messages")
          .select("*")
          .in("university_name", allNames)
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) throw error;

        const latestMessage = latestMessages?.[0] as GroupMessage | undefined;

        const groupChat: GroupChat = {
          university_name: canonical,
          participants_count: universityStudents.length,
          last_message: latestMessage
            ? {
                content: latestMessage.content,
                created_at: latestMessage.created_at,
                sender_name: profiles.find(p => p.id === latestMessage.sender_id)?.name || 'Unknown user'
              }
            : null
        };

        setAvailableGroups([groupChat]);
      } catch (error) {
        console.error("Error fetching group chats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [currentUserProfile, profiles, resolver, resolverReady]);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-16 bg-gray-100 rounded-lg mb-2"></div>
        </div>
      </div>
    );
  }

  if (!currentUserProfile?.university) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <p className="text-sm text-gray-500">
          Select your destination university to join your group chat.
        </p>
      </div>
    );
  }

  if (availableGroups.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <p className="text-sm text-gray-500">No group chats available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium px-4">📚 University Group Chats</h3>
      {availableGroups.map((group) => (
        <button
          key={group.university_name}
          className={`w-full bg-white rounded-lg p-4 shadow-sm mb-3 text-left hover:bg-gray-50 ${
            selectedGroupChat === group.university_name ? "ring-2 ring-erasmatch-blue" : ""
          }`}
          onClick={() => onSelectGroupChat(group.university_name)}
        >
          <div className="flex flex-col">
            <div className="font-medium">🎓 {group.university_name} Chat</div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Users className="h-3 w-3 mr-1" />
              <span>{group.participants_count} members</span>
            </div>
            {group.last_message && (
              <div className="mt-1">
                <div className="text-sm text-gray-600 truncate">
                  <span className="font-medium">{group.last_message.sender_name}: </span>
                  {group.last_message.content}
                </div>
                <div className="text-xs text-gray-400">
                  {format(new Date(group.last_message.created_at), "MMM d")}
                </div>
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};
