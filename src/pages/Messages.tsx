
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Message, Profile, ChatThread } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Send, Users } from "lucide-react";
import { GroupChatsList } from "@/components/messages/GroupChatsList";
import { GroupChatPanel } from "@/components/messages/GroupChatPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type MessagesProps = {
  messages: Message[];
  profiles: Profile[];
  currentUserId: string;
  onSendMessage: (receiverId: string, content: string) => void;
};

const Messages = ({ messages, profiles, currentUserId, onSendMessage }: MessagesProps) => {
  const isMobile = useIsMobile();
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<"direct" | "groups">("direct");
  const [selectedGroupChat, setSelectedGroupChat] = useState<string | null>(null);

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

  const handleSendMessage = async () => {
    if (!selectedThread || !newMessage.trim()) return;
    
    setIsSending(true);
    try {
      await onSendMessage(selectedThread.partner.id, newMessage);
      setNewMessage("");
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectGroupChat = (universityName: string) => {
    setSelectedGroupChat(universityName);
    if (isMobile) {
      setActiveTab("groups");
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

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, h:mm a");
  };

  // Show message list on mobile when no thread selected
  if (isMobile && !selectedThread && !selectedGroupChat) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "direct" | "groups")}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="direct" className="flex-1">
              Direct Messages
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex-1">
              Group Chats
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="direct">
            {threads.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <h2 className="text-xl font-medium text-gray-900 mb-2">No messages yet</h2>
                <p className="text-gray-600 mb-6">Start connecting with other Erasmus students</p>
                <Link to="/students">
                  <Button>Find Students</Button>
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {threads.map((thread) => (
                  <div key={thread.partner.id}>
                    <button
                      className="w-full p-4 hover:bg-gray-50 text-left flex items-center"
                      onClick={() => setSelectedThread(thread)}
                    >
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={thread.partner.avatar_url || undefined} />
                        <AvatarFallback className="bg-erasmatch-light-accent">
                          {getInitials(thread.partner.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <div className="font-medium">{thread.partner.name}</div>
                        {thread.lastMessage && (
                          <div className="text-sm text-gray-500 truncate">
                            {thread.lastMessage.sender_id === currentUserId ? 'You: ' : ''}
                            {thread.lastMessage.content}
                          </div>
                        )}
                      </div>
                      {thread.lastMessage && (
                        <div className="ml-auto text-xs text-gray-400">
                          {format(new Date(thread.lastMessage.created_at), "MMM d")}
                        </div>
                      )}
                    </button>
                    <Separator />
                  </div>
                ))}
              </div>
            )}
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
        </Tabs>
      </div>
    );
  }

  // Show thread messages (or back to thread list on mobile)
  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-128px)] py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
      
      <div className="flex flex-1 bg-white rounded-lg shadow overflow-hidden">
        {/* Thread list (hidden on mobile when conversation is open) */}
        {(!isMobile || (!selectedThread && !selectedGroupChat)) && (
          <div className="w-full md:w-1/3 border-r flex flex-col">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "direct" | "groups")} className="h-full flex flex-col">
              <TabsList className="w-full">
                <TabsTrigger value="direct" className="flex-1">
                  Direct Messages
                </TabsTrigger>
                <TabsTrigger value="groups" className="flex-1">
                  <Users className="h-4 w-4 mr-2" /> Group Chats
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="direct" className="flex-1 overflow-y-auto">
                {threads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-4">
                    <p className="text-gray-600 mb-4">No messages yet</p>
                    <Link to="/students">
                      <Button>Find Students</Button>
                    </Link>
                  </div>
                ) : (
                  threads.map((thread) => (
                    <div key={thread.partner.id}>
                      <button
                        className={`w-full p-4 hover:bg-gray-50 text-left flex items-center ${
                          selectedThread?.partner.id === thread.partner.id ? 'bg-gray-100' : ''
                        }`}
                        onClick={() => {
                          setSelectedThread(thread);
                          setSelectedGroupChat(null);
                        }}
                      >
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={thread.partner.avatar_url || undefined} />
                          <AvatarFallback className="bg-erasmatch-light-accent">
                            {getInitials(thread.partner.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                          <div className="font-medium">{thread.partner.name}</div>
                          {thread.lastMessage && (
                            <div className="text-sm text-gray-500 truncate">
                              {thread.lastMessage.sender_id === currentUserId ? 'You: ' : ''}
                              {thread.lastMessage.content}
                            </div>
                          )}
                        </div>
                      </button>
                      <Separator />
                    </div>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="groups" className="flex-1 overflow-y-auto">
                <GroupChatsList 
                  profiles={profiles}
                  currentUserProfile={currentUserProfile}
                  onSelectGroupChat={handleSelectGroupChat}
                  selectedGroupChat={selectedGroupChat}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {/* Conversation area */}
        {selectedThread && activeTab === "direct" ? (
          <div className="flex flex-col w-full md:w-2/3 h-full">
            {/* Conversation header */}
            <div className="p-4 border-b flex items-center">
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedThread(null)}
                  className="mr-2"
                >
                  Back
                </Button>
              )}
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={selectedThread.partner.avatar_url || undefined} />
                <AvatarFallback className="bg-erasmatch-light-accent">
                  {getInitials(selectedThread.partner.name)}
                </AvatarFallback>
              </Avatar>
              <div className="font-medium">{selectedThread.partner.name}</div>
            </div>
            
            {/* Message list */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
              {threadMessages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500">No messages yet. Start a conversation!</p>
                </div>
              ) : (
                threadMessages.map((message) => {
                  const isCurrentUser = message.sender_id === currentUserId;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          isCurrentUser
                            ? 'bg-erasmatch-blue text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div>{message.content}</div>
                        <div
                          className={`text-xs mt-1 ${
                            isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {formatMessageDate(message.created_at)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Message input */}
            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex space-x-2"
              >
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim() || isSending}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
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
        ) : (
          <div className="hidden md:flex flex-col w-2/3 items-center justify-center p-4">
            <p className="text-gray-500 mb-4">Select a conversation from the left</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
