
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";

export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log("Fetching profile for user:", userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error in fetchUserProfile:', error);
      throw error;
    }

    console.log("Profile data retrieved:", data);
    return data as unknown as Profile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const createUserProfile = async (
  userId: string, 
  email: string, 
  defaultName: string | null
): Promise<Profile | null> => {
  const newProfile = {
    id: userId,
    name: defaultName,
    email,
    university: null,
    city: null,
    semester: null,
    bio: null,
    avatar_url: null,
    created_at: new Date().toISOString(),
    home_university: null,
    personality_tags: [],
    course: null,
  };
  
  try {
    console.log("Creating new profile:", newProfile);
    const { error } = await supabase
      .from('profiles')
      .upsert(newProfile);
      
    if (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
    
    console.log("New profile created successfully");
    return newProfile as Profile;
  } catch (error) {
    console.error("Error creating profile:", error);
    return null;
  }
};

export const updateUserProfile = async (
  userId: string, 
  updatedProfile: Partial<Profile>
): Promise<boolean> => {
  try {
    console.log("Updating profile in authUtils:", userId, updatedProfile);
    const { error } = await supabase
      .from('profiles')
      .update(updatedProfile)
      .eq('id', userId);
    
    if (error) {
      console.error("Error updating profile in authUtils:", error);
      throw error;
    }
    
    console.log("Profile updated successfully in authUtils");
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    return false;
  }
};
