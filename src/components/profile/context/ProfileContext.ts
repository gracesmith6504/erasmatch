
import { createContext } from "react";
import { Profile as ProfileType } from "@/types";

type ProfileFormState = {
  name: string;
  email: string;
  university: string;
  semester: string;
  bio: string;
  avatar_url: string | null;
  home_university: string;
  city: string | null;
  personality_tags: string[];
  course: string;
  email_notifications: boolean;
  arrival_date: string | null;
  looking_for: string[];
};

export type ProfileContextType = {
  form: ProfileFormState;
  profile: ProfileType | null;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | null | string[]) => void;
  handleUniversityChange: (university: string) => void;
  handleHomeUniversityChange: (university: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  updateProfile: (newData: Partial<ProfileType>) => Promise<void>;
};

// Create context with undefined default value
export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);
