
import { useEffect } from "react";
import { Profile, ChatThread } from "@/types";

/**
 * Handle initial user selection logic
 */
export function useInitialUserSelection(
  initialSelectedUser: string | null,
  profiles: Profile[],
  threads: ChatThread[],
  selectedThread: ChatThread | null,
  isMobile: boolean,
  activeTab: "direct" | "groups" | "cities",
  setSelectedThread: (thread: ChatThread | null) => void,
  setActiveTab: (tab: "direct" | "groups" | "cities") => void,
  setSelectedGroupChat: (chat: string | null) => void,
  setSelectedCityChat: (chat: string | null) => void,
  refreshKey: number
) {
  useEffect(() => {
    // If initialSelectedUser is provided, create or find a thread for that user
    if (initialSelectedUser) {
      console.log("Initial selected user:", initialSelectedUser);
      // Find the profile for the selected user
      const selectedUserProfile = profiles.find(p => p.id === initialSelectedUser);
      
      if (selectedUserProfile) {
        // Check if there's an existing thread with this user
        const existingThread = threads.find(t => t.partner.id === initialSelectedUser);
        
        if (existingThread) {
          // Use existing thread
          setSelectedThread(existingThread);
        } else {
          // Create a new thread for this user
          setSelectedThread({
            partner: selectedUserProfile,
            lastMessage: null
          });
        }
        
        // Make sure we're on the direct messages tab
        setActiveTab("direct");
        
        // Reset the group and city selections
        setSelectedGroupChat(null);
        setSelectedCityChat(null);
      }
    } 
    // If no initial user and no thread selected, default to first thread on desktop
    else if (threads.length > 0 && !selectedThread && !isMobile && activeTab === "direct") {
      setSelectedThread(threads[0]);
    }
  }, [initialSelectedUser, threads, profiles, selectedThread, isMobile, activeTab, refreshKey]);
}
