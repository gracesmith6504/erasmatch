
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read_by?: string[];
}

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
}

export interface LastMessage {
  content: string;
  created_at: string;
  sender_name: string;
  sender_id?: string;
  read_by?: string[];
}

export interface ChatThread {
  partner: Profile;
  lastMessage: LastMessage | null;
  hasUnreadMessages?: boolean;
}

export interface CityMessage {
  id: string;
  sender_id: string;
  city_name: string;
  content: string;
  created_at: string;
}

export interface GroupMessage {
  id: string;
  sender_id: string;
  university_name: string;
  content: string;
  created_at: string;
}

export interface CityChat {
  city_name: string;
  participants_count: number;
  last_message: LastMessage | null;
}

export interface GroupChat {
  university_name: string;
  participants_count: number;
  last_message: LastMessage | null;
}
