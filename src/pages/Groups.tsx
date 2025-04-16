import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { GroupChatPanel } from "@/components/messages/GroupChatPanel";
import { CityPanel } from "@/components/messages/CityPanel";

const slugify = (text: string = "") =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

type Group = {
  id: string;
  name: string;
  slug: string;
  type: "city" | "university" | "custom";
};

const Groups = () => {
  const { currentUserId } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [groupChats, setGroupChats] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        // 1. Get current user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUserId)
          .single();

        if (profileError || !profileData) {
          toast.error("Could not load your profile");
          return;
        }

        setProfile(profileData);

        const universitySlug = profileData.university ? slugify(profileData.university) : null;
        const citySlug = profileData.city ? slugify(profileData.city) : null;

        const slugs = [universitySlug, citySlug].filter(Boolean);
        console.log("🔍 Slugs to query:", slugs);

        const { data: groups, error: groupError } = await supabase
          .from("groups")
          .select("*")
          .in("slug", slugs);

        if (groupError) {
          toast.error("Error loading groups");
          return;
        }

        setGroupChats(groups);

        // 3. Auto-join user to each group if not already in
        for (const group of groups) {
          const { data: exists } = await supabase
            .from("group_members")
            .select("*")
            .eq("group_id", group.id)
            .eq("user_id", currentUserId)
            .maybeSingle();

          if (!exists) {
            await supabase.from("group_members").insert({
              group_id: group.id,
              user_id: currentUserId,
            });
            toast.success(`Joined ${group.name} group`);
          }
        }

      } catch (err) {
        console.error("Error:", err);
        toast.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUserId]);

  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group);
  };

  const handleBack = () => {
    setSelectedGroup(null);
  };

  if (selectedGroup) {
    return (
      <div className="max-w-7xl mx-auto h-[calc(100vh-128px)] py-4 px-2 sm:px-4 flex flex-col">
        <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
          {selectedGroup.type === "university" ? (
            <GroupChatPanel
              universityName={selectedGroup.name}
              currentUserId={currentUserId!}
              profiles={profile ? [profile] : []}
              onBack={handleBack}
              isFullScreen={true}
            />
          ) : (
            <CityPanel
              cityName={selectedGroup.name}
              currentUserId={currentUserId!}
              profiles={profile ? [profile] : []}
              onBack={handleBack}
              isFullScreen={true}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Group Chats</h1>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-3xl overflow-hidden animate-pulse bg-gray-200 h-48" />
          ))}
        </div>
      ) : groupChats.length > 0 ? (
        <div className="space-y-6">
          {groupChats.map((group) => (
            <Card
              key={group.id}
              onClick={() => handleSelectGroup(group)}
              className="rounded-3xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className={`p-8 text-white relative ${
                group.type === "university"
                  ? "bg-gradient-to-r from-purple-700 to-indigo-500"
                  : "bg-gradient-to-r from-blue-600 to-blue-400"
              }`}>
                <div className="absolute top-4 right-4 bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                  {group.type === "university" ? "University Chat" : "City Chat"}
                </div>
                {group.type === "university" ? (
                  <GraduationCap className="w-16 h-16 mb-4 opacity-70 absolute right-8 top-8" />
                ) : (
                  <MapPin className="w-16 h-16 mb-4 opacity-70 absolute right-8 top-8" />
                )}
                <h2 className="text-5xl font-bold mb-2">
                  {group.type === "university" ? "Your University" : "Your City"}
                </h2>
                <p className="text-2xl opacity-90 mb-4">{group.name}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">No group chats found for your university or city.</p>
          <Button className="mt-4" onClick={() => window.location.href = "/profile"}>
            Update Profile
          </Button>
        </div>
      )}
    </div>
  );
};

export default Groups;
