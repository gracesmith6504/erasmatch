/**
 * Slim data provider for current-user profile operations only.
 * Profiles and messages are now fetched lazily via page-scoped React Query hooks.
 */
import { createContext, useContext, ReactNode } from "react";
import { Profile } from "@/types";
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
  const { handleProfileUpdate, refreshProfile } = useAuth();

  /** Updates the current user's profile. */
  const updateProfile = async (updatedProfile: Partial<Profile>): Promise<void> => {
    await handleProfileUpdate(updatedProfile);
  };

  /** Re-fetches the current user's profile. */
  const fetchProfile = async (): Promise<void> => {
    await refreshProfile();
  };

  return (
    <DataContext.Provider value={{ updateProfile, fetchProfile }}>
      {children}
    </DataContext.Provider>
  );
};
