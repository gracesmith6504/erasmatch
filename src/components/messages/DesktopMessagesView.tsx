
import { Profile, ChatThread } from "@/types";
import { DirectMessagePanel } from "./DirectMessagePanel";
import { MessagesTabs } from "./MessagesTabs";
import { ThreadsList } from "./ThreadsList";
import { GroupChatsList } from "./GroupChatsList";
import { CityList } from "./CityList";
import { Button } from "@/components/ui/button";
import { GroupChatPanel } from "./GroupChatPanel";
import { CityPanel } from "./CityPanel";
import { getInitials } from "./utils/messageUtils";

interface DesktopMessagesViewProps {
  threads: ChatThread[];
  selectedThread: ChatThread | null;
  setSelectedThread: (thread: ChatThread | null) => void;
  profiles: Profile[];
  currentUserProfile: Profile | null;
  handleSelectGroupChat: (universityName: string) => void;
  selectedGroupChat: string | null;
  handleSelectCityChat: (cityName: string) => void;
  selectedCityChat: string | null;
  activeTab: "direct" | "groups" | "cities";
  setActiveTab: (tab: "direct" | "groups" | "cities") => void;
  threadMessages: any[];
  currentUserId: string;
  isMobile: boolean;
  onSendMessage: (receiverId: string, content: string) => void;
  onPromptUsed?: () => void;
}

export const DesktopMessagesView = ({
  threads,
  selectedThread,
  setSelectedThread,
  profiles,
  currentUserProfile,
  handleSelectGroupChat,
  selectedGroupChat,
  handleSelectCityChat,
  selectedCityChat,
  activeTab,
  setActiveTab,
  threadMessages,
  currentUserId,
  isMobile,
  onSendMessage,
  onPromptUsed = () => {},
}: DesktopMessagesViewProps) => {
  console.log("DesktopMessagesView activeTab:", activeTab);
  
  // Handle send message and ensure tab state is preserved
  const handleSendDirectMessage = async (receiverId: string, content: string) => {
    try {
      await onSendMessage(receiverId, content);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  return (
    <div className="flex flex-1 bg-white rounded-lg shadow overflow-hidden">
      {/* Thread list */}
      <div className="w-full md:w-1/3 border-r flex flex-col">
        <MessagesTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          className="h-full flex flex-col"
          directContent={
            <ThreadsList 
              threads={threads} 
              selectedThread={selectedThread} 
              onSelectThread={(thread) => {
                setSelectedThread(thread);
                setActiveTab("direct");
              }}
              getInitials={getInitials}
            />
          }
          groupsContent={
            <GroupChatsList 
              profiles={profiles}
              currentUserProfile={currentUserProfile}
              onSelectGroupChat={handleSelectGroupChat}
              selectedGroupChat={selectedGroupChat}
            />
          }
          citiesContent={
            <CityList 
              profiles={profiles}
              currentUserProfile={currentUserProfile}
              onSelectCityChat={handleSelectCityChat}
              selectedCityChat={selectedCityChat}
            />
          }
        />
      </div>
      
      {/* Conversation area */}
      {activeTab === "direct" && selectedThread ? (
        <DirectMessagePanel
          thread={selectedThread}
          messages={threadMessages}
          currentUserId={currentUserId}
          isMobile={isMobile}
          onBack={() => setSelectedThread(null)}
          onSendMessage={handleSendDirectMessage}
          onPromptUsed={onPromptUsed}
        />
      ) : activeTab === "groups" && selectedGroupChat ? (
        <div className="flex flex-col w-full md:w-2/3 h-full">
          {isMobile && (
            <div className="border-b p-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleSelectGroupChat("")}
                className="mr-2"
              >
                Back
              </Button>
            </div>
          )}
          <GroupChatPanel 
            universityName={selectedGroupChat}
            currentUserId={currentUserId}
            profiles={profiles}
          />
        </div>
      ) : activeTab === "cities" && selectedCityChat ? (
        <div className="flex flex-col w-full md:w-2/3 h-full">
          {isMobile && (
            <div className="border-b p-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleSelectCityChat("")}
                className="mr-2"
              >
                Back
              </Button>
            </div>
          )}
          <CityPanel
            cityName={selectedCityChat}
            currentUserId={currentUserId}
            profiles={profiles}
          />
        </div>
      ) : (
        <div className="hidden md:flex flex-col w-2/3 items-center justify-center p-4">
          <p className="text-gray-500 mb-4">Select a conversation from the left</p>
        </div>
      )}
    </div>
  );
};
