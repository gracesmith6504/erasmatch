
import { Profile } from "@/types";

export type AuthContextType = {
  isAuthenticated: boolean;
  currentUserId: string | null;
  currentUserEmail: string | null;
  currentUserProfile: Profile | null;
  loading: boolean;
  handleLogin: (email: string) => void;
  handleLogout: () => Promise<void>;
  handleProfileUpdate: (updatedProfile: Partial<Profile>) => Promise<void>;
};
