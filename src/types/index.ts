
// User Profile
export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  university: string | null;
  semester: string | null;
  bio: string | null;
  avatar_url: string | null;
  city: string | null;
  home_university: string | null;
  personality_tags: string[];
  course: string | null;
  country: string | null;
  interests: string[] | null;
  deleted_at?: string | null;
  ref_code?: string | null;
  created_at?: string;
}

// Messages
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read?: boolean;
}

// Chat Thread
export interface ChatThread {
  partner: Profile;
  lastMessage: {
    content: string;
    created_at: string;
    sender_name: string;
  } | null;
}

// Group Message
export interface GroupMessage {
  id: string;
  sender_id: string;
  university_name: string;
  content: string;
  created_at: string;
}

// Group Chat
export interface GroupChat {
  university_name: string;
  participants_count: number;
  last_message: {
    content: string;
    created_at: string;
    sender_name: string;
  } | null;
}

// City Message
export interface CityMessage {
  id: string;
  sender_id: string;
  city_name: string;
  content: string;
  created_at: string;
}

// City Chat
export interface CityChat {
  city_name: string;
  participants_count: number;
  last_message: {
    content: string;
    created_at: string;
    sender_name: string;
  } | null;
}
