
import { useEffect } from "react";
import { Profile, ChatThread } from "@/types";

export function useInitialUserSelection(
  initialSelectedUser: string | null,
  profiles: Profile[],
  threads: ChatThread[],
  selectedThread: ChatThread | null,
  isMobile: boolean,
  activeTab: string,
  setSelectedThread: (thread: ChatThread | null) => void,
  setActiveTab: (tab: any) => void,
  setSelectedGroupChat: (name: string | null) => void,
  setSelectedCityChat: (name: string | null) => void,
  refreshKey: number
) {
  // Handle initial user selection from URL params
  useEffect(() => {
    if (initialSelectedUser && !selectedThread) {
      console.log("Looking for user with ID:", initialSelectedUser);
      
      // Find the thread with the selected user
      const thread = threads.find(
        t => t.partner.id === initialSelectedUser
      );
      
      if (thread) {
        console.log("Found thread for user:", thread.partner.name);
        setSelectedThread(thread);
        
        // Set active tab to direct messages
        setActiveTab("direct");
      } else {
        console.log("No thread found for user ID:", initialSelectedUser);
        
        // If no thread exists yet, find the user profile
        const selectedUserProfile = profiles.find(
          profile => profile.id === initialSelectedUser
        );
        
        if (selectedUserProfile) {
          console.log("Found profile for user:", selectedUserProfile.name);
          
          // Create a new thread with this user
          const newThread: ChatThread = {
            partner: selectedUserProfile,
            lastMessage: null
          };
          
          setSelectedThread(newThread);
          setActiveTab("direct");
        }
      }
    }
  }, [initialSelectedUser, threads, selectedThread, profiles, refreshKey]);
}
