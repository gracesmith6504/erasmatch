
import { useContext } from "react";
import { ProfileContext, ProfileContextType } from "./ProfileContext";

export const useProfileContext = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  
  if (context === undefined) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  
  return context;
};
