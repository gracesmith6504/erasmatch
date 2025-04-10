

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

