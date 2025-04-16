
import { useState, useEffect } from "react";
import { Profile } from "@/types";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { GroupChatsList } from "@/components/messages/GroupChatsList";
import { CityList } from "@/components/messages/CityList";
import { GroupChatPanel } from "@/components/messages/GroupChatPanel";
import { CityPanel } from "@/components/messages/CityPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const slugify = (text: string = "") =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

type Group = {
  id: string;
  name: string;
  slug: string;
  type: "city" | "university" | "custom";
  visibility: string | null;
  description: string | null;
  creator_id: string | null;
  created_at: string | null;
  member_count?: number;
};

const Groups = () => {
  const { profiles } = useData();
  const { currentUserId } = useAuth();
  const isMobile = useIsMobile();
  
  // New state for storing the latest profile data
  const [profile, setProfile] = useState<Profile | null>(null);
  const [groupChats, setGroupChats] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGroupChat, setSelectedGroupChat] = useState<string | null>(null);
  const [selectedCityChat, setSelectedCityChat] = useState<string | null>(null);

  // Fetch the latest profile directly from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUserId) return;
      
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUserId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Could not load your profile");
        setIsLoading(false);
        return;
      }

      // Cast the data to Profile type, ensuring country field exists
      setProfile({
        ...data,
        country: data.country || null, // Ensure country exists even if null
      } as Profile);
      
      console.log("📝 Fresh profile loaded:", data);
    };

    fetchProfile();
  }, [currentUserId]);

  // Use the fresh profile data to fetch relevant groups
  useEffect(() => {
    if (!profile) return;

    const fetchGroups = async () => {
      try {
        // Generate slugs from the fresh profile data
        const universitySlug = profile.university 
          ? slugify(profile.university) 
          : null;
          
        const citySlug = profile.city 
          ? slugify(profile.city) 
          : null;

        // Create an array of slugs to search for, filtering out nulls
        const slugsToSearch = [universitySlug, citySlug].filter(Boolean);
        
        if (slugsToSearch.length === 0) {
          setGroupChats([]);
          setIsLoading(false);
          return;
        }

        console.log("🏫 University:", profile.university);
        console.log("🏙️ City:", profile.city);
        console.log("🔍 Slugs to search:", slugsToSearch);
        
        // Fetch groups matching the slugs
        const { data: groups, error } = await supabase
          .from("groups")
          .select("*")
          .in("slug", slugsToSearch);

        if (error) {
          console.error("Error fetching groups:", error);
          toast.error("Failed to load your groups");
          return;
        }

        if (groups) {
          // Type assertion to ensure proper typing
          const typedGroups = groups.map(group => ({
            ...group,
            type: group.type as "city" | "university" | "custom"
          }));
          
          console.log("🎯 Fetched groups:", typedGroups);
          setGroupChats(typedGroups);

          // Auto-join if not already in
          for (const group of groups) {
            const { data: existing } = await supabase
              .from("group_members")
              .select("id")
              .eq("group_id", group.id)
              .eq("user_id", currentUserId)
              .maybeSingle();

            if (!existing) {
              await supabase.from("group_members").insert({
                group_id: group.id,
                user_id: currentUserId,
              });
              
              // Notify user they've been added
              toast.success(`Joined the ${group.name} group chat!`);
            }
          }
        }
      } catch (err) {
        console.error("Error in group fetching process:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [profile, currentUserId]);

  const handleSelectGroupChat = (universityName: string) => {
    console.log("Selecting group chat:", universityName);
    setSelectedGroupChat(universityName || null);
    setSelectedCityChat(null);
  };

  const handleSelectCityChat = (cityName: string) => {
    console.log("Selecting city chat:", cityName);
    setSelectedCityChat(cityName || null);
    setSelectedGroupChat(null);
  };

  const handleBack = () => {
    setSelectedGroupChat(null);
    setSelectedCityChat(null);
  };

  // Show full-screen chat view when a chat is selected
  if (selectedGroupChat || selectedCityChat) {
    return (
      <div className="max-w-7xl mx-auto h-[calc(100vh-128px)] py-4 px-2 sm:px-4 flex flex-col">
        <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
          {selectedGroupChat ? (
            <GroupChatPanel 
              universityName={selectedGroupChat}
              currentUserId={currentUserId!}
              profiles={profiles}
              onBack={handleBack}
              isFullScreen={true}
            />
          ) : selectedCityChat ? (
            <CityPanel
              cityName={selectedCityChat}
              currentUserId={currentUserId!}
              profiles={profiles}
              onBack={handleBack}
              isFullScreen={true}
            />
          ) : null}
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">Your Group Chats</h1>
        <div className="space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="rounded-3xl overflow-hidden animate-pulse bg-gray-200 h-48" />
          ))}
        </div>
      </div>
    );
  }

  // Cards view for listing available groups
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-8">Join Group Chats</h1>
      
      <div className="space-y-6">
        {groupChats.length > 0 ? (
          groupChats.map(group => (
            <Card 
              key={group.id}
              className="rounded-3xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                if (group.type === "university") {
                  handleSelectGroupChat(group.name);
                } else if (group.type === "city") {
                  handleSelectCityChat(group.name);
                }
              }}
            >
              <div className={`p-8 relative text-white ${
                group.type === "university"
                  ? "bg-gradient-to-r from-purple-700 to-indigo-500"
                  : "bg-gradient-to-r from-blue-600 to-blue-400"
              }`}>
                <div className="absolute top-4 right-4 bg-white/20 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  {profiles.filter(p => 
                    group.type === "university" 
                      ? p.university === group.name 
                      : p.city === group.name
                  ).length} students
                </div>
                {group.type === "university" ? (
                  <GraduationCap className="w-16 h-16 mb-4 opacity-70 absolute right-8 top-8" />
                ) : (
                  <MapPin className="w-16 h-16 mb-4 opacity-70 absolute right-8 top-8" />
                )}
                <h2 className="text-5xl font-bold mb-2">
                  {group.type === "university" ? "Your University" : "Your City"}
                </h2>
                <p className="text-2xl opacity-90 mb-4">
                  {group.type === "university" 
                    ? `Chat with students at\n${group.name}`
                    : `Group chat for\n${group.name}`
                  }
                </p>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-lg text-gray-600">
              {profile
                ? "No group chats found for your university or city."
                : "Set your university and city in your profile to join group chats."}
            </p>
            <Button 
              className="mt-4"
              onClick={() => window.location.href = "/profile"}
            >
              {profile ? "Update Profile" : "Complete Your Profile"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
