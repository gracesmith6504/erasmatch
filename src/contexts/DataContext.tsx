/**
 * Slim data provider for current-user profile operations only.
 * Profiles and messages are now fetched lazily via page-scoped React Query hooks.
 */
import { createContext, useContext, ReactNode } from "react";
import { Profile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

type DataContextType = {
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
  const { currentUserId, handleProfileUpdate } = useAuth();

  /** Updates the current user's profile via AuthProvider. */
  const updateProfile = async (updatedProfile: Partial<Profile>): Promise<void> => {
    await handleProfileUpdate(updatedProfile);
  };

  /** Re-fetches the current user's profile via AuthProvider. */
  const fetchProfile = async (): Promise<void> => {
    // handleProfileUpdate with empty object triggers a re-fetch in AuthProvider
    // But we need a dedicated path — for now delegate to handleProfileUpdate
    if (!currentUserId) return;
    // Directly re-fetch via AuthProvider's handleProfileUpdate mechanism
    await handleProfileUpdate({});
  };

  return (
    <DataContext.Provider value={{ updateProfile, fetchProfile }}>
      {children}
    </DataContext.Provider>
  );
};
