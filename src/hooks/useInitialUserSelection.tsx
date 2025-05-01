
import { useEffect } from "react";
import { Profile, ChatThread } from "@/types";

interface InitialUserSelectionProps {
  initialSelectedUserId: string | null;
  profiles: Profile[];
  threads: ChatThread[];
  selectedThread: ChatThread | null;
  isMobile: boolean;
  viewMode?: string;
  setSelectedThread: (thread: ChatThread | null) => void;
  setShowGroupsList?: () => void;
  setShowCityList?: () => void;
  setSelectedView?: (view: string) => void;
  refreshKey?: number;
}

export const useInitialUserSelection = ({
  initialSelectedUserId,
  profiles,
  threads,
  selectedThread,
  isMobile,
  viewMode = "direct",
  setSelectedThread,
  setShowGroupsList = () => {},
  setShowCityList = () => {},
  setSelectedView = () => {},
  refreshKey = 0
}: InitialUserSelectionProps) => {
  useEffect(() => {
    if (!initialSelectedUserId || selectedThread?.partner?.id === initialSelectedUserId) {
      return;
    }

    // Find the profile for the initial selected user
    const userProfile = profiles.find(p => p.id === initialSelectedUserId);
    if (!userProfile) return;

    // Find or create a thread for this user
    const existingThread = threads.find(t => t.partner.id === initialSelectedUserId);
    
    if (existingThread) {
      setSelectedThread(existingThread);
      
      // Set the appropriate view for mobile
      if (isMobile) {
        if (viewMode === "direct") {
          // Do nothing, the thread will be selected in MessagesContainer
        } else if (viewMode === "groups") {
          setShowGroupsList();
        } else if (viewMode === "cities") {
          setShowCityList();
        }
        
        setSelectedView("direct");
      }
    } else if (userProfile) {
      // Create a new thread with this user
      const newThread: ChatThread = {
        partner: userProfile,
        lastMessage: null
      };
      
      setSelectedThread(newThread);
    }
  }, [
    initialSelectedUserId, 
    profiles, 
    threads, 
    selectedThread, 
    isMobile, 
    viewMode, 
    setSelectedThread,
    setShowGroupsList,
    setShowCityList,
    setSelectedView,
    refreshKey
  ]);
};
