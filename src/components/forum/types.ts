
export type ForumPost = {
  id: string;
  city: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  author?: {
    name: string | null;
    avatar_url: string | null;
  };
};

export type ForumComment = {
  id: string;
  forum_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: {
    name: string | null;
    avatar_url: string | null;
  };
};
