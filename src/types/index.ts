
export type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  university: string | null;
  city: string | null;
  semester: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  home_university: string | null;
  country?: string | null;  // Make country optional with ?
  personality_tags?: string[] | null;
  interests?: string | null;
  course?: string | null;
};

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};

export type ChatThread = {
  partner: Profile;
  lastMessage: Message | null;
};

export type GroupChat = {
  university_name: string;
  participants_count: number;
  last_message?: {
    content: string;
    created_at: string;
    sender_name: string;
  } | null;
};

export type GroupMessage = {
  id: string;
  sender_id: string;
  university_name: string;
  content: string;
  created_at: string;
};

export type CityChat = {
  city_name: string;
  participants_count: number;
  last_message?: {
    content: string;
    created_at: string;
    sender_name: string;
  } | null;
};

export type CityMessage = {
  id: string;
  sender_id: string;
  city_name: string;
  content: string;
  created_at: string;
};
