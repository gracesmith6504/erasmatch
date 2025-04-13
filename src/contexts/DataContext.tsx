
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile, Message } from "@/types";
import { useAuth } from "./AuthContext";

type DataContextType = {
  profiles: Profile[];
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  handleSendMessage: (receiverId: string, content: string) => Promise<Message | undefined>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

type DataProviderProps = {
  children: ReactNode;
};

export const DataProvider = ({ children }: DataProviderProps) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const { currentUserId, isAuthenticated } = useAuth();

  // Fetch data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && currentUserId) {
      fetchProfiles();
      fetchUserMessages(currentUserId);
    }
  }, [isAuthenticated, currentUserId]);

  // Function to fetch all profiles
  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      if (data) {
        setProfiles(data as unknown as Profile[]);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  // Function to fetch messages for the current user
  const fetchUserMessages = async (userId: string) => {
    try {
      const { data: userMessages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (userMessages) {
        setMessages(userMessages as Message[]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (receiverId: string, content: string) => {
    if (!currentUserId) return;

    try {
      // Send message via Supabase
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          receiver_id: receiverId,
          content
        })
        .select()
        .single();
      
      if (error) throw error;

      if (data) {
        // Update local messages state
        setMessages(prev => [data as Message, ...prev]);
        return data as Message;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider
      value={{
        profiles,
        messages,
        setMessages,
        handleSendMessage
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
