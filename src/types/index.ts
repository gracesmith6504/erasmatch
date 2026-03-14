/**
 * Shared TypeScript interfaces used across the application.
 * These mirror the Supabase database schema for type safety.
 */

/** Direct message between two users. */
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read_by?: string[];
}

/** User profile — maps to the `profiles` table in Supabase. */
export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  university: string | null;
  home_university: string | null;
  course: string | null;
  semester: string | null;
  personality_tags?: string[];
  created_at: string;
  deleted_at?: string | null;
  last_active_at?: string | null;
  ref_code?: string | null;
  invited_by?: string | null;
  country?: string | null;
  interests?: string[] | null;
  onboarding_complete?: boolean;
  featured?: boolean;
  privacy_consent_at?: string | null;
  email_notifications?: boolean;
  arrival_date?: string | null;
  looking_for?: string[] | null;
}

/** Preview of the most recent message in a chat thread. */
export interface LastMessage {
  content: string;
  created_at: string;
  sender_name: string;
  sender_id?: string;
  read_by?: string[];
}

/** A conversation thread between the current user and another user. */
export interface ChatThread {
  partner: Profile;
  lastMessage: LastMessage | null;
  hasUnreadMessages?: boolean;
}

/** Message sent in a city-based group chat. */
export interface CityMessage {
  id: string;
  sender_id: string;
  city_name: string;
  content: string;
  created_at: string;
}

/** Message sent in a university group chat. */
export interface GroupMessage {
  id: string;
  sender_id: string;
  university_name: string;
  content: string;
  created_at: string;
}

/** Summary of a city group chat for the chat list. */
export interface CityChat {
  city_name: string;
  participants_count: number;
  last_message: LastMessage | null;
}

/** Summary of a university group chat for the chat list. */
export interface GroupChat {
  university_name: string;
  participants_count: number;
  last_message: LastMessage | null;
}
