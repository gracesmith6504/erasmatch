import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile, Message, PromptLog } from "@/types";
import { useAuth } from "./AuthContext";

type DataContextType = {
  profiles: Profile[];
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  handleSendMessage: (receiverId: string, content: string) => Promise<Message | undefined>;
  logPrompt: (
    sender_id: string, 
    receiver_id: string, 
    prompt_text: string, 
    type: string
  ) => Promise<PromptLog | undefined>;
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

  useEffect(() => {
    if (isAuthenticated && currentUserId) {
      fetchProfiles();
      fetchUserMessages(currentUserId);
    }
  }, [isAuthenticated, currentUserId]);

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
        setMessages(prev => [data as Message, ...prev]);
        return data as Message;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const logPrompt = async (
    sender_id: string, 
    receiver_id: string, 
    prompt_text: string, 
    type: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('prompt_logs')
        .insert({
          sender_id,
          receiver_id,
          prompt_text,
          type
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data as PromptLog;
    } catch (error) {
      console.error('Error logging prompt:', error);
      return undefined;
    }
  };

  return (
    <DataContext.Provider
      value={{
        profiles,
        messages,
        setMessages,
        handleSendMessage,
        logPrompt
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
