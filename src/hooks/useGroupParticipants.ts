
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";

export function useGroupParticipants(
  chatType: "university" | "city",
  groupId: string
) {
  const [participants, setParticipants] = useState<Profile[]>([]);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  
  const decodedId = groupId ? decodeURIComponent(groupId) : "";

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*");

        if (error) throw error;
        
        if (data) {
          const profilesData = data as unknown as Profile[];
          setAllProfiles(profilesData);
          
          const filteredProfiles = profilesData.filter((profile) => {
            return chatType === "university" 
              ? profile.university === decodedId
              : profile.city === decodedId;
          });
          
          setParticipants(filteredProfiles);
        }
      } catch (error) {
        console.error(`Error fetching profiles:`, error);
      }
    };

    fetchProfiles();
  }, [decodedId, chatType]);

  return { participants, allProfiles };
}
