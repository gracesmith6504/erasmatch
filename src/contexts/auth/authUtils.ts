/**
 * Authentication utilities for Supabase profile CRUD operations.
 * Used by AuthProvider to manage user profiles during auth flows.
 */
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";

/** Fetches a user profile by ID. Returns null if not found. */
export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data as unknown as Profile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

/** Creates a new profile for a freshly registered user. Uses upsert for idempotency. */
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
    const { error } = await supabase
      .from('profiles')
      .upsert(newProfile);
      
    if (error) throw error;
    return newProfile as Profile;
  } catch (error) {
    console.error("Error creating profile:", error);
    return null;
  }
};

/** Updates specific fields on a user profile. */
export const updateUserProfile = async (
  userId: string, 
  updatedProfile: Partial<Profile>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updatedProfile)
      .eq('id', userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    return false;
  }
};
