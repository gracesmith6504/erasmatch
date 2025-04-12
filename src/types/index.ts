
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
  country: string | null;
  interests: string | null;
  personality_tags: string[] | null; // Add this line
};
