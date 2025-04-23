
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile, Message } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

type DataContextType = {
  profiles: Profile[];
  messages: Message[];
  handleSendMessage: (receiverId: string, content: string) => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  fetchProfile: () => Promise<void>;
  refreshMessages: () => Promise<void>;
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

  // Subscribe to new messages for real-time updates
  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel('messages-channel')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${currentUserId}`
        }, 
        payload => {
          const newMessage = payload.new as Message;
          setMessages(prevMessages => [newMessage, ...prevMessages]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  // Function to fetch all profiles
  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      if (data) {
        // Ensure all profiles have the required fields
        const processedProfiles = data.map(profile => ({
          ...profile,
          country: null,
          interests: null,
          personality_tags: profile.personality_tags || []
        })) as Profile[];
        
        setProfiles(processedProfiles);
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
      
      if (error) {
        console.error('Error fetching messages:', error);
        toast.error("Failed to load messages");
        return;
      }
      
      if (userMessages) {
        console.log('Fetched messages:', userMessages.length);
        setMessages(userMessages as Message[]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error("Failed to load messages");
    }
  };

  // Function to refresh messages
  const refreshMessages = async (): Promise<void> => {
    if (!currentUserId) return;
    await fetchUserMessages(currentUserId);
  };

  const handleSendMessage = async (receiverId: string, content: string): Promise<void> => {
    if (!currentUserId) return Promise.reject(new Error("User not authenticated"));

    try {
      console.log("Sending message to", receiverId, "with content:", content);
      
      // Insert directly into the messages table
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          receiver_id: receiverId,
          content: content,
          read_by: []
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error sending message:', error);
        toast.error("Failed to send message");
        throw error;
      }

      if (data) {
        console.log("Message sent successfully:", data);
        // Update local messages state - add to beginning of array
        setMessages(prev => [data as Message, ...prev]);
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(`Failed to send message: ${error.message || 'Unknown error'}`);
      throw error;
    }
  };

  // Function to update a user profile
  const updateProfile = async (updatedProfile: Partial<Profile>): Promise<void> => {
    if (!currentUserId) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', currentUserId);
      
      if (error) throw error;
      
      // Update the profiles array with the updated profile
      setProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile.id === currentUserId 
            ? { ...profile, ...updatedProfile } 
            : profile
        )
      );
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating profile:', error);
      return Promise.reject(error);
    }
  };

  // Function to fetch a single profile
  const fetchProfile = async (): Promise<void> => {
    if (!currentUserId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUserId)
        .single();

      if (error) throw error;
      
      if (data) {
        // Update the profiles array with the fetched profile
        setProfiles(prevProfiles => {
          const profileExists = prevProfiles.some(p => p.id === currentUserId);
          if (profileExists) {
            return prevProfiles.map(p => p.id === currentUserId ? { 
              ...p, 
              ...data, 
              country: null,
              interests: null 
            } as Profile : p);
          } else {
            return [...prevProfiles, { 
              ...data, 
              country: null,
              interests: null,
              personality_tags: data.personality_tags || []
            } as Profile];
          }
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return (
    <DataContext.Provider
      value={{
        profiles,
        messages,
        handleSendMessage,
        updateProfile,
        fetchProfile,
        refreshMessages
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
