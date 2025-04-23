
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile, Message } from "@/types";
import { useAuth } from "./AuthContext";

type DataContextType = {
  profiles: Profile[];
  messages: Message[];
  handleSendMessage: (receiverId: string, content: string) => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  fetchProfile: () => Promise<void>;
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
      
      if (error) throw error;
      
      if (userMessages) {
        setMessages(userMessages as Message[]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

 const handleSendMessage = async (receiverId: string, content: string): Promise<void> => {
  if (!currentUserId) return;

  try {
    // Insert the new message
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert({
        sender_id: currentUserId,
        receiver_id: receiverId,
        content
      })
      .select()
      .single();

    if (messageError) throw messageError;

    // Get receiver's profile (for their email)
    const { data: receiverProfile, error: receiverError } = await supabase
      .from('profiles')
      .select('email, name')
      .eq('id', receiverId)
      .single();

    if (receiverError) throw receiverError;

    // Get sender's name and avatar
    const { data: senderProfile, error: senderError } = await supabase
      .from('profiles')
      .select('name, avatar_url')
      .eq('id', currentUserId)
      .single();

    if (senderError) throw senderError;

    // Send email if receiver has an email
    if (receiverProfile?.email) {
      const response = await supabase.functions.invoke('send-message-notification', {
        body: {
          to: receiverProfile.email,
          senderName: senderProfile?.name || 'Someone',
          senderAvatarUrl: senderProfile?.avatar_url || null,
          messageContent: content
        }
      });

      if (response.error) {
        console.error('Error sending email notification:', response.error);
      }
    }

    // Update local messages state
    if (messageData) {
      setMessages(prev => [messageData as Message, ...prev]);
    }
  } catch (error) {
    console.error('Error sending message:', error);
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
        fetchProfile
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
