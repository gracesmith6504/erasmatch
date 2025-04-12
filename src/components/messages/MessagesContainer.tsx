
import { useState, useEffect, useMemo } from "react";
import { Message, Profile, ChatThread } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MapPin } from "lucide-react";
import { ThreadsList } from "./ThreadsList";
import { DirectMessagePanel } from "./DirectMessagePanel";
import { GroupChatsList } from "./GroupChatsList";
import { GroupChatPanel } from "./GroupChatPanel";
import { CityList } from "./CityList";
import { CityPanel } from "./CityPanel";

interface MessagesContainerProps {
  messages: Message[];
  profiles: Profile[];
  currentUserId: string;
  onSendMessage: (receiverId: string, content: string) => void;
}

export const MessagesContainer = ({
  messages,
  profiles,
  currentUserId,
  onSendMessage,
}: MessagesContainerProps) => {
  const isMobile = useIsMobile();
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [activeTab, setActiveTab] = useState<"direct" | "groups" | "cities">("direct");
  const [selectedGroupChat, setSelectedGroupChat] = useState<string | null>(null);
  const [selectedCityChat, setSelectedCityChat] = useState<string | null>(null);

  const currentUserProfile = useMemo(() => {
    return profiles.find(profile => profile.id === currentUserId) || null;
  }, [profiles, currentUserId]);

  // Process messages into threads
  const threads = useMemo(() => {
    if (!currentUserId) return [];
    
    // Get all unique conversation partners
    const userIds = new Set<string>();
    messages.forEach(message => {
      if (message.sender_id === currentUserId) {
        userIds.add(message.receiver_id);
      } else if (message.receiver_id === currentUserId) {
        userIds.add(message.sender_id);
      }
    });
    
    // Create threads with the last message for each conversation partner
    return Array.from(userIds).map(userId => {
      const partner = profiles.find(p => p.id === userId);
      if (!partner) return null;
      
      // Find messages between current user and this partner
      const threadMessages = messages.filter(
        m => (m.sender_id === currentUserId && m.receiver_id === userId) ||
             (m.receiver_id === currentUserId && m.sender_id === userId)
      );
      
      // Sort by date and get the most recent
      const sortedMessages = [...threadMessages].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      const lastMessage = sortedMessages.length > 0 ? sortedMessages[0] : null;
      
      return {
        partner,
        lastMessage
      };
    }).filter(Boolean) as ChatThread[];
  }, [currentUserId, messages, profiles]);

  // Auto-select the first thread if none selected
  useEffect(() => {
    if (threads.length > 0 && !selectedThread && !isMobile && activeTab === "direct") {
      setSelectedThread(threads[0]);
    }
  }, [threads, selectedThread, isMobile, activeTab]);

  // Get messages for selected thread
  const threadMessages = useMemo(() => {
    if (!selectedThread) return [];
    
    return messages
      .filter(
        m => (m.sender_id === currentUserId && m.receiver_id === selectedThread.partner.id) ||
             (m.receiver_id === currentUserId && m.sender_id === selectedThread.partner.id)
      )
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [selectedThread, currentUserId, messages]);

  const handleSelectGroupChat = (universityName: string) => {
    setSelectedGroupChat(universityName);
    setSelectedCityChat(null);
    setSelectedThread(null);
    if (isMobile) {
      setActiveTab("groups");
    }
  };

  const handleSelectCityChat = (cityName: string) => {
    setSelectedCityChat(cityName);
    setSelectedGroupChat(null);
    setSelectedThread(null);
    if (isMobile) {
      setActiveTab("cities");
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Show message list on mobile when no conversation selected
  if (isMobile && !selectedThread && !selectedGroupChat && !selectedCityChat) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "direct" | "groups" | "cities")}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="direct" className="flex-1">
              Direct Messages
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex-1">
              University Groups
            </TabsTrigger>
            <TabsTrigger value="cities" className="flex-1">
              City Groups
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="direct">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ThreadsList 
                threads={threads} 
                selectedThread={selectedThread} 
                onSelectThread={setSelectedThread}
                getInitials={getInitials}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="groups">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <GroupChatsList 
                profiles={profiles}
                currentUserProfile={currentUserProfile}
                onSelectGroupChat={handleSelectGroupChat}
                selectedGroupChat={selectedGroupChat}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="cities">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <CityList 
                profiles={profiles}
                currentUserProfile={currentUserProfile}
                onSelectCityChat={handleSelectCityChat}
                selectedCityChat={selectedCityChat}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Show conversation panel or select conversation message
  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-128px)] py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
      
      <div className="flex flex-1 bg-white rounded-lg shadow overflow-hidden">
        {/* Thread list (hidden on mobile when conversation is open) */}
        {(!isMobile || (!selectedThread && !selectedGroupChat && !selectedCityChat)) && (
          <div className="w-full md:w-1/3 border-r flex flex-col">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "direct" | "groups" | "cities")} className="h-full flex flex-col">
              <TabsList className="w-full">
                <TabsTrigger value="direct" className="flex-1">
                  Direct Messages
                </TabsTrigger>
                <TabsTrigger value="groups" className="flex-1">
                  <Users className="h-4 w-4 mr-2" /> University
                </TabsTrigger>
                <TabsTrigger value="cities" className="flex-1">
                  <MapPin className="h-4 w-4 mr-2" /> City
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="direct" className="flex-1 overflow-y-auto">
                <ThreadsList 
                  threads={threads} 
                  selectedThread={selectedThread} 
                  onSelectThread={(thread) => {
                    setSelectedThread(thread);
                    setSelectedGroupChat(null);
                    setSelectedCityChat(null);
                  }}
                  getInitials={getInitials}
                />
              </TabsContent>
              
              <TabsContent value="groups" className="flex-1 overflow-y-auto">
                <GroupChatsList 
                  profiles={profiles}
                  currentUserProfile={currentUserProfile}
                  onSelectGroupChat={handleSelectGroupChat}
                  selectedGroupChat={selectedGroupChat}
                />
              </TabsContent>
              
              <TabsContent value="cities" className="flex-1 overflow-y-auto">
                <CityList 
                  profiles={profiles}
                  currentUserProfile={currentUserProfile}
                  onSelectCityChat={handleSelectCityChat}
                  selectedCityChat={selectedCityChat}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {/* Conversation area */}
        {selectedThread && activeTab === "direct" ? (
          <DirectMessagePanel
            thread={selectedThread}
            messages={threadMessages}
            currentUserId={currentUserId}
            isMobile={isMobile}
            onBack={() => setSelectedThread(null)}
            onSendMessage={onSendMessage}
          />
        ) : selectedGroupChat ? (
          <div className="flex flex-col w-full md:w-2/3 h-full">
            {isMobile && (
              <div className="border-b p-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedGroupChat(null)}
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
        ) : selectedCityChat ? (
          <div className="flex flex-col w-full md:w-2/3 h-full">
            {isMobile && (
              <div className="border-b p-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedCityChat(null)}
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
    </div>
  );
};
